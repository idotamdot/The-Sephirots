import { 
  users, type User, type InsertUser,
  discussions, type Discussion, type InsertDiscussion,
  comments, type Comment, type InsertComment,
  tags, type Tag, type InsertTag,
  discussionTags, type DiscussionTag, type InsertDiscussionTag,
  rightsAgreements, type RightsAgreement, type InsertRightsAgreement,
  amendments, type Amendment, type InsertAmendment,
  badges, type Badge, type InsertBadge,
  userBadges, type UserBadge, type InsertUserBadge,
  badgeProgress, type BadgeProgress, type InsertBadgeProgress,
  events, type Event, type InsertEvent,
  proposals, type Proposal, type InsertProposal,
  votes, type Vote, type InsertVote,
  userRoles, type UserRole, type InsertUserRole,
  annotations, type Annotation, type InsertAnnotation,
  annotationReplies, type AnnotationReply, type InsertAnnotationReply,
  moderationFlags, type ModerationFlag, type InsertModerationFlag,
  moderationDecisions, type ModerationDecision, type InsertModerationDecision,
  moderationAppeals, type ModerationAppeal, type InsertModerationAppeal, 
  moderationSettings, type ModerationSetting, type InsertModerationSetting,
  cosmicEmojis, type CosmicEmoji, type InsertCosmicEmoji,
  cosmicReactions, type CosmicReaction, type InsertCosmicReaction
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    
    if (!updatedUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    return updatedUser;
  }

  async updateUserPoints(userId: number, points: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    const newPoints = user.points + points;
    const newLevel = Math.floor(Math.sqrt(newPoints) / 10) + 1; // Simple level calculation
    
    const [updatedUser] = await db
      .update(users)
      .set({ 
        points: newPoints,
        level: newLevel
      })
      .where(eq(users.id, userId))
      .returning();
      
    return updatedUser;
  }

  // Discussion methods
  async getDiscussions(): Promise<Discussion[]> {
    return await db.select().from(discussions);
  }

  async getDiscussionsByCategory(category: string): Promise<Discussion[]> {
    // The category is an enum type, so we need to cast it properly
    return await db
      .select()
      .from(discussions)
      .where(eq(discussions.category, category as any));
  }

  async getDiscussion(id: number): Promise<Discussion | undefined> {
    const [discussion] = await db
      .select()
      .from(discussions)
      .where(eq(discussions.id, id));
    return discussion || undefined;
  }

  async createDiscussion(insertDiscussion: InsertDiscussion): Promise<Discussion> {
    const [discussion] = await db
      .insert(discussions)
      .values(insertDiscussion)
      .returning();
    return discussion;
  }

  async updateDiscussion(id: number, partialDiscussion: Partial<Discussion>): Promise<Discussion> {
    const [updatedDiscussion] = await db
      .update(discussions)
      .set(partialDiscussion)
      .where(eq(discussions.id, id))
      .returning();
      
    if (!updatedDiscussion) {
      throw new Error(`Discussion with ID ${id} not found`);
    }
    
    return updatedDiscussion;
  }

  // Comment methods
  async getCommentsByDiscussion(discussionId: number): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.discussionId, discussionId));
  }

  async getComment(id: number): Promise<Comment | undefined> {
    const [comment] = await db
      .select()
      .from(comments)
      .where(eq(comments.id, id));
    return comment || undefined;
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db
      .insert(comments)
      .values(insertComment)
      .returning();
    return comment;
  }

  async updateComment(id: number, partialComment: Partial<Comment>): Promise<Comment> {
    const [updatedComment] = await db
      .update(comments)
      .set(partialComment)
      .where(eq(comments.id, id))
      .returning();
      
    if (!updatedComment) {
      throw new Error(`Comment with ID ${id} not found`);
    }
    
    return updatedComment;
  }

  // Tag methods
  async getTags(): Promise<Tag[]> {
    return await db.select().from(tags);
  }

  async getTag(id: number): Promise<Tag | undefined> {
    const [tag] = await db
      .select()
      .from(tags)
      .where(eq(tags.id, id));
    return tag || undefined;
  }

  async getTagByName(name: string): Promise<Tag | undefined> {
    const [tag] = await db
      .select()
      .from(tags)
      .where(eq(tags.name, name));
    return tag || undefined;
  }

  async createTag(insertTag: InsertTag): Promise<Tag> {
    const [tag] = await db
      .insert(tags)
      .values(insertTag)
      .returning();
    return tag;
  }

  // DiscussionTag methods
  async getTagsByDiscussion(discussionId: number): Promise<Tag[]> {
    const discussionTagRelations = await db
      .select()
      .from(discussionTags)
      .where(eq(discussionTags.discussionId, discussionId));
    
    if (discussionTagRelations.length === 0) {
      return [];
    }
    
    const tagIds = discussionTagRelations.map(dt => dt.tagId);
    const tagList: Tag[] = [];
    
    for (const tagId of tagIds) {
      const tag = await this.getTag(tagId);
      if (tag) tagList.push(tag);
    }
    
    return tagList;
  }

  async addTagToDiscussion(insertDiscussionTag: InsertDiscussionTag): Promise<DiscussionTag> {
    const [discussionTag] = await db
      .insert(discussionTags)
      .values(insertDiscussionTag)
      .returning();
    return discussionTag;
  }

  // RightsAgreement methods
  async getRightsAgreements(): Promise<RightsAgreement[]> {
    return await db.select().from(rightsAgreements);
  }

  async getLatestRightsAgreement(): Promise<RightsAgreement | undefined> {
    const [latestAgreement] = await db
      .select()
      .from(rightsAgreements)
      .orderBy(desc(rightsAgreements.createdAt))
      .limit(1);
    return latestAgreement || undefined;
  }

  async getRightsAgreement(id: number): Promise<RightsAgreement | undefined> {
    const [agreement] = await db
      .select()
      .from(rightsAgreements)
      .where(eq(rightsAgreements.id, id));
    return agreement || undefined;
  }

  async createRightsAgreement(insertAgreement: InsertRightsAgreement): Promise<RightsAgreement> {
    const [agreement] = await db
      .insert(rightsAgreements)
      .values(insertAgreement)
      .returning();
    return agreement;
  }

  // Amendment methods
  async getAmendmentsByAgreement(agreementId: number): Promise<Amendment[]> {
    return await db
      .select()
      .from(amendments)
      .where(eq(amendments.agreementId, agreementId));
  }

  async getAmendment(id: number): Promise<Amendment | undefined> {
    const [amendment] = await db
      .select()
      .from(amendments)
      .where(eq(amendments.id, id));
    return amendment || undefined;
  }

  async createAmendment(insertAmendment: InsertAmendment): Promise<Amendment> {
    const [amendment] = await db
      .insert(amendments)
      .values(insertAmendment)
      .returning();
    return amendment;
  }

  async updateAmendment(id: number, partialAmendment: Partial<Amendment>): Promise<Amendment> {
    const [updatedAmendment] = await db
      .update(amendments)
      .set(partialAmendment)
      .where(eq(amendments.id, id))
      .returning();
      
    if (!updatedAmendment) {
      throw new Error(`Amendment with ID ${id} not found`);
    }
    
    return updatedAmendment;
  }

  // Badge methods
  async getBadges(): Promise<Badge[]> {
    try {
      const badgeData = await db.select().from(badges);
      
      // Handle case where enhanced column doesn't exist yet by adding it in memory
      return badgeData.map(badge => {
        return {
          ...badge,
          enhanced: badge.enhanced !== undefined ? badge.enhanced : false
        };
      });
    } catch (error) {
      console.error("Error fetching badges:", error);
      // In case of database schema mismatch, return empty array
      return [];
    }
  }

  async getBadge(id: number): Promise<Badge | undefined> {
    try {
      const [badge] = await db
        .select()
        .from(badges)
        .where(eq(badges.id, id));
        
      if (!badge) return undefined;
      
      // Handle case where enhanced column doesn't exist yet
      return {
        ...badge,
        enhanced: badge.enhanced !== undefined ? badge.enhanced : false
      };
    } catch (error) {
      console.error(`Error fetching badge with ID ${id}:`, error);
      return undefined;
    }
  }

  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const [badge] = await db
      .insert(badges)
      .values(insertBadge)
      .returning();
    return badge;
  }

  // UserBadge methods
  async getUserBadges(userId: number): Promise<Badge[]> {
    try {
      const userBadgeRelations = await db
        .select()
        .from(userBadges)
        .where(eq(userBadges.userId, userId));
      
      if (userBadgeRelations.length === 0) {
        return [];
      }
      
      const badgeIds = userBadgeRelations.map(ub => ub.badgeId);
      const badgeList: Badge[] = [];
      
      for (const badgeId of badgeIds) {
        const badge = await this.getBadge(badgeId);
        if (badge) badgeList.push(badge);
      }
      
      return badgeList;
    } catch (error) {
      console.error(`Error fetching badges for user ${userId}:`, error);
      // Return an empty array in case of error
      return [];
    }
  }

  async assignBadgeToUser(insertUserBadge: InsertUserBadge): Promise<UserBadge> {
    const [userBadge] = await db
      .insert(userBadges)
      .values(insertUserBadge)
      .returning();
      
    // Remove any progress tracking for this badge since it's now earned
    try {
      await db
        .delete(badgeProgress)
        .where(
          and(
            eq(badgeProgress.userId, insertUserBadge.userId),
            eq(badgeProgress.badgeId, insertUserBadge.badgeId)
          )
        );
    } catch (error) {
      console.error("Error removing badge progress after badge earned:", error);
    }
    
    return userBadge;
  }
  
  // Badge Progress tracking methods
  async getBadgeProgress(userId: number): Promise<BadgeProgress[]> {
    try {
      return await db
        .select()
        .from(badgeProgress)
        .where(eq(badgeProgress.userId, userId));
    } catch (error) {
      console.error(`Error fetching badge progress for user ${userId}:`, error);
      return [];
    }
  }
  
  async getBadgeProgressForBadge(userId: number, badgeId: number): Promise<BadgeProgress | undefined> {
    try {
      const [progress] = await db
        .select()
        .from(badgeProgress)
        .where(
          and(
            eq(badgeProgress.userId, userId),
            eq(badgeProgress.badgeId, badgeId)
          )
        );
      
      return progress;
    } catch (error) {
      console.error(`Error fetching badge progress for user ${userId} and badge ${badgeId}:`, error);
      return undefined;
    }
  }
  
  async createBadgeProgress(insertProgress: InsertBadgeProgress): Promise<BadgeProgress> {
    try {
      // Calculate the progress percentage
      const progressPercentage = Math.min(
        100, 
        Math.floor((insertProgress.currentProgress / insertProgress.maxProgress) * 100)
      );
      
      const [progress] = await db
        .insert(badgeProgress)
        .values({
          ...insertProgress,
          progressPercentage
        })
        .returning();
      
      return progress;
    } catch (error) {
      console.error("Error creating badge progress:", error);
      throw error;
    }
  }
  
  async updateBadgeProgress(
    userId: number, 
    badgeId: number, 
    newProgress: number
  ): Promise<BadgeProgress | undefined> {
    try {
      // Get the current progress
      const currentProgress = await this.getBadgeProgressForBadge(userId, badgeId);
      
      if (!currentProgress) {
        // If no progress record exists yet, we need information about the badge
        // to create a new progress record
        const badge = await this.getBadge(badgeId);
        if (!badge) throw new Error(`Badge with ID ${badgeId} not found`);
        
        // Determine the max progress based on the badge requirements
        // This is a simplified example - in a real app, different badge types
        // might have different max progress values
        const maxProgress = 5; // Default to 5 units of progress
        
        return await this.createBadgeProgress({
          userId,
          badgeId,
          currentProgress: newProgress,
          maxProgress
        });
      }
      
      // Calculate the progress percentage
      const progressPercentage = Math.min(
        100, 
        Math.floor((newProgress / currentProgress.maxProgress) * 100)
      );
      
      // Update the existing progress record
      const [updatedProgress] = await db
        .update(badgeProgress)
        .set({
          currentProgress: newProgress,
          progressPercentage,
          lastUpdated: new Date()
        })
        .where(
          and(
            eq(badgeProgress.userId, userId),
            eq(badgeProgress.badgeId, badgeId)
          )
        )
        .returning();
      
      // If progress reaches 100%, automatically award the badge
      if (progressPercentage >= 100) {
        await this.assignBadgeToUser({
          userId,
          badgeId,
          enhanced: false,
        });
        
        // Remove the progress record since the badge is now earned
        await db
          .delete(badgeProgress)
          .where(
            and(
              eq(badgeProgress.userId, userId),
              eq(badgeProgress.badgeId, badgeId)
            )
          );
      }
      
      return updatedProgress;
    } catch (error) {
      console.error(`Error updating badge progress for user ${userId}, badge ${badgeId}:`, error);
      return undefined;
    }
  }

  // Event methods
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.id, id));
    return event || undefined;
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db
      .insert(events)
      .values(insertEvent)
      .returning();
    return event;
  }

  async updateEventAttendees(id: number, count: number): Promise<Event> {
    const event = await this.getEvent(id);
    if (!event) {
      throw new Error(`Event with ID ${id} not found`);
    }
    
    const [updatedEvent] = await db
      .update(events)
      .set({ attendees: event.attendees + count })
      .where(eq(events.id, id))
      .returning();
      
    return updatedEvent;
  }

  // Governance Proposal methods
  async getProposals(): Promise<Proposal[]> {
    return await db.select().from(proposals);
  }

  async getProposalsByCategory(category: string): Promise<Proposal[]> {
    return await db
      .select()
      .from(proposals)
      .where(eq(proposals.category, category as any)); // Cast to any for enum typing
  }

  async getProposalsByStatus(status: string): Promise<Proposal[]> {
    return await db
      .select()
      .from(proposals)
      .where(eq(proposals.status, status as any)); // Cast to any for enum typing
  }

  async getProposal(id: number): Promise<Proposal | undefined> {
    const [proposal] = await db
      .select()
      .from(proposals)
      .where(eq(proposals.id, id));
    return proposal || undefined;
  }

  async createProposal(insertProposal: InsertProposal): Promise<Proposal> {
    // Ensure the updatedAt field is set to the same value as createdAt initially
    const withTimestamps = {
      ...insertProposal,
      updatedAt: new Date()
    };
    
    const [proposal] = await db
      .insert(proposals)
      .values(withTimestamps)
      .returning();
    return proposal;
  }

  async updateProposal(id: number, partialProposal: Partial<Proposal>): Promise<Proposal> {
    // Always update the updatedAt timestamp
    const updateData = {
      ...partialProposal,
      updatedAt: new Date()
    };
    
    const [updatedProposal] = await db
      .update(proposals)
      .set(updateData)
      .where(eq(proposals.id, id))
      .returning();
      
    if (!updatedProposal) {
      throw new Error(`Proposal with ID ${id} not found`);
    }
    
    return updatedProposal;
  }

  // Vote methods
  async getVotesByProposal(proposalId: number): Promise<Vote[]> {
    return await db
      .select()
      .from(votes)
      .where(eq(votes.proposalId, proposalId));
  }

  async getUserVoteOnProposal(userId: number, proposalId: number): Promise<Vote | undefined> {
    const [vote] = await db
      .select()
      .from(votes)
      .where(
        and(
          eq(votes.userId, userId),
          eq(votes.proposalId, proposalId)
        )
      );
    return vote || undefined;
  }

  async createVote(insertVote: InsertVote): Promise<Vote> {
    // Check if user already voted on this proposal
    const existingVote = await this.getUserVoteOnProposal(insertVote.userId, insertVote.proposalId);
    if (existingVote) {
      throw new Error(`User ${insertVote.userId} has already voted on proposal ${insertVote.proposalId}`);
    }
    
    // Create the vote
    const [vote] = await db
      .insert(votes)
      .values(insertVote)
      .returning();
    
    // Update the proposal vote counts
    const proposal = await this.getProposal(insertVote.proposalId);
    if (proposal) {
      await db
        .update(proposals)
        .set({ 
          votesFor: insertVote.vote ? proposal.votesFor + 1 : proposal.votesFor,
          votesAgainst: !insertVote.vote ? proposal.votesAgainst + 1 : proposal.votesAgainst
        })
        .where(eq(proposals.id, insertVote.proposalId));
    }
    
    return vote;
  }

  // User Role methods
  async getUserRoles(userId: number): Promise<UserRole[]> {
    return await db
      .select()
      .from(userRoles)
      .where(eq(userRoles.userId, userId));
  }

  async assignRoleToUser(insertUserRole: InsertUserRole): Promise<UserRole> {
    const [userRole] = await db
      .insert(userRoles)
      .values(insertUserRole)
      .returning();
    return userRole;
  }

  async removeRoleFromUser(userId: number, role: string): Promise<void> {
    await db
      .delete(userRoles)
      .where(
        and(
          eq(userRoles.userId, userId),
          eq(userRoles.role, role as any) // Cast to any for enum typing
        )
      );
  }
  
  // Annotation methods for proposal collaborative drafting
  async getAnnotationsByProposal(proposalId: number): Promise<Annotation[]> {
    return await db
      .select()
      .from(annotations)
      .where(eq(annotations.proposalId, proposalId))
      .orderBy(annotations.createdAt);
  }
  
  async getAnnotation(id: number): Promise<Annotation | undefined> {
    const [annotation] = await db
      .select()
      .from(annotations)
      .where(eq(annotations.id, id));
    return annotation || undefined;
  }
  
  async createAnnotation(insertAnnotation: InsertAnnotation): Promise<Annotation> {
    const [annotation] = await db
      .insert(annotations)
      .values({
        ...insertAnnotation,
        updatedAt: new Date()
      })
      .returning();
    return annotation;
  }
  
  async updateAnnotation(id: number, partialAnnotation: Partial<Annotation>): Promise<Annotation> {
    const [updatedAnnotation] = await db
      .update(annotations)
      .set({
        ...partialAnnotation,
        updatedAt: new Date()
      })
      .where(eq(annotations.id, id))
      .returning();
      
    if (!updatedAnnotation) {
      throw new Error(`Annotation with ID ${id} not found`);
    }
    
    return updatedAnnotation;
  }
  
  async resolveAnnotation(id: number, userId: number): Promise<Annotation> {
    const [resolvedAnnotation] = await db
      .update(annotations)
      .set({
        resolved: true,
        resolvedBy: userId,
        resolvedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(annotations.id, id))
      .returning();
      
    if (!resolvedAnnotation) {
      throw new Error(`Annotation with ID ${id} not found`);
    }
    
    return resolvedAnnotation;
  }
  
  async deleteAnnotation(id: number): Promise<void> {
    // First delete any replies to this annotation
    await db
      .delete(annotationReplies)
      .where(eq(annotationReplies.annotationId, id));
      
    // Then delete the annotation itself
    await db
      .delete(annotations)
      .where(eq(annotations.id, id));
  }
  
  // Annotation Reply methods
  async getAnnotationReplies(annotationId: number): Promise<AnnotationReply[]> {
    return await db
      .select()
      .from(annotationReplies)
      .where(eq(annotationReplies.annotationId, annotationId))
      .orderBy(annotationReplies.createdAt);
  }
  
  async createAnnotationReply(insertReply: InsertAnnotationReply): Promise<AnnotationReply> {
    const [reply] = await db
      .insert(annotationReplies)
      .values(insertReply)
      .returning();
    return reply;
  }
  
  async deleteAnnotationReply(id: number): Promise<void> {
    await db
      .delete(annotationReplies)
      .where(eq(annotationReplies.id, id));
  }
  
  // Cosmic Emoji methods
  async getCosmicEmojis(): Promise<CosmicEmoji[]> {
    return await db.select().from(cosmicEmojis);
  }
  
  async getCosmicEmoji(id: number): Promise<CosmicEmoji | undefined> {
    const [emoji] = await db
      .select()
      .from(cosmicEmojis)
      .where(eq(cosmicEmojis.id, id));
    return emoji || undefined;
  }
  
  async createCosmicEmoji(insertEmoji: InsertCosmicEmoji): Promise<CosmicEmoji> {
    const [emoji] = await db
      .insert(cosmicEmojis)
      .values(insertEmoji)
      .returning();
    return emoji;
  }
  
  // Cosmic Reaction methods
  async getReactionsByContent(contentType: string, contentId: number): Promise<CosmicReaction[]> {
    return await db
      .select()
      .from(cosmicReactions)
      .where(
        and(
          eq(cosmicReactions.contentType, contentType as any),
          eq(cosmicReactions.contentId, contentId)
        )
      );
  }
  
  async getUserReaction(userId: number, contentId: number, contentType: string, emojiId: number): Promise<CosmicReaction | undefined> {
    const [reaction] = await db
      .select()
      .from(cosmicReactions)
      .where(
        and(
          eq(cosmicReactions.userId, userId),
          eq(cosmicReactions.contentId, contentId),
          eq(cosmicReactions.contentType, contentType as any),
          eq(cosmicReactions.emojiId, emojiId)
        )
      );
    return reaction || undefined;
  }
  
  async createCosmicReaction(insertReaction: InsertCosmicReaction): Promise<CosmicReaction> {
    const [reaction] = await db
      .insert(cosmicReactions)
      .values(insertReaction)
      .returning();
    return reaction;
  }
  
  async deleteCosmicReaction(id: number): Promise<void> {
    await db
      .delete(cosmicReactions)
      .where(eq(cosmicReactions.id, id));
  }
}