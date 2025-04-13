import { Badge as BadgeType } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BadgeDisplayProps {
  title: string;
  badges: BadgeType[];
  nextBadge?: {
    name: string;
    requirement: string;
  };
  className?: string;
}

export default function BadgeDisplay({ 
  title, 
  badges, 
  nextBadge,
  className 
}: BadgeDisplayProps) {
  const displayBadges = badges.slice(0, 3);
  const maxBadges = 3;
  
  // Fill with locked badges if we don't have enough
  const lockedBadges = maxBadges - displayBadges.length;
  
  return (
    <Card className={className}>
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-700">{title}</h3>
          <a href="#" className="text-xs text-primary-600 hover:text-primary-700">
            View All
          </a>
        </div>
        
        <div className="flex space-x-3">
          {displayBadges.map((badge) => (
            <div key={badge.id} className="flex flex-col items-center">
              <div 
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-1",
                  badge.category === 'participation' && "bg-accent-100 text-accent-600",
                  badge.category === 'social' && "bg-secondary-100 text-secondary-600"
                )}
              >
                <i className={`${badge.icon} text-xl`}></i>
              </div>
              <span className="text-xs text-gray-600">{badge.name}</span>
            </div>
          ))}
          
          {/* Locked badges */}
          {Array(lockedBadges).fill(0).map((_, index) => (
            <div key={`locked-${index}`} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center mb-1">
                <i className="ri-lock-line text-xl"></i>
              </div>
              <span className="text-xs text-gray-600">Locked</span>
            </div>
          ))}
        </div>
        
        {nextBadge && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-700">
              <strong>Next Badge:</strong>{" "}
              <span className="text-primary-600">{nextBadge.name}</span> - {nextBadge.requirement}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
