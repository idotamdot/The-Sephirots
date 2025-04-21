import { useState } from "react";
import DonationBadgeShowcase from "@/components/badges/DonationBadgeShowcase";
import { Badge } from "@shared/schema";

export default function SimpleBadgeTest() {
  // Create sample badge data
  const sampleBadges: Badge[] = [
    {
      id: 1,
      name: "Seed Planter I",
      description: "Supported the community with a Seed Planter donation.",
      icon: "🌱",
      requirement: "Donate $10 to the community",
      category: "donation",
      tier: "bronze",
      level: 1,
      points: 50,
      symbolism: "Growth and nurturing",
      isLimited: false,
      maxSupply: null,
      enhanced: false,
      createdAt: new Date()
    },
    {
      id: 2,
      name: "Tree Tender I",
      description: "Generously supported the community with a Tree Tender donation.",
      icon: "🌳",
      requirement: "Donate $50 to the community",
      category: "donation",
      tier: "silver",
      level: 2,
      points: 150,
      symbolism: "Strength and support",
      isLimited: false,
      maxSupply: null,
      enhanced: false,
      createdAt: new Date()
    },
    {
      id: 3,
      name: "Light Guardian I",
      description: "Magnificently illuminated the path with a Light Guardian donation.",
      icon: "✨",
      requirement: "Donate $200 to the community",
      category: "donation",
      tier: "gold",
      level: 3,
      points: 500,
      symbolism: "Illumination and guidance",
      isLimited: false,
      maxSupply: null,
      enhanced: true,
      createdAt: new Date()
    }
  ];

  return (
    <div className="container py-12 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Badge Showcase Test
      </h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">All Donation Badges</h2>
        <DonationBadgeShowcase badges={sampleBadges} />
      </div>
    </div>
  );
}