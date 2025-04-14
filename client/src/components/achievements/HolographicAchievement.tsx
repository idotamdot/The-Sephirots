import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Badge } from '@/lib/types';
import { cn } from '@/lib/utils';

interface HolographicAchievementProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  displayDetails?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function HolographicAchievement({
  badge,
  size = 'md',
  interactive = true,
  displayDetails = false,
  className,
  onClick
}: HolographicAchievementProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Motion values for parallax effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform mouse position into rotation values
  const rotateXSpring = useTransform(y, [-300, 300], [15, -15]);
  const rotateYSpring = useTransform(x, [-300, 300], [-15, 15]);
  
  // Visual effects based on badge tier
  const getBadgeGlow = () => {
    switch(badge.tier) {
      case 'founder': return 'shadow-[0_0_30px_5px_rgba(255,215,0,0.5)] border-amber-400';
      case 'platinum': return 'shadow-[0_0_25px_4px_rgba(229,228,226,0.5)] border-slate-300';
      case 'gold': return 'shadow-[0_0_20px_3px_rgba(255,215,0,0.4)] border-yellow-400';
      case 'silver': return 'shadow-[0_0_15px_2px_rgba(192,192,192,0.4)] border-gray-300';
      case 'bronze': return 'shadow-[0_0_10px_1px_rgba(205,127,50,0.4)] border-amber-700';
      default: return 'shadow-[0_0_10px_1px_rgba(138,43,226,0.3)] border-purple-500';
    }
  };
  
  const getBadgeBackground = () => {
    switch(badge.tier) {
      case 'founder': return 'bg-gradient-to-br from-amber-300 via-yellow-200 to-amber-400';
      case 'platinum': return 'bg-gradient-to-br from-slate-300 via-gray-100 to-slate-400';
      case 'gold': return 'bg-gradient-to-br from-yellow-300 via-yellow-200 to-amber-300';
      case 'silver': return 'bg-gradient-to-br from-gray-300 via-slate-200 to-gray-400';
      case 'bronze': return 'bg-gradient-to-br from-amber-700 via-orange-600 to-amber-800';
      default: return 'bg-gradient-to-br from-purple-500 via-indigo-400 to-purple-600';
    }
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'w-16 h-16 text-xs',
    md: 'w-24 h-24 text-sm',
    lg: 'w-32 h-32 text-base',
    xl: 'w-40 h-40 text-lg'
  };
  
  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    x.set(mouseX);
    y.set(mouseY);
  };
  
  // Add random holographic shimmer effect
  useEffect(() => {
    if (!interactive) return;
    
    const shimmerInterval = setInterval(() => {
      if (isHovered) return; // Don't change rotation when hovered
      
      setRotateX(Math.random() * 3 - 1.5);
      setRotateY(Math.random() * 3 - 1.5);
    }, 2000);
    
    return () => clearInterval(shimmerInterval);
  }, [interactive, isHovered]);
  
  // Trigger floating animation periodically
  useEffect(() => {
    if (!interactive) return;
    
    const animationInterval = setInterval(() => {
      if (!isHovered) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 2000);
      }
    }, 8000);
    
    return () => clearInterval(animationInterval);
  }, [interactive, isHovered]);
  
  return (
    <div 
      className={cn(
        "relative flex flex-col items-center justify-center",
        displayDetails ? "gap-3" : "",
        className
      )}
    >
      <motion.div
        ref={containerRef}
        className={cn(
          "relative rounded-full flex items-center justify-center border-2 overflow-hidden transition-shadow duration-500",
          sizeClasses[size],
          getBadgeGlow(),
          isHovered ? "z-10" : "z-0"
        )}
        style={{
          rotateX: interactive ? rotateXSpring : rotateX,
          rotateY: interactive ? rotateYSpring : rotateY,
          transformStyle: "preserve-3d",
          backgroundPosition: interactive ? "center" : undefined,
        }}
        animate={isAnimating ? { y: [0, -10, 0] } : undefined}
        transition={{ duration: 2, ease: "easeInOut" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        whileHover={interactive ? { scale: 1.05 } : undefined}
        whileTap={interactive ? { scale: 0.98 } : undefined}
      >
        {/* Holographic base layer */}
        <div className={cn(
          "absolute inset-0 w-full h-full",
          getBadgeBackground()
        )}></div>
        
        {/* Holographic shimmer effect */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-white to-transparent opacity-30 blur-[0.5px] animate-holo-shimmer"></div>
        
        {/* Badge icon */}
        <div className="relative z-10 text-white drop-shadow-lg">
          <i className={`${badge.icon} ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : size === 'lg' ? 'text-3xl' : 'text-4xl'}`}></i>
        </div>
      </motion.div>
      
      {/* Badge details (only shown if displayDetails is true) */}
      {displayDetails && (
        <AnimatePresence>
          <motion.div 
            className="text-center space-y-1"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-semibold text-sm">{badge.name}</h4>
            {badge.symbolism && (
              <p className="text-xs text-gray-500 italic max-w-[200px]">
                "{badge.symbolism}"
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}