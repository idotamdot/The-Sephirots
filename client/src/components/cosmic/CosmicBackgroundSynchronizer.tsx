import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CosmicBackgroundSynchronizerProps {
  className?: string;
  moodOverride?: 'calm' | 'energetic' | 'focused' | 'celebratory' | 'mystical';
  intensity?: number; // 0-100
  interactive?: boolean;
  children: React.ReactNode;
}

interface StarParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  speed: number;
  blinkRate: number;
}

export default function CosmicBackgroundSynchronizer({
  className,
  moodOverride,
  intensity = 70,
  interactive = true,
  children
}: CosmicBackgroundSynchronizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseActive, setIsMouseActive] = useState(false);
  const [mood, setMood] = useState<string>(moodOverride || 'mystical');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stars, setStars] = useState<StarParticle[]>([]);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  
  // Get community activity statistics to determine mood
  const { data: communityStats } = useQuery({
    queryKey: ['/api/community-stats'],
    enabled: !moodOverride,
    refetchInterval: 60000, // Refetch every minute
  });
  
  // Get user data for personalization
  const { data: userData } = useQuery({
    queryKey: ['/api/users/me'],
  });
  
  // Setup window dimensions
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setWindowDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Update current time periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Determine mood based on time of day, community activity, and optional override
  useEffect(() => {
    if (moodOverride) {
      setMood(moodOverride);
      return;
    }
    
    // Get hour of the day (0-23)
    const hour = currentTime.getHours();
    
    // Base mood on time of day
    let newMood: string;
    
    if (hour >= 5 && hour < 9) {
      newMood = 'calm'; // Morning: calm, meditative
    } else if (hour >= 9 && hour < 12) {
      newMood = 'focused'; // Late morning: productive, focused
    } else if (hour >= 12 && hour < 17) {
      newMood = 'energetic'; // Afternoon: energetic, active
    } else if (hour >= 17 && hour < 21) {
      newMood = 'celebratory'; // Evening: social, celebratory
    } else {
      newMood = 'mystical'; // Night: mystic, deep
    }
    
    // Adjust mood based on community activity if data is available
    if (communityStats) {
      // Safely extract values with fallbacks
      const activeUsers = communityStats.activeUsers || 0;
      const recentlyActiveDiscussions = communityStats.discussions?.recentlyActive || 0;
      const inProgressProposals = communityStats.proposals?.inProgress || 0;
      const recentlyApprovedProposals = communityStats.proposals?.recentlyApproved || 0;
      
      if (activeUsers > 100 || recentlyActiveDiscussions > 5 || inProgressProposals > 3) {
        // High activity levels
        if (newMood === 'calm') newMood = 'focused';
        if (newMood === 'focused') newMood = 'energetic';
      }
      
      if (recentlyApprovedProposals > 0) {
        // Celebrations for approved proposals
        newMood = 'celebratory';
      }
    }
    
    setMood(newMood);
  }, [moodOverride, currentTime, communityStats]);
  
  // Generate stars based on window dimensions and mood
  useEffect(() => {
    if (windowDimensions.width === 0 || windowDimensions.height === 0) return;
    
    const getStarColorBasedOnMood = (mood: string) => {
      switch (mood) {
        case 'calm':
          return ['#8AB4F8', '#B4C8FD', '#D0DDFF', '#FFFFFF', '#C8E0FE'];
        case 'energetic':
          return ['#FF9D6C', '#FFD56C', '#FFEA74', '#FFFFFF', '#FFC1A6'];
        case 'focused':
          return ['#B69CFF', '#CAB0FF', '#E0D0FF', '#FFFFFF', '#D6BCFF'];
        case 'celebratory':
          return ['#FFD700', '#FFA500', '#FF6347', '#FFFFFF', '#FFFACD'];
        case 'mystical':
        default:
          return ['#8B5CF6', '#A78BFA', '#C4B5FD', '#FFFFFF', '#DDD6FE'];
      }
    };
    
    const starColors = getStarColorBasedOnMood(mood);
    const starCount = Math.floor((windowDimensions.width * windowDimensions.height) / 6000 * (intensity / 100));
    
    const newStars: StarParticle[] = Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      x: Math.random() * windowDimensions.width,
      y: Math.random() * windowDimensions.height,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      color: starColors[Math.floor(Math.random() * starColors.length)],
      speed: Math.random() * 0.5 + 0.1,
      blinkRate: Math.random() * 2 + 1
    }));
    
    setStars(newStars);
  }, [windowDimensions, mood, intensity]);
  
  // Mouse movement tracking for interactive stars
  useEffect(() => {
    if (!interactive) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setMousePosition({ x, y });
      setIsMouseActive(true);
      
      // Auto-deactivate mouse effect after some time
      setTimeout(() => setIsMouseActive(false), 2000);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);
  
  // Animation loop for stars
  const animate = (time: number) => {
    if (previousTimeRef.current === undefined) {
      previousTimeRef.current = time;
    }
    
    const deltaTime = time - (previousTimeRef.current || 0);
    previousTimeRef.current = time;
    
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Update and draw stars
    stars.forEach(star => {
      // Update star position based on mood
      let yOffset = 0;
      
      if (mood === 'energetic') {
        yOffset = Math.sin(time / 1000 * star.blinkRate) * 1.5;
      } else if (mood === 'mystical') {
        yOffset = Math.sin(time / 2000 * star.blinkRate) * 0.8;
      }
      
      // Draw star
      ctx.beginPath();
      ctx.arc(
        star.x, 
        star.y + yOffset, 
        star.size, 
        0, 
        Math.PI * 2
      );
      
      // Add interactive glow if mouse is nearby
      if (isMouseActive && interactive) {
        const dx = mousePosition.x - star.x;
        const dy = mousePosition.y - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influenceRadius = 150;
        
        if (distance < influenceRadius) {
          const influence = 1 - (distance / influenceRadius);
          
          // Add glow
          const gradient = ctx.createRadialGradient(
            star.x, star.y + yOffset, 0,
            star.x, star.y + yOffset, star.size * (3 + influence * 5)
          );
          gradient.addColorStop(0, star.color);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = gradient;
          ctx.globalAlpha = star.opacity * (1 + influence);
          ctx.fill();
          
          // Draw center of star
          ctx.beginPath();
          ctx.arc(star.x, star.y + yOffset, star.size * (1 + influence), 0, Math.PI * 2);
        }
      }
      
      // Regular star drawing if not influenced by mouse
      ctx.fillStyle = star.color;
      ctx.globalAlpha = star.opacity * (0.5 + Math.sin(time / 1000 * star.blinkRate) * 0.5);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    
    requestRef.current = requestAnimationFrame(animate);
  };
  
  // Setup animation loop
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [stars, mousePosition, isMouseActive, mood, interactive]);
  
  // Update canvas size when window dimensions change
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = windowDimensions.width;
      canvasRef.current.height = windowDimensions.height;
    }
  }, [windowDimensions]);
  
  // Get background gradient based on mood
  const getBackgroundGradient = () => {
    switch (mood) {
      case 'calm':
        return 'bg-gradient-to-b from-blue-900/90 via-blue-800/90 to-indigo-900/90';
      case 'energetic':
        return 'bg-gradient-to-b from-orange-900/90 via-amber-800/90 to-red-900/90';
      case 'focused':
        return 'bg-gradient-to-b from-indigo-900/90 via-violet-800/90 to-purple-900/90';
      case 'celebratory':
        return 'bg-gradient-to-b from-amber-800/90 via-yellow-700/90 to-orange-800/90';
      case 'mystical':
      default:
        return 'bg-gradient-to-b from-purple-900/90 via-violet-800/90 to-indigo-900/90';
    }
  };
  
  return (
    <div ref={containerRef} className={cn("relative h-full w-full overflow-hidden", className)}>
      {/* Ambient Background */}
      <div
        className={cn(
          "absolute inset-0 transition-colors duration-3000",
          getBackgroundGradient()
        )}
      />
      
      {/* Animated mood-specific effects */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
      >
        {mood === 'energetic' && (
          <div className="absolute inset-0">
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-orange-500/30 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-red-500/20 blur-3xl"></div>
          </div>
        )}
        
        {mood === 'calm' && (
          <div className="absolute inset-0">
            <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl"></div>
          </div>
        )}
        
        {mood === 'focused' && (
          <div className="absolute inset-0">
            <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl"></div>
            <div className="absolute bottom-1/4 -left-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl"></div>
          </div>
        )}
        
        {mood === 'celebratory' && (
          <div className="absolute inset-0">
            <div className="absolute -top-20 left-1/4 w-96 h-96 rounded-full bg-yellow-500/30 blur-3xl"></div>
            <div className="absolute -bottom-20 right-1/4 w-96 h-96 rounded-full bg-amber-500/30 blur-3xl"></div>
            <div className="absolute top-1/2 -right-20 w-64 h-64 rounded-full bg-orange-500/20 blur-3xl"></div>
          </div>
        )}
        
        {mood === 'mystical' && (
          <div className="absolute inset-0">
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl"></div>
            <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full bg-indigo-400/20 blur-3xl"></div>
          </div>
        )}
      </motion.div>
      
      {/* Star field canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        width={windowDimensions.width}
        height={windowDimensions.height}
      />
      
      {/* Content */}
      <div className="relative z-20 h-full">
        {children}
      </div>
    </div>
  );
}