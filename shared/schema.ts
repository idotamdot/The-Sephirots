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
  avatarType: text("avatar_type").default("url"), // "url", "generated", "upload"
  bio: text("bio"),
  level: integer("level").notNull().default(1),
  points: integer("points").notNull().default(0),
  isAi: boolean("is_ai").notNull().default(false),
  twitterUrl: text("twitter_url"),
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  linkedinUrl: text("linkedin_url"),
  githubUrl: text("github_url"),
  personalWebsiteUrl: text("personal_website_url"),
  preferences: text("preferences").default("{}"), // Stored as JSON string
  lastActive: timestamp("last_active"),
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

// Proposals schema for community governance
export const proposalStatusEnum = pgEnum("proposal_status", [
  "draft",
  "active",
  "passed",
  "rejected",
  "implemented"
]);

export const proposalCategoryEnum = pgEnum("proposal_category", [
  "community_rules",
  "feature_request",
  "moderation_policy",
  "resource_allocation",
  "protocol_change",
  "other"
]);

export const proposals = pgTable("proposals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: proposalCategoryEnum("category").notNull(),
  status: proposalStatusEnum("status").notNull().default("draft"),
  proposedBy: integer("proposed_by").notNull(), // User ID
  votesRequired: integer("votes_required").notNull().default(10),
  votesFor: integer("votes_for").notNull().default(0),
  votesAgainst: integer("votes_against").notNull().default(0),
  votingEndsAt: timestamp("voting_ends_at").notNull(),
  implementationDetails: text("implementation_details"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertProposalSchema = createInsertSchema(proposals).omit({
  id: true,
  votesFor: true,
  votesAgainst: true,
  createdAt: true,
  updatedAt: true,
});

// Votes schema for proposals
export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  proposalId: integer("proposal_id").notNull(),
  userId: integer("user_id").notNull(),
  vote: boolean("vote").notNull(), // true = for, false = against
  reason: text("reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  createdAt: true,
});

// Community roles schema
export const roleEnum = pgEnum("role", [
  "member",
  "moderator",
  "governance_council",
  "admin"
]);

export const userRoles = pgTable("user_roles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  role: roleEnum("role").notNull(),
  assignedBy: integer("assigned_by"), // User ID who assigned this role, null for system-assigned
  assignedAt: timestamp("assigned_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"), // Optional expiration for temporary roles
});

export const insertUserRoleSchema = createInsertSchema(userRoles).omit({
  id: true,
  assignedAt: true,
});

// Annotations schema for proposal drafting and collaborative markup
export const annotationTypeEnum = pgEnum("annotation_type", [
  "comment",
  "suggestion",
  "question",
  "approval"
]);

export const annotations = pgTable("annotations", {
  id: serial("id").primaryKey(),
  proposalId: integer("proposal_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  type: annotationTypeEnum("type").notNull().default("comment"),
  selectionStart: integer("selection_start"), // Character position in proposal text where annotation starts
  selectionEnd: integer("selection_end"),     // Character position in proposal text where annotation ends
  resolved: boolean("resolved").notNull().default(false),
  resolvedBy: integer("resolved_by"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAnnotationSchema = createInsertSchema(annotations).omit({
  id: true,
  resolved: true,
  resolvedBy: true,
  resolvedAt: true,
  createdAt: true,
  updatedAt: true,
});

// Annotation replies for threaded discussions on annotations
export const annotationReplies = pgTable("annotation_replies", {
  id: serial("id").primaryKey(),
  annotationId: integer("annotation_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAnnotationReplySchema = createInsertSchema(annotationReplies).omit({
  id: true,
  createdAt: true,
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

export type Proposal = typeof proposals.$inferSelect;
export type InsertProposal = z.infer<typeof insertProposalSchema>;

export type Vote = typeof votes.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;

export type UserRole = typeof userRoles.$inferSelect;
export type InsertUserRole = z.infer<typeof insertUserRoleSchema>;

export type Annotation = typeof annotations.$inferSelect;
export type InsertAnnotation = z.infer<typeof insertAnnotationSchema>;

export type AnnotationReply = typeof annotationReplies.$inferSelect;
export type InsertAnnotationReply = z.infer<typeof insertAnnotationReplySchema>;

// We'll define relationships between tables later when needed
// For now, this basic schema is sufficient for creating the tables
