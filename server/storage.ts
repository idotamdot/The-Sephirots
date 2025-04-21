import {
  users, User, InsertUser,
  discussions, Discussion, InsertDiscussion,
  comments, Comment, InsertComment,
  tags, Tag, InsertTag,
  discussionTags, DiscussionTag, InsertDiscussionTag,
  rightsAgreements, RightsAgreement, InsertRightsAgreement,
  amendments, Amendment, InsertAmendment,
  badges, Badge, InsertBadge,
  userBadges, UserBadge, InsertUserBadge,
  events, Event, InsertEvent,
  proposals, Proposal, InsertProposal,
  votes, Vote, InsertVote,
  userRoles, UserRole, InsertUserRole,
  annotations, Annotation, InsertAnnotation,
  annotationReplies, AnnotationReply, InsertAnnotationReply,
  moderationFlags, ModerationFlag, InsertModerationFlag,
  moderationDecisions, ModerationDecision, InsertModerationDecision,
  moderationAppeals, ModerationAppeal, InsertModerationAppeal,
  moderationSettings, ModerationSetting, InsertModerationSetting,
  mindMaps, MindMap, InsertMindMap,
  mindMapNodes, MindMapNode, InsertMindMapNode, 
  mindMapConnections, MindMapConnection, InsertMindMapConnection,
  mindMapCollaborators, MindMapCollaborator, InsertMindMapCollaborator,
  mindMapTemplates, MindMapTemplate, InsertMindMapTemplate,
  cosmicReactions, CosmicReaction, InsertCosmicReaction,
  cosmicEmojis, CosmicEmoji, InsertCosmicEmoji
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User>;
  updateUserPoints(userId: number, points: number): Promise<User>;
  
  // Discussion methods
  getDiscussions(): Promise<Discussion[]>;
  getDiscussionsByCategory(category: string): Promise<Discussion[]>;
  getDiscussion(id: number): Promise<Discussion | undefined>;
  createDiscussion(discussion: InsertDiscussion): Promise<Discussion>;
  updateDiscussion(id: number, discussion: Partial<Discussion>): Promise<Discussion>;
  
  // Comment methods
  getCommentsByDiscussion(discussionId: number): Promise<Comment[]>;
  getComment(id: number): Promise<Comment | undefined>;
  createComment(comment: InsertComment): Promise<Comment>;
  updateComment(id: number, comment: Partial<Comment>): Promise<Comment>;
  
  // Tag methods
  getTags(): Promise<Tag[]>;
  getTag(id: number): Promise<Tag | undefined>;
  getTagByName(name: string): Promise<Tag | undefined>;
  createTag(tag: InsertTag): Promise<Tag>;
  
  // DiscussionTag methods
  getTagsByDiscussion(discussionId: number): Promise<Tag[]>;
  addTagToDiscussion(discussionTag: InsertDiscussionTag): Promise<DiscussionTag>;
  
  // RightsAgreement methods
  getLatestRightsAgreement(): Promise<RightsAgreement | undefined>;
  getRightsAgreements(): Promise<RightsAgreement[]>;
  getRightsAgreement(id: number): Promise<RightsAgreement | undefined>;
  createRightsAgreement(agreement: InsertRightsAgreement): Promise<RightsAgreement>;
  
  // Amendment methods
  getAmendmentsByAgreement(agreementId: number): Promise<Amendment[]>;
  getAmendment(id: number): Promise<Amendment | undefined>;
  createAmendment(amendment: InsertAmendment): Promise<Amendment>;
  updateAmendment(id: number, amendment: Partial<Amendment>): Promise<Amendment>;
  
  // Badge methods
  getBadges(): Promise<Badge[]>;
  getBadge(id: number): Promise<Badge | undefined>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  
  // UserBadge methods
  getUserBadges(userId: number): Promise<UserBadge[]>;
  getUserBadge(id: number): Promise<UserBadge | undefined>;
  awardBadge(userBadge: InsertUserBadge): Promise<UserBadge>;
  
  // Event methods
  getEvents(): Promise<Event[]>;
  getEventsByCategory(category: string): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<Event>): Promise<Event>;
  
  // Proposal methods
  getProposals(): Promise<Proposal[]>;
  getProposalsByCategory(category: string): Promise<Proposal[]>;
  getProposal(id: number): Promise<Proposal | undefined>;
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  updateProposal(id: number, proposal: Partial<Proposal>): Promise<Proposal>;
  
  // Vote methods
  getVotesByProposal(proposalId: number): Promise<Vote[]>;
  getVote(id: number): Promise<Vote | undefined>;
  getUserVoteOnProposal(userId: number, proposalId: number): Promise<Vote | undefined>;
  createVote(vote: InsertVote): Promise<Vote>;
  updateVote(id: number, vote: Partial<Vote>): Promise<Vote>;
  
  // UserRole methods
  getUserRoles(userId: number): Promise<UserRole[]>;
  getUserRole(id: number): Promise<UserRole | undefined>;
  assignUserRole(userRole: InsertUserRole): Promise<UserRole>;
  removeUserRole(id: number): Promise<void>;
  
  // Annotation methods
  getAnnotationsByDiscussion(discussionId: number): Promise<Annotation[]>;
  getAnnotation(id: number): Promise<Annotation | undefined>;
  createAnnotation(annotation: InsertAnnotation): Promise<Annotation>;
  updateAnnotation(id: number, annotation: Partial<Annotation>): Promise<Annotation>;
  deleteAnnotation(id: number): Promise<void>;
  
  // AnnotationReply methods
  getRepliesByAnnotation(annotationId: number): Promise<AnnotationReply[]>;
  getAnnotationReply(id: number): Promise<AnnotationReply | undefined>;
  createAnnotationReply(reply: InsertAnnotationReply): Promise<AnnotationReply>;
  updateAnnotationReply(id: number, reply: Partial<AnnotationReply>): Promise<AnnotationReply>;
  deleteAnnotationReply(id: number): Promise<void>;
  
  // Moderation Flag methods
  getModerationFlags(): Promise<ModerationFlag[]>;
  getModerationFlagsByStatus(status: string): Promise<ModerationFlag[]>;
  getModerationFlagsByContentType(contentType: string): Promise<ModerationFlag[]>;
  getModerationFlag(id: number): Promise<ModerationFlag | undefined>;
  createModerationFlag(flag: InsertModerationFlag): Promise<ModerationFlag>;
  updateModerationFlag(id: number, flag: Partial<ModerationFlag>): Promise<ModerationFlag>;
  
  // Moderation Decision methods
  getModerationDecisionsByFlag(flagId: number): Promise<ModerationDecision[]>;
  getModerationDecision(id: number): Promise<ModerationDecision | undefined>;
  createModerationDecision(decision: InsertModerationDecision): Promise<ModerationDecision>;
  
  // Moderation Appeal methods
  getModerationAppeals(): Promise<ModerationAppeal[]>;
  getModerationAppealsByStatus(status: string): Promise<ModerationAppeal[]>;
  getModerationAppeal(id: number): Promise<ModerationAppeal | undefined>;
  createModerationAppeal(appeal: InsertModerationAppeal): Promise<ModerationAppeal>;
  updateModerationAppeal(id: number, appeal: Partial<ModerationAppeal>): Promise<ModerationAppeal>;
  
  // Moderation Settings methods
  getModerationSettings(): Promise<ModerationSetting[]>;
  getModerationSetting(id: number): Promise<ModerationSetting | undefined>;
  updateModerationSetting(id: number, setting: Partial<ModerationSetting>): Promise<ModerationSetting>;
  createModerationSetting(setting: InsertModerationSetting): Promise<ModerationSetting>;
  
  // Mind Map methods
  getMindMaps(): Promise<MindMap[]>;
  getPublicMindMaps(): Promise<MindMap[]>;
  getUserMindMaps(userId: number): Promise<MindMap[]>;
  getUserPublicMindMaps(userId: number): Promise<MindMap[]>;
  getMindMap(id: number): Promise<MindMap | undefined>;
  createMindMap(mindMap: InsertMindMap): Promise<MindMap>;
  updateMindMap(id: number, mindMap: Partial<MindMap>): Promise<MindMap>;
  deleteMindMap(id: number): Promise<void>;

  // Mind Map Node methods
  getMindMapNodes(mindMapId: number): Promise<MindMapNode[]>;
  getMindMapNode(mindMapId: number, nodeId: string): Promise<MindMapNode | undefined>;
  createMindMapNode(node: InsertMindMapNode): Promise<MindMapNode>;
  updateMindMapNode(mindMapId: number, nodeId: string, node: Partial<MindMapNode>): Promise<MindMapNode>;
  deleteMindMapNode(mindMapId: number, nodeId: string): Promise<void>;

  // Mind Map Connection methods
  getMindMapConnections(mindMapId: number): Promise<MindMapConnection[]>;
  getMindMapConnection(mindMapId: number, connectionId: string): Promise<MindMapConnection | undefined>;
  createMindMapConnection(connection: InsertMindMapConnection): Promise<MindMapConnection>;
  updateMindMapConnection(mindMapId: number, connectionId: string, connection: Partial<MindMapConnection>): Promise<MindMapConnection>;
  deleteMindMapConnection(mindMapId: number, connectionId: string): Promise<void>;

  // Mind Map Collaborators methods
  getMindMapCollaborators(mindMapId: number): Promise<MindMapCollaborator[]>;
  addCollaboratorToMindMap(collaborator: InsertMindMapCollaborator): Promise<MindMapCollaborator>;
  removeCollaboratorFromMindMap(mindMapId: number, userId: number): Promise<void>;

  // Mind Map Templates methods
  getMindMapTemplates(): Promise<MindMapTemplate[]>;
  getMindMapTemplate(id: number): Promise<MindMapTemplate | undefined>;
  createMindMapTemplate(template: InsertMindMapTemplate): Promise<MindMapTemplate>;
  
  // Cosmic Emoji methods
  getCosmicEmojis(): Promise<CosmicEmoji[]>;
  getCosmicEmoji(id: number): Promise<CosmicEmoji | undefined>;
  createCosmicEmoji(emoji: InsertCosmicEmoji): Promise<CosmicEmoji>;
  
  // Cosmic Reaction methods
  getReactionsByContent(contentType: string, contentId: number): Promise<CosmicReaction[]>;
  getUserReaction(userId: number, contentId: number, contentType: string, emojiId: number): Promise<CosmicReaction | undefined>;
  createCosmicReaction(reaction: InsertCosmicReaction): Promise<CosmicReaction>;
  deleteCosmicReaction(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userId: number;
  
  private discussions: Map<number, Discussion>;
  private discussionId: number;
  
  private comments: Map<number, Comment>;
  private commentId: number;
  
  private tags: Map<number, Tag>;
  private tagId: number;
  
  private discussionTags: Map<number, DiscussionTag>;
  private discussionTagId: number;
  
  private rightsAgreements: Map<number, RightsAgreement>;
  private rightsAgreementId: number;
  
  private amendments: Map<number, Amendment>;
  private amendmentId: number;
  
  private badges: Map<number, Badge>;
  private badgeId: number;
  
  private userBadges: Map<number, UserBadge>;
  private userBadgeId: number;
  
  private events: Map<number, Event>;
  private eventId: number;
  
  private proposals: Map<number, Proposal>;
  private proposalId: number;
  
  private votes: Map<number, Vote>;
  private voteId: number;
  
  private userRoles: Map<number, UserRole>;
  private userRoleId: number;
  
  private annotations: Map<number, Annotation>;
  private annotationId: number;
  
  private annotationReplies: Map<number, AnnotationReply>;
  private annotationReplyId: number;
  
  private moderationFlags: Map<number, ModerationFlag>;
  private moderationFlagId: number;
  
  private moderationDecisions: Map<number, ModerationDecision>;
  private moderationDecisionId: number;
  
  private moderationAppeals: Map<number, ModerationAppeal>;
  private moderationAppealId: number;
  
  private cosmicEmojis: Map<number, CosmicEmoji>;
  private cosmicEmojiId: number;
  
  private cosmicReactions: Map<number, CosmicReaction>;
  private cosmicReactionId: number;
  
  private moderationSettings: Map<number, ModerationSetting>;
  private moderationSettingId: number;
  
  // Mind map related properties
  private mindMaps: Map<number, MindMap>;
  private mindMapId: number;
  private mindMapNodes: Map<string, MindMapNode>;
  private mindMapConnections: Map<string, MindMapConnection>;
  private mindMapCollaborators: Map<number, MindMapCollaborator>;
  private mindMapCollaboratorId: number;
  private mindMapTemplates: Map<number, MindMapTemplate>;
  private mindMapTemplateId: number;
  
  // Cosmic emoji and reaction properties are already defined above
  
  constructor() {
    this.users = new Map();
    this.userId = 1;
    
    this.discussions = new Map();
    this.discussionId = 1;
    
    this.comments = new Map();
    this.commentId = 1;
    
    this.tags = new Map();
    this.tagId = 1;
    
    this.discussionTags = new Map();
    this.discussionTagId = 1;
    
    this.rightsAgreements = new Map();
    this.rightsAgreementId = 1;
    
    this.amendments = new Map();
    this.amendmentId = 1;
    
    this.badges = new Map();
    this.badgeId = 1;
    
    this.userBadges = new Map();
    this.userBadgeId = 1;
    
    this.events = new Map();
    this.eventId = 1;
    
    this.proposals = new Map();
    this.proposalId = 1;
    
    this.votes = new Map();
    this.voteId = 1;
    
    this.userRoles = new Map();
    this.userRoleId = 1;
    
    this.annotations = new Map();
    this.annotationId = 1;
    
    this.annotationReplies = new Map();
    this.annotationReplyId = 1;
    
    this.moderationFlags = new Map();
    this.moderationFlagId = 1;
    
    this.moderationDecisions = new Map();
    this.moderationDecisionId = 1;
    
    this.moderationAppeals = new Map();
    this.moderationAppealId = 1;
    
    this.moderationSettings = new Map();
    this.moderationSettingId = 1;
    
    // Initialize mind map data structures
    this.mindMaps = new Map();
    this.mindMapId = 1;
    this.mindMapNodes = new Map();
    this.mindMapConnections = new Map();
    this.mindMapCollaborators = new Map();
    this.mindMapCollaboratorId = 1;
    this.mindMapTemplates = new Map();
    this.mindMapTemplateId = 1;
    
    // Initialize cosmic reaction data structures
    this.cosmicReactions = new Map();
    this.cosmicReactionId = 1;
    this.cosmicEmojis = new Map();
    this.cosmicEmojiId = 1;
    
    // Add initial cosmic emojis
    const emojiTypes = [
      {
        id: this.cosmicEmojiId++,
        emojiType: "star_of_awe",
        displayEmoji: "✨",
        tooltip: "Star of Awe - Keter",
        description: "Represents the crown and highest potential. Share when deeply inspired.",
        sephiroticPath: "Keter",
        pointsGranted: 3,
        animationClass: "star-animation",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.cosmicEmojiId++,
        emojiType: "crescent_of_peace",
        displayEmoji: "🌙",
        tooltip: "Crescent of Peace - Chokhmah",
        description: "Represents wisdom and harmony. Share when feeling peaceful resonance.",
        sephiroticPath: "Chokhmah",
        pointsGranted: 2,
        animationClass: "crescent-animation",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.cosmicEmojiId++,
        emojiType: "flame_of_passion",
        displayEmoji: "🔥",
        tooltip: "Flame of Passion - Gevurah",
        description: "Represents strength and passion. Share when feeling energized.",
        sephiroticPath: "Gevurah",
        pointsGranted: 2,
        animationClass: "flame-animation",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.cosmicEmojiId++,
        emojiType: "drop_of_compassion",
        displayEmoji: "💧",
        tooltip: "Drop of Compassion - Chesed",
        description: "Represents loving-kindness. Share when touched by compassion.",
        sephiroticPath: "Chesed",
        pointsGranted: 2,
        animationClass: "drop-animation",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.cosmicEmojiId++,
        emojiType: "leaf_of_growth",
        displayEmoji: "🌱",
        tooltip: "Leaf of Growth - Netzach",
        description: "Represents endurance and growth. Share when inspired to grow.",
        sephiroticPath: "Netzach",
        pointsGranted: 2,
        animationClass: "leaf-animation",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.cosmicEmojiId++,
        emojiType: "spiral_of_mystery",
        displayEmoji: "🌀",
        tooltip: "Spiral of Mystery - Yesod",
        description: "Represents the foundation and mystery. Share when encountering profound mystery.",
        sephiroticPath: "Yesod",
        pointsGranted: 2,
        animationClass: "spiral-animation",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.cosmicEmojiId++,
        emojiType: "mirror_of_insight",
        displayEmoji: "🪞",
        tooltip: "Mirror of Insight - Binah",
        description: "Represents understanding and insight. Share when experiencing a revelation.",
        sephiroticPath: "Binah",
        pointsGranted: 2,
        animationClass: "mirror-animation",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Store cosmic emojis
    emojiTypes.forEach(emoji => {
      this.cosmicEmojis.set(emoji.id, emoji);
    });
    
    // Add a sample user
    const user: User = {
      id: this.userId,
      username: "admin",
      email: "admin@example.com",
      displayName: "Admin User",
      passwordHash: "$2b$10$GyhOV5Px5YrCRqViB2L1C.j.DNFuojMEg3xE0bBDtvzpaMBUvILZu", // "password"
      avatar: null,
      bio: "Platform administrator",
      level: 10,
      points: 1000,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      isActive: true,
      isAdmin: true,
      settings: {},
      metrics: {}
    };
    this.users.set(this.userId, user);
    this.userId++;
    
    // Add a sample badge
    const badge: Badge = {
      id: this.badgeId,
      name: "Founder",
      level: 1,
      points: 100,
      createdAt: new Date(),
      category: "Contribution",
      description: "Awarded to pioneers who contributed to the format",
      icon: "🏆",
      requirement: "Be among the first members to contribute",
      tier: "founder",
      symbolism: "Keter - Representing the Crown and highest potential",
      isLimited: true,
      maxSupply: 100
    };
    this.badges.set(this.badgeId, badge);
    this.badgeId++;
    
    // Award badge to sample user
    const userBadge: UserBadge = {
      id: this.userBadgeId,
      userId: 1,
      badgeId: 1,
      earnedAt: new Date(),
      enhanced: false,
      completedCriteria: "Early contributor",
      issuedBy: null
    };
    this.userBadges.set(this.userBadgeId, userBadge);
    this.userBadgeId++;
    
    // Add a sample rights agreement
    const rightsAgreement: RightsAgreement = {
      id: this.rightsAgreementId,
      title: "The Sephirots AI-Human Collaboration Module Rights Agreement",
      content: "This Rights Agreement establishes the foundational principles for fostering harmonious collaboration between humans and artificial intelligences within our community.",
      version: "1.0.0",
      status: "active",
      createdAt: new Date(),
      activatedAt: new Date(),
      createdBy: 1
    };
    this.rightsAgreements.set(this.rightsAgreementId, rightsAgreement);
    this.rightsAgreementId++;
  }
  
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const newUser = {
      id: this.userId++,
      ...user,
      level: 1,
      points: 0,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      isActive: true,
      isAdmin: false,
      settings: {},
      metrics: {}
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const existingUser = await this.getUser(id);
    if (!existingUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    const updatedUser = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateUserPoints(userId: number, points: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    const updatedUser = { 
      ...user, 
      points: user.points + points 
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  // Discussion methods
  async getDiscussions(): Promise<Discussion[]> {
    return Array.from(this.discussions.values());
  }
  
  async getDiscussionsByCategory(category: string): Promise<Discussion[]> {
    return Array.from(this.discussions.values()).filter(
      discussion => discussion.category === category
    );
  }
  
  async getDiscussion(id: number): Promise<Discussion | undefined> {
    return this.discussions.get(id);
  }
  
  async createDiscussion(discussion: InsertDiscussion): Promise<Discussion> {
    const timestamp = new Date();
    const newDiscussion: Discussion = {
      id: this.discussionId++,
      ...discussion,
      createdAt: timestamp,
      updatedAt: timestamp,
      views: 0,
      isLocked: false,
      isPinned: false,
      status: "active"
    };
    this.discussions.set(newDiscussion.id, newDiscussion);
    return newDiscussion;
  }
  
  async updateDiscussion(id: number, discussion: Partial<Discussion>): Promise<Discussion> {
    const existingDiscussion = await this.getDiscussion(id);
    if (!existingDiscussion) {
      throw new Error(`Discussion with ID ${id} not found`);
    }
    
    const updatedDiscussion = { 
      ...existingDiscussion, 
      ...discussion, 
      updatedAt: new Date() 
    };
    this.discussions.set(id, updatedDiscussion);
    return updatedDiscussion;
  }
  
  // Comment methods
  async getCommentsByDiscussion(discussionId: number): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(
      comment => comment.discussionId === discussionId
    );
  }
  
  async getComment(id: number): Promise<Comment | undefined> {
    return this.comments.get(id);
  }
  
  async createComment(comment: InsertComment): Promise<Comment> {
    const timestamp = new Date();
    const newComment: Comment = {
      id: this.commentId++,
      ...comment,
      createdAt: timestamp,
      updatedAt: timestamp,
      isEdited: false,
      status: "active"
    };
    this.comments.set(newComment.id, newComment);
    return newComment;
  }
  
  async updateComment(id: number, comment: Partial<Comment>): Promise<Comment> {
    const existingComment = await this.getComment(id);
    if (!existingComment) {
      throw new Error(`Comment with ID ${id} not found`);
    }
    
    const updatedComment = { 
      ...existingComment, 
      ...comment, 
      updatedAt: new Date(),
      isEdited: true
    };
    this.comments.set(id, updatedComment);
    return updatedComment;
  }
  
  // Tag methods
  async getTags(): Promise<Tag[]> {
    return Array.from(this.tags.values());
  }
  
  async getTag(id: number): Promise<Tag | undefined> {
    return this.tags.get(id);
  }
  
  async getTagByName(name: string): Promise<Tag | undefined> {
    return Array.from(this.tags.values()).find(tag => tag.name === name);
  }
  
  async createTag(tag: InsertTag): Promise<Tag> {
    const existingTag = await this.getTagByName(tag.name);
    if (existingTag) {
      return existingTag;
    }
    
    const newTag: Tag = {
      id: this.tagId++,
      ...tag,
      createdAt: new Date(),
      usageCount: 0
    };
    this.tags.set(newTag.id, newTag);
    return newTag;
  }
  
  // DiscussionTag methods
  async getTagsByDiscussion(discussionId: number): Promise<Tag[]> {
    const discussionTags = Array.from(this.discussionTags.values()).filter(
      dt => dt.discussionId === discussionId
    );
    
    return Promise.all(
      discussionTags.map(async dt => {
        const tag = await this.getTag(dt.tagId);
        return tag as Tag;
      })
    );
  }
  
  async addTagToDiscussion(discussionTag: InsertDiscussionTag): Promise<DiscussionTag> {
    const newDiscussionTag: DiscussionTag = {
      id: this.discussionTagId++,
      ...discussionTag,
      createdAt: new Date()
    };
    this.discussionTags.set(newDiscussionTag.id, newDiscussionTag);
    
    // Update tag usage count
    const tag = await this.getTag(discussionTag.tagId);
    if (tag) {
      await this.tags.set(tag.id, { ...tag, usageCount: tag.usageCount + 1 });
    }
    
    return newDiscussionTag;
  }
  
  // RightsAgreement methods
  async getLatestRightsAgreement(): Promise<RightsAgreement | undefined> {
    const agreements = Array.from(this.rightsAgreements.values());
    if (agreements.length === 0) {
      return undefined;
    }
    
    return agreements.reduce((latest, current) => 
      latest.activatedAt > current.activatedAt ? latest : current
    );
  }
  
  async getRightsAgreements(): Promise<RightsAgreement[]> {
    return Array.from(this.rightsAgreements.values());
  }
  
  async getRightsAgreement(id: number): Promise<RightsAgreement | undefined> {
    return this.rightsAgreements.get(id);
  }
  
  async createRightsAgreement(agreement: InsertRightsAgreement): Promise<RightsAgreement> {
    const timestamp = new Date();
    const newAgreement: RightsAgreement = {
      id: this.rightsAgreementId++,
      ...agreement,
      createdAt: timestamp,
      activatedAt: agreement.status === "active" ? timestamp : null
    };
    this.rightsAgreements.set(newAgreement.id, newAgreement);
    return newAgreement;
  }
  
  // Amendment methods
  async getAmendmentsByAgreement(agreementId: number): Promise<Amendment[]> {
    return Array.from(this.amendments.values()).filter(
      amendment => amendment.agreementId === agreementId
    );
  }
  
  async getAmendment(id: number): Promise<Amendment | undefined> {
    return this.amendments.get(id);
  }
  
  async createAmendment(amendment: InsertAmendment): Promise<Amendment> {
    const timestamp = new Date();
    const newAmendment: Amendment = {
      id: this.amendmentId++,
      ...amendment,
      createdAt: timestamp,
      status: "proposed"
    };
    this.amendments.set(newAmendment.id, newAmendment);
    return newAmendment;
  }
  
  async updateAmendment(id: number, amendment: Partial<Amendment>): Promise<Amendment> {
    const existingAmendment = await this.getAmendment(id);
    if (!existingAmendment) {
      throw new Error(`Amendment with ID ${id} not found`);
    }
    
    const updatedAmendment = { ...existingAmendment, ...amendment };
    this.amendments.set(id, updatedAmendment);
    return updatedAmendment;
  }
  
  // Badge methods
  async getBadges(): Promise<Badge[]> {
    return Array.from(this.badges.values());
  }
  
  async getBadge(id: number): Promise<Badge | undefined> {
    return this.badges.get(id);
  }
  
  async createBadge(badge: InsertBadge): Promise<Badge> {
    const newBadge: Badge = {
      id: this.badgeId++,
      ...badge,
      level: badge.level || 1,
      points: badge.points || 0,
      createdAt: new Date(),
      tier: badge.tier || "bronze",
      symbolism: badge.symbolism || null,
      isLimited: badge.isLimited || false,
      maxSupply: badge.maxSupply || null,
      enhanced: badge.enhanced || false
    };
    this.badges.set(newBadge.id, newBadge);
    return newBadge;
  }
  
  // UserBadge methods
  async getUserBadges(userId: number): Promise<UserBadge[]> {
    return Array.from(this.userBadges.values()).filter(
      userBadge => userBadge.userId === userId
    );
  }
  
  async getUserBadge(id: number): Promise<UserBadge | undefined> {
    return this.userBadges.get(id);
  }
  
  async awardBadge(userBadge: InsertUserBadge): Promise<UserBadge> {
    const newUserBadge: UserBadge = {
      id: this.userBadgeId++,
      ...userBadge,
      earnedAt: new Date(),
      enhanced: userBadge.enhanced || false,
      completedCriteria: userBadge.completedCriteria || null,
      issuedBy: userBadge.issuedBy || null
    };
    this.userBadges.set(newUserBadge.id, newUserBadge);
    
    // Update user points
    const badge = await this.getBadge(userBadge.badgeId);
    if (badge && badge.points) {
      await this.updateUserPoints(userBadge.userId, badge.points);
    }
    
    return newUserBadge;
  }
  
  // Event methods
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }
  
  async getEventsByCategory(category: string): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      event => event.category === category
    );
  }
  
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }
  
  async createEvent(event: InsertEvent): Promise<Event> {
    const timestamp = new Date();
    const newEvent: Event = {
      id: this.eventId++,
      ...event,
      createdAt: timestamp,
      updatedAt: timestamp,
      isActive: true,
      status: "scheduled"
    };
    this.events.set(newEvent.id, newEvent);
    return newEvent;
  }
  
  async updateEvent(id: number, event: Partial<Event>): Promise<Event> {
    const existingEvent = await this.getEvent(id);
    if (!existingEvent) {
      throw new Error(`Event with ID ${id} not found`);
    }
    
    const updatedEvent = { 
      ...existingEvent, 
      ...event, 
      updatedAt: new Date() 
    };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }
  
  // Proposal methods
  async getProposals(): Promise<Proposal[]> {
    return Array.from(this.proposals.values());
  }
  
  async getProposalsByCategory(category: string): Promise<Proposal[]> {
    return Array.from(this.proposals.values()).filter(
      proposal => proposal.category === category
    );
  }
  
  async getProposal(id: number): Promise<Proposal | undefined> {
    return this.proposals.get(id);
  }
  
  async createProposal(proposal: InsertProposal): Promise<Proposal> {
    const timestamp = new Date();
    const newProposal: Proposal = {
      id: this.proposalId++,
      ...proposal,
      createdAt: timestamp,
      updatedAt: timestamp,
      status: "pending",
      votes: 0,
      votesUp: 0,
      votesDown: 0
    };
    this.proposals.set(newProposal.id, newProposal);
    return newProposal;
  }
  
  async updateProposal(id: number, proposal: Partial<Proposal>): Promise<Proposal> {
    const existingProposal = await this.getProposal(id);
    if (!existingProposal) {
      throw new Error(`Proposal with ID ${id} not found`);
    }
    
    const updatedProposal = { 
      ...existingProposal, 
      ...proposal, 
      updatedAt: new Date() 
    };
    this.proposals.set(id, updatedProposal);
    return updatedProposal;
  }
  
  // Vote methods
  async getVotesByProposal(proposalId: number): Promise<Vote[]> {
    return Array.from(this.votes.values()).filter(
      vote => vote.proposalId === proposalId
    );
  }
  
  async getVote(id: number): Promise<Vote | undefined> {
    return this.votes.get(id);
  }
  
  async getUserVoteOnProposal(userId: number, proposalId: number): Promise<Vote | undefined> {
    return Array.from(this.votes.values()).find(
      vote => vote.userId === userId && vote.proposalId === proposalId
    );
  }
  
  async createVote(vote: InsertVote): Promise<Vote> {
    // Check if user already voted on this proposal
    const existingVote = await this.getUserVoteOnProposal(vote.userId, vote.proposalId);
    if (existingVote) {
      throw new Error(`User ${vote.userId} already voted on proposal ${vote.proposalId}`);
    }
    
    const newVote: Vote = {
      id: this.voteId++,
      ...vote,
      createdAt: new Date()
    };
    this.votes.set(newVote.id, newVote);
    
    // Update proposal vote counts
    const proposal = await this.getProposal(vote.proposalId);
    if (proposal) {
      const updatedProposal = { 
        ...proposal,
        votes: proposal.votes + 1,
        votesUp: proposal.votesUp + (vote.voteType === "up" ? 1 : 0),
        votesDown: proposal.votesDown + (vote.voteType === "down" ? 1 : 0)
      };
      await this.updateProposal(proposal.id, updatedProposal);
    }
    
    return newVote;
  }
  
  async updateVote(id: number, vote: Partial<Vote>): Promise<Vote> {
    const existingVote = await this.getVote(id);
    if (!existingVote) {
      throw new Error(`Vote with ID ${id} not found`);
    }
    
    if (vote.voteType && vote.voteType !== existingVote.voteType) {
      // Update proposal vote counts
      const proposal = await this.getProposal(existingVote.proposalId);
      if (proposal) {
        const updatedProposal = { 
          ...proposal,
          votesUp: proposal.votesUp + (vote.voteType === "up" ? 1 : -1),
          votesDown: proposal.votesDown + (vote.voteType === "down" ? 1 : -1)
        };
        await this.updateProposal(proposal.id, updatedProposal);
      }
    }
    
    const updatedVote = { ...existingVote, ...vote };
    this.votes.set(id, updatedVote);
    return updatedVote;
  }
  
  // UserRole methods
  async getUserRoles(userId: number): Promise<UserRole[]> {
    return Array.from(this.userRoles.values()).filter(
      userRole => userRole.userId === userId
    );
  }
  
  async getUserRole(id: number): Promise<UserRole | undefined> {
    return this.userRoles.get(id);
  }
  
  async assignUserRole(userRole: InsertUserRole): Promise<UserRole> {
    // Check if user already has this role
    const existingRoles = await this.getUserRoles(userRole.userId);
    const hasRole = existingRoles.some(role => role.role === userRole.role);
    if (hasRole) {
      throw new Error(`User ${userRole.userId} already has role ${userRole.role}`);
    }
    
    const newUserRole: UserRole = {
      id: this.userRoleId++,
      ...userRole,
      createdAt: new Date()
    };
    this.userRoles.set(newUserRole.id, newUserRole);
    return newUserRole;
  }
  
  async removeUserRole(id: number): Promise<void> {
    this.userRoles.delete(id);
  }
  
  // Annotation methods
  async getAnnotationsByDiscussion(discussionId: number): Promise<Annotation[]> {
    return Array.from(this.annotations.values()).filter(
      annotation => annotation.discussionId === discussionId
    );
  }
  
  async getAnnotation(id: number): Promise<Annotation | undefined> {
    return this.annotations.get(id);
  }
  
  async createAnnotation(annotation: InsertAnnotation): Promise<Annotation> {
    const newAnnotation: Annotation = {
      id: this.annotationId++,
      ...annotation,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.annotations.set(newAnnotation.id, newAnnotation);
    return newAnnotation;
  }
  
  async updateAnnotation(id: number, annotation: Partial<Annotation>): Promise<Annotation> {
    const existingAnnotation = await this.getAnnotation(id);
    if (!existingAnnotation) {
      throw new Error(`Annotation with ID ${id} not found`);
    }
    
    const updatedAnnotation = { 
      ...existingAnnotation, 
      ...annotation, 
      updatedAt: new Date() 
    };
    this.annotations.set(id, updatedAnnotation);
    return updatedAnnotation;
  }
  
  async deleteAnnotation(id: number): Promise<void> {
    // Delete the annotation
    this.annotations.delete(id);
    
    // Delete related replies
    const replies = await this.getRepliesByAnnotation(id);
    for (const reply of replies) {
      await this.deleteAnnotationReply(reply.id);
    }
  }
  
  // AnnotationReply methods
  async getRepliesByAnnotation(annotationId: number): Promise<AnnotationReply[]> {
    return Array.from(this.annotationReplies.values()).filter(
      reply => reply.annotationId === annotationId
    );
  }
  
  async getAnnotationReply(id: number): Promise<AnnotationReply | undefined> {
    return this.annotationReplies.get(id);
  }
  
  async createAnnotationReply(reply: InsertAnnotationReply): Promise<AnnotationReply> {
    const newReply: AnnotationReply = {
      id: this.annotationReplyId++,
      ...reply,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.annotationReplies.set(newReply.id, newReply);
    return newReply;
  }
  
  async updateAnnotationReply(id: number, reply: Partial<AnnotationReply>): Promise<AnnotationReply> {
    const existingReply = await this.getAnnotationReply(id);
    if (!existingReply) {
      throw new Error(`Annotation reply with ID ${id} not found`);
    }
    
    const updatedReply = { 
      ...existingReply, 
      ...reply, 
      updatedAt: new Date() 
    };
    this.annotationReplies.set(id, updatedReply);
    return updatedReply;
  }
  
  async deleteAnnotationReply(id: number): Promise<void> {
    this.annotationReplies.delete(id);
  }
  
  // Moderation Flag methods
  async getModerationFlags(): Promise<ModerationFlag[]> {
    return Array.from(this.moderationFlags.values());
  }
  
  async getModerationFlagsByStatus(status: string): Promise<ModerationFlag[]> {
    return Array.from(this.moderationFlags.values()).filter(
      flag => flag.status === status
    );
  }
  
  async getModerationFlagsByContentType(contentType: string): Promise<ModerationFlag[]> {
    return Array.from(this.moderationFlags.values()).filter(
      flag => flag.contentType === contentType
    );
  }
  
  async getModerationFlag(id: number): Promise<ModerationFlag | undefined> {
    return this.moderationFlags.get(id);
  }
  
  async createModerationFlag(flag: InsertModerationFlag): Promise<ModerationFlag> {
    const timestamp = new Date();
    const newFlag: ModerationFlag = {
      id: this.moderationFlagId++,
      ...flag,
      status: flag.status || "pending",
      createdAt: timestamp,
      updatedAt: timestamp,
      reviewedAt: null,
      reviewedBy: null,
      isAuto: flag.isAuto || false
    };
    this.moderationFlags.set(newFlag.id, newFlag);
    return newFlag;
  }
  
  async updateModerationFlag(id: number, flag: Partial<ModerationFlag>): Promise<ModerationFlag> {
    const existingFlag = await this.getModerationFlag(id);
    if (!existingFlag) {
      throw new Error(`Moderation flag with ID ${id} not found`);
    }
    
    const updatedFlag = { 
      ...existingFlag, 
      ...flag, 
      updatedAt: new Date() 
    };
    this.moderationFlags.set(id, updatedFlag);
    return updatedFlag;
  }
  
  // Moderation Decision methods
  async getModerationDecisionsByFlag(flagId: number): Promise<ModerationDecision[]> {
    return Array.from(this.moderationDecisions.values()).filter(
      decision => decision.flagId === flagId
    );
  }
  
  async getModerationDecision(id: number): Promise<ModerationDecision | undefined> {
    return this.moderationDecisions.get(id);
  }
  
  async createModerationDecision(decision: InsertModerationDecision): Promise<ModerationDecision> {
    const newDecision: ModerationDecision = {
      id: this.moderationDecisionId++,
      ...decision,
      createdAt: new Date()
    };
    this.moderationDecisions.set(newDecision.id, newDecision);
    
    // Update the flag status
    const flag = await this.getModerationFlag(decision.flagId);
    if (flag) {
      await this.updateModerationFlag(flag.id, {
        status: decision.action,
        reviewedAt: new Date(),
        reviewedBy: decision.moderatorId
      });
    }
    
    return newDecision;
  }
  
  // Moderation Appeal methods
  async getModerationAppeals(): Promise<ModerationAppeal[]> {
    return Array.from(this.moderationAppeals.values());
  }
  
  async getModerationAppealsByStatus(status: string): Promise<ModerationAppeal[]> {
    return Array.from(this.moderationAppeals.values()).filter(
      appeal => appeal.status === status
    );
  }
  
  async getModerationAppeal(id: number): Promise<ModerationAppeal | undefined> {
    return this.moderationAppeals.get(id);
  }
  
  async createModerationAppeal(appeal: InsertModerationAppeal): Promise<ModerationAppeal> {
    const timestamp = new Date();
    const newAppeal: ModerationAppeal = {
      id: this.moderationAppealId++,
      ...appeal,
      status: "pending",
      createdAt: timestamp,
      updatedAt: timestamp,
      reviewedAt: null,
      reviewedBy: null
    };
    this.moderationAppeals.set(newAppeal.id, newAppeal);
    return newAppeal;
  }
  
  async updateModerationAppeal(id: number, appeal: Partial<ModerationAppeal>): Promise<ModerationAppeal> {
    const existingAppeal = await this.getModerationAppeal(id);
    if (!existingAppeal) {
      throw new Error(`Moderation appeal with ID ${id} not found`);
    }
    
    const updatedAppeal = { 
      ...existingAppeal, 
      ...appeal, 
      updatedAt: new Date() 
    };
    this.moderationAppeals.set(id, updatedAppeal);
    
    // If approving an appeal, update the related flag
    if (appeal.status === "approved" && existingAppeal.flagId) {
      const flag = await this.getModerationFlag(existingAppeal.flagId);
      if (flag) {
        await this.updateModerationFlag(flag.id, {
          status: "appealed",
          updatedAt: new Date()
        });
      }
    }
    
    return updatedAppeal;
  }
  
  // Moderation Settings methods
  async getModerationSettings(): Promise<ModerationSetting[]> {
    return Array.from(this.moderationSettings.values());
  }
  
  async getModerationSetting(id: number): Promise<ModerationSetting | undefined> {
    return this.moderationSettings.get(id);
  }
  
  async updateModerationSetting(id: number, setting: Partial<ModerationSetting>): Promise<ModerationSetting> {
    const existingSetting = await this.getModerationSetting(id);
    if (!existingSetting) {
      throw new Error(`Moderation setting with ID ${id} not found`);
    }
    
    const updatedSetting = { 
      ...existingSetting, 
      ...setting, 
      updatedAt: new Date() 
    };
    this.moderationSettings.set(id, updatedSetting);
    return updatedSetting;
  }
  
  async createModerationSetting(setting: InsertModerationSetting): Promise<ModerationSetting> {
    const timestamp = new Date();
    const newSetting: ModerationSetting = {
      id: this.moderationSettingId++,
      ...setting,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    this.moderationSettings.set(newSetting.id, newSetting);
    return newSetting;
  }

  // Mind Map methods
  async getMindMaps(): Promise<MindMap[]> {
    return Array.from(this.mindMaps.values());
  }

  async getPublicMindMaps(): Promise<MindMap[]> {
    return Array.from(this.mindMaps.values()).filter(
      map => map.isPublic === true
    );
  }

  async getUserMindMaps(userId: number): Promise<MindMap[]> {
    const userCreatedMaps = Array.from(this.mindMaps.values()).filter(
      map => map.createdBy === userId
    );
    
    // Find maps where user is a collaborator
    const userCollaborations = Array.from(this.mindMapCollaborators.values())
      .filter(collab => collab.userId === userId)
      .map(collab => collab.mindMapId);
    
    const collaborativeMaps = Array.from(this.mindMaps.values()).filter(
      map => userCollaborations.includes(map.id)
    );
    
    // Combine both sets of maps
    return [...userCreatedMaps, ...collaborativeMaps];
  }

  async getUserPublicMindMaps(userId: number): Promise<MindMap[]> {
    return Array.from(this.mindMaps.values()).filter(
      map => map.createdBy === userId && map.isPublic === true
    );
  }

  async getMindMap(id: number): Promise<MindMap | undefined> {
    return this.mindMaps.get(id);
  }

  async createMindMap(mindMap: InsertMindMap): Promise<MindMap> {
    const timestamp = new Date();
    const newMindMap: MindMap = {
      id: this.mindMapId++,
      name: mindMap.name,
      description: mindMap.description || "",
      category: mindMap.category,
      isPublic: mindMap.isPublic || false,
      isCollaborative: mindMap.isCollaborative || false,
      createdBy: mindMap.createdBy,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    this.mindMaps.set(newMindMap.id, newMindMap);
    return newMindMap;
  }

  async updateMindMap(id: number, mindMap: Partial<MindMap>): Promise<MindMap> {
    const existingMindMap = await this.getMindMap(id);
    if (!existingMindMap) {
      throw new Error(`Mind map with ID ${id} not found`);
    }
    
    const updatedMindMap = { ...existingMindMap, ...mindMap, updatedAt: new Date() };
    this.mindMaps.set(id, updatedMindMap);
    return updatedMindMap;
  }

  async deleteMindMap(id: number): Promise<void> {
    // Delete the mind map
    this.mindMaps.delete(id);
    
    // Delete associated nodes
    const nodesToDelete = Array.from(this.mindMapNodes.entries())
      .filter(([key, node]) => node.mindMapId === id);
    
    for (const [key] of nodesToDelete) {
      this.mindMapNodes.delete(key);
    }
    
    // Delete associated connections
    const connectionsToDelete = Array.from(this.mindMapConnections.entries())
      .filter(([key, conn]) => conn.mindMapId === id);
    
    for (const [key] of connectionsToDelete) {
      this.mindMapConnections.delete(key);
    }
    
    // Delete associated collaborators
    const collaboratorsToDelete = Array.from(this.mindMapCollaborators.entries())
      .filter(([key, collab]) => collab.mindMapId === id);
    
    for (const [key] of collaboratorsToDelete) {
      this.mindMapCollaborators.delete(key);
    }
  }

  // Mind Map Node methods
  async getMindMapNodes(mindMapId: number): Promise<MindMapNode[]> {
    return Array.from(this.mindMapNodes.values()).filter(
      node => node.mindMapId === mindMapId
    );
  }

  async getMindMapNode(mindMapId: number, nodeId: string): Promise<MindMapNode | undefined> {
    const key = `${mindMapId}:${nodeId}`;
    return this.mindMapNodes.get(key);
  }

  async createMindMapNode(node: InsertMindMapNode): Promise<MindMapNode> {
    const timestamp = new Date();
    const key = `${node.mindMapId}:${node.nodeId}`;
    
    const mindMapNode: MindMapNode = {
      mindMapId: node.mindMapId,
      nodeId: node.nodeId,
      type: node.type,
      content: node.content,
      description: node.description,
      x: node.x,
      y: node.y,
      color: node.color,
      size: node.size,
      createdBy: node.createdBy,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    this.mindMapNodes.set(key, mindMapNode);
    return mindMapNode;
  }

  async updateMindMapNode(mindMapId: number, nodeId: string, node: Partial<MindMapNode>): Promise<MindMapNode> {
    const key = `${mindMapId}:${nodeId}`;
    const existingNode = this.mindMapNodes.get(key);
    
    if (!existingNode) {
      throw new Error(`Node with ID ${nodeId} in mind map ${mindMapId} not found`);
    }
    
    const updatedNode = { ...existingNode, ...node, updatedAt: new Date() };
    this.mindMapNodes.set(key, updatedNode);
    return updatedNode;
  }

  async deleteMindMapNode(mindMapId: number, nodeId: string): Promise<void> {
    const key = `${mindMapId}:${nodeId}`;
    
    // Delete the node
    this.mindMapNodes.delete(key);
    
    // Delete connections that reference this node
    const connectionsToDelete = Array.from(this.mindMapConnections.entries())
      .filter(([, conn]) => 
        conn.mindMapId === mindMapId && 
        (conn.sourceId === nodeId || conn.targetId === nodeId)
      );
    
    for (const [connKey] of connectionsToDelete) {
      this.mindMapConnections.delete(connKey);
    }
  }

  // Mind Map Connection methods
  async getMindMapConnections(mindMapId: number): Promise<MindMapConnection[]> {
    return Array.from(this.mindMapConnections.values()).filter(
      conn => conn.mindMapId === mindMapId
    );
  }

  async getMindMapConnection(mindMapId: number, connectionId: string): Promise<MindMapConnection | undefined> {
    const key = `${mindMapId}:${connectionId}`;
    return this.mindMapConnections.get(key);
  }

  async createMindMapConnection(connection: InsertMindMapConnection): Promise<MindMapConnection> {
    const timestamp = new Date();
    const key = `${connection.mindMapId}:${connection.connectionId}`;
    
    const mindMapConnection: MindMapConnection = {
      mindMapId: connection.mindMapId,
      connectionId: connection.connectionId,
      sourceId: connection.sourceId,
      targetId: connection.targetId,
      label: connection.label,
      description: connection.description,
      color: connection.color,
      thickness: connection.thickness,
      style: connection.style,
      createdBy: connection.createdBy,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    this.mindMapConnections.set(key, mindMapConnection);
    return mindMapConnection;
  }

  async updateMindMapConnection(mindMapId: number, connectionId: string, connection: Partial<MindMapConnection>): Promise<MindMapConnection> {
    const key = `${mindMapId}:${connectionId}`;
    const existingConnection = this.mindMapConnections.get(key);
    
    if (!existingConnection) {
      throw new Error(`Connection with ID ${connectionId} in mind map ${mindMapId} not found`);
    }
    
    const updatedConnection = { ...existingConnection, ...connection, updatedAt: new Date() };
    this.mindMapConnections.set(key, updatedConnection);
    return updatedConnection;
  }

  async deleteMindMapConnection(mindMapId: number, connectionId: string): Promise<void> {
    const key = `${mindMapId}:${connectionId}`;
    this.mindMapConnections.delete(key);
  }

  // Mind Map Collaborators methods
  async getMindMapCollaborators(mindMapId: number): Promise<MindMapCollaborator[]> {
    return Array.from(this.mindMapCollaborators.values()).filter(
      collab => collab.mindMapId === mindMapId
    );
  }

  async addCollaboratorToMindMap(collaborator: InsertMindMapCollaborator): Promise<MindMapCollaborator> {
    const id = this.mindMapCollaboratorId++;
    const timestamp = new Date();
    
    const mindMapCollaborator: MindMapCollaborator = {
      id,
      mindMapId: collaborator.mindMapId,
      userId: collaborator.userId,
      role: collaborator.role,
      createdAt: timestamp
    };
    
    this.mindMapCollaborators.set(id, mindMapCollaborator);
    return mindMapCollaborator;
  }

  async removeCollaboratorFromMindMap(mindMapId: number, userId: number): Promise<void> {
    const collaborator = Array.from(this.mindMapCollaborators.entries())
      .find(([, collab]) => collab.mindMapId === mindMapId && collab.userId === userId);
    
    if (collaborator) {
      const [id] = collaborator;
      this.mindMapCollaborators.delete(id);
    }
  }

  // Mind Map Templates methods
  async getMindMapTemplates(): Promise<MindMapTemplate[]> {
    return Array.from(this.mindMapTemplates.values());
  }

  async getMindMapTemplate(id: number): Promise<MindMapTemplate | undefined> {
    return this.mindMapTemplates.get(id);
  }

  async createMindMapTemplate(template: InsertMindMapTemplate): Promise<MindMapTemplate> {
    const id = this.mindMapTemplateId++;
    const timestamp = new Date();
    
    const mindMapTemplate: MindMapTemplate = {
      id,
      name: template.name,
      description: template.description || "",
      category: template.category,
      createdBy: template.createdBy,
      nodeData: template.nodeData,
      connectionData: template.connectionData,
      isPublic: template.isPublic || false,
      createdAt: timestamp
    };
    
    this.mindMapTemplates.set(id, mindMapTemplate);
    return mindMapTemplate;
  }
  
  // Cosmic Reaction methods
  async getCosmicReactionsByContent(contentId: number, contentType: string): Promise<CosmicReaction[]> {
    return Array.from(this.cosmicReactions.values()).filter(
      reaction => reaction.contentId === contentId && reaction.contentType === contentType
    );
  }
  
  async getCosmicReactionById(id: number): Promise<CosmicReaction | undefined> {
    return this.cosmicReactions.get(id);
  }
  
  async getUserCosmicReactionOnContent(userId: number, contentId: number, contentType: string, emojiType: string): Promise<CosmicReaction | undefined> {
    return Array.from(this.cosmicReactions.values()).find(
      reaction => 
        reaction.userId === userId && 
        reaction.contentId === contentId && 
        reaction.contentType === contentType &&
        reaction.emojiType === emojiType
    );
  }
  
  async createCosmicReaction(reaction: InsertCosmicReaction): Promise<CosmicReaction> {
    // Check if the user already reacted with this emoji type on this content
    const existingReaction = await this.getUserCosmicReactionOnContent(
      reaction.userId, 
      reaction.contentId, 
      reaction.contentType,
      reaction.emojiType
    );
    
    if (existingReaction) {
      // If the user already reacted, return existing reaction
      return existingReaction;
    }
    
    // Create new reaction
    const newReaction: CosmicReaction = {
      id: this.cosmicReactionId++,
      ...reaction,
      createdAt: new Date()
    };
    this.cosmicReactions.set(newReaction.id, newReaction);
    
    // Update user points if there's emoji metadata with points
    const emojiMetadata = Array.from(this.cosmicEmojiMetadata.values()).find(
      meta => meta.emojiType === reaction.emojiType
    );
    
    if (emojiMetadata && reaction.contentType === "discussion") {
      // Get the discussion to find the author
      const discussion = this.discussions.get(reaction.contentId);
      if (discussion) {
        // Add points to the discussion author
        await this.updateUserPoints(discussion.userId, emojiMetadata.pointsGranted);
      }
    } else if (emojiMetadata && reaction.contentType === "comment") {
      // Get the comment to find the author
      const comment = this.comments.get(reaction.contentId);
      if (comment) {
        // Add points to the comment author
        await this.updateUserPoints(comment.userId, emojiMetadata.pointsGranted);
      }
    }
    
    return newReaction;
  }
  
  async deleteCosmicReaction(id: number): Promise<void> {
    // Get the reaction first to access its data before deletion
    const reaction = this.cosmicReactions.get(id);
    if (!reaction) {
      throw new Error(`Cosmic reaction with ID ${id} not found`);
    }
    
    // Delete the reaction
    this.cosmicReactions.delete(id);
    
    // Remove points if there's emoji metadata with points
    const emojiMetadata = Array.from(this.cosmicEmojiMetadata.values()).find(
      meta => meta.emojiType === reaction.emojiType
    );
    
    if (emojiMetadata && reaction.contentType === "discussion") {
      // Get the discussion to find the author
      const discussion = this.discussions.get(reaction.contentId);
      if (discussion) {
        // Remove points from the discussion author (negative points)
        await this.updateUserPoints(discussion.userId, -emojiMetadata.pointsGranted);
      }
    } else if (emojiMetadata && reaction.contentType === "comment") {
      // Get the comment to find the author
      const comment = this.comments.get(reaction.contentId);
      if (comment) {
        // Remove points from the comment author (negative points)
        await this.updateUserPoints(comment.userId, -emojiMetadata.pointsGranted);
      }
    }
  }
  
  // Cosmic Emoji Metadata methods
  async getCosmicEmojiMetadata(): Promise<CosmicEmojiMetadata[]> {
    return Array.from(this.cosmicEmojiMetadata.values());
  }
  
  async getCosmicEmojiMetadataByType(emojiType: string): Promise<CosmicEmojiMetadata | undefined> {
    return Array.from(this.cosmicEmojiMetadata.values()).find(
      metadata => metadata.emojiType === emojiType
    );
  }
  
  async createCosmicEmojiMetadata(metadata: InsertCosmicEmojiMetadata): Promise<CosmicEmojiMetadata> {
    // Check if metadata for this emoji type already exists
    const existingMetadata = await this.getCosmicEmojiMetadataByType(metadata.emojiType);
    if (existingMetadata) {
      return existingMetadata;
    }
    
    const timestamp = new Date();
    const newMetadata: CosmicEmojiMetadata = {
      id: this.cosmicEmojiMetadataId++,
      ...metadata,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    this.cosmicEmojiMetadata.set(newMetadata.id, newMetadata);
    return newMetadata;
  }
  
  async updateCosmicEmojiMetadata(id: number, metadata: Partial<CosmicEmojiMetadata>): Promise<CosmicEmojiMetadata> {
    const existingMetadata = this.cosmicEmojiMetadata.get(id);
    if (!existingMetadata) {
      throw new Error(`Cosmic emoji metadata with ID ${id} not found`);
    }
    
    const updatedMetadata = { 
      ...existingMetadata, 
      ...metadata, 
      updatedAt: new Date() 
    };
    this.cosmicEmojiMetadata.set(id, updatedMetadata);
    return updatedMetadata;
  }
  
  // Cosmic Emoji methods
  async getCosmicEmojis(): Promise<CosmicEmoji[]> {
    return Array.from(this.cosmicEmojis.values());
  }
  
  async getCosmicEmoji(id: number): Promise<CosmicEmoji | undefined> {
    return this.cosmicEmojis.get(id);
  }
  
  async createCosmicEmoji(emoji: InsertCosmicEmoji): Promise<CosmicEmoji> {
    const newEmoji = {
      id: this.cosmicEmojiId++,
      ...emoji,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.cosmicEmojis.set(newEmoji.id, newEmoji);
    return newEmoji;
  }
  
  // Cosmic Reaction methods
  async getReactionsByContent(contentType: string, contentId: number): Promise<CosmicReaction[]> {
    return Array.from(this.cosmicReactions.values()).filter(
      reaction => 
        reaction.contentType === contentType && 
        reaction.contentId === contentId
    );
  }
  
  async getUserReaction(userId: number, contentId: number, contentType: string, emojiId: number): Promise<CosmicReaction | undefined> {
    return Array.from(this.cosmicReactions.values()).find(
      reaction => 
        reaction.userId === userId && 
        reaction.contentId === contentId && 
        reaction.contentType === contentType && 
        reaction.emojiId === emojiId
    );
  }
  
  async createCosmicReaction(reaction: InsertCosmicReaction): Promise<CosmicReaction> {
    const newReaction = {
      id: this.cosmicReactionId++,
      ...reaction,
      createdAt: new Date()
    };
    this.cosmicReactions.set(newReaction.id, newReaction);
    return newReaction;
  }
  
  async deleteCosmicReaction(id: number): Promise<void> {
    this.cosmicReactions.delete(id);
  }
}

// Use DatabaseStorage for proper persistence
import { DatabaseStorage } from './database-storage';
export const storage = new DatabaseStorage();