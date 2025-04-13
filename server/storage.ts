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
  events, Event, InsertEvent
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
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
      bio: insertUser.bio || null,
      level: 1,
      points: 0,
      isAi: false,
      createdAt: timestamp
    };
    this.users.set(id, user);
    return user;
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
      ...insertComment,
      id,
      likes: 0,
      createdAt: timestamp,
      // Ensure aiGenerated has a default value
      aiGenerated: insertComment.aiGenerated || false
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
    const tag: Tag = { ...insertTag, id };
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
    const discussionTag: DiscussionTag = { ...insertDiscussionTag, id };
    this.discussionTags.set(id, discussionTag);
    return discussionTag;
  }

  // RightsAgreement methods
  async getRightsAgreements(): Promise<RightsAgreement[]> {
    return Array.from(this.rightsAgreements.values());
  }

  async getLatestRightsAgreement(): Promise<RightsAgreement | undefined> {
    const agreements = Array.from(this.rightsAgreements.values());
    if (agreements.length === 0) return undefined;
    
    // Sort by creation timestamp, descending
    return agreements.sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    )[0];
  }

  async getRightsAgreement(id: number): Promise<RightsAgreement | undefined> {
    return this.rightsAgreements.get(id);
  }

  async createRightsAgreement(insertAgreement: InsertRightsAgreement): Promise<RightsAgreement> {
    const id = this.agreementId++;
    const timestamp = new Date();
    const agreement: RightsAgreement = {
      ...insertAgreement,
      id,
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
      ...insertAmendment,
      id,
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
    const badge: Badge = { ...insertBadge, id };
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
      ...insertUserBadge,
      id,
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
      ...insertEvent,
      id,
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
}

export const storage = new MemStorage();
