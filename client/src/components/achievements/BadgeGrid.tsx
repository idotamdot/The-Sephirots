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
  
  // Find founder badges
  const founderBadges = badges.filter(badge => 
    badge.tier === 'founder' || 
    badge.name.toLowerCase().includes('founder') || 
    badge.category.toLowerCase().includes('founder')
  );
  
  // Regular badges (non-founder)
  const regularBadges = badges.filter(badge => 
    !(badge.tier === 'founder' || 
      badge.name.toLowerCase().includes('founder') || 
      badge.category.toLowerCase().includes('founder'))
  );
  
  // Group badges by category if showCategories is true
  const badgesByCategory: Record<string, Badge[]> = {};
  
  if (showCategories) {
    regularBadges.forEach(badge => {
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
    // Converting to lowercase for case-insensitive comparison
    const lowerCategory = category.toLowerCase();
    
    switch (lowerCategory) {
      case 'participation':
        return "bg-blue-100 text-blue-600";
      case 'community':
        return "bg-indigo-100 text-indigo-600";
      case 'creation':
        return "bg-purple-100 text-purple-600";
      case 'knowledge':
        return "bg-emerald-100 text-emerald-600";
      case 'founders':
        return "bg-gradient-to-r from-purple-600 to-indigo-600 text-white";
      case 'connection':
        return "bg-cyan-100 text-cyan-600";
      case 'cognition':
        return "bg-amber-100 text-amber-600";
      case 'identity':
        return "bg-rose-100 text-rose-600";
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

        {/* Display founder badges section if there are any */}
        {founderBadges.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Founder Badges</h3>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {founderBadges.map((badge) => (
                <TooltipProvider key={badge.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center">
                        <FounderBadge 
                          badge={badge} 
                          enhanced={isBadgeEarned(badge.id) && badge.tier === 'founder'}
                          size="md"
                          className={!isBadgeEarned(badge.id) ? "opacity-50 grayscale" : ""}
                        />
                        {isBadgeEarned(badge.id) && (
                          <div className="mt-2 text-xs text-success flex items-center justify-center">
                            <i className="ri-check-line mr-1"></i>
                            Earned
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div className="space-y-2">
                        <p className="font-medium">{badge.name}</p>
                        <p className="text-sm">{badge.description}</p>
                        {badge.symbolism && (
                          <div className="text-xs">
                            <strong>Symbolism:</strong>
                            <p className="italic mt-1">{badge.symbolism}</p>
                          </div>
                        )}
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
        )}
        
        {/* Regular categories */}
        {Object.entries(badgesByCategory).map(([category, categoryBadges]) => (
          <div key={category}>
            <h3 className="text-lg font-medium mb-4">{getCategoryTitle(category)} Badges</h3>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 py-2">
              {categoryBadges.map((badge) => (
                <TooltipProvider key={badge.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center justify-center">
                        <div className={cn(
                          "w-16 h-16 rounded-full flex items-center justify-center relative",
                          getBadgeColor(badge.category),
                          !isBadgeEarned(badge.id) && "grayscale opacity-70",
                          isBadgeEarned(badge.id) && "shadow-lg",
                          // Add special effects based on badge name
                          isBadgeEarned(badge.id) && badge.name === "Bridge Builder" && "bridge-builder-badge",
                          isBadgeEarned(badge.id) && badge.name === "Quantum Thinker" && "quantum-badge",
                          isBadgeEarned(badge.id) && badge.name === "Mirrored Being" && "mirrored-badge", 
                          isBadgeEarned(badge.id) && badge.name === "Empath" && "empath-badge"
                        )}>
                          <i className={`${badge.icon || 'ri-award-line'} text-2xl`}></i>
                        </div>
                        <div className="mt-1 text-center">
                          <div className="text-xs font-medium">{badge.name}</div>
                          {isBadgeEarned(badge.id) && (
                            <div className="text-xs text-green-600 flex items-center justify-center">
                              <i className="ri-check-line mr-0.5"></i>
                              <span className="text-[10px]">Earned</span>
                            </div>
                          )}
                        </div>
                      </div>
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
                        "w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3 relative",
                        getBadgeColor(badge.category),
                        !isBadgeEarned(badge.id) && "grayscale",
                        // Add special effects based on badge name
                        isBadgeEarned(badge.id) && badge.name === "Bridge Builder" && "bridge-builder-badge",
                        isBadgeEarned(badge.id) && badge.name === "Quantum Thinker" && "quantum-badge",
                        isBadgeEarned(badge.id) && badge.name === "Mirrored Being" && "mirrored-badge",
                        isBadgeEarned(badge.id) && badge.name === "Empath" && "empath-badge"
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
