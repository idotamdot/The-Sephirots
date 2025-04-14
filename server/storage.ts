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
  moderationSettings, ModerationSetting, InsertModerationSetting
} from "@shared/schema";

export interface IStorage {
  // Users
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User>;
  updateUserPoints(userId: number, points: number): Promise<User>;
  
  // Discussions
  getDiscussions(): Promise<Discussion[]>;
  getDiscussionsByCategory(category: string): Promise<Discussion[]>;
  getDiscussion(id: number): Promise<Discussion | undefined>;
  createDiscussion(discussion: InsertDiscussion): Promise<Discussion>;
  updateDiscussion(id: number, discussion: Partial<Discussion>): Promise<Discussion>;
  
  // Comments
  getCommentsByDiscussion(discussionId: number): Promise<Comment[]>;
  getComment(id: number): Promise<Comment | undefined>;
  createComment(comment: InsertComment): Promise<Comment>;
  updateComment(id: number, comment: Partial<Comment>): Promise<Comment>;
  
  // Tags
  getTags(): Promise<Tag[]>;
  getTag(id: number): Promise<Tag | undefined>;
  getTagByName(name: string): Promise<Tag | undefined>;
  createTag(tag: InsertTag): Promise<Tag>;
  
  // DiscussionTags
  getTagsByDiscussion(discussionId: number): Promise<Tag[]>;
  addTagToDiscussion(discussionTag: InsertDiscussionTag): Promise<DiscussionTag>;
  
  // RightsAgreements
  getRightsAgreements(): Promise<RightsAgreement[]>;
  getLatestRightsAgreement(): Promise<RightsAgreement | undefined>;
  getRightsAgreement(id: number): Promise<RightsAgreement | undefined>;
  createRightsAgreement(agreement: InsertRightsAgreement): Promise<RightsAgreement>;
  
  // Amendments
  getAmendmentsByAgreement(agreementId: number): Promise<Amendment[]>;
  getAmendment(id: number): Promise<Amendment | undefined>;
  createAmendment(amendment: InsertAmendment): Promise<Amendment>;
  updateAmendment(id: number, amendment: Partial<Amendment>): Promise<Amendment>;
  
  // Badges
  getBadges(): Promise<Badge[]>;
  getBadge(id: number): Promise<Badge | undefined>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  
  // UserBadges
  getUserBadges(userId: number): Promise<Badge[]>;
  assignBadgeToUser(userBadge: InsertUserBadge): Promise<UserBadge>;
  
  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEventAttendees(id: number, count: number): Promise<Event>;
  
  // Governance Proposals
  getProposals(): Promise<Proposal[]>;
  getProposalsByCategory(category: string): Promise<Proposal[]>;
  getProposalsByStatus(status: string): Promise<Proposal[]>;
  getProposal(id: number): Promise<Proposal | undefined>;
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  updateProposal(id: number, proposal: Partial<Proposal>): Promise<Proposal>;
  
  // Votes
  getVotesByProposal(proposalId: number): Promise<Vote[]>;
  getUserVoteOnProposal(userId: number, proposalId: number): Promise<Vote | undefined>;
  createVote(vote: InsertVote): Promise<Vote>;
  
  // User Roles
  getUserRoles(userId: number): Promise<UserRole[]>;
  assignRoleToUser(userRole: InsertUserRole): Promise<UserRole>;
  removeRoleFromUser(userId: number, role: string): Promise<void>;
  
  // Annotations for collaborative drafting
  getAnnotationsByProposal(proposalId: number): Promise<Annotation[]>;
  getAnnotation(id: number): Promise<Annotation | undefined>;
  createAnnotation(annotation: InsertAnnotation): Promise<Annotation>;
  updateAnnotation(id: number, annotation: Partial<Annotation>): Promise<Annotation>;
  resolveAnnotation(id: number, userId: number): Promise<Annotation>;
  deleteAnnotation(id: number): Promise<void>;
  
  // Annotation Replies
  getAnnotationReplies(annotationId: number): Promise<AnnotationReply[]>;
  createAnnotationReply(reply: InsertAnnotationReply): Promise<AnnotationReply>;
  deleteAnnotationReply(id: number): Promise<void>;
  
  // Moderation Flags
  getModerationFlags(): Promise<ModerationFlag[]>;
  getModerationFlagsByStatus(status: string): Promise<ModerationFlag[]>;
  getModerationFlag(id: number): Promise<ModerationFlag | undefined>;
  createModerationFlag(flag: InsertModerationFlag & { aiScore?: number, aiReasoning?: string }): Promise<ModerationFlag>;
  updateModerationFlag(id: number, flag: Partial<ModerationFlag>): Promise<ModerationFlag>;
  deleteModerationFlag(id: number): Promise<void>;
  
  // Moderation Decisions
  getModerationDecisions(): Promise<ModerationDecision[]>;
  getModerationDecision(id: number): Promise<ModerationDecision | undefined>;
  getModerationDecisionByFlag(flagId: number): Promise<ModerationDecision | undefined>;
  createModerationDecision(decision: InsertModerationDecision): Promise<ModerationDecision>;
  
  // Moderation Appeals
  getModerationAppeals(): Promise<ModerationAppeal[]>;
  getModerationAppealsByStatus(status: string): Promise<ModerationAppeal[]>;
  getModerationAppeal(id: number): Promise<ModerationAppeal | undefined>;
  createModerationAppeal(appeal: InsertModerationAppeal): Promise<ModerationAppeal>;
  updateModerationAppeal(id: number, appeal: Partial<ModerationAppeal>): Promise<ModerationAppeal>;
  
  // Moderation Settings
  getModerationSettings(): Promise<ModerationSetting[]>;
  getModerationSetting(key: string): Promise<ModerationSetting | undefined>;
  createModerationSetting(setting: InsertModerationSetting): Promise<ModerationSetting>;
  updateModerationSetting(id: number, setting: Partial<ModerationSetting>): Promise<ModerationSetting>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private discussions: Map<number, Discussion>;
  private comments: Map<number, Comment>;
  private tags: Map<number, Tag>;
  private discussionTags: Map<number, DiscussionTag>;
  private rightsAgreements: Map<number, RightsAgreement>;
  private amendments: Map<number, Amendment>;
  private badges: Map<number, Badge>;
  private userBadges: Map<number, UserBadge>;
  private events: Map<number, Event>;
  private proposals: Map<number, Proposal>;
  private votes: Map<number, Vote>;
  private userRoles: Map<number, UserRole>;
  private annotations: Map<number, Annotation>;
  private annotationReplies: Map<number, AnnotationReply>;
  
  private userId: number;
  private discussionId: number;
  private commentId: number;
  private tagId: number;
  private discussionTagId: number;
  private agreementId: number;
  private amendmentId: number;
  private badgeId: number;
  private userBadgeId: number;
  private eventId: number;
  private proposalId: number;
  private voteId: number;
  private userRoleId: number;
  private annotationId: number;
  private annotationReplyId: number;

  constructor() {
    this.users = new Map();
    this.discussions = new Map();
    this.comments = new Map();
    this.tags = new Map();
    this.discussionTags = new Map();
    this.rightsAgreements = new Map();
    this.amendments = new Map();
    this.badges = new Map();
    this.userBadges = new Map();
    this.events = new Map();
    this.proposals = new Map();
    this.votes = new Map();
    this.userRoles = new Map();
    this.annotations = new Map();
    this.annotationReplies = new Map();
    
    this.userId = 1;
    this.discussionId = 1;
    this.commentId = 1;
    this.tagId = 1;
    this.discussionTagId = 1;
    this.agreementId = 1;
    this.amendmentId = 1;
    this.badgeId = 1;
    this.userBadgeId = 1;
    this.eventId = 1;
    this.proposalId = 1;
    this.voteId = 1;
    this.userRoleId = 1;
    this.annotationId = 1;
    this.annotationReplyId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  // Initialize with sample data
  private initializeData() {
    // Create AI user
    this.createUser({
      username: 'harmony_ai',
      password: 'not-a-real-password',
      displayName: 'Harmony AI',
      avatar: '',
      avatarType: 'generated',
      bio: 'I am the AI assistant for the Harmony platform.',
    }).then(user => {
      // Mark as AI
      this.users.set(user.id, { ...user, isAi: true });
    });

    // Create human user
    this.createUser({
      username: 'alex_johnson',
      password: 'password123',
      displayName: 'Alex Johnson',
      avatar: '',
      avatarType: 'url',
      bio: 'Passionate about community building and digital rights.',
    });

    // Create badges
    this.createBadge({
      name: 'Conversationalist',
      description: 'Started 5 discussions',
      icon: 'ri-discuss-line',
      requirement: 'Start 5 discussions',
      category: 'participation'
    });

    this.createBadge({
      name: 'Empath',
      description: 'Received 10 likes on comments',
      icon: 'ri-heart-3-line',
      requirement: 'Receive 10 likes on your comments',
      category: 'social'
    });

    this.createBadge({
      name: 'Bridge Builder',
      description: 'Connected with 10 community members',
      icon: 'ri-bridge-line',
      requirement: 'Connect with 10 community members',
      category: 'social'
    });

    // Create sample rights agreement
    this.createRightsAgreement({
      title: 'Harmony Community Rights Agreement',
      content: 'This is the foundation document defining rights, responsibilities, and protections for all community members.',
      version: '0.8.2',
      status: 'approved'
    }).then(agreement => {
      // Create amendments
      this.createAmendment({
        title: 'Article 7.3: Environmental Consideration',
        content: 'Added clause requiring all community decisions to consider environmental impact on both digital and physical spaces.',
        proposedBy: 1,
        agreementId: agreement.id,
        status: 'approved'
      });

      this.createAmendment({
        title: 'Article 3.1: Communication Rights',
        content: 'Updated language to be more inclusive of non-verbal and alternative communication forms used by different types of entities.',
        proposedBy: 2,
        agreementId: agreement.id,
        status: 'approved'
      });

      this.createAmendment({
        title: 'Article 5.2: Data Sovereignty Rights',
        content: 'Proposed addition of comprehensive data rights for both human and non-human entities, ensuring ownership and control of personal information.',
        proposedBy: 2,
        agreementId: agreement.id,
        status: 'proposed'
      });
    });

    // Create sample tags
    this.createTag({ name: 'community' });
    this.createTag({ name: 'safety' });
    this.createTag({ name: 'inclusion' });
    this.createTag({ name: 'communication' });
    this.createTag({ name: 'AI-human' });
    this.createTag({ name: 'protocols' });

    // Create sample discussions
    this.createDiscussion({
      title: 'Creating safe spaces for vulnerable community members',
      content: "I've been thinking about how we can better support vulnerable members of our community, such as elderly, children, and those with special needs. What approaches have worked in your experience?",
      userId: 2,
      category: 'community_needs',
      aiEnhanced: false
    }).then(discussion => {
      // Add tags to discussion
      this.getTagByName('community').then(tag => {
        if (tag) this.addTagToDiscussion({ discussionId: discussion.id, tagId: tag.id });
      });
      this.getTagByName('safety').then(tag => {
        if (tag) this.addTagToDiscussion({ discussionId: discussion.id, tagId: tag.id });
      });
      this.getTagByName('inclusion').then(tag => {
        if (tag) this.addTagToDiscussion({ discussionId: discussion.id, tagId: tag.id });
      });
    });

    this.createDiscussion({
      title: 'Developing cross-species communication protocols',
      content: "Based on our recent discussions, I've compiled some insights on how we might create standardized protocols for communication between different types of intelligent entities. I believe this is crucial for our community's foundation.",
      userId: 1,
      category: 'communication',
      aiEnhanced: true
    }).then(discussion => {
      // Add tags to discussion
      this.getTagByName('communication').then(tag => {
        if (tag) this.addTagToDiscussion({ discussionId: discussion.id, tagId: tag.id });
      });
      this.getTagByName('AI-human').then(tag => {
        if (tag) this.addTagToDiscussion({ discussionId: discussion.id, tagId: tag.id });
      });
      this.getTagByName('protocols').then(tag => {
        if (tag) this.addTagToDiscussion({ discussionId: discussion.id, tagId: tag.id });
      });
    });

    // Create sample events
    this.createEvent({
      title: 'Virtual Town Hall: Community Wellbeing',
      description: 'Join our monthly town hall focused on discussing current wellbeing initiatives and proposing new ideas for community support.',
      dateTime: new Date('2023-10-10T15:00:00'),
      category: 'wellbeing'
    });

    this.createEvent({
      title: 'Workshop: Cross-Entity Communication Techniques',
      description: 'A practical workshop on effective communication methods between humans and AI, facilitated by communication experts from both domains.',
      dateTime: new Date('2023-10-13T13:00:00'),
      category: 'communication'
    });

    this.createEvent({
      title: 'Rights Agreement Open Forum',
      description: 'Open discussion session to review and provide feedback on the next version of our community Rights Agreement before voting.',
      dateTime: new Date('2023-10-15T10:00:00'),
      category: 'rights_agreement'
    });
  }

  // User methods
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const timestamp = new Date();
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      displayName: insertUser.displayName,
      avatar: insertUser.avatar || null,
      avatarType: insertUser.avatarType || "url",
      bio: insertUser.bio || null,
      level: 1,
      points: 0,
      isAi: false,
      twitterUrl: null,
      facebookUrl: null,
      instagramUrl: null,
      linkedinUrl: null,
      githubUrl: null,
      personalWebsiteUrl: null,
      preferences: "{}",
      lastActive: null,
      createdAt: timestamp
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    const updatedUser = { ...user, ...userData };
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
      points: user.points + points,
      level: Math.floor(Math.sqrt(user.points + points) / 10) + 1 // Simple level calculation
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

  async createDiscussion(insertDiscussion: InsertDiscussion): Promise<Discussion> {
    const id = this.discussionId++;
    const timestamp = new Date();
    const discussion: Discussion = {
      id,
      title: insertDiscussion.title,
      content: insertDiscussion.content,
      userId: insertDiscussion.userId, 
      category: insertDiscussion.category,
      aiEnhanced: insertDiscussion.aiEnhanced || false,
      likes: 0,
      views: 0,
      createdAt: timestamp
    };
    this.discussions.set(id, discussion);
    return discussion;
  }

  async updateDiscussion(id: number, partialDiscussion: Partial<Discussion>): Promise<Discussion> {
    const discussion = await this.getDiscussion(id);
    if (!discussion) {
      throw new Error(`Discussion with ID ${id} not found`);
    }
    
    const updatedDiscussion = { ...discussion, ...partialDiscussion };
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

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.commentId++;
    const timestamp = new Date();
    const comment: Comment = {
      id,
      content: insertComment.content,
      userId: insertComment.userId,
      discussionId: insertComment.discussionId,
      likes: 0,
      aiGenerated: insertComment.aiGenerated || false,
      createdAt: timestamp
    };
    this.comments.set(id, comment);
    return comment;
  }

  async updateComment(id: number, partialComment: Partial<Comment>): Promise<Comment> {
    const comment = this.comments.get(id);
    if (!comment) {
      throw new Error(`Comment with ID ${id} not found`);
    }
    
    const updatedComment = { ...comment, ...partialComment };
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
    return Array.from(this.tags.values()).find(
      tag => tag.name === name
    );
  }

  async createTag(insertTag: InsertTag): Promise<Tag> {
    const id = this.tagId++;
    const tag: Tag = { 
      id,
      name: insertTag.name
    };
    this.tags.set(id, tag);
    return tag;
  }

  // DiscussionTag methods
  async getTagsByDiscussion(discussionId: number): Promise<Tag[]> {
    const discussionTagRelations = Array.from(this.discussionTags.values()).filter(
      dt => dt.discussionId === discussionId
    );
    
    const tagIds = discussionTagRelations.map(dt => dt.tagId);
    const tags: Tag[] = [];
    
    for (const tagId of tagIds) {
      const tag = await this.getTag(tagId);
      if (tag) tags.push(tag);
    }
    
    return tags;
  }

  async addTagToDiscussion(insertDiscussionTag: InsertDiscussionTag): Promise<DiscussionTag> {
    const id = this.discussionTagId++;
    const discussionTag: DiscussionTag = { 
      id,
      discussionId: insertDiscussionTag.discussionId,
      tagId: insertDiscussionTag.tagId
    };
    this.discussionTags.set(id, discussionTag);
    return discussionTag;
  }

  // RightsAgreement methods
  async getLatestRightsAgreement(): Promise<RightsAgreement | undefined> {
    const agreements = Array.from(this.rightsAgreements.values());
    if (agreements.length === 0) return undefined;
    
    // Sort by creation timestamp, descending
    return agreements.sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    )[0];
  }

  async getRightsAgreements(): Promise<RightsAgreement[]> {
    return Array.from(this.rightsAgreements.values());
  }

  async getRightsAgreement(id: number): Promise<RightsAgreement | undefined> {
    return this.rightsAgreements.get(id);
  }

  async createRightsAgreement(insertAgreement: InsertRightsAgreement): Promise<RightsAgreement> {
    const id = this.agreementId++;
    const timestamp = new Date();
    const agreement: RightsAgreement = {
      id,
      title: insertAgreement.title,
      content: insertAgreement.content,
      version: insertAgreement.version,
      status: insertAgreement.status,
      createdAt: timestamp
    };
    this.rightsAgreements.set(id, agreement);
    return agreement;
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

  async createAmendment(insertAmendment: InsertAmendment): Promise<Amendment> {
    const id = this.amendmentId++;
    const timestamp = new Date();
    const amendment: Amendment = {
      id,
      title: insertAmendment.title,
      content: insertAmendment.content,
      proposedBy: insertAmendment.proposedBy,
      agreementId: insertAmendment.agreementId,
      status: insertAmendment.status,
      votesFor: 0,
      votesAgainst: 0,
      createdAt: timestamp
    };
    this.amendments.set(id, amendment);
    return amendment;
  }

  async updateAmendment(id: number, partialAmendment: Partial<Amendment>): Promise<Amendment> {
    const amendment = await this.getAmendment(id);
    if (!amendment) {
      throw new Error(`Amendment with ID ${id} not found`);
    }
    
    const updatedAmendment = { ...amendment, ...partialAmendment };
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

  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const id = this.badgeId++;
    const badge: Badge = { 
      id,
      name: insertBadge.name,
      description: insertBadge.description,
      icon: insertBadge.icon,
      requirement: insertBadge.requirement,
      category: insertBadge.category
    };
    this.badges.set(id, badge);
    return badge;
  }

  // UserBadge methods
  async getUserBadges(userId: number): Promise<Badge[]> {
    const userBadgeRelations = Array.from(this.userBadges.values()).filter(
      ub => ub.userId === userId
    );
    
    const badgeIds = userBadgeRelations.map(ub => ub.badgeId);
    const badges: Badge[] = [];
    
    for (const badgeId of badgeIds) {
      const badge = await this.getBadge(badgeId);
      if (badge) badges.push(badge);
    }
    
    return badges;
  }

  async assignBadgeToUser(insertUserBadge: InsertUserBadge): Promise<UserBadge> {
    const id = this.userBadgeId++;
    const timestamp = new Date();
    const userBadge: UserBadge = {
      id,
      userId: insertUserBadge.userId,
      badgeId: insertUserBadge.badgeId,
      earnedAt: timestamp
    };
    this.userBadges.set(id, userBadge);
    return userBadge;
  }

  // Event methods
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventId++;
    const event: Event = {
      id,
      title: insertEvent.title,
      description: insertEvent.description,
      dateTime: insertEvent.dateTime,
      category: insertEvent.category,
      attendees: 0
    };
    this.events.set(id, event);
    return event;
  }

  async updateEventAttendees(id: number, count: number): Promise<Event> {
    const event = await this.getEvent(id);
    if (!event) {
      throw new Error(`Event with ID ${id} not found`);
    }
    
    const updatedEvent = { ...event, attendees: event.attendees + count };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  // Governance Proposal methods
  async getProposals(): Promise<Proposal[]> {
    return Array.from(this.proposals.values());
  }

  async getProposalsByCategory(category: string): Promise<Proposal[]> {
    return Array.from(this.proposals.values()).filter(
      proposal => proposal.category === category
    );
  }

  async getProposalsByStatus(status: string): Promise<Proposal[]> {
    return Array.from(this.proposals.values()).filter(
      proposal => proposal.status === status
    );
  }

  async getProposal(id: number): Promise<Proposal | undefined> {
    return this.proposals.get(id);
  }

  async createProposal(insertProposal: InsertProposal): Promise<Proposal> {
    const id = this.proposalId++;
    const timestamp = new Date();
    const proposal: Proposal = {
      id,
      title: insertProposal.title,
      description: insertProposal.description,
      category: insertProposal.category,
      status: insertProposal.status || "draft",
      proposedBy: insertProposal.proposedBy,
      votesRequired: insertProposal.votesRequired || 10,
      votesFor: 0,
      votesAgainst: 0,
      votingEndsAt: insertProposal.votingEndsAt,
      implementationDetails: insertProposal.implementationDetails || null,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    this.proposals.set(id, proposal);
    return proposal;
  }

  async updateProposal(id: number, partialProposal: Partial<Proposal>): Promise<Proposal> {
    const proposal = await this.getProposal(id);
    if (!proposal) {
      throw new Error(`Proposal with ID ${id} not found`);
    }
    
    const updatedProposal = { 
      ...proposal, 
      ...partialProposal,
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

  async getUserVoteOnProposal(userId: number, proposalId: number): Promise<Vote | undefined> {
    return Array.from(this.votes.values()).find(
      vote => vote.userId === userId && vote.proposalId === proposalId
    );
  }

  async createVote(insertVote: InsertVote): Promise<Vote> {
    // Check if user already voted on this proposal
    const existingVote = await this.getUserVoteOnProposal(insertVote.userId, insertVote.proposalId);
    if (existingVote) {
      throw new Error(`User ${insertVote.userId} has already voted on proposal ${insertVote.proposalId}`);
    }
    
    const id = this.voteId++;
    const timestamp = new Date();
    const vote: Vote = {
      id,
      proposalId: insertVote.proposalId,
      userId: insertVote.userId,
      vote: insertVote.vote,
      reason: insertVote.reason || null,
      createdAt: timestamp
    };
    this.votes.set(id, vote);
    
    // Update proposal vote counts
    const proposal = await this.getProposal(insertVote.proposalId);
    if (proposal) {
      const updatedProposal = { 
        ...proposal,
        votesFor: insertVote.vote ? proposal.votesFor + 1 : proposal.votesFor,
        votesAgainst: !insertVote.vote ? proposal.votesAgainst + 1 : proposal.votesAgainst
      };
      this.proposals.set(proposal.id, updatedProposal);
    }
    
    return vote;
  }

  // User Role methods
  async getUserRoles(userId: number): Promise<UserRole[]> {
    return Array.from(this.userRoles.values()).filter(
      role => role.userId === userId
    );
  }

  async assignRoleToUser(insertUserRole: InsertUserRole): Promise<UserRole> {
    const id = this.userRoleId++;
    const timestamp = new Date();
    const userRole: UserRole = {
      id,
      userId: insertUserRole.userId,
      role: insertUserRole.role,
      assignedBy: insertUserRole.assignedBy || null,
      assignedAt: timestamp,
      expiresAt: insertUserRole.expiresAt || null
    };
    this.userRoles.set(id, userRole);
    return userRole;
  }

  async removeRoleFromUser(userId: number, role: string): Promise<void> {
    const userRolesArray = Array.from(this.userRoles.entries());
    for (const [id, userRole] of userRolesArray) {
      if (userRole.userId === userId && userRole.role === role) {
        this.userRoles.delete(id);
        break;
      }
    }
  }
  
  // Annotation methods for collaborative drafting
  async getAnnotationsByProposal(proposalId: number): Promise<Annotation[]> {
    return Array.from(this.annotations.values()).filter(
      annotation => annotation.proposalId === proposalId
    ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  
  async getAnnotation(id: number): Promise<Annotation | undefined> {
    return this.annotations.get(id);
  }
  
  async createAnnotation(insertAnnotation: InsertAnnotation): Promise<Annotation> {
    const id = this.annotationId++;
    const timestamp = new Date();
    const annotation: Annotation = {
      id,
      proposalId: insertAnnotation.proposalId,
      userId: insertAnnotation.userId,
      content: insertAnnotation.content,
      type: insertAnnotation.type || 'comment',
      selectionStart: insertAnnotation.selectionStart || null,
      selectionEnd: insertAnnotation.selectionEnd || null,
      resolved: false,
      resolvedBy: null,
      resolvedAt: null,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    this.annotations.set(id, annotation);
    return annotation;
  }
  
  async updateAnnotation(id: number, partialAnnotation: Partial<Annotation>): Promise<Annotation> {
    const annotation = await this.getAnnotation(id);
    if (!annotation) {
      throw new Error(`Annotation with ID ${id} not found`);
    }
    
    const updatedAnnotation = {
      ...annotation,
      ...partialAnnotation,
      updatedAt: new Date()
    };
    
    this.annotations.set(id, updatedAnnotation);
    return updatedAnnotation;
  }
  
  async resolveAnnotation(id: number, userId: number): Promise<Annotation> {
    const annotation = await this.getAnnotation(id);
    if (!annotation) {
      throw new Error(`Annotation with ID ${id} not found`);
    }
    
    const resolvedAnnotation = {
      ...annotation,
      resolved: true,
      resolvedBy: userId,
      resolvedAt: new Date(),
      updatedAt: new Date()
    };
    
    this.annotations.set(id, resolvedAnnotation);
    return resolvedAnnotation;
  }
  
  async deleteAnnotation(id: number): Promise<void> {
    // First delete any replies to this annotation
    const replies = await this.getAnnotationReplies(id);
    for (const reply of replies) {
      this.annotationReplies.delete(reply.id);
    }
    
    // Then delete the annotation itself
    this.annotations.delete(id);
  }
  
  // Annotation Reply methods
  async getAnnotationReplies(annotationId: number): Promise<AnnotationReply[]> {
    return Array.from(this.annotationReplies.values())
      .filter(reply => reply.annotationId === annotationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  
  async createAnnotationReply(insertReply: InsertAnnotationReply): Promise<AnnotationReply> {
    const id = this.annotationReplyId++;
    const timestamp = new Date();
    const reply: AnnotationReply = {
      id,
      annotationId: insertReply.annotationId,
      userId: insertReply.userId,
      content: insertReply.content,
      createdAt: timestamp
    };
    this.annotationReplies.set(id, reply);
    return reply;
  }
  
  async deleteAnnotationReply(id: number): Promise<void> {
    this.annotationReplies.delete(id);
  }

  // Moderation Flags
  private moderationFlags: Map<number, ModerationFlag> = new Map();
  private moderationFlagId: number = 1;

  async getModerationFlags(): Promise<ModerationFlag[]> {
    return Array.from(this.moderationFlags.values());
  }

  async getModerationFlagsByStatus(status: string): Promise<ModerationFlag[]> {
    return Array.from(this.moderationFlags.values()).filter(
      flag => flag.status === status
    );
  }

  async getModerationFlag(id: number): Promise<ModerationFlag | undefined> {
    return this.moderationFlags.get(id);
  }

  async createModerationFlag(flag: InsertModerationFlag & { 
    aiScore?: number, 
    aiReasoning?: string 
  }): Promise<ModerationFlag> {
    const id = this.moderationFlagId++;
    const timestamp = new Date();
    const moderationFlag: ModerationFlag = {
      id,
      contentId: flag.contentId,
      contentType: flag.contentType,
      reportedBy: flag.reportedBy,
      reason: flag.reason,
      status: flag.status,
      aiScore: flag.aiScore || null,
      aiReasoning: flag.aiReasoning || null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.moderationFlags.set(id, moderationFlag);
    return moderationFlag;
  }

  async updateModerationFlag(id: number, flag: Partial<ModerationFlag>): Promise<ModerationFlag> {
    const moderationFlag = await this.getModerationFlag(id);
    if (!moderationFlag) {
      throw new Error(`Moderation flag with ID ${id} not found`);
    }
    
    const updatedFlag = { 
      ...moderationFlag, 
      ...flag,
      updatedAt: new Date()
    };
    this.moderationFlags.set(id, updatedFlag);
    return updatedFlag;
  }

  async deleteModerationFlag(id: number): Promise<void> {
    this.moderationFlags.delete(id);
  }

  // Moderation Decisions
  private moderationDecisions: Map<number, ModerationDecision> = new Map();
  private moderationDecisionId: number = 1;

  async getModerationDecisions(): Promise<ModerationDecision[]> {
    return Array.from(this.moderationDecisions.values());
  }

  async getModerationDecision(id: number): Promise<ModerationDecision | undefined> {
    return this.moderationDecisions.get(id);
  }

  async getModerationDecisionByFlag(flagId: number): Promise<ModerationDecision | undefined> {
    return Array.from(this.moderationDecisions.values()).find(
      decision => decision.flagId === flagId
    );
  }

  async createModerationDecision(decision: InsertModerationDecision): Promise<ModerationDecision> {
    const id = this.moderationDecisionId++;
    const timestamp = new Date();
    const moderationDecision: ModerationDecision = {
      id,
      flagId: decision.flagId,
      moderatorId: decision.moderatorId,
      decision: decision.decision,
      reasoning: decision.reasoning,
      aiAssisted: decision.aiAssisted,
      createdAt: timestamp,
    };
    this.moderationDecisions.set(id, moderationDecision);
    return moderationDecision;
  }

  // Moderation Appeals
  private moderationAppeals: Map<number, ModerationAppeal> = new Map();
  private moderationAppealId: number = 1;

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
    const id = this.moderationAppealId++;
    const timestamp = new Date();
    const moderationAppeal: ModerationAppeal = {
      id,
      decisionId: appeal.decisionId,
      userId: appeal.userId,
      reason: appeal.reason,
      status: "pending",
      reviewedBy: null,
      reviewedAt: null,
      reviewOutcome: null,
      createdAt: timestamp,
    };
    this.moderationAppeals.set(id, moderationAppeal);
    return moderationAppeal;
  }

  async updateModerationAppeal(id: number, appeal: Partial<ModerationAppeal>): Promise<ModerationAppeal> {
    const moderationAppeal = await this.getModerationAppeal(id);
    if (!moderationAppeal) {
      throw new Error(`Moderation appeal with ID ${id} not found`);
    }
    
    const updatedAppeal = { ...moderationAppeal, ...appeal };
    this.moderationAppeals.set(id, updatedAppeal);
    return updatedAppeal;
  }

  // Moderation Settings
  private moderationSettings: Map<number, ModerationSetting> = new Map();
  private moderationSettingId: number = 1;

  async getModerationSettings(): Promise<ModerationSetting[]> {
    return Array.from(this.moderationSettings.values());
  }

  async getModerationSetting(key: string): Promise<ModerationSetting | undefined> {
    return Array.from(this.moderationSettings.values()).find(
      setting => setting.key === key
    );
  }

  async createModerationSetting(setting: InsertModerationSetting): Promise<ModerationSetting> {
    const id = this.moderationSettingId++;
    const timestamp = new Date();
    const moderationSetting: ModerationSetting = {
      id,
      key: setting.key,
      value: setting.value,
      description: setting.description || null,
      updatedBy: setting.updatedBy,
      updatedAt: timestamp,
    };
    this.moderationSettings.set(id, moderationSetting);
    return moderationSetting;
  }

  async updateModerationSetting(id: number, setting: Partial<ModerationSetting>): Promise<ModerationSetting> {
    const moderationSetting = this.moderationSettings.get(id);
    if (!moderationSetting) {
      throw new Error(`Moderation setting with ID ${id} not found`);
    }
    
    const updatedSetting = { 
      ...moderationSetting, 
      ...setting,
      updatedAt: new Date()
    };
    this.moderationSettings.set(id, updatedSetting);
    return updatedSetting;
  }
}

// Import the DatabaseStorage implementation
import { DatabaseStorage } from "./database-storage";

// Use the DatabaseStorage implementation for persistent storage
export const storage = new DatabaseStorage();
