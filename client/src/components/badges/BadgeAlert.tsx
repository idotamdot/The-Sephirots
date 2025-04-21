import React, { useEffect, useState } from 'react';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Badge } from '@shared/schema';
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, Award, Sparkles, TreePine, Leaf, Sprout, SunMedium, Heart, Smile } from 'lucide-react';
import BadgeDisplay from './BadgeDisplay';

interface BadgeAlertProps {
  badge: Badge | null;
  isOpen: boolean;
  onClose: () => void;
}

// SVG patterns for background effects
const PatternBackground = ({ isDonation = false }) => (
  <div className="absolute inset-0 overflow-hidden opacity-10">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={isDonation ? "donationPattern" : "regularPattern"} 
                 patternUnits="userSpaceOnUse" 
                 width="50" height="50" 
                 patternTransform="rotate(45)">
          <path d={
            isDonation
              ? "M25,0 L50,25 L25,50 L0,25 Z"  // Diamond for donation
              : "M10,10 L40,10 L40,40 L10,40 Z" // Square for regular
          } 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" 
            fill={`url(#${isDonation ? "donationPattern" : "regularPattern"})`} />
    </svg>
  </div>
);

// Particle effect for donation badges
const ParticleEffect = ({ color }: { color: string }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            initial={{ 
              x: 0, 
              y: 0, 
              opacity: 0,
              scale: 0
            }}
            animate={{ 
              x: (Math.random() - 0.5) * 400, 
              y: (Math.random() - 0.5) * 400, 
              opacity: [0, Math.random() * 0.7, 0], 
              scale: [0, Math.random() * 0.7 + 0.3, 0]
            }}
            transition={{ 
              duration: 2 + Math.random() * 3,
              delay: Math.random() * 2,
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: Math.random() * 3 + 1
            }}
            className={`absolute w-2 h-2 rounded-full ${color}`}
            style={{ left: '50%', top: '50%' }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export function BadgeAlert({ badge, isOpen, onClose }: BadgeAlertProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  
  // For donation badges, show longer and with more effects
  const isDonationBadge = badge ? 
    badge.name.toLowerCase().includes('seed planter') || 
    badge.name.toLowerCase().includes('tree tender') || 
    badge.name.toLowerCase().includes('light guardian') 
    : false;
  
  // Automatically close after 8-12 seconds (longer for donation badges)
  useEffect(() => {
    if (isOpen) {
      // Show confetti effect shortly after opening
      const confettiTimeout = setTimeout(() => {
        setShowConfetti(true);
      }, 500);
      
      // Close dialog after delay (longer for donation badges)
      const closeTimeout = setTimeout(() => {
        onClose();
      }, isDonationBadge ? 12000 : 8000);
      
      return () => {
        clearTimeout(confettiTimeout);
        clearTimeout(closeTimeout);
      };
    } else {
      // Reset confetti when closed
      setShowConfetti(false);
    }
  }, [isOpen, onClose, isDonationBadge]);

  if (!badge) return null;
  
  // Determine appropriate icon based on badge properties
  const BadgeIcon = () => {
    // Check if it's a donation badge and return specific icon
    if (badge.name.toLowerCase().includes('seed planter')) {
      return <Sprout className="w-20 h-20" />;
    } else if (badge.name.toLowerCase().includes('tree tender')) {
      return <TreePine className="w-20 h-20" />;
    } else if (badge.name.toLowerCase().includes('light guardian')) {
      return <SunMedium className="w-20 h-20" />;
    } else if (badge.icon === "star") {
      return <Sparkles className="w-20 h-20" />;
    } else if (badge.icon === "heart" || badge.icon === "love") {
      return <Heart className="w-20 h-20" />;
    } else if (badge.category === "wellbeing") {
      return <Smile className="w-20 h-20" />;
    } else if (badge.category === "participation") {
      return <Leaf className="w-20 h-20" />;
    } else {
      // Default icon
      return <Award className="w-20 h-20" />;
    }
  };
  
  // Determine background gradient based on badge type
  const getBgGradient = () => {
    if (isDonationBadge) {
      if (badge.name.toLowerCase().includes('seed planter')) {
        return "from-emerald-900 to-emerald-950";
      } else if (badge.name.toLowerCase().includes('tree tender')) {
        return "from-amber-900 to-amber-950";
      } else if (badge.name.toLowerCase().includes('light guardian')) {
        return "from-purple-900 to-indigo-950";
      }
    }
    
    // Default gradient based on tier
    switch(badge.tier) {
      case 'bronze': return "from-amber-800 to-amber-950";
      case 'silver': return "from-gray-600 to-gray-900";
      case 'gold': return "from-yellow-700 to-amber-900";
      case 'platinum': return "from-indigo-700 to-indigo-950";
      case 'founder': return "from-purple-800 to-purple-950";
      default: return "from-gray-800 to-gray-950";
    }
  };
  
  // Get appropriate accent color for particles
  const getParticleColor = () => {
    if (isDonationBadge) {
      if (badge.name.toLowerCase().includes('seed planter')) {
        return "bg-emerald-400";
      } else if (badge.name.toLowerCase().includes('tree tender')) {
        return "bg-amber-400";
      } else if (badge.name.toLowerCase().includes('light guardian')) {
        return "bg-purple-400";
      }
    }
    
    switch(badge.tier) {
      case 'bronze': return "bg-amber-500";
      case 'silver': return "bg-gray-300";
      case 'gold': return "bg-yellow-400"; 
      case 'platinum': return "bg-indigo-400";
      case 'founder': return "bg-purple-400";
      default: return "bg-white";
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent 
        className={`max-w-md overflow-hidden p-0 border-0 shadow-2xl
          ${isDonationBadge ? 'shadow-purple-500/20' : 'shadow-primary/20'}`}
      >
        {/* Top decoration bar */}
        <div className={`h-2 bg-gradient-to-r 
          ${isDonationBadge 
            ? 'from-purple-500 via-amber-400 to-purple-500' 
            : 'from-primary/20 via-primary/30 to-primary/20'}`} 
        />
        
        {/* Main content with dynamic background based on badge type */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`p-6 relative bg-gradient-to-br ${getBgGradient()} text-white overflow-hidden`}
        >
          {/* Background pattern */}
          <PatternBackground isDonation={isDonationBadge} />
          
          {/* Particle effects for donation badges */}
          {isDonationBadge && <ParticleEffect color={getParticleColor()} />}
          
          {/* Confetti effect */}
          {showConfetti && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <AnimatePresence>
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={`confetti-${i}`}
                    initial={{ 
                      x: (Math.random() - 0.5) * 100, 
                      y: -50,
                      rotate: Math.random() * 360,
                      opacity: 1
                    }}
                    animate={{ 
                      y: window.innerHeight,
                      rotate: Math.random() * 720,
                      opacity: [1, 1, 0]
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: Math.random() * 3 + 2,
                      delay: Math.random() * 0.5,
                      ease: "easeOut"
                    }}
                    style={{
                      position: 'absolute',
                      width: `${Math.random() * 10 + 5}px`,
                      height: `${Math.random() * 10 + 5}px`,
                      backgroundColor: [
                        '#FFD700', '#FF6347', '#4169E1', '#32CD32', 
                        '#FF69B4', '#9370DB', '#00CED1', '#FFA500'
                      ][Math.floor(Math.random() * 8)],
                      top: 0,
                      left: `${Math.random() * 100}%`
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
          
          <AlertDialogHeader className="gap-2 relative z-10">
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ scale: 0.5, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                className="relative"
              >
                {/* For donation badges, use BadgeDisplay instead of just an icon */}
                {isDonationBadge ? (
                  <BadgeDisplay 
                    badge={badge} 
                    size="lg" 
                    enhanced={true}
                    isDonation={true}
                  />
                ) : (
                  <div className={`
                    relative w-24 h-24 flex items-center justify-center
                    ${badge.enhanced ? 'animate-pulse-slow' : ''}
                    ${badge.tier === 'gold' ? 'text-yellow-500' : ''}
                    ${badge.tier === 'silver' ? 'text-slate-400' : ''}
                    ${badge.tier === 'platinum' ? 'text-indigo-300' : ''}
                    ${badge.tier === 'founder' ? 'text-fuchsia-500' : ''}
                  `}>
                    {badge.enhanced && (
                      <motion.div 
                        className="absolute inset-0 rounded-full bg-amber-400/30"
                        animate={{ 
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
                    <BadgeIcon />
                  </div>
                )}
                
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.3 }}
                  className="absolute top-0 right-0"
                >
                  <PartyPopper className={`w-6 h-6 ${isDonationBadge ? 'text-amber-400' : 'text-primary'}`} />
                </motion.div>
              </motion.div>
            </div>
            
            <AlertDialogTitle className="text-center text-xl">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className={isDonationBadge ? "bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent" : ""}
              >
                {isDonationBadge ? "Thank You!" : "Badge Earned"}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.3 }}
                className="text-white"
              >
                {badge.name}
              </motion.div>
            </AlertDialogTitle>
            
            <AlertDialogDescription className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mb-2 text-gray-200"
              >
                {badge.description}
              </motion.div>
              
              {badge.symbolism && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className={`text-sm italic ${isDonationBadge ? 'text-purple-300' : 'text-gray-400'}`}
                >
                  "{badge.symbolism}"
                </motion.div>
              )}
              
              {/* Points awarded */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="mt-4 flex justify-center items-center gap-2"
              >
                <UIBadge variant="outline" className="bg-black/20 border-gray-500 text-amber-300">
                  +{badge.points} Soul Points
                </UIBadge>
              </motion.div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {/* Special message for donation badges */}
          {isDonationBadge && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              className="mt-4 py-2 px-4 rounded bg-white/5 text-center text-sm"
            >
              <p className="text-amber-300">Your contribution helps sustain The Sephirots community</p>
              <p className="text-xs text-gray-300 mt-1">50% supports platform development and 50% goes to Replit staff</p>
            </motion.div>
          )}
          
          <AlertDialogFooter className="mt-4 sm:mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.3 }}
              className="w-full"
            >
              <Button 
                onClick={onClose} 
                className={`w-full ${
                  isDonationBadge 
                    ? "bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 border-none" 
                    : ""
                }`}
              >
                Continue your journey
              </Button>
            </motion.div>
          </AlertDialogFooter>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  );
}