import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import openai from "./openai";
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
  type User,
  type Proposal,
  type Vote,
  type UserRole
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

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // ===== USER ROUTES =====
  
  // Get current user (stub - in production this would use sessions)
  app.get("/api/users/me", async (req, res) => {
    try {
      // For demo purposes, return the first user
      const user = await storage.getUser(2);
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

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
