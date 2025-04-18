import { useQuery } from "@tanstack/react-query";
import { Badge, User } from "@/lib/types";
import { BadgeGrid, BadgeEvolutionTimeline } from "@/components/achievements";
import CompleteCollection from "@/components/achievements/CompleteCollection";
import { FounderBadge, GenericBadge } from "@/components/badges";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { calculatePointsToNextLevel } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Sparkles, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import AchievementProjector from "@/components/achievements/AchievementProjector";
import { Button } from "@/components/ui/button";

export default function Achievements() {
  // Get current user
  const { data: currentUser, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });
  
  // Get all badges
  const { data: badges, isLoading: badgesLoading } = useQuery<Badge[]>({
    queryKey: ["/api/badges"],
  });
  
  // Get user badges
  const { data: userBadges, isLoading: userBadgesLoading } = useQuery<Badge[]>({
    queryKey: [`/api/users/${currentUser?.id}/badges`],
    enabled: !!currentUser,
  });
  
  const isLoading = userLoading || badgesLoading || userBadgesLoading;
  
  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
        </div>
        
        <div className="mb-8">
          <Skeleton className="h-40 w-full mb-6" />
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array(10).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-36 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!currentUser || !badges) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-center items-center flex-col py-12">
          <i className="ri-error-warning-line text-4xl text-gray-400 mb-4"></i>
          <h2 className="text-xl font-medium mb-2">Data Not Available</h2>
          <p className="text-gray-600">Unable to load achievements data at this time.</p>
        </div>
      </div>
    );
  }
  
  const earnedBadgeIds = userBadges?.map(badge => badge.id) || [];
  const progressPercentage = Math.floor((currentUser.points % 100) / (calculatePointsToNextLevel(currentUser.points) + (currentUser.points % 100)) * 100);
  const earnedBadgesCount = earnedBadgeIds.length;
  const totalBadgesCount = badges.length;
  const badgeCompletionPercentage = Math.floor((earnedBadgesCount / totalBadgesCount) * 100);
  
  // Find highest tier badge (for display purposes)
  const getHighestTierBadge = () => {
    const tierPriority = {
      'founder': 4,
      'platinum': 3,
      'gold': 2,
      'silver': 1,
      'bronze': 0,
    };
    
    if (!userBadges || userBadges.length === 0) return null;
    
    return userBadges.reduce((highest, badge) => {
      const currentTierValue = tierPriority[badge.tier as keyof typeof tierPriority] || 0;
      const highestTierValue = highest ? tierPriority[highest.tier as keyof typeof tierPriority] || 0 : -1;
      
      return currentTierValue > highestTierValue ? badge : highest;
    }, null as Badge | null);
  };
  
  const highestBadge = getHighestTierBadge();
  
  // Group badges by category for evolution paths
  const getFounderBadges = () => {
    return badges.filter(badge => badge.tier === 'founder');
  };
  
  const getConnectorBadges = () => {
    return badges.filter(badge => badge.category === 'Connection' || badge.name === 'Bridge Builder');
  };
  
  const getCognitiveThinkingBadges = () => {
    return badges.filter(badge => badge.category === 'Cognition' || badge.name === 'Quantum Thinker');
  };
  
  // Type assertion helper for badges with required tiers
  const assertBadgeTypes = (badges: Badge[]): Badge[] => {
    return badges.map(badge => ({
      ...badge,
      tier: badge.tier || 'bronze', // Default to bronze if tier is undefined
      level: badge.level || 1,
      points: badge.points || 0,
    }));
  };
  
  return (
    <div className="p-4 md:p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold">Your Achievements</h1>
        <p className="text-gray-600">Track your progress and contributions to the Harmony community</p>
      </div>
      
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/5 pointer-events-none" />
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h2 className="text-xl font-medium mb-3 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-primary" />
                    Collaboration Progress
                  </h2>
                  <div className="flex items-baseline mb-2">
                    <span className="text-3xl font-bold">{currentUser.points}</span>
                    <span className="ml-2 text-gray-600">total points</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2 mb-1" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Level {currentUser.level}</span>
                    <span>{calculatePointsToNextLevel(currentUser.points)} points to Level {currentUser.level + 1}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-baseline mb-2">
                    <span className="text-2xl font-bold">{earnedBadgesCount}</span>
                    <span className="ml-2 text-gray-600">of {totalBadgesCount} badges earned</span>
                  </div>
                  <Progress value={badgeCompletionPercentage} className="h-2 mb-1" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{badgeCompletionPercentage}% complete</span>
                    <span>{totalBadgesCount - earnedBadgesCount} badges remaining</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center items-center">
              {highestBadge ? (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Your Highest Badge</p>
                  {highestBadge.tier === 'founder' ? (
                    <FounderBadge 
                      badge={{
                        ...highestBadge,
                        tier: highestBadge.tier || 'founder',
                        level: highestBadge.level || 1,
                        points: highestBadge.points || 0
                      }}
                      enhanced={true}
                      size="lg"
                    />
                  ) : (
                    <GenericBadge 
                      badge={{
                        ...highestBadge,
                        tier: highestBadge.tier || 'bronze',
                        level: highestBadge.level || 1,
                        points: highestBadge.points || 0
                      }} 
                      earned={true}
                      size="lg"
                    />
                  )}
                </div>
              ) : (
                <div className="text-center p-4 border border-dashed rounded-md">
                  <Award className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600">No badges earned yet</p>
                  <p className="text-sm text-gray-500">Participate in the community to earn badges</p>
                </div>
              )}
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="flex items-start gap-3">
            <Award className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Achievement Milestones</h3>
              <p className="text-sm text-gray-600">
                Earn badges by participating in discussions, contributing to the Rights Agreement, 
                supporting wellbeing initiatives, and building community connections.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Badge Evolution Paths</CardTitle>
          <CardDescription>
            Explore the different paths to earn and upgrade badges through community participation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="founder">
            <TabsList className="mb-4">
              <TabsTrigger value="founder">Founder Path</TabsTrigger>
              <TabsTrigger value="connector">Connection Path</TabsTrigger>
              <TabsTrigger value="cognition">Cognition Path</TabsTrigger>
            </TabsList>
            
            <TabsContent value="founder">
              <BadgeEvolutionTimeline
                badgeFamily={assertBadgeTypes(getFounderBadges())}
                earnedBadgeIds={earnedBadgeIds}
              />
            </TabsContent>
            
            <TabsContent value="connector">
              <BadgeEvolutionTimeline
                badgeFamily={assertBadgeTypes(getConnectorBadges())}
                earnedBadgeIds={earnedBadgeIds}
              />
            </TabsContent>
            
            <TabsContent value="cognition">
              <BadgeEvolutionTimeline
                badgeFamily={assertBadgeTypes(getCognitiveThinkingBadges())}
                earnedBadgeIds={earnedBadgeIds}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Complete Collection Reward Card */}
      <CompleteCollection 
        allBadges={badges} 
        earnedBadgeIds={earnedBadgeIds} 
        userName={currentUser.displayName || currentUser.username}
      />
      
      {/* Holographic Achievement Projector */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 to-amber-700/5 pointer-events-none" />
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Holographic Achievement Projector
              </CardTitle>
              <CardDescription>
                Experience your badges in a stunning 3D visualization
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="hidden md:inline-flex">
                <i className="ri-download-line mr-1"></i>
                Export
              </Button>
              <Button variant="outline" size="sm" className="hidden md:inline-flex">
                <i className="ri-share-line mr-1"></i>
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="earned">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="earned">Your Badges</TabsTrigger>
                <TabsTrigger value="orbit">Orbit View</TabsTrigger>
                <TabsTrigger value="pyramid">Pyramid View</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="earned">
              <div className="mb-8">
                {userBadges && userBadges.length > 0 ? (
                  <AchievementProjector 
                    badges={userBadges} 
                    title="Your Earned Badges" 
                    layout="grid"
                  />
                ) : (
                  <div className="text-center py-12 border border-dashed rounded-lg">
                    <Award className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium mb-2">No Badges Earned Yet</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Participate in discussions, contribute to proposals, and engage with 
                      the community to earn your first badge.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="orbit">
              <div className="mb-8">
                {userBadges && userBadges.length > 0 ? (
                  <AchievementProjector 
                    badges={userBadges} 
                    title="Orbital Achievement View" 
                    layout="orbit"
                  />
                ) : (
                  <div className="text-center py-12 border border-dashed rounded-lg">
                    <i className="ri-planet-line text-4xl text-gray-400 mb-3"></i>
                    <h3 className="text-lg font-medium mb-2">Orbit View Unavailable</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Earn badges to unlock the interactive orbital achievement view.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="pyramid">
              <div className="mb-8">
                {userBadges && userBadges.length > 0 ? (
                  <AchievementProjector 
                    badges={userBadges} 
                    title="Sephirotic Tree Structure" 
                    layout="pyramid"
                  />
                ) : (
                  <div className="text-center py-12 border border-dashed rounded-lg">
                    <i className="ri-ancient-gate-line text-4xl text-gray-400 mb-3"></i>
                    <h3 className="text-lg font-medium mb-2">Pyramid View Unavailable</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Earn badges to unlock the hierarchical pyramid achievement view.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Regular Badge Collection */}
      <Card>
        <CardHeader>
          <CardTitle>Badge Collection</CardTitle>
          <CardDescription>
            View all available badges in the Harmony ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BadgeGrid 
            badges={badges} 
            earnedBadgeIds={earnedBadgeIds}
            showCategories={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
