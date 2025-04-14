import { useState, useEffect } from "react";
import { Badge } from "@/lib/types";
import { User } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import DoveAndStars from "@/components/icons/DoveAndStars";

interface PersonalizedBadgeProps {
  badge: Badge;
  user?: User;
  size?: "sm" | "md" | "lg" | "xl";
  enhanced?: boolean;
  showProgress?: boolean;
  showDescription?: boolean;
  interactive?: boolean;
}

const BADGE_COLORS = {
  bronze: {
    bg: "bg-gradient-to-br from-amber-300 to-amber-600",
    border: "border-amber-600",
    glow: "rgba(217, 119, 6, 0.4)",
    symbol: "#713f12"
  },
  silver: {
    bg: "bg-gradient-to-br from-gray-300 to-gray-500",
    border: "border-gray-600",
    glow: "rgba(107, 114, 128, 0.4)",
    symbol: "#1f2937"
  },
  gold: {
    bg: "bg-gradient-to-br from-yellow-300 to-amber-600",
    border: "border-amber-700",
    glow: "rgba(217, 119, 6, 0.5)",
    symbol: "#78350f"
  },
  platinum: {
    bg: "bg-gradient-to-br from-indigo-200 to-indigo-400",
    border: "border-indigo-500",
    glow: "rgba(99, 102, 241, 0.4)",
    symbol: "#3730a3"
  },
  founder: {
    bg: "bg-gradient-to-br from-purple-300 to-purple-600",
    border: "border-purple-700",
    glow: "rgba(126, 34, 206, 0.5)",
    symbol: "#581c87"
  }
};

const SEPHIROT_COLORS = {
  "Keter": "#f9fafb", // Crown - Pure white/silver
  "Chokmah": "#93c5fd", // Wisdom - Light blue
  "Binah": "#a78bfa", // Understanding - Purple
  "Chesed": "#60a5fa", // Loving-kindness - Blue
  "Gevurah": "#ef4444", // Strength - Red
  "Tiferet": "#fcd34d", // Beauty/Harmony - Gold/yellow
  "Netzach": "#34d399", // Victory/Eternity - Green
  "Hod": "#f97316", // Splendor - Orange
  "Yesod": "#a855f7", // Foundation - Purple
  "Malkuth": "#4b5563", // Kingdom - Earth/gray
  "Da'at": "#e5e7eb", // Knowledge (non-traditional) - Silver/gray
};

function getSephirotCode(badge: Badge): string {
  if (!badge.symbolism) return "";
  
  // Extract Sephirot name from the symbolism field
  const sephirotMatches = badge.symbolism.match(/(Keter|Chokmah|Binah|Chesed|Gevurah|Tiferet|Netzach|Hod|Yesod|Malkuth|Da'at)/);
  return sephirotMatches ? sephirotMatches[0] : "";
}

function getSephirotColor(badge: Badge): string {
  const sephirot = getSephirotCode(badge);
  return SEPHIROT_COLORS[sephirot as keyof typeof SEPHIROT_COLORS] || "#9333ea"; // Default purple
}

function getHaloEffect(badge: Badge, enhanced?: boolean): string {
  const sephirotCode = getSephirotCode(badge); 
  const sephirotColor = getSephirotColor(badge);
  
  if (enhanced) {
    return `radial-gradient(circle, ${sephirotColor}40 10%, transparent 70%)`;
  }
  
  return "none";
}

function getBadgeSize(size?: string): string {
  switch(size) {
    case "sm": return "w-16 h-16";
    case "md": return "w-24 h-24";
    case "lg": return "w-32 h-32";
    case "xl": return "w-40 h-40";
    default: return "w-24 h-24";
  }
}

function extractCategoryFromName(badge: Badge): string {
  const match = badge.name.match(/\((.*?)\)$/);
  return match ? match[1] : "";
}

export default function PersonalizedBadge({ 
  badge, 
  user, 
  size = "md",
  enhanced = false, 
  showProgress = false,
  showDescription = false,
  interactive = false
}: PersonalizedBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [personalizedSymbol, setPersonalizedSymbol] = useState<string | null>(null);
  
  const { data: userBadges } = useQuery({
    queryKey: user ? [`/api/users/${user.id}/badges`] : ["/api/badges/dummy"],
    enabled: !!user
  });

  // Calculate progress for this badge (simplified for demo)
  useEffect(() => {
    if (showProgress) {
      // Placeholder logic - in real implementation, would be based on actual progress
      const calculatedProgress = Math.floor(Math.random() * 100);
      setProgress(calculatedProgress);
    }
  }, [badge, user, showProgress]);

  // Generate personalized elements based on user and badge
  useEffect(() => {
    if (user && badge) {
      // In a real implementation, would make API call to generate personalized symbol
      // For demo, we'll use a placeholder based on badge tier and user data
      setPersonalizedSymbol(`${(badge.tier || 'bronze').charAt(0).toUpperCase()}${user.id}`);
    }
  }, [user, badge]);

  const tierColors = BADGE_COLORS[(badge.tier || 'bronze') as keyof typeof BADGE_COLORS];
  const sephirotColor = getSephirotColor(badge);
  const badgeSize = getBadgeSize(size);
  const category = extractCategoryFromName(badge);
  
  // Handle animation start
  const handleAnimationStart = () => {
    if (interactive && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    }
  };

  return (
    <div className="relative">
      <div
        className={`relative ${badgeSize} rounded-full flex items-center justify-center transition-all duration-500 ${isHovered ? 'scale-110' : ''} ${isAnimating ? 'animate-pulse' : ''}`}
        style={{ 
          background: enhanced ? `linear-gradient(135deg, ${sephirotColor}80, ${tierColors.bg.split(' ')[1]})` : tierColors.bg,
          boxShadow: enhanced ? `0 0 20px ${tierColors.glow}, 0 0 40px ${tierColors.glow}` : `0 0 10px ${tierColors.glow}`,
          border: `2px solid ${enhanced ? sephirotColor : tierColors.border.split('-')[1]}`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleAnimationStart}
      >
        <div 
          className="absolute inset-0 rounded-full" 
          style={{ 
            background: getHaloEffect(badge, enhanced),
            opacity: isHovered || isAnimating ? 0.8 : 0.4,
            transition: "opacity 0.5s ease"
          }}
        />

        {/* Badge Icon */}
        {badge.icon === 'dove' ? (
          <DoveAndStars 
            size={size === "sm" ? "md" : size === "md" ? "lg" : "xl"} 
            fillColor={enhanced ? sephirotColor : "#9333ea"}
            showStars={enhanced}
            withGlow={enhanced}
            glowColor={`${sephirotColor}80`}
          />
        ) : (
          <i 
            className={`${badge.icon} text-2xl`} 
            style={{ color: enhanced ? sephirotColor : tierColors.symbol }}
          />
        )}

        {/* Personalized Symbol (if available) */}
        {personalizedSymbol && enhanced && (
          <div 
            className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-white bg-opacity-50 flex items-center justify-center text-xs font-bold"
            style={{ color: sephirotColor }}
          >
            {personalizedSymbol}
          </div>
        )}

        {/* Sephirot symbol for badge category */}
        {category && (
          <div 
            className="absolute top-1 left-1 text-xs font-semibold"
            style={{ color: enhanced ? "white" : tierColors.symbol }}
          >
            {category.substring(0, 2)}
          </div>
        )}
      </div>

      {/* Progress bar (if applicable) */}
      {showProgress && (
        <div className="mt-2 w-full">
          <Progress value={progress} className="h-1.5" />
          <p className="text-xs text-center mt-1 text-gray-600">{progress}%</p>
        </div>
      )}

      {/* Description (if enabled) */}
      {showDescription && (
        <div className={`mt-2 text-center ${isHovered ? 'opacity-100' : 'opacity-80'} transition-opacity duration-300`}>
          <p className="font-medium text-sm">{badge.name}</p>
          {isHovered && (
            <p className="text-xs text-gray-600 mt-1 max-w-[200px]">{badge.description.substring(0, 100)}{badge.description.length > 100 ? '...' : ''}</p>
          )}
        </div>
      )}
    </div>
  );
}