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
        return <DoveIcon className="h-12 w-12" />;
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

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div
        className={cn(
          "relative rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 via-purple-400 to-indigo-500",
          sizeClasses[size],
          enhanced && "ring-4 ring-yellow-300 animate-pulse-slow"
        )}
      >
        {/* Fractal halo effect */}
        <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-sm"></div>
        
        {/* Orb in the center */}
        <div className="absolute w-3/4 h-3/4 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
          <div className="text-white flex flex-col items-center justify-center">
            {getBadgeSymbol()}
            {size !== "sm" && (
              <span className="font-bold text-sm mt-2">Founder</span>
            )}
          </div>
        </div>
        
        {/* Enhanced glow overlay */}
        {enhanced && (
          <div className="absolute inset-0 rounded-full bg-yellow-500/20 blur-sm animate-pulse-slow"></div>
        )}
      </div>
      
      {/* Badge info displayed below the badge */}
      <div className="mt-3 text-center">
        <h3 className="font-bold text-base">{badge.name}</h3>
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
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M13 7 8 2 3 7l5 5" />
      <path d="M13 7h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3H9" />
      <path d="M12 22v-8" />
      <path d="M10 14v8" />
      <path d="M8 14v2" />
      <path d="M16 14v4" />
      <path d="M15 14h.4a.6.6 0 0 1 .6.6v.4" />
      <path d="M4 22v-8" />
      <path d="M6 14v4" />
      <path d="M2 14h16" />
      <path d="M22 14a2 2 0 0 0-2-2" />
      <path d="M14 14a2 2 0 0 0-2-2" />
      <path d="M20 14a2 2 0 0 1 0 4" />
      <path d="M13 19a2 2 0 0 1 2 2" />
    </svg>
  );
}