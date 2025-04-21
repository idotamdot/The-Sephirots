import { cn } from "@/lib/utils";
import { Badge } from "@shared/schema";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BadgeDisplayProps {
  badge: Badge;
  size?: "sm" | "md" | "lg" | "xl";
  showDetails?: boolean;
  enhanced?: boolean;
  isDonation?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function BadgeDisplay({
  badge,
  size = "md",
  showDetails = false,
  enhanced = false,
  isDonation = false,
  className,
  onClick,
}: BadgeDisplayProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Occasionally animate donation badges
  useEffect(() => {
    if (isDonation) {
      const interval = setInterval(() => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 2000);
      }, Math.random() * 10000 + 15000); // Random interval between 15-25 seconds
      
      return () => clearInterval(interval);
    }
  }, [isDonation]);
  
  // Map badge tier to colors
  const tierColors = {
    bronze: "from-amber-700 to-amber-800 border-amber-500",
    silver: "from-gray-400 to-gray-500 border-gray-300",
    gold: "from-yellow-500 to-yellow-600 border-yellow-400",
    platinum: "from-indigo-400 to-indigo-500 border-indigo-300",
    founder: "from-purple-600 to-indigo-700 border-purple-400",
  };
  
  // Additional colors for donation badges
  const donationColors = {
    'seed-planter': "from-emerald-500 to-emerald-700 border-emerald-400",
    'tree-tender': "from-amber-500 to-amber-700 border-amber-400",
    'light-guardian': "from-purple-500 to-indigo-600 border-purple-400"
  };
  
  // Map size to dimensions
  const sizeDimensions = {
    sm: "w-12 h-12 text-xs",
    md: "w-20 h-20 text-sm",
    lg: "w-32 h-32 text-base",
    xl: "w-40 h-40 text-lg"
  };
  
  // Get icon component based on badge icon
  const renderBadgeIcon = () => {
    if (badge.icon === "seed") {
      return (
        <svg viewBox="0 0 24 24" fill="none" className="w-3/5 h-3/5 text-white">
          <path
            d="M12 22V16M12 16C10.8954 16 10 15.1046 10 14V7.5C10 5.01472 12.0147 3 14.5 3C16.9853 3 19 5.01472 19 7.5V14C19 15.1046 18.1046 16 17 16H12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 11.5V9.5C6 8.39543 6.89543 7.5 8 7.5H10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path 
            d="M6 14.5H8M6 17.5H8" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    } else if (badge.icon === "tree") {
      return (
        <svg viewBox="0 0 24 24" fill="none" className="w-3/5 h-3/5 text-white">
          <path
            d="M12 22V14M12 14L18 9.5L12 5L6 9.5L12 14Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 5V2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 17.5L8 15M19 17.5L16 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    } else if (badge.icon === "light") {
      return (
        <svg viewBox="0 0 24 24" fill="none" className="w-3/5 h-3/5 text-white">
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 4V2M12 22V20M4 12H2M22 12H20M19.778 19.778L18.364 18.364M4.222 4.222L5.636 5.636M19.778 4.222L18.364 5.636M4.222 19.778L5.636 18.364"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    } else if (badge.icon === "dove") {
      return (
        <svg viewBox="0 0 24 24" fill="none" className="w-3/5 h-3/5 text-white">
          <path
            d="M22 2L15 9M15 9V3M15 9H9M2 22L9 15M9 15H15M9 15V21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    } else if (badge.icon === "star") {
      return (
        <svg viewBox="0 0 24 24" fill="none" className="w-3/5 h-3/5 text-white">
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    } else if (badge.icon === "atom") {
      return (
        <svg viewBox="0 0 24 24" fill="none" className="w-3/5 h-3/5 text-white">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 5C16.4183 5 20 8.13401 20 12C20 15.866 16.4183 19 12 19"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 19C7.58172 19 4 15.866 4 12C4 8.13401 7.58172 5 12 5"
            stroke="currentColor"
            strokeWidth="2"
            transform="rotate(60 12 12)"
          />
          <path
            d="M12 19C7.58172 19 4 15.866 4 12C4 8.13401 7.58172 5 12 5"
            stroke="currentColor"
            strokeWidth="2"
            transform="rotate(-60 12 12)"
          />
        </svg>
      );
    } else if (badge.icon === "people") {
      return (
        <svg viewBox="0 0 24 24" fill="none" className="w-3/5 h-3/5 text-white">
          <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="2" />
          <circle cx="15" cy="7" r="3" stroke="currentColor" strokeWidth="2" />
          <path
            d="M5 21V16C5 14.8954 5.89543 14 7 14H11H17C18.1046 14 19 14.8954 19 16V21"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      );
    } else if (badge.icon === "brain") {
      return (
        <svg viewBox="0 0 24 24" fill="none" className="w-3/5 h-3/5 text-white">
          <path
            d="M12 4.5C11.743 3.77101 11.0844 2.5 9 2.5C6.5 2.5 5.5 4.73858 5.5 6.5C5.5 6.89812 5.56664 7.27256 5.68212 7.62193C4.66839 8.22486 4 9.26933 4 10.5C4 11.8366 4.78555 12.9616 5.9295 13.5282C5.64598 14.0324 5.5 14.5938 5.5 15.2C5.5 17.2 7 18.5 9 18.5C9.80267 18.5 10.5339 18.2676 11.1221 17.8768C11.3912 19.1066 12.5141 20 13.8045 20C15.0119 20 16.0726 19.2499 16.4019 18.1682C16.436 18.1731 16.4704 18.1755 16.505 18.1755C17.8845 18.1755 19 17.0601 19 15.6805C19 15.0784 18.7837 14.5234 18.4237 14.0862C19.3293 13.5117 20 12.5138 20 11.5C20 10.1 18.84 9 17.5 9C17.2636 9 17.0331 9.02904 16.8127 9.08447C16.9368 8.74131 17 8.37442 17 8C17 6.067 15.433 4.5 13.5 4.5C13.3246 4.5 13.1533 4.51414 12.9873 4.54117C12.7903 4.52051 12.5884 4.5 12.3833 4.5C12.2516 4.5 12.1228 4.50394 12 4.5Z"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      );
    } else if (badge.icon === "mirror") {
      return (
        <svg viewBox="0 0 24 24" fill="none" className="w-3/5 h-3/5 text-white">
          <path
            d="M9 21H7C4.79086 21 3 19.2091 3 17V10C3 7.79086 4.79086 6 7 6H9M15 21H17C19.2091 21 21 19.2091 21 17V10C21 7.79086 19.2091 6 17 6H15M7 12H17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    } else if (badge.icon === "alien") {
      return (
        <svg viewBox="0 0 24 24" fill="none" className="w-3/5 h-3/5 text-white">
          <path
            d="M12 17C9.23858 17 7 14.7614 7 12V11C7 8.23858 9.23858 6 12 6C14.7614 6 17 8.23858 17 11V12C17 14.7614 14.7614 17 12 17Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="9" cy="11" r="1" fill="currentColor" />
          <circle cx="15" cy="11" r="1" fill="currentColor" />
          <path
            d="M8 17L6 22M16 17L18 22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    } else {
      // Default icon
      return (
        <svg viewBox="0 0 24 24" fill="none" className="w-3/5 h-3/5 text-white">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 8V12L15 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    }
  };
  
  // Determine if this is a donation badge by name
  const isDonationBadge = 
    badge.name.toLowerCase().includes('seed planter') || 
    badge.name.toLowerCase().includes('tree tender') || 
    badge.name.toLowerCase().includes('light guardian');
  
  // Get color scheme based on badge type
  let badgeColorClass = tierColors[badge.tier] || tierColors.bronze;
  
  // Override with donation-specific colors if applicable
  if (isDonationBadge) {
    if (badge.name.toLowerCase().includes('seed planter')) {
      badgeColorClass = donationColors['seed-planter'];
    } else if (badge.name.toLowerCase().includes('tree tender')) {
      badgeColorClass = donationColors['tree-tender'];
    } else if (badge.name.toLowerCase().includes('light guardian')) {
      badgeColorClass = donationColors['light-guardian'];
    }
  }
  
  const sizeClass = sizeDimensions[size] || sizeDimensions.md;
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div
        className="relative flex flex-col items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* Badge */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          animate={isAnimating ? { 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          } : {}}
          transition={{ 
            duration: isAnimating ? 1 : 0.3,
            ease: "easeInOut" 
          }}
          className={cn(
            "rounded-full flex items-center justify-center cursor-pointer bg-gradient-to-br border-2",
            badgeColorClass,
            sizeClass,
            {
              "cursor-default": !onClick,
            }
          )}
        >
          {renderBadgeIcon()}
          
          {/* Level indicator for badges with levels */}
          {badge.level > 1 && (
            <div className="absolute bottom-0 right-0 bg-gray-900 rounded-full w-1/4 h-1/4 flex items-center justify-center text-white font-bold text-xs">
              {badge.level}
            </div>
          )}
          
          {/* Enhanced glow effect - different for donation badges */}
          {enhanced && (
            <motion.div 
              className={cn(
                "absolute inset-0 rounded-full",
                isDonationBadge ? "bg-purple-400/20" : "bg-amber-400/30"
              )}
              animate={isDonationBadge ? { 
                boxShadow: [
                  "0 0 10px 2px rgba(168, 85, 247, 0.3)",
                  "0 0 20px 6px rgba(168, 85, 247, 0.5)",
                  "0 0 10px 2px rgba(168, 85, 247, 0.3)"
                ]
              } : { 
                boxShadow: [
                  "0 0 10px 2px rgba(251, 191, 36, 0.3)",
                  "0 0 20px 6px rgba(251, 191, 36, 0.5)",
                  "0 0 10px 2px rgba(251, 191, 36, 0.3)"
                ]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          )}
          
          {/* Special donation badge effects */}
          {isDonationBadge && (
            <>
              {/* Particle effects for donation badges */}
              <AnimatePresence>
                {isAnimating && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={`particle-${i}`}
                        initial={{ 
                          x: 0, 
                          y: 0, 
                          opacity: 0.7, 
                          scale: 0.5 
                        }}
                        animate={{ 
                          x: (Math.random() - 0.5) * 60, 
                          y: (Math.random() - 0.5) * 60, 
                          opacity: 0, 
                          scale: 0
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 + Math.random() }}
                        className={cn(
                          "absolute w-2 h-2 rounded-full",
                          badge.name.toLowerCase().includes('seed planter') ? "bg-emerald-400" :
                          badge.name.toLowerCase().includes('tree tender') ? "bg-amber-400" :
                          "bg-purple-400"
                        )}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
              
              {/* Permanent subtle pulse for donation badges */}
              <motion.div
                className="absolute inset-0 rounded-full bg-white/5"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </>
          )}
        </motion.div>
        
        {/* Badge name with special styling for donation badges */}
        <div className={cn(
          "mt-2 text-center font-medium",
          isDonationBadge ? "bg-gradient-to-br from-purple-600 to-amber-500 bg-clip-text text-transparent" : ""
        )}>
          {badge.name}
        </div>
        
        {/* Badge tooltip details */}
        {isHovered && showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full z-50 rounded-lg shadow-xl p-4 w-64 text-white",
              isDonationBadge ? 
                "bg-gradient-to-br from-purple-950/95 to-indigo-950/95 border border-purple-500/30" : 
                "bg-gray-900/95"
            )}
          >
            <div className={cn(
              "text-sm font-medium",
              isDonationBadge ? "text-purple-300" : "text-amber-400"
            )}>
              {badge.name}
            </div>
            <div className="text-xs mt-1">{badge.description}</div>
            {badge.symbolism && (
              <div className="mt-2">
                <div className="text-xs font-medium text-purple-300">Symbolism:</div>
                <div className="text-xs mt-1 italic">{badge.symbolism}</div>
              </div>
            )}
            <div className="mt-2">
              <div className="text-xs font-medium text-purple-300">Requirement:</div>
              <div className="text-xs">{badge.requirement}</div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span className="capitalize">{badge.tier}</span>
              <span>{badge.points} pts</span>
            </div>
            
            {/* Special message for donation badges */}
            {isDonationBadge && (
              <div className="mt-2 pt-2 border-t border-purple-500/30 text-xs text-center text-purple-300">
                Thank you for supporting The Sephirots collective journey
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}