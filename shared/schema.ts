import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  level: integer("level").notNull().default(1),
  points: integer("points").notNull().default(0),
  isAi: boolean("is_ai").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  level: true,
  points: true,
  isAi: true,
  createdAt: true,
});

// Topic category enum
export const topicCategoryEnum = pgEnum("topic_category", [
  "community_needs",
  "rights_agreement",
  "wellbeing",
  "communication",
  "other"
]);

// Discussions schema
export const discussions = pgTable("discussions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: integer("user_id").notNull(),
  category: topicCategoryEnum("category").notNull(),
  aiEnhanced: boolean("ai_enhanced").notNull().default(false),
  likes: integer("likes").notNull().default(0),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDiscussionSchema = createInsertSchema(discussions).omit({
  id: true,
  likes: true,
  views: true,
  createdAt: true,
});

// Comments schema
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userId: integer("user_id").notNull(),
  discussionId: integer("discussion_id").notNull(),
  likes: integer("likes").notNull().default(0),
  aiGenerated: boolean("ai_generated").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  likes: true,
  createdAt: true,
});

// Tags schema
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const insertTagSchema = createInsertSchema(tags).omit({
  id: true,
});

// Discussion-Tags relation
export const discussionTags = pgTable("discussion_tags", {
  id: serial("id").primaryKey(),
  discussionId: integer("discussion_id").notNull(),
  tagId: integer("tag_id").notNull(),
});

export const insertDiscussionTagSchema = createInsertSchema(discussionTags).omit({
  id: true,
});

// Rights Agreement schema
export const rightsAgreements = pgTable("rights_agreements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  version: text("version").notNull(),
  status: text("status").notNull(), // draft, approved, archived
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertRightsAgreementSchema = createInsertSchema(rightsAgreements).omit({
  id: true,
  createdAt: true,
});

// Amendments schema
export const amendments = pgTable("amendments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  proposedBy: integer("proposed_by").notNull(),
  agreementId: integer("agreement_id").notNull(),
  status: text("status").notNull(), // proposed, approved, rejected
  votesFor: integer("votes_for").notNull().default(0),
  votesAgainst: integer("votes_against").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAmendmentSchema = createInsertSchema(amendments).omit({
  id: true,
  votesFor: true,
  votesAgainst: true,
  createdAt: true,
});

// Badges schema
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  requirement: text("requirement").notNull(),
  category: text("category").notNull(),
});

export const insertBadgeSchema = createInsertSchema(badges).omit({
  id: true,
});

// User Badges relation
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  badgeId: integer("badge_id").notNull(),
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({
  id: true,
  earnedAt: true,
});

// Events schema
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  dateTime: timestamp("date_time").notNull(),
  category: text("category").notNull(),
  attendees: integer("attendees").notNull().default(0),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  attendees: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Discussion = typeof discussions.$inferSelect;
export type InsertDiscussion = z.infer<typeof insertDiscussionSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Tag = typeof tags.$inferSelect;
export type InsertTag = z.infer<typeof insertTagSchema>;

export type DiscussionTag = typeof discussionTags.$inferSelect;
export type InsertDiscussionTag = z.infer<typeof insertDiscussionTagSchema>;

export type RightsAgreement = typeof rightsAgreements.$inferSelect;
export type InsertRightsAgreement = z.infer<typeof insertRightsAgreementSchema>;

export type Amendment = typeof amendments.$inferSelect;
export type InsertAmendment = z.infer<typeof insertAmendmentSchema>;

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;

export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
