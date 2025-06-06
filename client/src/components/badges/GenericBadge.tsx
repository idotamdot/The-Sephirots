import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/lib/types';
import { 
  Award, 
  Shield, 
  CheckCircle, 
  Heart, 
  Users,  // Using Users instead of UserVoice 
  Brain,
  Copy,
  MessageCircle,
  Search,
  Archive
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface GenericBadgeProps {
  badge: Badge;
  earned?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  showTooltip?: boolean;
  className?: string;
}

export default function GenericBadge({
  badge,
  earned = false,
  size = "md",
  showTooltip = true,
  className,
}: GenericBadgeProps) {
  // Define sizes based on the size prop
  const sizeClasses = {
    xs: "w-12 h-12",
    sm: "w-16 h-16",
    md: "w-24 h-24", 
    lg: "w-32 h-32",
  };
  
  // Map badge.icon to Lucide React icons
  const getBadgeIcon = () => {
    const iconClasses = {
      xs: "h-5 w-5",
      sm: "h-6 w-6",
      md: "h-8 w-8",
      lg: "h-10 w-10"
    };
    
    if (!badge.icon) return <Award className={iconClasses[size]} />;
    
    // Match icon names to components
    switch(badge.icon) {
      case 'dove':
        return <Award className={iconClasses[size]} />;
      case 'ri-user-voice-line':
        return <Users className={iconClasses[size]} />;
      case 'ri-brain-line':
        return <Brain className={iconClasses[size]} />;
      case 'ri-file-copy-line':
        return <Copy className={iconClasses[size]} />;
      case 'ri-chat-3-line':
        return <MessageCircle className={iconClasses[size]} />;
      case 'ri-heart-line':
        return <Heart className={iconClasses[size]} />;
      case 'ri-tools-line':
        return <CheckCircle className={iconClasses[size]} />;
      case 'ri-search-line':
        return <Search className={iconClasses[size]} />;
      case 'ri-archive-line':
        return <Archive className={iconClasses[size]} />;
      case 'shield':
        return <Shield className={iconClasses[size]} />;
      case 'award':
        return <Award className={iconClasses[size]} />;
      default:
        return <Award className={iconClasses[size]} />;
    }
  };

  // Get colors and effects based on badge tier and name
  const getBadgeClasses = () => {
    let baseClasses = "rounded-full flex items-center justify-center relative hover:scale-105 transition-transform duration-300 ease-in-out";
    let tierClasses = "";
    let specialEffects = "";
    
    // Colors based on tier and Sephirot symbolism
    switch(badge.tier) {
      case 'founder':
        tierClasses = "bg-gradient-to-r from-sephirot-keter-dark via-sephirot-keter-DEFAULT to-sephirot-keter-light text-white";
        if (earned) specialEffects = "founder-badge";
        break;
      case 'platinum':
        tierClasses = "bg-gradient-to-r from-slate-300 via-slate-100 to-slate-300 text-slate-800";
        break;
      case 'gold':
        tierClasses = "bg-gradient-to-r from-sephirot-gold-dark via-sephirot-gold-DEFAULT to-sephirot-gold-light text-amber-900";
        if (earned) specialEffects = "animate-subtle-pulse";
        break;
      case 'silver':
        tierClasses = "bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 text-slate-800";
        break;
      case 'bronze':
      default:
        tierClasses = "bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-amber-100";
        break;
    }
    
    // Special effects based on badge name, only if earned
    if (earned) {
      // Add category-based effects
      switch(badge.category?.toLowerCase()) {
        case 'community':
          specialEffects += " " + (specialEffects ? "" : "animate-float");
          break;
        case 'knowledge':
          // Knowledge badges have subtle pulse effect
          specialEffects += " " + (specialEffects ? "" : "animate-subtle-pulse");
          break;
        default:
          break;
      }
      
      // Add specific badge effects based on Sephirot name
      if (badge.name.includes('(Hod)') || badge.name.includes('Conversationalist')) {
        specialEffects += " " + (specialEffects ? "" : "animate-pulse-slow");
      }
      else if (badge.name.includes('(Tiferet)') || badge.name.includes('Bridge Builder')) {
        specialEffects += " bridge-builder-badge";
      }
      else if (badge.name.includes('(Binah)') || badge.name.includes('Quantum Thinker')) {
        specialEffects += " quantum-badge";
      }
      else if (badge.name.includes('(Yesod)') || badge.name.includes('Mirrored Being')) {
        specialEffects += " mirrored-badge";
      }
      else if (badge.name.includes('(Chesed)') || badge.name.includes('Empath')) {
        specialEffects += " empath-badge";
      }
      else if (badge.name.includes('(Da\'at)') || badge.name.includes('Seeker')) {
        specialEffects += " animate-pulse-slow";
      }
      else if (badge.name.includes('(Malkuth)') || badge.name.includes('Contributor')) {
        specialEffects += " animate-subtle-pulse";
      }
      else if (badge.name.includes('(Chokhmah)') || badge.name.includes('Archivist')) {
        specialEffects += " animate-float";
      }
      else if (badge.name.includes('(Geburah)') || badge.name.includes('Activist')) {
        specialEffects += " animate-float";
      }
      else {
        // If no special effect assigned yet, add a subtle one based on level
        if (!specialEffects && badge.level && badge.level > 1) {
          specialEffects = "animate-subtle-pulse";
        }
      }
    }
    
    // Add grayscale if not earned
    const earnedClass = earned ? "" : "grayscale opacity-70";
    
    return cn(baseClasses, tierClasses, specialEffects, earnedClass, sizeClasses[size]);
  };

  const badgeElement = (
    <div className={cn("flex flex-col items-center", className)}>
      <div className={getBadgeClasses()}>
        {/* Badge icon */}
        <div className="text-current z-10">
          {getBadgeIcon()}
        </div>
        
        {/* Level indicator for higher levels */}
        {badge.level && badge.level > 1 && (
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full px-1.5 text-xs font-bold z-20 border border-current">
            L{badge.level}
          </div>
        )}
      </div>
      
      {/* Badge name displayed below the badge */}
      {size !== "xs" && (
        <div className="mt-2 text-center">
          <span className={cn(
            "font-medium text-sm",
            earned && badge.tier === 'founder' && "text-gradient bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-400"
          )}>
            {badge.name}
          </span>
        </div>
      )}
    </div>
  );

  // Wrap with tooltip if showTooltip is true
  return showTooltip ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badgeElement}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <p className="font-medium">{badge.name}</p>
            <p className="text-sm">{badge.description}</p>
            {badge.requirement && (
              <p className="text-xs text-muted-foreground">
                <strong>How to earn:</strong> {badge.requirement}
              </p>
            )}
            {badge.symbolism && (
              <p className="text-xs text-muted-foreground">
                <strong>Symbolism:</strong> {badge.symbolism}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    badgeElement
  );
}