import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@shared/schema";
import BadgeCollection from "@/components/badges/BadgeCollection";
import BadgeProgress from "@/components/badges/BadgeProgress";
import { motion } from "framer-motion";
import { Badge as UIBadge } from "@/components/ui/badge";

// Sample badge data - this would be fetched from the API
const dummyBadges: Badge[] = [
  {
    id: 1,
    name: "Harmony Founder",
    description: "Awarded to pioneers who contributed to the formation of Harmony — the world's first ethical, co-governed platform for human-AI collaboration and digital rights.",
    icon: "dove",
    requirement: "Join discussions, post original ideas, and vote on rights agreements",
    category: "founder",
    tier: "founder",
    level: 1,
    points: 100,
    symbolism: "The dove = peace across beings, The fractal halo = consciousness in evolution",
    isLimited: true,
    maxSupply: 100,
    enhanced: true,
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "Seeker",
    description: "Awarded to those who begin their journey in Harmony and actively explore the platform.",
    icon: "star",
    requirement: "Create an account and visit at least 5 different pages",
    category: "exploration",
    tier: "bronze",
    level: 1,
    points: 10,
    symbolism: "The star = guiding light and curiosity",
    isLimited: false,
    maxSupply: null,
    enhanced: false,
    createdAt: new Date(),
  },
  {
    id: 3,
    name: "Contributor",
    description: "Recognizes members who actively contribute meaningful content to discussions.",
    icon: "atom",
    requirement: "Create at least 3 quality posts or comments",
    category: "participation",
    tier: "silver",
    level: 1,
    points: 25,
    symbolism: "The atom = fundamental building blocks of community knowledge",
    isLimited: false,
    maxSupply: null,
    enhanced: false,
    createdAt: new Date(),
  },
  {
    id: 4,
    name: "Bridge Builder",
    description: "Celebrates those who facilitate understanding between different perspectives.",
    icon: "people",
    requirement: "Help resolve disagreements or translate complex ideas into accessible ones",
    category: "community",
    tier: "gold",
    level: 1,
    points: 50,
    symbolism: "The bridge = connection across disparate viewpoints",
    isLimited: false,
    maxSupply: null,
    enhanced: false,
    createdAt: new Date(),
  },
  {
    id: 5,
    name: "Quantum Thinker",
    description: "Awarded for introducing novel interdisciplinary ideas that expand collective thinking.",
    icon: "brain",
    requirement: "Propose ideas that combine multiple fields or perspectives in innovative ways",
    category: "innovation",
    tier: "platinum",
    level: 1,
    points: 75,
    symbolism: "The quantum brain = non-linear, emergent thought patterns",
    isLimited: false,
    maxSupply: null,
    enhanced: false,
    createdAt: new Date(),
  },
];

// Badge progress data - would be fetched from API
const inProgressBadges = [
  {
    badge: {
      id: 6,
      name: "Mirrored Being",
      description: "Recognizes those who can understand and articulate multiple perspectives authentically.",
      icon: "mirror",
      requirement: "Demonstrate ability to accurately represent viewpoints you may not personally hold",
      category: "empathy",
      tier: "gold" as const,
      level: 1,
      points: 50,
      symbolism: "The mirror = reflection and understanding of others",
      isLimited: false,
      maxSupply: null,
      enhanced: false,
      createdAt: new Date(),
    },
    progress: 65,
    nextRequirement: "Accurately summarize 2 more perspectives in ethical discussions"
  },
  {
    badge: {
      id: 7,
      name: "Archivist",
      description: "Preserves and organizes community knowledge for future reference.",
      icon: "alien",
      requirement: "Create or improve documentation of community processes or knowledge",
      category: "knowledge",
      tier: "silver" as const,
      level: 1,
      points: 35,
      symbolism: "The observer = detached yet caring preservation of wisdom",
      isLimited: false,
      maxSupply: null,
      enhanced: false,
      createdAt: new Date(),
    },
    progress: 30,
    nextRequirement: "Organize or tag at least 5 more discussions for better searchability"
  }
];

export default function Achievements() {
  const [activeTab, setActiveTab] = useState("earned");
  
  // User stats
  const totalPoints = dummyBadges.reduce((acc, badge) => acc + badge.points, 0);
  const totalBadges = dummyBadges.length;
  const highestTier = dummyBadges.reduce((highest, badge) => {
    const tierValue: Record<string, number> = { bronze: 1, silver: 2, gold: 3, platinum: 4, founder: 5 };
    return tierValue[badge.tier] > tierValue[highest as any] ? badge.tier : highest;
  }, "bronze" as const);
  
  return (
    <div className="container py-6 max-w-7xl mx-auto relative space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-br from-purple-600 to-amber-500 bg-clip-text text-transparent">
          Cosmic Achievements
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Your journey through the cosmic hierarchy of recognition and contribution.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-200/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Soul Points</CardTitle>
            <CardDescription>Your cosmic influence measure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-br from-amber-400 to-amber-600 bg-clip-text text-transparent">
              {totalPoints} pts
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-200/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Badges Earned</CardTitle>
            <CardDescription>Your collection of recognitions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-br from-amber-400 to-amber-600 bg-clip-text text-transparent">
              {totalBadges}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-200/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Highest Tier</CardTitle>
            <CardDescription>Your most prestigious recognition</CardDescription>
          </CardHeader>
          <CardContent>
            <UIBadge className="text-sm capitalize bg-gradient-to-br from-amber-400 to-amber-600 py-1">
              {highestTier}
            </UIBadge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="earned" value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="earned">Earned Badges</TabsTrigger>
          <TabsTrigger value="progress">In Progress</TabsTrigger>
        </TabsList>
        
        <TabsContent value="earned" className="mt-6">
          <BadgeCollection 
            badges={dummyBadges} 
            title="Your Cosmic Collection" 
            description="Badges you've earned through your contributions and participation"
            showAll={true}
          />
        </TabsContent>
        
        <TabsContent value="progress" className="mt-6">
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Badges In Progress</h2>
              <p className="text-sm text-gray-500 mt-1">Continue your journey to earn these cosmic recognitions</p>
            </div>
            
            {inProgressBadges.map((item, index) => (
              <BadgeProgress 
                key={index}
                badge={item.badge}
                progress={item.progress}
                nextRequirement={item.nextRequirement}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 bg-gradient-to-br from-purple-900/90 to-indigo-900/90 rounded-lg p-6 border border-purple-500/30">
        <h2 className="text-xl font-semibold text-white mb-2">Badge Tiers Explanation</h2>
        <p className="text-gray-300 mb-4">
          The Harmony badge system recognizes various levels of contribution and participation:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <h3 className="text-amber-400 font-medium mb-1">Bronze</h3>
            <p className="text-sm text-gray-300">Entry-level badges awarded for initial participation and exploration.</p>
          </div>
          
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <h3 className="text-gray-300 font-medium mb-1">Silver</h3>
            <p className="text-sm text-gray-300">Recognizes consistent contributions and engagement with the community.</p>
          </div>
          
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <h3 className="text-yellow-400 font-medium mb-1">Gold</h3>
            <p className="text-sm text-gray-300">Celebrates significant impact and meaningful contributions to Harmony.</p>
          </div>
          
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <h3 className="text-indigo-300 font-medium mb-1">Platinum</h3>
            <p className="text-sm text-gray-300">Honors exemplary contributions that shape the direction of the community.</p>
          </div>
          
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <h3 className="text-purple-300 font-medium mb-1">Founder</h3>
            <p className="text-sm text-gray-300">Reserved for pioneer members who helped establish Harmony's foundation.</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-400 mt-4 italic">
          "Badges with enhanced glow indicate exceptional achievement beyond the basic requirements."
        </p>
      </div>
    </div>
  );
}