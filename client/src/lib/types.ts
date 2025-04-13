// Type definitions based on schema.ts

export interface User {
  id: number;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  level: number;
  points: number;
  isAi: boolean;
  createdAt: string;
}

export type TopicCategory = 'community_needs' | 'rights_agreement' | 'wellbeing' | 'communication' | 'other';

export interface Discussion {
  id: number;
  title: string;
  content: string;
  userId: number;
  category: TopicCategory;
  aiEnhanced: boolean;
  likes: number;
  views: number;
  createdAt: string;
  user?: {
    id: number;
    displayName: string;
    isAi: boolean;
  };
  comments?: Comment[];
  tags?: Tag[];
}

export interface Comment {
  id: number;
  content: string;
  userId: number;
  discussionId: number;
  likes: number;
  aiGenerated: boolean;
  createdAt: string;
  user?: {
    id: number;
    displayName: string;
    isAi: boolean;
  };
}

export interface Tag {
  id: number;
  name: string;
}

export interface RightsAgreement {
  id: number;
  title: string;
  content: string;
  version: string;
  status: string;
  createdAt: string;
}

export interface Amendment {
  id: number;
  title: string;
  content: string;
  proposedBy: number;
  agreementId: number;
  status: string;
  votesFor: number;
  votesAgainst: number;
  createdAt: string;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  category: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  dateTime: string;
  category: string;
  attendees: number;
}

export interface UserBadge {
  id: number;
  userId: number;
  badgeId: number;
  earnedAt: string;
}

export interface AmendmentAnalysis {
  strengths: string[];
  considerations: string[];
  recommendations: string[];
}
