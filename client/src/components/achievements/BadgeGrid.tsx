import { Badge } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import FounderBadge from "@/components/badges/FounderBadge";

interface BadgeGridProps {
  badges: Badge[];
  earnedBadgeIds?: number[];
  title?: string;
  showCategories?: boolean;
}

export default function BadgeGrid({ 
  badges, 
  earnedBadgeIds = [], 
  title,
  showCategories = true
}: BadgeGridProps) {
  if (!badges || badges.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <i className="ri-award-line text-3xl mb-2"></i>
        <p>No badges available yet.</p>
      </div>
    );
  }
  
  // Group badges by category if showCategories is true
  const badgesByCategory: Record<string, Badge[]> = {};
  
  if (showCategories) {
    badges.forEach(badge => {
      if (!badgesByCategory[badge.category]) {
        badgesByCategory[badge.category] = [];
      }
      badgesByCategory[badge.category].push(badge);
    });
  }
  
  // Function to check if badge is earned
  const isBadgeEarned = (badgeId: number) => earnedBadgeIds.includes(badgeId);
  
  // Function to get badge color based on category
  const getBadgeColor = (category: string) => {
    switch (category) {
      case 'participation':
        return "bg-accent-100 text-accent-600";
      case 'social':
        return "bg-secondary-100 text-secondary-600";
      case 'creation':
        return "bg-primary-100 text-primary-600";
      case 'community':
        return "bg-indigo-100 text-indigo-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };
  
  // Function to get category title
  const getCategoryTitle = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };
  
  // Render the grid based on whether to show categories
  if (showCategories) {
    return (
      <div className="space-y-8">
        {title && <h2 className="text-xl font-heading font-semibold mb-4">{title}</h2>}
        
        {Object.entries(badgesByCategory).map(([category, categoryBadges]) => (
          <div key={category}>
            <h3 className="text-lg font-medium mb-4">{getCategoryTitle(category)} Badges</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categoryBadges.map((badge) => (
                <TooltipProvider key={badge.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Card className={cn(
                        "text-center hover:shadow-md transition-shadow cursor-help",
                        isBadgeEarned(badge.id) ? "border-accent-200" : "opacity-70"
                      )}>
                        <CardContent className="p-4">
                          <div className={cn(
                            "w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3",
                            getBadgeColor(badge.category),
                            !isBadgeEarned(badge.id) && "grayscale"
                          )}>
                            <i className={`${badge.icon} text-2xl`}></i>
                          </div>
                          <h4 className="font-medium text-sm">{badge.name}</h4>
                          {isBadgeEarned(badge.id) && (
                            <div className="mt-2 text-xs text-success flex items-center justify-center">
                              <i className="ri-check-line mr-1"></i>
                              Earned
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div className="space-y-2">
                        <p className="font-medium">{badge.name}</p>
                        <p className="text-sm">{badge.description}</p>
                        <p className="text-xs text-muted-foreground">
                          <strong>How to earn:</strong> {badge.requirement}
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div>
        {title && <h2 className="text-xl font-heading font-semibold mb-4">{title}</h2>}
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {badges.map((badge) => (
            <TooltipProvider key={badge.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className={cn(
                    "text-center hover:shadow-md transition-shadow cursor-help",
                    isBadgeEarned(badge.id) ? "border-accent-200" : "opacity-70"
                  )}>
                    <CardContent className="p-4">
                      <div className={cn(
                        "w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3",
                        getBadgeColor(badge.category),
                        !isBadgeEarned(badge.id) && "grayscale"
                      )}>
                        <i className={`${badge.icon} text-2xl`}></i>
                      </div>
                      <h4 className="font-medium text-sm">{badge.name}</h4>
                      {isBadgeEarned(badge.id) && (
                        <div className="mt-2 text-xs text-success flex items-center justify-center">
                          <i className="ri-check-line mr-1"></i>
                          Earned
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-2">
                    <p className="font-medium">{badge.name}</p>
                    <p className="text-sm">{badge.description}</p>
                    <p className="text-xs text-muted-foreground">
                      <strong>How to earn:</strong> {badge.requirement}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    );
  }
}
