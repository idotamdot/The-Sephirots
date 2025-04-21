import { Badge } from "@shared/schema";
import BadgeDisplay from "./BadgeDisplay";
import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface BadgeCollectionProps {
  badges: Badge[];
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  showAll?: boolean;
}

export default function BadgeCollection({
  badges,
  title = "Badges",
  description,
  size = "md",
  showAll = false,
}: BadgeCollectionProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const openBadgeDetail = (badge: Badge) => {
    setSelectedBadge(badge);
    setIsDialogOpen(true);
  };
  
  // Sort badges by tier and then by level
  const sortedBadges = [...badges].sort((a, b) => {
    const tierOrder = { founder: 1, platinum: 2, gold: 3, silver: 4, bronze: 5 };
    const tierA = tierOrder[a.tier] || 999;
    const tierB = tierOrder[b.tier] || 999;
    
    if (tierA === tierB) {
      return b.level - a.level;
    }
    
    return tierA - tierB;
  });
  
  const displayBadges = showAll ? sortedBadges : sortedBadges.slice(0, 5);
  const hasMoreBadges = !showAll && sortedBadges.length > 5;
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div>
      {title && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
      )}
      
      {badges.length === 0 ? (
        <div className="text-center py-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500">No badges earned yet</p>
          <p className="text-sm text-gray-400 mt-1">Participate in the community to earn badges</p>
        </div>
      ) : (
        <>
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {displayBadges.map((badge) => (
              <motion.div key={badge.id} variants={item}>
                <BadgeDisplay
                  badge={badge}
                  size={size}
                  enhanced={badge.enhanced}
                  showDetails={true}
                  onClick={() => openBadgeDetail(badge)}
                />
              </motion.div>
            ))}
            
            {hasMoreBadges && (
              <motion.div 
                variants={item}
                className="flex items-center justify-center"
              >
                <button
                  onClick={() => {/* Navigate to full badges page */}}
                  className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <span>+{sortedBadges.length - 5}</span>
                </button>
              </motion.div>
            )}
          </motion.div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-950 to-indigo-950 text-white border border-purple-500/30">
              <DialogHeader>
                <DialogTitle className="text-amber-400">Badge Details</DialogTitle>
                <DialogDescription className="text-gray-300">
                  Learn about this badge and how it was earned
                </DialogDescription>
              </DialogHeader>
              
              {selectedBadge && (
                <div className="flex flex-col items-center p-4">
                  <BadgeDisplay badge={selectedBadge} size="lg" enhanced={selectedBadge.enhanced} />
                  
                  <div className="mt-6 w-full">
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-purple-300">Description</h3>
                      <p className="mt-1 text-sm text-gray-300">{selectedBadge.description}</p>
                    </div>
                    
                    {selectedBadge.symbolism && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-purple-300">Symbolism</h3>
                        <p className="mt-1 text-sm text-gray-300 italic">{selectedBadge.symbolism}</p>
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-purple-300">Requirement</h3>
                      <p className="mt-1 text-sm text-gray-300">{selectedBadge.requirement}</p>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-400 mt-6">
                      <div>
                        <span className="text-purple-300">Tier: </span>
                        <span className="capitalize">{selectedBadge.tier}</span>
                      </div>
                      <div>
                        <span className="text-purple-300">Level: </span>
                        <span>{selectedBadge.level}</span>
                      </div>
                      <div>
                        <span className="text-purple-300">Points: </span>
                        <span>{selectedBadge.points}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}