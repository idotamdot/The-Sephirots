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
export const badgeTierEnum = pgEnum("badge_tier", [
  "bronze",
  "silver",
  "gold",
  "platinum",
  "founder"
]);

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  requirement: text("requirement").notNull(),
  category: text("category").notNull(),
  tier: badgeTierEnum("tier").notNull().default("bronze"),
  level: integer("level").notNull().default(1),
  points: integer("points").notNull().default(10),
  symbolism: text("symbolism"),
  isLimited: boolean("is_limited").notNull().default(false),
  maxSupply: integer("max_supply"),
  enhanced: boolean("enhanced").notNull().default(false), // Indicates badge with special glow
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBadgeSchema = createInsertSchema(badges).omit({
  id: true,
  createdAt: true,
});

// User Badges relation
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  badgeId: integer("badge_id").notNull(),
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
  enhanced: boolean("enhanced").notNull().default(false),
  completedCriteria: text("completed_criteria"), // JSON string to track which criteria were met
  issuedBy: integer("issued_by"), // User ID who issued this badge, null for system-issued
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({
  id: true,
  earnedAt: true,
  completedCriteria: true,
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

// Moderation system schema
export const contentTypeEnum = pgEnum("content_type", [
  "discussion",
  "comment", 
  "proposal",
  "amendment",
  "profile",
  "event"
]);

export const moderationStatusEnum = pgEnum("moderation_status", [
  "pending",
  "approved",
  "rejected",
  "appealed",
  "auto_flagged",
  "auto_approved"
]);

export const moderationFlags = pgTable("moderation_flags", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").notNull(),
  contentType: contentTypeEnum("content_type").notNull(),
  reportedBy: integer("reported_by").notNull(), // User ID or null for AI
  reason: text("reason").notNull(),
  status: moderationStatusEnum("status").notNull().default("pending"),
  aiScore: integer("ai_score"), // Score from the AI analysis (0-100)
  aiReasoning: text("ai_reasoning"), // AI explanation for the flag
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertModerationFlagSchema = createInsertSchema(moderationFlags).omit({
  id: true,
  aiScore: true,
  aiReasoning: true,
  createdAt: true,
  updatedAt: true,
});

export const moderationDecisions = pgTable("moderation_decisions", {
  id: serial("id").primaryKey(),
  flagId: integer("flag_id").notNull().references(() => moderationFlags.id),
  moderatorId: integer("moderator_id").notNull(), // User ID or null for AI
  decision: moderationStatusEnum("decision").notNull(),
  reasoning: text("reasoning").notNull(),
  aiAssisted: boolean("ai_assisted").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertModerationDecisionSchema = createInsertSchema(moderationDecisions).omit({
  id: true,
  createdAt: true,
});

export const moderationAppeals = pgTable("moderation_appeals", {
  id: serial("id").primaryKey(),
  decisionId: integer("decision_id").notNull().references(() => moderationDecisions.id),
  userId: integer("user_id").notNull(),
  reason: text("reason").notNull(),
  status: moderationStatusEnum("status").notNull().default("pending"),
  reviewedBy: integer("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  reviewOutcome: moderationStatusEnum("review_outcome"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertModerationAppealSchema = createInsertSchema(moderationAppeals).omit({
  id: true,
  status: true,
  reviewedBy: true,
  reviewedAt: true,
  reviewOutcome: true,
  createdAt: true,
});

export const moderationSettings = pgTable("moderation_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedBy: integer("updated_by").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertModerationSettingSchema = createInsertSchema(moderationSettings).omit({
  id: true,
  updatedAt: true,
});

// Export moderation types
export type ModerationFlag = typeof moderationFlags.$inferSelect;
export type InsertModerationFlag = z.infer<typeof insertModerationFlagSchema>;

export type ModerationDecision = typeof moderationDecisions.$inferSelect;
export type InsertModerationDecision = z.infer<typeof insertModerationDecisionSchema>;

export type ModerationAppeal = typeof moderationAppeals.$inferSelect;
export type InsertModerationAppeal = z.infer<typeof insertModerationAppealSchema>;

export type ModerationSetting = typeof moderationSettings.$inferSelect;
export type InsertModerationSetting = z.infer<typeof insertModerationSettingSchema>;

// MindMap schema
export const mindMapNodeTypeEnum = pgEnum("mindmap_node_type", [
  "concept",
  "insight",
  "question",
  "experience",
  "connection"
]);

export const mindMaps = pgTable("mind_maps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  createdBy: integer("created_by").notNull(), // User ID
  category: text("category").notNull(),
  isPublic: boolean("is_public").notNull().default(true),
  isCollaborative: boolean("is_collaborative").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertMindMapSchema = createInsertSchema(mindMaps).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const mindMapNodes = pgTable("mindmap_nodes", {
  id: serial("id").primaryKey(),
  mindMapId: integer("mindmap_id").notNull(),
  nodeId: text("node_id").notNull(), // Client-side UUID for easy reference
  type: mindMapNodeTypeEnum("type").notNull(),
  content: text("content").notNull(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
  color: text("color").notNull(),
  size: integer("size").notNull().default(100),
  createdBy: integer("created_by").notNull(),
  attributes: text("attributes").notNull().default("{}"), // Stored as JSON string
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertMindMapNodeSchema = createInsertSchema(mindMapNodes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const connectionStyleEnum = pgEnum("connection_style", [
  "solid",
  "dashed",
  "dotted",
  "wavy"
]);

export const mindMapConnections = pgTable("mindmap_connections", {
  id: serial("id").primaryKey(),
  mindMapId: integer("mindmap_id").notNull(),
  connectionId: text("connection_id").notNull(), // Client-side UUID for easy reference
  sourceNodeId: text("source_node_id").notNull(), // References nodeId from mindMapNodes
  targetNodeId: text("target_node_id").notNull(), // References nodeId from mindMapNodes
  label: text("label"),
  color: text("color").notNull(),
  thickness: integer("thickness").notNull().default(2),
  style: connectionStyleEnum("style").notNull().default("solid"),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertMindMapConnectionSchema = createInsertSchema(mindMapConnections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const mindMapCollaborators = pgTable("mindmap_collaborators", {
  id: serial("id").primaryKey(),
  mindMapId: integer("mindmap_id").notNull(),
  userId: integer("user_id").notNull(),
  canEdit: boolean("can_edit").notNull().default(true),
  addedBy: integer("added_by").notNull(),
  addedAt: timestamp("added_at").notNull().defaultNow(),
});

export const insertMindMapCollaboratorSchema = createInsertSchema(mindMapCollaborators).omit({
  id: true,
  addedAt: true,
});

export const mindMapTemplates = pgTable("mindmap_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  createdBy: integer("created_by").notNull(),
  nodeData: text("node_data").notNull(), // JSON string of node templates
  connectionData: text("connection_data").notNull(), // JSON string of connection templates
  isPublic: boolean("is_public").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMindMapTemplateSchema = createInsertSchema(mindMapTemplates).omit({
  id: true,
  createdAt: true,
});

// Export mindmap types
export type MindMap = typeof mindMaps.$inferSelect;
export type InsertMindMap = z.infer<typeof insertMindMapSchema>;

export type MindMapNode = typeof mindMapNodes.$inferSelect;
export type InsertMindMapNode = z.infer<typeof insertMindMapNodeSchema>;

export type MindMapConnection = typeof mindMapConnections.$inferSelect;
export type InsertMindMapConnection = z.infer<typeof insertMindMapConnectionSchema>;

export type MindMapCollaborator = typeof mindMapCollaborators.$inferSelect;
export type InsertMindMapCollaborator = z.infer<typeof insertMindMapCollaboratorSchema>;

export type MindMapTemplate = typeof mindMapTemplates.$inferSelect;
export type InsertMindMapTemplate = z.infer<typeof insertMindMapTemplateSchema>;

// Cosmic Emoji Reaction System

// Define the emoji types enum for cosmic reactions
export const cosmicEmojiTypeEnum = pgEnum("cosmic_emoji_type", [
  "star_of_awe",
  "crescent_of_peace",
  "flame_of_passion",
  "drop_of_compassion",
  "leaf_of_growth",
  "spiral_of_mystery",
  "mirror_of_insight"
]);

// Reactions schema for discussions and comments
export const cosmicReactions = pgTable("cosmic_reactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  contentId: integer("content_id").notNull(),
  contentType: text("content_type").notNull(), // "discussion" or "comment"
  emojiType: cosmicEmojiTypeEnum("emoji_type").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCosmicReactionSchema = createInsertSchema(cosmicReactions).omit({
  id: true,
  createdAt: true,
});

// Emoji metadata for displaying tooltips, animations, etc.
export const cosmicEmojiMetadata = pgTable("cosmic_emoji_metadata", {
  id: serial("id").primaryKey(),
  emojiType: cosmicEmojiTypeEnum("emoji_type").notNull().unique(),
  displayEmoji: text("display_emoji").notNull(), // The actual emoji character to display
  tooltip: text("tooltip").notNull(), // The tooltip text for this emoji
  description: text("description").notNull(), // Longer description of what this emoji represents
  sephiroticPath: text("sephirotic_path").notNull(), // Which Sephirotic path/attribute this relates to
  pointsGranted: integer("points_granted").notNull().default(1), // Points granted toward that path when receiving this reaction
  animationClass: text("animation_class").notNull(), // CSS class for animation
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCosmicEmojiMetadataSchema = createInsertSchema(cosmicEmojiMetadata).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Export cosmic reaction types
export type CosmicReaction = typeof cosmicReactions.$inferSelect;
export type InsertCosmicReaction = z.infer<typeof insertCosmicReactionSchema>;

export type CosmicEmojiMetadata = typeof cosmicEmojiMetadata.$inferSelect;
export type InsertCosmicEmojiMetadata = z.infer<typeof insertCosmicEmojiMetadataSchema>;

// We'll define relationships between tables later when needed
// For now, this basic schema is sufficient for creating the tables
