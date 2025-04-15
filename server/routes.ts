import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import openai from "./openai";
import { ModerationService } from "./moderation";
import { getAIPerspective } from "./aiPerspective";
import Stripe from "stripe";
import * as crypto from "crypto";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { 
  insertUserSchema, 
  insertDiscussionSchema, 
  insertCommentSchema,
  insertRightsAgreementSchema,
  insertAmendmentSchema,
  insertEventSchema,
  insertTagSchema,
  insertProposalSchema,
  insertVoteSchema,
  insertUserRoleSchema,
  insertAnnotationSchema,
  insertAnnotationReplySchema,
  insertModerationFlagSchema,
  insertModerationDecisionSchema,
  insertModerationAppealSchema,
  insertModerationSettingSchema,
  insertCosmicReactionSchema,
  insertCosmicEmojiMetadataSchema,
  type User,
  type Proposal,
  type Vote,
  type UserRole,
  type Annotation,
  type AnnotationReply,
  type ModerationFlag,
  type ModerationDecision,
  type ModerationAppeal,
  type ModerationSetting,
  type CosmicReaction,
  type CosmicEmojiMetadata
} from "@shared/schema";
import { z, ZodError } from "zod";

// Utility function to handle zod validation errors
function handleZodError(err: unknown, res: Response) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
}

// Configure Passport.js for local authentication

// Helper function to hash passwords
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure passport local strategy
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      
      // Check password
      const hashedPassword = hashPassword(password);
      if (user.password !== hashedPassword) {
        return done(null, false, { message: "Incorrect password" });
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
  
  // Configure passport session serialization
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      
      // Don't expose password
      const { password, ...userWithoutPassword } = user;
      done(null, userWithoutPassword);
    } catch (err) {
      done(err);
    }
  });
  // Community stats API for the Cosmic Background Mood Synchronizer
  app.get('/api/community-stats', async (req, res) => {
    try {
      // For this endpoint, we'll aggregate stats from various parts of the platform
      // We need to handle the possibility that our current DatabaseStorage implementation
      // might not have all the methods needed, so we'll gracefully handle errors
      
      let users = [];
      let discussions = [];
      let proposals = [];
      
      try {
        users = Array.from((await storage.getUsers()) || []);
        discussions = Array.from((await storage.getDiscussions()) || []);
        proposals = Array.from((await storage.getProposals()) || []);
      } catch (err) {
        console.error("Error getting community stats:", err);
        // If methods are missing, we'll return default values
      }
      
      // Calculate active users (logged in within last 24h)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      
      const activeUsersCount = users.filter(user => {
        // If lastLoginAt is available, use it; otherwise fall back to user creation date
        const lastActivity = user.lastLoginAt || user.createdAt;
        return new Date(lastActivity) > oneDayAgo;
      }).length;
      
      // Get recently active discussions (comments in last 48h)
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      const recentlyActiveDiscussions = discussions.filter(discussion => {
        return new Date(discussion.updatedAt) > twoDaysAgo;
      }).length;
      
      // Get proposal stats
      const inProgressProposals = proposals.filter(proposal => 
        proposal.status === 'active' || proposal.status === 'voting'
      ).length;
      
      const recentlyApprovedProposals = proposals.filter(proposal => {
        const approvedRecently = proposal.status === 'approved' && 
                               new Date(proposal.updatedAt) > twoDaysAgo;
        return approvedRecently;
      }).length;
      
      res.json({
        activeUsers: activeUsersCount,
        discussions: {
          total: discussions.length,
          recentlyActive: recentlyActiveDiscussions
        },
        proposals: {
          total: proposals.length,
          inProgress: inProgressProposals,
          recentlyApproved: recentlyApprovedProposals
        }
      });
    } catch (error) {
      console.error('Error getting community stats:', error);
      res.status(500).json({ error: 'Failed to get community stats' });
    }
  });
  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  
  // Development-only route for testing profile functionality
  app.get("/api/dev/login-test-user", async (req, res) => {
    if (process.env.NODE_ENV !== "development") {
      return res.status(404).json({ error: "Not found" });
    }
    
    try {
      // Look for existing test user or create one
      let testUser = await storage.getUserByUsername("testuser");
      
      if (!testUser) {
        // Create a test user if none exists
        testUser = await storage.createUser({
          username: "testuser",
          displayName: "Test User",
          password: hashPassword("password"),
          avatar: null,
          bio: "This is a test user account for development.",
          level: 3,
          points: 150,
          isAi: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      
      // Log the user in
      req.login(testUser, (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to log in test user" });
        }
        
        const { password, ...userWithoutPassword } = testUser;
        return res.json(userWithoutPassword);
      });
    } catch (error) {
      console.error("Error logging in test user:", error);
      res.status(500).json({ error: "Failed to log in test user" });
    }
  });

  // ===== AUTH ROUTES =====
  
  // Login route
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      
      if (!user) {
        return res.status(401).json({ error: info.message || "Authentication failed" });
      }
      
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        
        // Don't return password in response
        const { password, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
      });
    })(req, res, next);
  });
  
  // Register route
  app.post("/api/auth/register", async (req, res) => {
    try {
      // Validate request body
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
      }
      
      // Hash password
      userData.password = hashPassword(userData.password);
      
      // Create user
      const user = await storage.createUser(userData);
      
      // Automatically log in the user
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to log in after registration" });
        }
        
        // Don't return password in response
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  // Logout route
  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  
  // ===== USER ROUTES =====
  
  // Get current user from session
  app.get("/api/users/me", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // User is already in req.user from passport deserialization
      res.json(req.user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get user by ID
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Update user profile
  app.patch("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Define a validation schema for user profile updates
      const updateProfileSchema = z.object({
        displayName: z.string().min(2).max(50).optional(),
        avatar: z.string().url().or(z.string().length(0)).nullish(),
        avatarType: z.enum(['url', 'generated', 'upload']).optional(),
        bio: z.string().max(500).nullish(),
        twitterUrl: z.string().url().or(z.string().length(0)).nullish(),
        facebookUrl: z.string().url().or(z.string().length(0)).nullish(),
        instagramUrl: z.string().url().or(z.string().length(0)).nullish(),
        linkedinUrl: z.string().url().or(z.string().length(0)).nullish(),
        githubUrl: z.string().url().or(z.string().length(0)).nullish(),
        personalWebsiteUrl: z.string().url().or(z.string().length(0)).nullish(),
        preferences: z.string().optional() // JSON string
      });
      
      // Validate request body
      const updateData = updateProfileSchema.parse(req.body);
      
      // Update user
      const updatedUser = await storage.updateUser(userId, updateData);
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Create user
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Update user points
  app.post("/api/users/:id/points", async (req, res) => {
    try {
      const pointsSchema = z.object({ points: z.number() });
      const { points } = pointsSchema.parse(req.body);
      const userId = parseInt(req.params.id);
      
      const updatedUser = await storage.updateUserPoints(userId, points);
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Get user badges
  app.get("/api/users/:id/badges", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const badges = await storage.getUserBadges(userId);
      res.json(badges);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ===== DISCUSSION ROUTES =====
  
  // Get all discussions
  app.get("/api/discussions", async (_req, res) => {
    try {
      const discussions = await storage.getDiscussions();
      res.json(discussions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get discussions by category
  app.get("/api/discussions/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const discussions = await storage.getDiscussionsByCategory(category);
      res.json(discussions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get single discussion with related data
  app.get("/api/discussions/:id", async (req, res) => {
    try {
      const discussionId = parseInt(req.params.id);
      const discussion = await storage.getDiscussion(discussionId);
      
      if (!discussion) {
        return res.status(404).json({ error: "Discussion not found" });
      }
      
      // Update view count
      const updatedDiscussion = await storage.updateDiscussion(discussionId, {
        views: discussion.views + 1
      });
      
      // Get comments
      const comments = await storage.getCommentsByDiscussion(discussionId);
      
      // Get tags
      const tags = await storage.getTagsByDiscussion(discussionId);
      
      // Get user data for the discussion
      const user = await storage.getUser(discussion.userId);
      const userInfo = user ? { id: user.id, displayName: user.displayName, isAi: user.isAi } : null;
      
      // Get user data for each comment
      const enrichedComments = await Promise.all(
        comments.map(async (comment) => {
          const commentUser = await storage.getUser(comment.userId);
          const commentUserInfo = commentUser 
            ? { id: commentUser.id, displayName: commentUser.displayName, isAi: commentUser.isAi } 
            : null;
          
          return {
            ...comment,
            user: commentUserInfo
          };
        })
      );
      
      res.json({
        ...updatedDiscussion,
        user: userInfo,
        comments: enrichedComments,
        tags
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create discussion
  app.post("/api/discussions", async (req, res) => {
    try {
      const discussionData = insertDiscussionSchema.parse(req.body);
      
      // Optional AI enhancement
      if (req.body.enhance) {
        const enhancedContent = await openai.enhanceDiscussion(
          discussionData.title,
          discussionData.content
        );
        discussionData.content = enhancedContent;
        discussionData.aiEnhanced = true;
      }
      
      // Create the discussion
      const discussion = await storage.createDiscussion(discussionData);
      
      // Handle tags if provided
      if (req.body.tags && Array.isArray(req.body.tags)) {
        for (const tagName of req.body.tags) {
          // Check if tag exists, create if not
          let tag = await storage.getTagByName(tagName);
          if (!tag) {
            tag = await storage.createTag({ name: tagName });
          }
          
          // Add tag to discussion
          await storage.addTagToDiscussion({
            discussionId: discussion.id,
            tagId: tag.id
          });
        }
      }
      
      // Award points to the user for creating a discussion
      await storage.updateUserPoints(discussionData.userId, 10);
      
      res.status(201).json(discussion);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Update discussion likes
  app.post("/api/discussions/:id/like", async (req, res) => {
    try {
      const discussionId = parseInt(req.params.id);
      const discussion = await storage.getDiscussion(discussionId);
      
      if (!discussion) {
        return res.status(404).json({ error: "Discussion not found" });
      }
      
      const updatedDiscussion = await storage.updateDiscussion(discussionId, {
        likes: discussion.likes + 1
      });
      
      // Award points to the discussion author
      await storage.updateUserPoints(discussion.userId, 2);
      
      res.json(updatedDiscussion);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ===== COMMENT ROUTES =====
  
  // Create comment
  app.post("/api/comments", async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse(req.body);
      
      // Check if AI should respond
      if (req.body.requestAiResponse) {
        const discussion = await storage.getDiscussion(commentData.discussionId);
        if (!discussion) {
          return res.status(404).json({ error: "Discussion not found" });
        }
        
        // Get existing comments for context
        const existingComments = await storage.getCommentsByDiscussion(commentData.discussionId);
        const existingCommentsText = existingComments.map(c => c.content);
        
        // Generate AI response
        const aiResponse = await openai.generateAIResponse(
          discussion.title,
          discussion.content,
          existingCommentsText
        );
        
        // Find AI user
        const aiUser = await storage.getUserByUsername('harmony_ai');
        if (aiUser) {
          // Create AI comment
          await storage.createComment({
            content: aiResponse,
            userId: aiUser.id,
            discussionId: commentData.discussionId,
            aiGenerated: true
          });
        }
      }
      
      // Create the user's comment
      const comment = await storage.createComment(commentData);
      
      // Award points to the user for commenting
      await storage.updateUserPoints(commentData.userId, 5);
      
      res.status(201).json(comment);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Update comment likes
  app.post("/api/comments/:id/like", async (req, res) => {
    try {
      const commentId = parseInt(req.params.id);
      // Use storage to get the comment instead of this.comments
      const comment = await storage.getComment(commentId);
      
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }
      
      const updatedComment = await storage.updateComment(commentId, {
        likes: comment.likes + 1
      });
      
      // Award points to the comment author
      await storage.updateUserPoints(comment.userId, 1);
      
      res.json(updatedComment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ===== RIGHTS AGREEMENT ROUTES =====
  
  // Get latest rights agreement
  app.get("/api/rights-agreement/latest", async (_req, res) => {
    try {
      const agreement = await storage.getLatestRightsAgreement();
      
      if (!agreement) {
        return res.status(404).json({ error: "No rights agreement found" });
      }
      
      // Get amendments for this agreement
      const amendments = await storage.getAmendmentsByAgreement(agreement.id);
      
      res.json({
        ...agreement,
        amendments
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Get all rights agreement versions
  app.get("/api/rights-agreement/versions", async (_req, res) => {
    try {
      const agreements = await storage.getRightsAgreements();
      
      if (!agreements || agreements.length === 0) {
        return res.status(404).json({ error: "No rights agreements found" });
      }
      
      // Sort by version number (descending)
      const sortedAgreements = agreements.sort((a, b) => {
        return parseFloat(b.version) - parseFloat(a.version);
      });
      
      // Return basic info for each version
      const versions = sortedAgreements.map(agreement => ({
        id: agreement.id,
        title: agreement.title,
        version: agreement.version,
        status: agreement.status,
        createdAt: agreement.createdAt
      }));
      
      res.json(versions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get specific rights agreement by ID
  app.get("/api/rights-agreement/:id", async (req, res) => {
    try {
      const agreementId = parseInt(req.params.id);
      const agreement = await storage.getRightsAgreement(agreementId);
      
      if (!agreement) {
        return res.status(404).json({ error: "Rights agreement not found" });
      }
      
      // Get amendments for this agreement
      const amendments = await storage.getAmendmentsByAgreement(agreement.id);
      
      res.json({
        ...agreement,
        amendments
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create rights agreement
  app.post("/api/rights-agreement", async (req, res) => {
    try {
      const agreementData = insertRightsAgreementSchema.parse(req.body);
      const agreement = await storage.createRightsAgreement(agreementData);
      res.status(201).json(agreement);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Get amendments for an agreement
  app.get("/api/rights-agreement/:id/amendments", async (req, res) => {
    try {
      const agreementId = parseInt(req.params.id);
      const amendments = await storage.getAmendmentsByAgreement(agreementId);
      res.json(amendments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create amendment proposal
  app.post("/api/amendments", async (req, res) => {
    try {
      const amendmentData = insertAmendmentSchema.parse(req.body);
      
      // Use OpenAI to analyze the proposal
      const analysis = await openai.analyzeRightsProposal(amendmentData.content);
      
      // Create the amendment
      const amendment = await storage.createAmendment(amendmentData);
      
      // Award points to the user for proposing an amendment
      await storage.updateUserPoints(amendmentData.proposedBy, 15);
      
      res.status(201).json({
        amendment,
        analysis
      });
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Vote on amendment
  app.post("/api/amendments/:id/vote", async (req, res) => {
    try {
      const voteSchema = z.object({ 
        support: z.boolean(),
        userId: z.number()
      });
      
      const { support, userId } = voteSchema.parse(req.body);
      const amendmentId = parseInt(req.params.id);
      
      const amendment = await storage.getAmendment(amendmentId);
      if (!amendment) {
        return res.status(404).json({ error: "Amendment not found" });
      }
      
      // Update votes
      const updatedAmendment = await storage.updateAmendment(amendmentId, {
        votesFor: support ? amendment.votesFor + 1 : amendment.votesFor,
        votesAgainst: !support ? amendment.votesAgainst + 1 : amendment.votesAgainst
      });
      
      // Award points to the user for voting
      await storage.updateUserPoints(userId, 2);
      
      res.json(updatedAmendment);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // ===== BADGE ROUTES =====
  
  // Get all badges
  app.get("/api/badges", async (_req, res) => {
    try {
      const badges = await storage.getBadges();
      res.json(badges);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Handle requests for physical achievement posters
  app.post('/api/achievements/request-poster', async (req, res) => {
    try {
      const { userName } = req.body;
      
      // In a production app, we would:
      // 1. Use Stripe to process payment for shipping
      // 2. Use SendGrid to send a confirmation email
      // 3. Store the order in the database
      
      // For demonstration purposes, we're just returning a success response
      res.json({
        success: true,
        message: 'Poster request received',
        details: {
          recipient: userName,
          requestDate: new Date().toISOString(),
          status: 'processing'
        }
      });
    } catch (error: any) {
      console.error('Error processing poster request:', error);
      res.status(500).json({ 
        error: 'Failed to process poster request',
        message: error.message 
      });
    }
  });

  // ===== EVENT ROUTES =====
  
  // Get all events
  app.get("/api/events", async (_req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create event
  app.post("/api/events", async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Register attendance for event
  app.post("/api/events/:id/attend", async (req, res) => {
    try {
      const userSchema = z.object({ userId: z.number() });
      const { userId } = userSchema.parse(req.body);
      const eventId = parseInt(req.params.id);
      
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      
      const updatedEvent = await storage.updateEventAttendees(eventId, 1);
      
      // Award points to the user for attending an event
      await storage.updateUserPoints(userId, 5);
      
      res.json(updatedEvent);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // ===== AI MODERATION ROUTE =====
  
  // Moderate content
  app.post("/api/moderate", async (req, res) => {
    try {
      const contentSchema = z.object({ content: z.string() });
      const { content } = contentSchema.parse(req.body);
      
      const moderation = await openai.moderateContent(content);
      res.json(moderation);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // ===== GOVERNANCE ROUTES =====
  
  // Get all proposals
  app.get("/api/proposals", async (_req, res) => {
    try {
      const proposals = await storage.getProposals();
      res.json(proposals);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get proposals by category
  app.get("/api/proposals/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const proposals = await storage.getProposalsByCategory(category);
      res.json(proposals);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get proposals by status
  app.get("/api/proposals/status/:status", async (req, res) => {
    try {
      const status = req.params.status;
      const proposals = await storage.getProposalsByStatus(status);
      res.json(proposals);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get single proposal with votes
  app.get("/api/proposals/:id", async (req, res) => {
    try {
      const proposalId = parseInt(req.params.id);
      const proposal = await storage.getProposal(proposalId);
      
      if (!proposal) {
        return res.status(404).json({ error: "Proposal not found" });
      }
      
      // Get votes
      const votes = await storage.getVotesByProposal(proposalId);
      
      // Get user data for the proposal
      const user = await storage.getUser(proposal.proposedBy);
      const userInfo = user ? { id: user.id, displayName: user.displayName, isAi: user.isAi } : null;
      
      res.json({
        ...proposal,
        user: userInfo,
        votes
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create proposal
  app.post("/api/proposals", async (req, res) => {
    try {
      const proposalData = insertProposalSchema.parse(req.body);
      
      // Use OpenAI to analyze the proposal content
      const analysis = await openai.analyzeRightsProposal(proposalData.description);
      
      // Create the proposal
      const proposal = await storage.createProposal(proposalData);
      
      // Award points to the user for creating a proposal
      await storage.updateUserPoints(proposalData.proposedBy, 20);
      
      res.status(201).json({
        proposal,
        analysis
      });
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Update proposal status
  app.patch("/api/proposals/:id", async (req, res) => {
    try {
      const proposalId = parseInt(req.params.id);
      const proposal = await storage.getProposal(proposalId);
      
      if (!proposal) {
        return res.status(404).json({ error: "Proposal not found" });
      }
      
      const updateSchema = z.object({
        status: z.enum(["draft", "active", "passed", "rejected", "implemented"]),
        implementationDetails: z.string().optional()
      });
      
      const updateData = updateSchema.parse(req.body);
      const updatedProposal = await storage.updateProposal(proposalId, updateData);
      
      // Award points to the user who authored the proposal if it was passed or implemented
      if (updateData.status === "passed" || updateData.status === "implemented") {
        await storage.updateUserPoints(proposal.proposedBy, 50);
      }
      
      res.json(updatedProposal);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Vote on proposal
  app.post("/api/proposals/:id/vote", async (req, res) => {
    try {
      const proposalId = parseInt(req.params.id);
      const proposal = await storage.getProposal(proposalId);
      
      if (!proposal) {
        return res.status(404).json({ error: "Proposal not found" });
      }
      
      // Check if proposal is active
      if (proposal.status !== "active") {
        return res.status(400).json({ error: "Voting is only allowed on active proposals" });
      }
      
      const voteSchema = z.object({
        userId: z.number(),
        vote: z.boolean(),
        reason: z.string().optional()
      });
      
      const voteData = voteSchema.parse(req.body);
      
      // Create the vote
      const vote = await storage.createVote({
        proposalId,
        userId: voteData.userId,
        vote: voteData.vote,
        reason: voteData.reason
      });
      
      // Check if the proposal should be automatically passed or rejected
      const updatedProposal = await storage.getProposal(proposalId);
      if (updatedProposal) {
        if (updatedProposal.votesFor >= updatedProposal.votesRequired) {
          await storage.updateProposal(proposalId, { status: "passed" });
        } else if (updatedProposal.votesAgainst >= updatedProposal.votesRequired) {
          await storage.updateProposal(proposalId, { status: "rejected" });
        }
      }
      
      // Award points to the user for voting
      await storage.updateUserPoints(voteData.userId, 5);
      
      res.status(201).json(vote);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Get user roles
  app.get("/api/users/:id/roles", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const roles = await storage.getUserRoles(userId);
      res.json(roles);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Assign role to user
  app.post("/api/users/:id/roles", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const roleSchema = z.object({
        role: z.enum(["member", "moderator", "governance_council", "admin"]),
        assignedBy: z.number().optional(),
        expiresAt: z.string().optional()
      });
      
      const roleData = roleSchema.parse(req.body);
      
      // Parse expiresAt if provided
      let expiresAt = undefined;
      if (roleData.expiresAt) {
        expiresAt = new Date(roleData.expiresAt);
      }
      
      const userRole = await storage.assignRoleToUser({
        userId,
        role: roleData.role,
        assignedBy: roleData.assignedBy,
        expiresAt
      });
      
      res.status(201).json(userRole);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Remove role from user
  app.delete("/api/users/:id/roles/:role", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const role = req.params.role;
      
      await storage.removeRoleFromUser(userId, role);
      
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ===== ANNOTATION ROUTES =====

  // Get annotations for a proposal
  app.get("/api/proposals/:id/annotations", async (req, res) => {
    try {
      const proposalId = parseInt(req.params.id);
      const annotations = await storage.getAnnotationsByProposal(proposalId);
      
      // Get user data for each annotation and replies
      const enrichedAnnotations = await Promise.all(
        annotations.map(async (annotation) => {
          const user = await storage.getUser(annotation.userId);
          const userInfo = user 
            ? { id: user.id, displayName: user.displayName, avatar: user.avatar } 
            : null;
          
          // Get replies for this annotation
          const replies = await storage.getAnnotationReplies(annotation.id);
          
          // Get user data for each reply
          const enrichedReplies = await Promise.all(
            replies.map(async (reply) => {
              const replyUser = await storage.getUser(reply.userId);
              const replyUserInfo = replyUser 
                ? { id: replyUser.id, displayName: replyUser.displayName, avatar: replyUser.avatar } 
                : null;
              
              return {
                ...reply,
                user: replyUserInfo
              };
            })
          );
          
          return {
            ...annotation,
            user: userInfo,
            replies: enrichedReplies
          };
        })
      );
      
      res.json(enrichedAnnotations);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create annotation
  app.post("/api/annotations", async (req, res) => {
    try {
      const annotationData = insertAnnotationSchema.parse(req.body);
      
      // Create the annotation
      const annotation = await storage.createAnnotation(annotationData);
      
      // Award points to the user for creating an annotation
      await storage.updateUserPoints(annotationData.userId, 5);
      
      res.status(201).json(annotation);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Update annotation
  app.patch("/api/annotations/:id", async (req, res) => {
    try {
      const annotationId = parseInt(req.params.id);
      const annotation = await storage.getAnnotation(annotationId);
      
      if (!annotation) {
        return res.status(404).json({ error: "Annotation not found" });
      }
      
      // Define a validation schema for annotation updates
      const updateAnnotationSchema = z.object({
        content: z.string().optional(),
        status: z.enum(['open', 'resolved']).optional(),
        resolvedBy: z.number().nullable().optional()
      });
      
      // Validate request body
      const updateData = updateAnnotationSchema.parse(req.body);
      
      // Update annotation
      const updatedAnnotation = await storage.updateAnnotation(annotationId, updateData);
      
      res.json(updatedAnnotation);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Resolve annotation
  app.post("/api/annotations/:id/resolve", async (req, res) => {
    try {
      const annotationId = parseInt(req.params.id);
      const userId = z.object({ userId: z.number() }).parse(req.body).userId;
      
      // Resolve the annotation
      const resolvedAnnotation = await storage.resolveAnnotation(annotationId, userId);
      
      // Award points to the user for resolving an annotation
      await storage.updateUserPoints(userId, 3);
      
      res.json(resolvedAnnotation);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Delete annotation
  app.delete("/api/annotations/:id", async (req, res) => {
    try {
      const annotationId = parseInt(req.params.id);
      await storage.deleteAnnotation(annotationId);
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Add reply to annotation
  app.post("/api/annotations/:id/replies", async (req, res) => {
    try {
      const annotationId = parseInt(req.params.id);
      const annotation = await storage.getAnnotation(annotationId);
      
      if (!annotation) {
        return res.status(404).json({ error: "Annotation not found" });
      }
      
      // Modify the request body to include the annotation ID
      const replyData = {
        ...req.body,
        annotationId
      };
      
      // Validate and create the reply
      const validatedReplyData = insertAnnotationReplySchema.parse(replyData);
      const reply = await storage.createAnnotationReply(validatedReplyData);
      
      // Award points to the user for contributing to the discussion
      await storage.updateUserPoints(validatedReplyData.userId, 2);
      
      res.status(201).json(reply);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Delete annotation reply
  app.delete("/api/annotation-replies/:id", async (req, res) => {
    try {
      const replyId = parseInt(req.params.id);
      await storage.deleteAnnotationReply(replyId);
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  // Initialize the moderation service
  const moderationService = new ModerationService(storage);

  // ===== MODERATION ROUTES =====

  // Auto-moderate content
  app.post("/api/moderation/auto-moderate", async (req, res) => {
    try {
      const autoModerateSchema = z.object({
        contentId: z.number(),
        contentType: z.enum(["discussion", "comment", "proposal", "amendment", "profile", "event"]),
        content: z.string(),
        userId: z.number()
      });

      const { contentId, contentType, content, userId } = autoModerateSchema.parse(req.body);
      
      const result = await moderationService.autoModerateContent(
        contentId,
        contentType,
        content,
        userId
      );
      
      res.json(result);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Get content moderation analysis
  app.post("/api/moderation/analyze", async (req, res) => {
    try {
      const analyzeSchema = z.object({
        content: z.string()
      });

      const { content } = analyzeSchema.parse(req.body);
      
      const analysis = await moderationService.analyzeContent(content);
      res.json(analysis);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // // ===== 🌌 COSMIC INSIGHTS: AI Perspective Channel =====
app.post("/api/ai/perspective", async (req, res) => {
  try {
    const { discussionText, badges, userContext, style } = req.body;

    if (!discussionText) {
      return res.status(400).json({ error: "Missing discussionText" });
    }

    const result = await getAIPerspective({ discussionText, badges, userContext, style });

    res.json(result);
  } catch (err) {
    console.error("AI Perspective API error:", err);
    res.status(500).json({ error: "Failed to generate AI perspective" });
  }
});


  
  // Get all moderation flags
  app.get("/api/moderation/flags", async (_req, res) => {
    try {
      const flags = await storage.getModerationFlags();
      res.json(flags);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get moderation flags by status
  app.get("/api/moderation/flags/status/:status", async (req, res) => {
    try {
      const status = req.params.status;
      const flags = await storage.getModerationFlagsByStatus(status);
      res.json(flags);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create moderation flag
  app.post("/api/moderation/flags", async (req, res) => {
    try {
      const flagData = insertModerationFlagSchema.parse(req.body);
      const flag = await storage.createModerationFlag(flagData);
      res.status(201).json(flag);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Get AI assistance for moderation decision
  app.get("/api/moderation/flags/:id/ai-assistance", async (req, res) => {
    try {
      const flagId = parseInt(req.params.id);
      const assistance = await moderationService.getAIAssistance(flagId);
      res.json(assistance);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Make moderation decision
  app.post("/api/moderation/decisions", async (req, res) => {
    try {
      const decisionSchema = z.object({
        flagId: z.number(),
        moderatorId: z.number(),
        decision: z.enum(["approved", "rejected"]),
        reasoning: z.string(),
        aiAssisted: z.boolean()
      });

      const { flagId, moderatorId, decision, reasoning, aiAssisted } = decisionSchema.parse(req.body);
      
      const result = await moderationService.makeDecision(
        flagId,
        moderatorId,
        decision,
        reasoning,
        aiAssisted
      );
      
      res.status(201).json(result);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Submit appeal for moderation decision
  app.post("/api/moderation/appeals", async (req, res) => {
    try {
      const appealData = insertModerationAppealSchema.parse(req.body);
      const appeal = await storage.createModerationAppeal(appealData);
      res.status(201).json(appeal);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Get all appeals
  app.get("/api/moderation/appeals", async (_req, res) => {
    try {
      const appeals = await storage.getModerationAppeals();
      res.json(appeals);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get appeals by status
  app.get("/api/moderation/appeals/status/:status", async (req, res) => {
    try {
      const status = req.params.status;
      const appeals = await storage.getModerationAppealsByStatus(status);
      res.json(appeals);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Review an appeal
  app.post("/api/moderation/appeals/:id/review", async (req, res) => {
    try {
      const reviewSchema = z.object({
        reviewerId: z.number(),
        outcome: z.enum(["approved", "rejected"]),
        flagId: z.number()
      });

      const appealId = parseInt(req.params.id);
      const { reviewerId, outcome, flagId } = reviewSchema.parse(req.body);
      
      const result = await moderationService.reviewAppeal(
        appealId,
        reviewerId,
        outcome,
        flagId
      );
      
      res.json(result);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Get moderation settings
  app.get("/api/moderation/settings", async (_req, res) => {
    try {
      const settings = await storage.getModerationSettings();
      res.json(settings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create or update moderation setting
  app.post("/api/moderation/settings", async (req, res) => {
    try {
      const settingData = insertModerationSettingSchema.parse(req.body);
      
      // Check if setting already exists
      const existingSetting = await storage.getModerationSetting(settingData.key);
      
      if (existingSetting) {
        // Update
        const updated = await storage.updateModerationSetting(existingSetting.id, {
          value: settingData.value,
          description: settingData.description,
          updatedBy: settingData.updatedBy
        });
        return res.json(updated);
      }
      
      // Create new
      const setting = await storage.createModerationSetting(settingData);
      res.status(201).json(setting);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // ===== MIND MAP ROUTES =====
  
  // Get all mind maps
  app.get("/api/mind-maps", async (req, res) => {
    try {
      // Default to only returning public mind maps unless the user is authenticated
      const mindMaps = req.user 
        ? await storage.getMindMaps()
        : await storage.getPublicMindMaps();
      res.json(mindMaps);
    } catch (error) {
      console.error("Error fetching mind maps:", error);
      res.status(500).json({ message: "Failed to fetch mind maps" });
    }
  });
  
  // Get public mind maps
  app.get("/api/mind-maps/public", async (req, res) => {
    try {
      const publicMindMaps = await storage.getPublicMindMaps();
      res.json(publicMindMaps);
    } catch (error) {
      console.error("Error fetching public mind maps:", error);
      res.status(500).json({ message: "Failed to fetch public mind maps" });
    }
  });
  
  // Get mind maps for a specific user
  app.get("/api/mind-maps/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Check if requesting user has permission to view these maps
      if (!req.user && userId !== req.user?.id) {
        return res.json(await storage.getUserPublicMindMaps(userId));
      }
      
      const userMindMaps = await storage.getUserMindMaps(userId);
      res.json(userMindMaps);
    } catch (error) {
      console.error("Error fetching user mind maps:", error);
      res.status(500).json({ message: "Failed to fetch user mind maps" });
    }
  });
  
  // Get a specific mind map with its nodes and connections
  app.get("/api/mind-maps/:id", async (req, res) => {
    try {
      const mindMapId = parseInt(req.params.id);
      const mindMap = await storage.getMindMap(mindMapId);
      
      if (!mindMap) {
        return res.status(404).json({ message: "Mind map not found" });
      }
      
      // Check if user has access to this mind map
      if (!mindMap.isPublic && (!req.user || req.user.id !== mindMap.createdBy)) {
        return res.status(403).json({ message: "Not authorized to view this mind map" });
      }
      
      // Get nodes and connections
      const nodes = await storage.getMindMapNodes(mindMapId);
      const connections = await storage.getMindMapConnections(mindMapId);
      
      // Get creator info
      const creator = await storage.getUser(mindMap.createdBy);
      const creatorInfo = creator ? { 
        id: creator.id, 
        username: creator.username,
        displayName: creator.displayName
      } : null;
      
      res.json({
        ...mindMap,
        nodes,
        connections,
        creator: creatorInfo
      });
    } catch (error) {
      console.error("Error fetching mind map:", error);
      res.status(500).json({ message: "Failed to fetch mind map" });
    }
  });
  
  // Create a new mind map
  app.post("/api/mind-maps", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const { name, description, category, isPublic, isCollaborative } = req.body;
      
      if (!name) {
        return res.status(400).json({ message: "Mind map name is required" });
      }
      
      const insertMindMap = {
        name,
        description: description || "",
        category: category || "personal",
        createdBy: req.user.id,
        isPublic: isPublic || false,
        isCollaborative: isCollaborative || false,
      };
      
      const mindMap = await storage.createMindMap(insertMindMap);
      res.status(201).json(mindMap);
    } catch (error) {
      console.error("Error creating mind map:", error);
      res.status(500).json({ message: "Failed to create mind map" });
    }
  });
  
  // Update a mind map
  app.put("/api/mind-maps/:id", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const mindMapId = parseInt(req.params.id);
      const mindMap = await storage.getMindMap(mindMapId);
      
      if (!mindMap) {
        return res.status(404).json({ message: "Mind map not found" });
      }
      
      if (mindMap.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to update this mind map" });
      }
      
      const { name, description, category, isPublic, isCollaborative } = req.body;
      
      const updatedMindMap = await storage.updateMindMap(mindMapId, {
        name,
        description,
        category,
        isPublic,
        isCollaborative
      });
      
      res.json(updatedMindMap);
    } catch (error) {
      console.error("Error updating mind map:", error);
      res.status(500).json({ message: "Failed to update mind map" });
    }
  });
  
  // Delete a mind map
  app.delete("/api/mind-maps/:id", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const mindMapId = parseInt(req.params.id);
      const mindMap = await storage.getMindMap(mindMapId);
      
      if (!mindMap) {
        return res.status(404).json({ message: "Mind map not found" });
      }
      
      if (mindMap.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to delete this mind map" });
      }
      
      await storage.deleteMindMap(mindMapId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting mind map:", error);
      res.status(500).json({ message: "Failed to delete mind map" });
    }
  });
  
  // Create a new node in a mind map
  app.post("/api/mind-maps/:id/nodes", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const mindMapId = parseInt(req.params.id);
      const mindMap = await storage.getMindMap(mindMapId);
      
      if (!mindMap) {
        return res.status(404).json({ message: "Mind map not found" });
      }
      
      // Check if user has permission to add nodes
      if (!mindMap.isCollaborative && mindMap.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to add nodes to this mind map" });
      }
      
      const { id, type, content, description, x, y, color, size } = req.body;
      
      if (!id || !type || !content) {
        return res.status(400).json({ message: "Node id, type, and content are required" });
      }
      
      const insertNode = {
        mindMapId,
        nodeId: id,
        type,
        content,
        description: description || null,
        x,
        y,
        color,
        size,
        createdBy: req.user.id
      };
      
      const node = await storage.createMindMapNode(insertNode);
      res.status(201).json(node);
    } catch (error) {
      console.error("Error creating node:", error);
      res.status(500).json({ message: "Failed to create node" });
    }
  });
  
  // Update a node in a mind map
  app.put("/api/mind-maps/:mapId/nodes/:nodeId", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const mindMapId = parseInt(req.params.mapId);
      const nodeId = req.params.nodeId;
      
      const mindMap = await storage.getMindMap(mindMapId);
      if (!mindMap) {
        return res.status(404).json({ message: "Mind map not found" });
      }
      
      // Check if user has permission to update nodes
      if (!mindMap.isCollaborative && mindMap.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to update nodes in this mind map" });
      }
      
      const node = await storage.getMindMapNode(mindMapId, nodeId);
      if (!node) {
        return res.status(404).json({ message: "Node not found" });
      }
      
      const { type, content, description, x, y, color, size } = req.body;
      
      const updatedNode = await storage.updateMindMapNode(mindMapId, nodeId, {
        type,
        content,
        description,
        x,
        y,
        color,
        size
      });
      
      res.json(updatedNode);
    } catch (error) {
      console.error("Error updating node:", error);
      res.status(500).json({ message: "Failed to update node" });
    }
  });
  
  // Delete a node from a mind map
  app.delete("/api/mind-maps/:mapId/nodes/:nodeId", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const mindMapId = parseInt(req.params.mapId);
      const nodeId = req.params.nodeId;
      
      const mindMap = await storage.getMindMap(mindMapId);
      if (!mindMap) {
        return res.status(404).json({ message: "Mind map not found" });
      }
      
      // Check if user has permission to delete nodes
      if (!mindMap.isCollaborative && mindMap.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to delete nodes from this mind map" });
      }
      
      const node = await storage.getMindMapNode(mindMapId, nodeId);
      if (!node) {
        return res.status(404).json({ message: "Node not found" });
      }
      
      await storage.deleteMindMapNode(mindMapId, nodeId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting node:", error);
      res.status(500).json({ message: "Failed to delete node" });
    }
  });
  
  // Create a new connection in a mind map
  app.post("/api/mind-maps/:id/connections", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const mindMapId = parseInt(req.params.id);
      const mindMap = await storage.getMindMap(mindMapId);
      
      if (!mindMap) {
        return res.status(404).json({ message: "Mind map not found" });
      }
      
      // Check if user has permission to add connections
      if (!mindMap.isCollaborative && mindMap.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to add connections to this mind map" });
      }
      
      const { id, sourceId, targetId, label, description, color, thickness, style } = req.body;
      
      if (!id || !sourceId || !targetId) {
        return res.status(400).json({ message: "Connection id, sourceId, and targetId are required" });
      }
      
      const insertConnection = {
        mindMapId,
        connectionId: id,
        sourceId,
        targetId,
        label: label || null,
        description: description || null,
        color,
        thickness,
        style,
        createdBy: req.user.id
      };
      
      const connection = await storage.createMindMapConnection(insertConnection);
      res.status(201).json(connection);
    } catch (error) {
      console.error("Error creating connection:", error);
      res.status(500).json({ message: "Failed to create connection" });
    }
  });
  
  // Update a connection in a mind map
  app.put("/api/mind-maps/:mapId/connections/:connectionId", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const mindMapId = parseInt(req.params.mapId);
      const connectionId = req.params.connectionId;
      
      const mindMap = await storage.getMindMap(mindMapId);
      if (!mindMap) {
        return res.status(404).json({ message: "Mind map not found" });
      }
      
      // Check if user has permission to update connections
      if (!mindMap.isCollaborative && mindMap.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to update connections in this mind map" });
      }
      
      const connection = await storage.getMindMapConnection(mindMapId, connectionId);
      if (!connection) {
        return res.status(404).json({ message: "Connection not found" });
      }
      
      const { label, description, color, thickness, style } = req.body;
      
      const updatedConnection = await storage.updateMindMapConnection(mindMapId, connectionId, {
        label,
        description,
        color,
        thickness,
        style
      });
      
      res.json(updatedConnection);
    } catch (error) {
      console.error("Error updating connection:", error);
      res.status(500).json({ message: "Failed to update connection" });
    }
  });
  
  // Delete a connection from a mind map
  app.delete("/api/mind-maps/:mapId/connections/:connectionId", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const mindMapId = parseInt(req.params.mapId);
      const connectionId = req.params.connectionId;
      
      const mindMap = await storage.getMindMap(mindMapId);
      if (!mindMap) {
        return res.status(404).json({ message: "Mind map not found" });
      }
      
      // Check if user has permission to delete connections
      if (!mindMap.isCollaborative && mindMap.createdBy !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to delete connections from this mind map" });
      }
      
      const connection = await storage.getMindMapConnection(mindMapId, connectionId);
      if (!connection) {
        return res.status(404).json({ message: "Connection not found" });
      }
      
      await storage.deleteMindMapConnection(mindMapId, connectionId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting connection:", error);
      res.status(500).json({ message: "Failed to delete connection" });
    }
  });
  
  // Get all mind map templates
  app.get("/api/mind-map-templates", async (req, res) => {
    try {
      const templates = await storage.getMindMapTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching mind map templates:", error);
      res.status(500).json({ message: "Failed to fetch mind map templates" });
    }
  });
  
  // Get a specific mind map template
  app.get("/api/mind-map-templates/:id", async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      const template = await storage.getMindMapTemplate(templateId);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.json(template);
    } catch (error) {
      console.error("Error fetching mind map template:", error);
      res.status(500).json({ message: "Failed to fetch mind map template" });
    }
  });

  // ===== DONATION ROUTES =====
  
  // Initialize Stripe
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Missing required Stripe secret: STRIPE_SECRET_KEY');
  } else {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16"
    });
    
    // Define the donation tiers metadata
    const DONATION_TIERS = {
      'seed-planter': {
        name: 'Seed Planter',
        badgeId: 1001, // This would be the actual badge ID in your system
      },
      'tree-tender': {
        name: 'Tree Tender',
        badgeId: 1002,
      },
      'light-guardian': {
        name: 'Light Guardian',
        badgeId: 1003,
      }
    };

    // Create payment intent for donation
    app.post("/api/create-donation-intent", async (req, res) => {
      try {
        const { amount, tierId } = req.body;
        
        if (!amount || amount < 1) {
          return res.status(400).json({ 
            error: "Invalid amount. Must be at least 1 cent."
          });
        }

        // Validate the tier ID
        if (tierId && !DONATION_TIERS[tierId]) {
          return res.status(400).json({
            error: "Invalid donation tier."
          });
        }
        
        // Create the payment intent with Stripe
        // Note: In a real application with application fees, you'd use a Connect account
        // and transfer_data or application_fee_amount, but for simplicity here we'll
        // just track the Replit allocation in metadata
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount, // Amount is already in cents
          currency: "usd",
          metadata: {
            tierId,
            donationType: "one-time",
            replitAllocation: "20", // Store the 20% allocation as metadata
            replitAllocationAmount: Math.floor(amount * 0.20) // Calculate the 20% amount in cents
          }
        });
        
        // Return the client secret for the frontend to complete the payment
        res.json({ 
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id
        });
      } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ 
          error: "Failed to initialize donation process."
        });
      }
    });
    
    // Get donation payment status
    app.get("/api/donation-status", async (req, res) => {
      try {
        const { payment_intent } = req.query;
        
        if (!payment_intent || typeof payment_intent !== 'string') {
          return res.status(400).json({ 
            error: "Payment intent ID is required"
          });
        }
        
        // Retrieve the payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);
        
        res.json({
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          metadata: paymentIntent.metadata
        });
      } catch (error) {
        console.error("Error retrieving payment status:", error);
        res.status(500).json({ 
          error: "Failed to retrieve donation status."
        });
      }
    });
    
    // Webhook handler for Stripe events
    app.post("/api/webhooks/stripe", async (req, res) => {
      const sig = req.headers['stripe-signature'];
      
      try {
        // Note: In production, you'd need to retrieve and verify the webhook secret
        // const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        const event = req.body;
        
        // Handle payment success
        if (event.type === 'payment_intent.succeeded') {
          const paymentIntent = event.data.object;
          
          // Log the successful donation
          console.log('Payment succeeded:', paymentIntent.id);
          
          // Here you would:
          // 1. Record the donation in your database
          // 2. Update user's donation history/status if applicable
          // 3. Trigger any rewards/badges for the donation
          
          // For now, we'll just log it
          console.log(`Successful donation of $${paymentIntent.amount / 100} (${paymentIntent.metadata.tierId})`);
        }
        
        res.json({ received: true });
      } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).send(`Webhook error: ${error.message}`);
      }
    });
    
    // ===== COSMIC REACTION ROUTES =====
    
    // Get all emoji metadata
    app.get("/api/cosmic-emoji-metadata", async (_req, res) => {
      try {
        const metadata = await storage.getCosmicEmojiMetadata();
        res.json(metadata);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    
    // Get reactions for content
    app.get("/api/cosmic-reactions/:contentType/:contentId", async (req, res) => {
      try {
        const contentType = req.params.contentType;
        const contentId = parseInt(req.params.contentId);
        
        const reactions = await storage.getCosmicReactionsByContent(contentId, contentType);
        
        // Group reactions by emoji type and count them
        const reactionCounts = reactions.reduce((acc, reaction) => {
          if (!acc[reaction.emojiType]) {
            acc[reaction.emojiType] = 0;
          }
          acc[reaction.emojiType]++;
          return acc;
        }, {});
        
        // Get emoji metadata for each type
        const emojiMetadata = await storage.getCosmicEmojiMetadata();
        const enrichedReactions = Object.entries(reactionCounts).map(([emojiType, count]) => {
          const metadata = emojiMetadata.find(meta => meta.emojiType === emojiType);
          return {
            emojiType,
            count,
            metadata
          };
        });
        
        // Sort by count (highest first)
        enrichedReactions.sort((a, b) => b.count - a.count);
        
        res.json(enrichedReactions);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    
    // Create reaction
    app.post("/api/cosmic-reactions", async (req, res) => {
      try {
        if (!req.isAuthenticated()) {
          return res.status(401).json({ error: "You must be logged in to react" });
        }
        
        const reactionData = insertCosmicReactionSchema.parse(req.body);
        
        // Set the userId from the authenticated user
        reactionData.userId = (req.user as any).id;
        
        const reaction = await storage.createCosmicReaction(reactionData);
        
        res.status(201).json(reaction);
      } catch (err) {
        handleZodError(err, res);
      }
    });
    
    // This endpoint was duplicated below. Removing this version.

    // Delete reaction
    app.delete("/api/cosmic-reactions/:id", async (req, res) => {
      try {
        if (!req.isAuthenticated()) {
          return res.status(401).json({ error: "You must be logged in to remove a reaction" });
        }
        
        const reactionId = parseInt(req.params.id);
        
        // Check if the reaction exists and belongs to the user
        const reaction = await storage.getCosmicReactionById(reactionId);
        
        if (!reaction) {
          return res.status(404).json({ error: "Reaction not found" });
        }
        
        if (reaction.userId !== (req.user as any).id) {
          return res.status(403).json({ error: "You can only remove your own reactions" });
        }
        
        await storage.deleteCosmicReaction(reactionId);
        
        res.json({ message: "Reaction removed successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    
    // Get user's reactions on content
    app.get("/api/users/:userId/cosmic-reactions/:contentType/:contentId", async (req, res) => {
      try {
        const userId = parseInt(req.params.userId);
        const contentType = req.params.contentType;
        const contentId = parseInt(req.params.contentId);
        
        // Check if the current user is authorized to view this information
        if (!req.isAuthenticated() || (req.user as any).id !== userId) {
          return res.status(403).json({ error: "You can only view your own reactions" });
        }
        
        // Get all reactions for this content
        const allReactions = await storage.getCosmicReactionsByContent(contentId, contentType);
        
        // Filter for the user's reactions
        const userReactions = allReactions.filter(reaction => reaction.userId === userId);
        
        res.json(userReactions);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    
    // Toggle reaction (add if not present, remove if exists)
    app.post("/api/cosmic-reactions/toggle", async (req, res) => {
      try {
        if (!req.isAuthenticated()) {
          return res.status(401).json({ error: "You must be logged in to react" });
        }
        
        const { emojiType, contentId, contentType } = req.body;
        
        if (!emojiType || !contentId || !contentType) {
          return res.status(400).json({ error: "Missing required fields" });
        }
        
        const userId = (req.user as any).id;
        
        // Check if the user already has this reaction on this content
        const existingReaction = await storage.getUserCosmicReactionOnContent(
          userId, 
          contentId, 
          contentType, 
          emojiType
        );
        
        if (existingReaction) {
          // If reaction exists, remove it
          await storage.deleteCosmicReaction(existingReaction.id);
          
          // Get updated count
          const reactions = await storage.getCosmicReactionsByContent(contentId, contentType);
          const count = reactions.filter(r => r.emojiType === emojiType).length;
          
          return res.json({
            removed: true,
            emojiType,
            count,
            hasReacted: false
          });
        } else {
          // If reaction doesn't exist, add it
          const newReaction = await storage.createCosmicReaction({
            userId,
            contentId,
            contentType,
            emojiType
          });
          
          // Get updated count
          const reactions = await storage.getCosmicReactionsByContent(contentId, contentType);
          const count = reactions.filter(r => r.emojiType === emojiType).length;
          
          // Get emoji metadata
          const metadata = await storage.getCosmicEmojiMetadataByType(emojiType);
          
          // If points are granted for this reaction, update the content creator's points
          if (metadata && metadata.pointsGranted > 0) {
            // Different content types might reference users differently
            let contentOwnerId;
            
            if (contentType === 'discussion') {
              const discussion = await storage.getDiscussion(contentId);
              contentOwnerId = discussion?.userId;
            } else if (contentType === 'comment') {
              const comment = await storage.getComment(contentId);
              contentOwnerId = comment?.userId;
            } else if (contentType === 'proposal') {
              const proposal = await storage.getProposal(contentId);
              contentOwnerId = proposal?.proposedBy;
            } else if (contentType === 'amendment') {
              const amendment = await storage.getAmendment(contentId);
              contentOwnerId = amendment?.proposedBy;
            }
            
            // Add points to content creator (if not reacting to own content)
            if (contentOwnerId && contentOwnerId !== userId) {
              await storage.updateUserPoints(contentOwnerId, metadata.pointsGranted);
            }
          }
          
          return res.json({
            added: true,
            emojiType,
            count,
            hasReacted: true,
            reaction: newReaction
          });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      }
    });
  }

  return httpServer;
}
