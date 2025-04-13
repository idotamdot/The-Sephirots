import { useQuery } from "@tanstack/react-query";
import { Badge, User } from "@/lib/types";
import BadgeGrid from "@/components/achievements/BadgeGrid";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { calculatePointsToNextLevel } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

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
  
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold">Your Achievements</h1>
        <p className="text-gray-600">Track your progress and contributions to the community</p>
      </div>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium mb-3">Collaboration Progress</h2>
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
            
            <div>
              <h2 className="text-lg font-medium mb-3">Badge Collection</h2>
              <div className="flex items-baseline mb-2">
                <span className="text-3xl font-bold">{earnedBadgesCount}</span>
                <span className="ml-2 text-gray-600">of {totalBadgesCount} badges earned</span>
              </div>
              <Progress value={badgeCompletionPercentage} className="h-2 mb-1" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{badgeCompletionPercentage}% complete</span>
                <span>{totalBadgesCount - earnedBadgesCount} badges remaining</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-3">
              <i className="ri-award-line text-xl text-primary-500 mt-0.5"></i>
              <div>
                <h3 className="font-medium">Achievement Milestones</h3>
                <p className="text-sm text-gray-600">
                  Earn badges by participating in discussions, contributing to the Rights Agreement, 
                  supporting wellbeing initiatives, and building community connections.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <BadgeGrid 
        badges={badges} 
        earnedBadgeIds={earnedBadgeIds}
        title="All Badges" 
        showCategories={true}
      />
    </div>
  );
}
