import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/lib/types';
import FounderBadge from '@/components/badges/FounderBadge';
import GenericBadge from '@/components/badges/GenericBadge';

interface BadgeEvolutionTimelineProps {
  badgeFamily: Badge[];
  earnedBadgeIds?: number[];
  className?: string;
}

export default function BadgeEvolutionTimeline({
  badgeFamily,
  earnedBadgeIds = [],
  className
}: BadgeEvolutionTimelineProps) {
  // Sort badges by level
  const sortedBadges = [...badgeFamily].sort((a, b) => (a.level || 0) - (b.level || 0));
  
  // Check if a badge is earned
  const isBadgeEarned = (id: number) => earnedBadgeIds.includes(id);
  
  return (
    <div className={cn("w-full", className)}>
      <h3 className="text-lg font-semibold mb-4">Badge Evolution Path</h3>
      
      <div className="flex flex-col md:flex-row justify-start items-center space-y-4 md:space-y-0 md:space-x-4">
        {sortedBadges.map((badge, index) => (
          <div key={badge.id} className="flex flex-col md:flex-row items-center">
            {/* Badge with its earned status */}
            <div className="flex flex-col items-center">
              {badge.tier === 'founder' ? (
                <FounderBadge 
                  badge={badge} 
                  enhanced={isBadgeEarned(badge.id)} 
                  size="md" 
                />
              ) : (
                <GenericBadge 
                  badge={badge} 
                  earned={isBadgeEarned(badge.id)} 
                  size="md" 
                />
              )}
              <div className="mt-1 text-center">
                <span className="text-xs text-muted-foreground">
                  Level {badge.level || 1}
                </span>
              </div>
            </div>
            
            {/* Arrow between badges, except after the last one */}
            {index < sortedBadges.length - 1 && (
              <div className="flex items-center justify-center transform rotate-90 md:rotate-0 md:ml-2">
                <ChevronRight 
                  className={cn(
                    "h-6 w-6 mx-2",
                    isBadgeEarned(badge.id) ? "text-primary" : "text-muted-foreground opacity-50"
                  )} 
                />
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-muted rounded-md">
        <h4 className="font-medium mb-2">How to Progress</h4>
        <ul className="list-disc list-inside space-y-2 text-sm">
          {sortedBadges.map((badge) => (
            <li key={`req-${badge.id}`} className={cn(
              isBadgeEarned(badge.id) ? "text-muted-foreground line-through" : ""
            )}>
              <span className="font-medium">{badge.name} (Level {badge.level || 1})</span>: {badge.requirement}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}