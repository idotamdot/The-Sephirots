import { Badge } from '@/lib/types';
import { GenericBadge, FounderBadge } from '@/components/badges';
import { ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface BadgeEvolutionTimelineProps {
  badgeFamily: Badge[];
  earnedBadgeIds: number[];
}

export default function BadgeEvolutionTimeline({ badgeFamily, earnedBadgeIds }: BadgeEvolutionTimelineProps) {
  const sortedBadges = [...badgeFamily].sort((a, b) => {
    // If levels are different, sort by level
    const aLevel = a.level ?? 1;
    const bLevel = b.level ?? 1;
    if (aLevel !== bLevel) {
      return aLevel - bLevel;
    }
    
    // If tiers are different, sort by tier priority
    const tierPriority: Record<string, number> = {
      'founder': 4,
      'platinum': 3,
      'gold': 2,
      'silver': 1,
      'bronze': 0
    };
    
    const aTierValue = tierPriority[a.tier as keyof typeof tierPriority] || 0;
    const bTierValue = tierPriority[b.tier as keyof typeof tierPriority] || 0;
    
    if (aTierValue !== bTierValue) {
      return aTierValue - bTierValue; // Lowest tier first in timeline
    }
    
    // Otherwise sort by points required
    const aPoints = a.points ?? 0;
    const bPoints = b.points ?? 0;
    return aPoints - bPoints;
  });
  
  if (sortedBadges.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed rounded-lg">
        <p className="text-gray-500">No badges available in this evolution path.</p>
      </div>
    );
  }
  
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-200 via-amber-200 to-purple-200 opacity-50 rounded-full" />
      
      <div className="grid grid-cols-1 gap-8 py-4">
        {sortedBadges.map((badge, index) => {
          const isEarned = earnedBadgeIds.includes(badge.id);
          const isLast = index === sortedBadges.length - 1;
          const nextBadge = !isLast ? sortedBadges[index + 1] : null;
          
          return (
            <div key={badge.id} className="relative">
              {/* Timeline dot */}
              <div 
                className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full z-10 ${
                  isEarned ? 'bg-amber-500' : 'bg-gray-300'
                }`}
              />
              
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 items-center ${
                index % 2 === 0 ? '' : 'md:grid-cols-[1fr_auto_1fr] md:[direction:rtl]'
              }`}>
                <div className={`flex justify-center md:justify-end ${
                  index % 2 === 0 ? 'md:col-start-1' : 'md:col-start-3 md:[direction:ltr]'
                }`}>
                  {badge.tier === 'founder' ? (
                    <FounderBadge
                      badge={{
                        ...badge,
                        tier: badge.tier || 'founder',
                        level: badge.level || 1,
                        points: badge.points || 0
                      }} 
                      earned={isEarned}
                      size="md"
                    />
                  ) : (
                    <GenericBadge 
                      badge={{
                        ...badge,
                        tier: badge.tier || 'bronze',
                        level: badge.level || 1,
                        points: badge.points || 0
                      }} 
                      earned={isEarned}
                      size="md"
                    />
                  )}
                </div>
                
                <div className="flex justify-center">
                  <div className="h-full" />
                </div>
                
                <div className={`${
                  index % 2 === 0 ? 'md:col-start-3 md:text-left' : 'md:col-start-1 md:text-right md:[direction:ltr]'
                }`}>
                  <h3 className="font-medium">{badge.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                  
                  <div className="mt-2 text-sm">
                    <span className={`inline-block px-2 py-0.5 rounded-full ${
                      isEarned ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {isEarned ? 'Earned' : `${badge.points} points required`}
                    </span>
                  </div>
                  
                  {badge.requirement && (
                    <p className="mt-2 text-xs text-gray-500 italic">
                      "{badge.requirement}"
                    </p>
                  )}
                </div>
              </div>
              
              {!isLast && nextBadge && (
                <div className="flex justify-center mt-6 mb-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{badge.points} points</span>
                    <ArrowRight className="h-3 w-3" />
                    <span>{nextBadge.points} points</span>
                  </div>
                </div>
              )}
              
              {!isLast && <Separator className="my-4" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}