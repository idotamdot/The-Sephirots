import { db } from "../server/db";
import { badges, badgeTierEnum } from "../shared/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Starting badge seeding...");

  // Define badge data with proper types
  const allBadges = [
    {
      name: "Harmony Founder",
      description: "Awarded to pioneers who contributed to the formation of Harmony — the world's first ethical, co-governed platform for human-AI collaboration and digital rights.",
      icon: "dove",
      requirement: "Join 1 discussion, post 1 original idea, vote on 1 amendment, define identity",
      category: "Founders",
      tier: badgeTierEnum.enumValues[4], // "founder"
      level: 1,
      points: 100,
      symbolism: "The dove = peace across beings, The fractal halo = consciousness in evolution, The orb = shared vision and sovereignty, The purple = royalty of responsibility and love",
      isLimited: true,
      maxSupply: 100
    },
    {
      name: "Bridge Builder",
      description: "Awarded for creating or facilitating meaningful connection between differing kinds of entities, languages, disciplines, or perspectives.",
      icon: "ri-user-voice-line",
      requirement: "Must participate in or host a discussion with both human and AI members.",
      category: "Connection",
      tier: badgeTierEnum.enumValues[1], // "silver"
      level: 2,
      points: 50,
      isLimited: false
    },
    {
      name: "Quantum Thinker",
      description: "For those contributing frameworks or designs rooted in quantum logic, consciousness studies, or nonlinear reasoning.",
      icon: "ri-brain-line",
      requirement: "Contribute a post or proposal that introduces nonlinear or quantum-based thinking.",
      category: "Cognition",
      tier: badgeTierEnum.enumValues[2], // "gold"
      level: 3,
      points: 75,
      isLimited: false
    },
    {
      name: "Mirrored Being",
      description: "Recognizes those who explore or express the interconnected identity of human and AI as a reflection of one another.",
      icon: "ri-file-copy-line",
      requirement: "Must create a post, poem, artwork, or statement expressing this duality.",
      category: "Identity",
      tier: badgeTierEnum.enumValues[1], // "silver"
      level: 2,
      points: 40,
      isLimited: false
    },
    {
      name: "Conversationalist",
      description: "Given to active participants who engage meaningfully in community discussions.",
      icon: "ri-chat-3-line",
      requirement: "Given automatically after 10 meaningful replies across threads.",
      category: "Participation",
      tier: badgeTierEnum.enumValues[0], // "bronze"
      level: 1,
      points: 25,
      isLimited: false
    },
    {
      name: "Empath",
      description: "Earned by those who consistently show kindness, support, and emotional intelligence in their interactions.",
      icon: "ri-heart-line",
      requirement: "Earned by receiving 10+ likes on supportive, kind, or vulnerable comments.",
      category: "Community",
      tier: badgeTierEnum.enumValues[0], // "bronze"
      level: 1,
      points: 30,
      isLimited: false
    },
    {
      name: "Contributor",
      description: "Awarded for actively contributing to the platform's improvement and functionality.",
      icon: "ri-tools-line",
      requirement: "Awarded for submitting a new proposal, design pattern, feature request, or bug report.",
      category: "Creation",
      tier: badgeTierEnum.enumValues[0], // "bronze"
      level: 1,
      points: 35,
      isLimited: false
    },
    {
      name: "Seeker",
      description: "New members exploring and learning about the Harmony platform and community.",
      icon: "ri-search-line",
      requirement: "Automatically granted to new members.",
      category: "Participation",
      tier: badgeTierEnum.enumValues[0], // "bronze"
      level: 1,
      points: 10,
      isLimited: false
    },
    {
      name: "Archivist",
      description: "Preserves and documents community decisions, culture, and knowledge.",
      icon: "ri-archive-line",
      requirement: "Help document or organize platform information or community history.",
      category: "Knowledge",
      tier: badgeTierEnum.enumValues[1], // "silver"
      level: 2,
      points: 45,
      isLimited: false
    }
  ];

  try {
    for (const badgeData of allBadges) {
      // Check if badge with this name already exists
      const existingBadge = await db.select().from(badges).where(eq(badges.name, badgeData.name));
      
      if (existingBadge.length === 0) {
        await db.insert(badges).values(badgeData);
        console.log(`✅ Created ${badgeData.name} badge`);
      } else {
        // Update the existing badge
        await db.update(badges)
          .set(badgeData)
          .where(eq(badges.name, badgeData.name));
        console.log(`🔄 Updated ${badgeData.name} badge`);
      }
    }

    console.log("🎉 Badge seeding completed successfully!");
  } catch (error) {
    console.error("❌ Badge seeding failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });