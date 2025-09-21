import React from 'react';
import { cn } from '@/lib/utils';
import DoveAndStars from '@/components/icons/DoveAndStars';
import { Badge } from '@/lib/types';

interface FounderBadgeProps {
  badge?: Badge;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  enhanced?: boolean;
  isAscended?: boolean;
  earned?: boolean;
}

// Size classes mapping
const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
};

export default function FounderBadge({ 
  badge,
  className, 
  size = 'md', 
  enhanced = false,
  isAscended = false,
  earned = false
}: FounderBadgeProps) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div
        className={cn(
          "relative rounded-full flex items-center justify-center",
          "bg-gradient-to-r from-sephirot-keter-dark via-sephirot-keter-DEFAULT to-sephirot-keter-light",
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
          "bg-gradient-to-br from-amber-500 to-yellow-600",
          "flex items-center justify-center",
          "shadow-inner",
          enhanced && "animate-subtle-pulse"
        )}>
          {/* Dove and Stars Icon */}
          <DoveAndStars 
            fillColor="white" 
            size={size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'lg'} 
            withGlow={enhanced}
            glowColor="rgba(255, 255, 255, 0.7)"
          />
        </div>
        
        {/* Glow effect for enhanced badges */}
        {enhanced && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/20 to-yellow-300/20 animate-pulse-slow"></div>
        )}
      </div>
      
      {/* Badge label - can be shown optionally */}
      {/* <div className="mt-2 text-center">
        <p className="text-sm font-medium text-amber-800">Founder</p>
        <p className="text-xs text-amber-600">Level 1</p>
      </div> */}
    </div>
  );
}