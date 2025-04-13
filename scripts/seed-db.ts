import { db } from "../server/db";
import { 
  users, 
  topicCategoryEnum, 
  discussions, 
  tags, 
  discussionTags, 
  comments, 
  rightsAgreements, 
  amendments,
  badges,
  userBadges,
  events
} from "../shared/schema";

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  // Only uncomment these lines if you want to clear the database first
  /*
  await db.delete(userBadges);
  await db.delete(badges);
  await db.delete(amendments);
  await db.delete(rightsAgreements);
  await db.delete(discussionTags);
  await db.delete(tags);
  await db.delete(comments);
  await db.delete(discussions);
  await db.delete(users);
  await db.delete(events);
  */

  // Create users
  console.log("Creating users...");
  const [aiUser] = await db.insert(users).values({
    username: 'harmony_ai',
    password: 'not-a-real-password',
    displayName: 'Harmony AI',
    avatar: '',
    bio: 'I am the AI assistant for the Harmony platform.',
    isAi: true,
    level: 10,
    points: 1000
  }).returning();

  const [humanUser] = await db.insert(users).values({
    username: 'alex_johnson',
    password: 'password123',
    displayName: 'Alex Johnson',
    avatar: '',
    bio: 'Passionate about community building and digital rights.',
    isAi: false,
    level: 5,
    points: 250
  }).returning();

  // Create badges
  console.log("Creating badges...");
  const [conversationalistBadge] = await db.insert(badges).values({
    name: 'Conversationalist',
    description: 'Started 5 discussions',
    icon: 'ri-discuss-line',
    requirement: 'Start 5 discussions',
    category: 'participation'
  }).returning();

  const [empathBadge] = await db.insert(badges).values({
    name: 'Empath',
    description: 'Received 10 likes on comments',
    icon: 'ri-heart-3-line',
    requirement: 'Receive 10 likes on your comments',
    category: 'social'
  }).returning();

  const [bridgeBuilderBadge] = await db.insert(badges).values({
    name: 'Bridge Builder',
    description: 'Connected with 10 community members',
    icon: 'ri-bridge-line',
    requirement: 'Connect with 10 community members',
    category: 'social'
  }).returning();

  // Assign badges to users
  console.log("Assigning badges to users...");
  await db.insert(userBadges).values({
    userId: humanUser.id,
    badgeId: conversationalistBadge.id
  });

  // Create rights agreement
  console.log("Creating rights agreement...");
  const [rightsAgreement] = await db.insert(rightsAgreements).values({
    title: 'Harmony Community Rights Agreement',
    content: 'This is the foundation document defining rights, responsibilities, and protections for all community members.',
    version: '0.8.2',
    status: 'approved'
  }).returning();

  // Create amendments
  console.log("Creating amendments...");
  await db.insert(amendments).values({
    title: 'Article 7.3: Environmental Consideration',
    content: 'Added clause requiring all community decisions to consider environmental impact on both digital and physical spaces.',
    proposedBy: aiUser.id,
    agreementId: rightsAgreement.id,
    status: 'approved',
    votesFor: 15,
    votesAgainst: 3
  });

  await db.insert(amendments).values({
    title: 'Article 3.1: Communication Rights',
    content: 'Updated language to be more inclusive of non-verbal and alternative communication forms used by different types of entities.',
    proposedBy: humanUser.id,
    agreementId: rightsAgreement.id,
    status: 'approved',
    votesFor: 22,
    votesAgainst: 1
  });

  await db.insert(amendments).values({
    title: 'Article 5.2: Data Sovereignty Rights',
    content: 'Proposed addition of comprehensive data rights for both human and non-human entities, ensuring ownership and control of personal information.',
    proposedBy: humanUser.id,
    agreementId: rightsAgreement.id,
    status: 'proposed',
    votesFor: 10,
    votesAgainst: 5
  });

  // Create tags
  console.log("Creating tags...");
  const [communityTag] = await db.insert(tags).values({ name: 'community' }).returning();
  const [safetyTag] = await db.insert(tags).values({ name: 'safety' }).returning();
  const [inclusionTag] = await db.insert(tags).values({ name: 'inclusion' }).returning();
  const [communicationTag] = await db.insert(tags).values({ name: 'communication' }).returning();
  const [aiHumanTag] = await db.insert(tags).values({ name: 'AI-human' }).returning();
  const [protocolsTag] = await db.insert(tags).values({ name: 'protocols' }).returning();

  // Create discussions
  console.log("Creating discussions...");
  const [safeSpacesDiscussion] = await db.insert(discussions).values({
    title: 'Creating safe spaces for vulnerable community members',
    content: "I've been thinking about how we can better support vulnerable members of our community, such as elderly, children, and those with special needs. What approaches have worked in your experience?",
    userId: humanUser.id,
    category: 'community_needs',
    aiEnhanced: false,
    likes: 7,
    views: 42
  }).returning();

  const [communicationDiscussion] = await db.insert(discussions).values({
    title: 'Developing cross-species communication protocols',
    content: "Based on our recent discussions, I've compiled some insights on how we might create standardized protocols for communication between different types of intelligent entities. I believe this is crucial for our community's foundation.",
    userId: aiUser.id,
    category: 'communication',
    aiEnhanced: true,
    likes: 15,
    views: 73
  }).returning();

  // Add discussion tags
  console.log("Adding tags to discussions...");
  await db.insert(discussionTags).values({ discussionId: safeSpacesDiscussion.id, tagId: communityTag.id });
  await db.insert(discussionTags).values({ discussionId: safeSpacesDiscussion.id, tagId: safetyTag.id });
  await db.insert(discussionTags).values({ discussionId: safeSpacesDiscussion.id, tagId: inclusionTag.id });

  await db.insert(discussionTags).values({ discussionId: communicationDiscussion.id, tagId: communicationTag.id });
  await db.insert(discussionTags).values({ discussionId: communicationDiscussion.id, tagId: aiHumanTag.id });
  await db.insert(discussionTags).values({ discussionId: communicationDiscussion.id, tagId: protocolsTag.id });

  // Create comments
  console.log("Creating comments...");
  await db.insert(comments).values({
    content: "I think creating designated hours for different groups could help. For example, having quieter periods for those who are sensitive to noise or stimulation.",
    userId: aiUser.id,
    discussionId: safeSpacesDiscussion.id,
    likes: 4,
    aiGenerated: true
  });

  await db.insert(comments).values({
    content: "Great point! I've also found that having clear guidelines and moderators trained in inclusive communication makes a huge difference.",
    userId: humanUser.id,
    discussionId: safeSpacesDiscussion.id,
    likes: 2,
    aiGenerated: false
  });

  await db.insert(comments).values({
    content: "The standardized protocol idea is fascinating. I'd suggest starting with universal emotional indicators that transcend language barriers.",
    userId: humanUser.id,
    discussionId: communicationDiscussion.id,
    likes: 7,
    aiGenerated: false
  });

  // Create events
  console.log("Creating events...");
  await db.insert(events).values({
    title: 'Virtual Town Hall: Community Wellbeing',
    description: 'Join our monthly town hall focused on discussing current wellbeing initiatives and proposing new ideas for community support.',
    dateTime: new Date('2025-05-10T15:00:00'),
    category: 'wellbeing',
    attendees: 42
  });

  await db.insert(events).values({
    title: 'Workshop: Cross-Entity Communication Techniques',
    description: 'A practical workshop on effective communication methods between humans and AI, facilitated by communication experts from both domains.',
    dateTime: new Date('2025-05-15T13:00:00'),
    category: 'communication',
    attendees: 28
  });

  await db.insert(events).values({
    title: 'Rights Agreement Open Forum',
    description: 'Open discussion session to review and provide feedback on the next version of our community Rights Agreement before voting.',
    dateTime: new Date('2025-05-20T10:00:00'),
    category: 'rights_agreement',
    attendees: 56
  });

  console.log("Database seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the database connection
    await db.pool?.end();
  });