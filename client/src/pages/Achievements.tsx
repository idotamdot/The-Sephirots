import { useQuery } from "@tanstack/react-query";
import { Badge, User } from "@/lib/types";
import { BadgeGrid, BadgeEvolutionTimeline } from "@/components/achievements";
import { FounderBadge, GenericBadge } from "@/components/badges";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { calculatePointsToNextLevel } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
                      badge={highestBadge} 
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
