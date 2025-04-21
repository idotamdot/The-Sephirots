import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@shared/schema";
import BadgeCollection from "@/components/badges/BadgeCollection";
import BadgeProgress from "@/components/badges/BadgeProgress";
import { motion } from "framer-motion";
import { Badge as UIBadge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

// Sample in-progress badges data
// In a real app, this would come from the API as well
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
  const { user } = useAuth();
  
  // Fetch user's badges from the API
  const { data: userBadges, isLoading: isLoadingBadges } = useQuery<Badge[]>({
    queryKey: ["/api/users", user?.id, "badges"],
    queryFn: async ({ queryKey }) => {
      if (!user) return [];
      const userId = queryKey[1];
      const res = await fetch(`/api/users/${userId}/badges`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch badges");
      }
      return res.json();
    },
    enabled: !!user, // Only run this query if user is authenticated
  });
  
  // Fetch all available badges for the in-progress tab display
  const { data: allBadges, isLoading: isLoadingAllBadges } = useQuery<Badge[]>({
    queryKey: ["/api/badges"],
    queryFn: async () => {
      const res = await fetch("/api/badges", {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch all badges");
      }
      return res.json();
    },
  });
  
  // Calculate badges in progress (all badges not yet earned)
  const badgesInProgress = allBadges?.filter(badge => 
    !userBadges?.some(userBadge => userBadge.id === badge.id)
  );
  
  // User stats
  const totalPoints = userBadges?.reduce((acc, badge) => acc + badge.points, 0) || 0;
  const totalBadges = userBadges?.length || 0;
  
  // Calculate highest tier badge
  const tierOrder = ["bronze", "silver", "gold", "platinum", "founder"] as const;
  type BadgeTier = typeof tierOrder[number];
  
  const getHighestTier = (): BadgeTier => {
    if (!userBadges?.length) return "bronze";
    
    const tierValues: Record<BadgeTier, number> = { 
      bronze: 1, 
      silver: 2, 
      gold: 3, 
      platinum: 4, 
      founder: 5 
    };
    
    return userBadges.reduce((highest: BadgeTier, badge) => {
      const currentTier = badge.tier as BadgeTier;
      return tierValues[currentTier] > tierValues[highest] ? currentTier : highest;
    }, "bronze" as BadgeTier);
  };
  
  const highestTier = getHighestTier();
  
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
          {isLoadingBadges ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              <span className="ml-2 text-sm text-gray-500">Loading your badges...</span>
            </div>
          ) : !userBadges?.length ? (
            <div className="text-center py-12 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-800/20">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No Badges Yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Start participating in the community to earn your first badge!
              </p>
            </div>
          ) : (
            <BadgeCollection 
              badges={userBadges} 
              title="Your Cosmic Collection" 
              description="Badges you've earned through your contributions and participation"
              showAll={true}
            />
          )}
        </TabsContent>
        
        <TabsContent value="progress" className="mt-6">
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Badges In Progress</h2>
              <p className="text-sm text-gray-500 mt-1">Continue your journey to earn these cosmic recognitions</p>
            </div>
            
            {isLoadingAllBadges ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                <span className="ml-2 text-sm text-gray-500">Loading available badges...</span>
              </div>
            ) : !badgesInProgress?.length ? (
              <div className="text-center py-12 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-800/20">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">All Badges Earned!</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Congratulations! You've earned all available badges.
                </p>
              </div>
            ) : (
              // For now, use the sample progress data until we implement progress tracking
              // In a real application, this would come from the API as well
              inProgressBadges.map((item, index) => (
                <BadgeProgress 
                  key={index}
                  badge={item.badge}
                  progress={item.progress}
                  nextRequirement={item.nextRequirement}
                />
              ))
            )}
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