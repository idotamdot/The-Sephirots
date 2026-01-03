import { useQuery } from "@tanstack/react-query";
import ProgressCard from "@/components/ui/progress-card";
import BadgeDisplay from "@/components/ui/badge-display";
import ContributionStats from "@/components/ui/contribution-stats";
import QuestSystem from "@/components/quests/QuestSystem";
import { Badge, User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

interface ProgressSectionProps {
  currentUser?: User;
}

export default function ProgressSection({ currentUser }: ProgressSectionProps) {
  const { data: badges, isLoading: badgesLoading } = useQuery<Badge[]>({
    queryKey: ["/api/badges"],
    enabled: !!currentUser,
  });
  
  const { data: userBadges, isLoading: userBadgesLoading } = useQuery<Badge[]>({
    queryKey: [`/api/users/${currentUser?.id}/badges`],
    enabled: !!currentUser,
  });
  
  // Get user statistics
  const { data: userStats } = useQuery<{
    discussions: number;
    comments: number;
    proposals: number;
    reactions: number;
  }>({
    queryKey: [`/api/users/${currentUser?.id}/statistics`],
    enabled: !!currentUser,
  });
  
  if (!currentUser) {
    return null;
  }
  
  const isLoading = badgesLoading || userBadgesLoading;
  
  // Calculate points to next level (simplified)
  const pointsToNextLevel = 100 - (currentUser.points % 100);
  
  // Contribution stats - now using real data from API
  const contributionStats = [
    { icon: 'ri-message-3-line', label: 'Discussion posts', value: userStats?.discussions ?? 0 },
    { icon: 'ri-reply-line', label: 'Replies', value: userStats?.comments ?? 0 },
    { icon: 'ri-draft-line', label: 'Proposals', value: userStats?.proposals ?? 0 },
    { icon: 'ri-thumb-up-line', label: 'Reactions', value: userStats?.reactions ?? 0 },
  ];
  
  // Get next badge
  const getNextBadge = () => {
    if (!badges || !userBadges) return undefined;
    
    const earnedBadgeIds = userBadges.map(b => b.id);
    const unearnedBadges = badges.filter(b => !earnedBadgeIds.includes(b.id));
    
    return unearnedBadges.length > 0 
      ? { name: unearnedBadges[0].name, requirement: unearnedBadges[0].requirement }
      : undefined;
  };
  
  if (isLoading) {
    return (
      <section className="mb-8">
        <h2 className="text-xl font-heading font-semibold mb-4">Your Progress</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-[196px]" />
          <Skeleton className="h-[196px]" />
          <Skeleton className="h-[196px]" />
        </div>
      </section>
    );
  }
  
  return (
    <section className="mb-8">
      <h2 className="text-xl font-heading font-semibold mb-4">Your Progress</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <ProgressCard
          title="Collaboration Points"
          points={currentUser.points}
          level={currentUser.level}
          pointsToNextLevel={pointsToNextLevel}
          weeklyProgress={15}
        />
        
        <BadgeDisplay
          title="Recent Badges"
          badges={userBadges || []}
          nextBadge={getNextBadge()}
        />
        
        <ContributionStats
          title="Your Contributions"
          stats={contributionStats}
          userLevel="Active Member"
        />
      </div>
      
      {/* Quest System - Compact View */}
      <div className="mt-6">
        <QuestSystem compact={true} maxQuests={3} />
      </div>
    </section>
  );
}
