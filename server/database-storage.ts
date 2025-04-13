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
  events, type Event, type InsertEvent
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
    return await db.select().from(badges);
  }

  async getBadge(id: number): Promise<Badge | undefined> {
    const [badge] = await db
      .select()
      .from(badges)
      .where(eq(badges.id, id));
    return badge || undefined;
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
  }

  async assignBadgeToUser(insertUserBadge: InsertUserBadge): Promise<UserBadge> {
    const [userBadge] = await db
      .insert(userBadges)
      .values(insertUserBadge)
      .returning();
    return userBadge;
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
}