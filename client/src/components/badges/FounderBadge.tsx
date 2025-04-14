import { Badge as BadgeType } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle, Award, Shield } from "lucide-react";

interface FounderBadgeProps {
  badge: BadgeType;
  enhanced?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function FounderBadge({
  badge,
  enhanced = false,
  size = "md",
  className,
}: FounderBadgeProps) {
  // Define sizes based on the size prop
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-40 h-40", 
    lg: "w-52 h-52",
  };

  // Generate badge icon or fallback based on badge properties
  const getBadgeSymbol = () => {
    // Use badge.icon if available
    if (badge.icon) {
      if (badge.icon === "dove") {
        return <DoveIcon className="h-12 w-12 text-white" />;
      } else if (badge.icon === "shield") {
        return <Shield className="h-12 w-12" />;
      } else if (badge.icon === "award") {
        return <Award className="h-12 w-12" />;
      }
      // Return a generic icon if the specific icon isn't found
      return <CheckCircle className="h-12 w-12" />;
    }
    // Default to a general award icon
    return <Award className="h-12 w-12" />;
  };

  // Level 2+ founder badges get particle effects
  const isAscended = badge.level && badge.level >= 2;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div
        className={cn(
          "relative rounded-full flex items-center justify-center",
          "bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600",
          "hover:scale-105 transition-transform duration-300 ease-in-out",
          sizeClasses[size],
          enhanced && "founder-badge",
          enhanced && !isAscended && "founder-badge-glow",
          enhanced && isAscended && "founder-badge-ascended founder-badge-particles"
        )}
      >
        {/* Particles for ascended badges */}
        {enhanced && isAscended && (
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div className="orbit-particle orbit-1"></div>
            <div className="orbit-particle orbit-2"></div>
            <div className="orbit-particle orbit-3"></div>
            <div className="orbit-particle orbit-4"></div>
            <div className="orbit-particle orbit-5"></div>
          </div>
        )}
        
        {/* Fractal halo effect */}
        <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm"></div>
        
        {/* Orb in the center */}
        <div className={cn(
          "absolute w-3/4 h-3/4 rounded-full",
          "bg-gradient-to-br from-violet-600 to-indigo-700",
          "flex items-center justify-center",
          "shadow-inner",
          enhanced && "animate-subtle-pulse"
        )}>
          <div className="text-white flex flex-col items-center justify-center relative z-10">
            {getBadgeSymbol()}
            {size !== "sm" && (
              <span className="font-bold text-sm mt-2">
                {badge.level && badge.level > 1 ? `Founder L${badge.level}` : "Founder"}
              </span>
            )}
          </div>
        </div>
        
        {/* Enhanced glow overlay */}
        {enhanced && (
          <div className={cn(
            "absolute inset-0 rounded-full",
            isAscended ? "bg-yellow-400/30 blur-lg" : "bg-violet-500/30 blur-md",
            isAscended ? "animate-pulse-fast" : "animate-pulse-slow"
          )}></div>
        )}
        
        {/* Extra outer glow for more prominence - only for enhanced badges */}
        {enhanced && (
          <div className={cn(
            "absolute -inset-2 rounded-full opacity-40",
            isAscended ? "bg-yellow-400/20 blur-xl" : "bg-violet-500/20 blur-xl",
            "animate-pulse-slow"
          )}></div>
        )}
        
        {/* Gold border for enhanced badges */}
        {enhanced && (
          <div className={cn(
            "absolute inset-0 rounded-full border-2",
            isAscended ? "border-yellow-300" : "border-violet-300",
            "opacity-70"
          )}></div>
        )}
      </div>
      
      {/* Badge info displayed below the badge */}
      <div className="mt-3 text-center">
        <h3 className={cn(
          "font-bold text-base",
          enhanced && "text-gradient bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500"
        )}>{badge.name}</h3>
        <p className="text-xs text-muted-foreground">{badge.category}</p>
      </div>
    </div>
  );
}

// Custom dove icon for the Harmony Founder badge
function DoveIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor"
      className={className}
    >
      {/* Radiating lines for the halo */}
      <g stroke="currentColor" strokeWidth="0.5" strokeLinecap="round">
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="17" y1="3" x2="16" y2="5" />
        <line x1="21" y1="7" x2="19" y2="8" />
        <line x1="7" y1="3" x2="8" y2="5" />
        <line x1="3" y1="7" x2="5" y2="8" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="23" y1="12" x2="21" y2="12" />
      </g>

      {/* Dove body and wing */}
      <path 
        fill="currentColor" 
        d="M12,5c-1.4,0-2.5,0.3-3.5,0.9C7.5,6.5,6.7,7.1,6,7.8C5.2,8.6,4.7,9.5,4.3,10.5C4,11.5,3.8,12.5,4,13.5
        c0.1,0.8,0.4,1.5,0.8,2.1c0.4,0.6,0.9,1.1,1.5,1.5c0.6,0.4,1.3,0.6,2,0.8c0.7,0.1,1.5,0.1,2.2,0.1c0.5,0,1-0.1,1.5-0.2
        c0.5-0.1,1-0.2,1.5-0.4c0.5-0.2,0.9-0.4,1.3-0.7c0.4-0.3,0.8-0.6,1.1-1c0.3-0.4,0.6-0.8,0.8-1.3c0.2-0.5,0.3-1,0.3-1.5
        c0-0.5-0.1-1-0.3-1.5c-0.2-0.5-0.4-0.9-0.7-1.3c-0.3-0.4-0.7-0.7-1.1-1c-0.4-0.3-0.9-0.5-1.4-0.7C13.5,7.6,13,7.5,12.5,7.4
        C12.3,7.4,12.2,7.3,12,7.3"
      />
      
      {/* Wing detail */}
      <path 
        fill="white" 
        stroke="currentColor" 
        strokeWidth="0.2"
        d="M8,11c0.5-0.8,1.2-1.5,2-2c0.8-0.5,1.7-0.8,2.7-0.9c0.3,0,0.5,0,0.8,0C13.8,8.1,14,8.2,14.2,8.3
        c0.2,0.1,0.4,0.2,0.6,0.4c0.2,0.2,0.3,0.3,0.4,0.5c0.1,0.2,0.2,0.4,0.2,0.6c0,0.2,0,0.4,0,0.6c-0.1,0.4-0.2,0.7-0.4,1
        c-0.2,0.3-0.5,0.6-0.8,0.8C13.9,13,13.5,13.1,13,13.2c-0.4,0.1-0.9,0.1-1.3,0c-0.4-0.1-0.8-0.2-1.2-0.4c-0.3-0.2-0.7-0.4-0.9-0.7
        C9.3,11.8,9.1,11.5,9,11.2C8.8,10.9,8.7,10.6,8.7,10.3C8.7,10,8.7,9.7,8.8,9.4"
      />
      
      {/* Eye */}
      <circle cx="9.5" cy="10" r="0.5" fill="currentColor" />
    </svg>
  );
}