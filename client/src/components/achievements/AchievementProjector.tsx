import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/lib/types';
import HolographicAchievement from './HolographicAchievement';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AchievementProjectorProps {
  badges: Badge[];
  title?: string;
  layout?: 'grid' | 'orbit' | 'pyramid';
  interactive?: boolean;
  className?: string;
}

export default function AchievementProjector({
  badges,
  title = "Achievements Projector",
  layout = 'grid',
  interactive = true,
  className
}: AchievementProjectorProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [orbitSpeed, setOrbitSpeed] = useState(15); // seconds per revolution
  const [isActivated, setIsActivated] = useState(false);
  
  // Automatically activate the projector after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActivated(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle badge selection
  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge === selectedBadge ? null : badge);
  };
  
  // Orbit position calculations
  const getOrbitPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI;
    const radius = 150; // Orbit radius
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    
    return {
      x,
      z
    };
  };
  
  // Pyramid position calculations
  const getPyramidPosition = (index: number, total: number) => {
    const rowSize = Math.ceil(Math.sqrt(total));
    const row = Math.floor(index / rowSize);
    const col = index % rowSize;
    
    // Center each row
    const rowOffset = (rowSize - (row === Math.floor(total / rowSize) ? total % rowSize : rowSize)) / 2;
    
    return {
      x: (col - rowOffset) * 80,
      y: row * 70
    };
  };
  
  // Render different layouts
  const renderBadges = () => {
    if (!isActivated) return null;
    
    switch (layout) {
      case 'orbit':
        return (
          <div className="relative h-[350px] w-[350px] perspective-800">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-900/30 to-indigo-900/30 flex items-center justify-center shadow-lg animate-pulse-slow">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/40 to-purple-500/40 blur-sm"></div>
              </div>
            </div>
            
            {badges.map((badge, index) => {
              const { x, z } = getOrbitPosition(index, badges.length);
              
              return (
                <motion.div
                  key={badge.id}
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    x: selectedBadge && selectedBadge.id !== badge.id ? 0 : x,
                    z,
                    scale: selectedBadge && selectedBadge.id === badge.id ? 1.5 : 1
                  }}
                  transition={{
                    type: 'spring',
                    damping: 20,
                    stiffness: 100
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `translateX(${x}px) translateZ(${z}px)`,
                    zIndex: z < 0 ? 0 : 10
                  }}
                  animate-custom={`orbit ${orbitSpeed}s linear infinite`}
                >
                  <HolographicAchievement 
                    badge={badge}
                    size="md"
                    interactive={interactive}
                    onClick={() => handleBadgeClick(badge)}
                    displayDetails={selectedBadge?.id === badge.id}
                  />
                </motion.div>
              );
            })}
          </div>
        );
        
      case 'pyramid':
        return (
          <div className="relative flex flex-col items-center gap-6 mt-8">
            {badges.map((badge, index) => {
              const { x, y } = getPyramidPosition(index, badges.length);
              
              return (
                <motion.div
                  key={badge.id}
                  className="absolute"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ 
                    opacity: 1,
                    x,
                    y: selectedBadge && selectedBadge.id === badge.id ? y - 20 : y,
                    scale: selectedBadge && selectedBadge.id === badge.id ? 1.2 : 1,
                    zIndex: selectedBadge && selectedBadge.id === badge.id ? 20 : 10
                  }}
                  transition={{
                    type: 'spring',
                    damping: 25,
                    stiffness: 120,
                    delay: index * 0.1
                  }}
                >
                  <HolographicAchievement 
                    badge={badge}
                    size="md"
                    interactive={interactive}
                    onClick={() => handleBadgeClick(badge)}
                    displayDetails={selectedBadge?.id === badge.id}
                  />
                </motion.div>
              );
            })}
          </div>
        );
        
      case 'grid':
      default:
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-4">
            {badges.map((badge) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: selectedBadge && selectedBadge.id === badge.id ? 1.1 : 1,
                  zIndex: selectedBadge && selectedBadge.id === badge.id ? 20 : 10
                }}
                transition={{
                  type: 'spring',
                  damping: 20,
                  stiffness: 100
                }}
                className="flex flex-col items-center"
              >
                <HolographicAchievement 
                  badge={badge}
                  size="md"
                  interactive={interactive}
                  onClick={() => handleBadgeClick(badge)}
                  displayDetails={true}
                />
              </motion.div>
            ))}
          </div>
        );
    }
  };
  
  return (
    <div className={cn("relative", className)}>
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-amber-500 to-purple-500 bg-clip-text text-transparent">
          {title}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-purple-500 rounded-full mx-auto mt-2"></div>
      </div>

      {/* Projector Controls */}
      {layout !== 'grid' && (
        <div className="flex justify-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "border-amber-300/50",
              layout === 'orbit' ? "bg-amber-100/50 text-amber-700" : "bg-transparent"
            )}
            onClick={() => setOrbitSpeed(orbitSpeed === 15 ? 30 : orbitSpeed === 30 ? 10 : 15)}
          >
            <i className="ri-speed-line mr-1"></i>
            {orbitSpeed === 10 ? "Fast" : orbitSpeed === 30 ? "Slow" : "Normal"} Speed
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="border-purple-300/50"
            onClick={() => setSelectedBadge(null)}
          >
            <i className="ri-focus-3-line mr-1"></i>
            Reset View
          </Button>
        </div>
      )}
      
      {/* Holographic base */}
      <div className={cn(
        "relative overflow-hidden rounded-lg border border-purple-200/20 bg-gradient-to-br from-slate-200/40 to-purple-100/40 backdrop-blur-sm transition-all duration-500 perspective-1000",
        layout === 'grid' ? "p-6" : "p-6 h-[450px]",
        isActivated ? "opacity-100" : "opacity-0"
      )}>
        {/* Ambient light effect */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-300/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl"></div>
        
        {/* Badges projection */}
        <div className={cn(
          "relative h-full",
          layout === 'orbit' ? "flex items-center justify-center" : ""
        )}>
          {renderBadges()}
        </div>
        
        {/* Holographic scanlines effect */}
        <div className="absolute inset-0 bg-scanlines opacity-20 pointer-events-none"></div>
        
        {/* Projector activation beam */}
        <AnimatePresence>
          {!isActivated && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-amber-300/40 to-purple-500/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          )}
        </AnimatePresence>
      </div>
      
      {/* Selected badge detail (for orbit and pyramid layouts) */}
      {selectedBadge && layout !== 'grid' && (
        <motion.div
          className="mt-6 bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-purple-200/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <h3 className="font-semibold text-center">{selectedBadge.name}</h3>
          <p className="text-sm text-center text-gray-600 mt-1">{selectedBadge.description}</p>
          {selectedBadge.symbolism && (
            <p className="text-xs text-center text-purple-600 italic mt-2">
              "{selectedBadge.symbolism}"
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}