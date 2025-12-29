import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Badge } from "@/lib/types";

interface AchievementCelebrationProps {
  badge?: Badge;
  title: string;
  description: string;
  isVisible: boolean;
  onComplete?: () => void;
}

export function AchievementCelebration({
  badge,
  title,
  description,
  isVisible,
  onComplete,
}: AchievementCelebrationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    if (isVisible) {
      // Generate particles for celebration effect
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);

      // Auto-dismiss after animation
      const timer = setTimeout(() => {
        onComplete?.();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onComplete}
        >
          {/* Particle effects */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ 
                opacity: 0, 
                y: "50vh", 
                x: `${particle.x}vw`,
                scale: 0 
              }}
              animate={{ 
                opacity: [0, 1, 1, 0], 
                y: "-20vh",
                scale: [0, 1, 1.2, 0],
              }}
              transition={{ 
                duration: 2,
                delay: particle.delay,
                ease: "easeOut",
              }}
              className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300"
              style={{ 
                boxShadow: "0 0 10px rgba(251, 191, 36, 0.8)",
              }}
            />
          ))}

          {/* Main celebration content */}
          <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ 
              scale: 1, 
              rotateY: 0,
              transition: {
                type: "spring",
                stiffness: 200,
                damping: 15,
              }
            }}
            exit={{ scale: 0, opacity: 0 }}
            className="relative bg-gradient-to-br from-amber-50 via-white to-yellow-50 rounded-2xl p-8 shadow-2xl max-w-md mx-4"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/20 to-yellow-400/20 blur-xl" />
            
            {/* Stars decoration */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -top-4 -right-4 text-4xl"
            >
              ⭐
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-4 -left-4 text-3xl"
            >
              ✨
            </motion.div>

            <div className="relative text-center">
              {/* Achievement icon/badge */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-4"
              >
                {badge ? (
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg">
                    <span className="text-4xl">{badge.icon}</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg">
                    <span className="text-4xl">🏆</span>
                  </div>
                )}
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-500 mb-2"
              >
                Achievement Unlocked!
              </motion.h2>

              {/* Badge name */}
              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl font-semibold text-gray-800 mb-2"
              >
                {title}
              </motion.h3>

              {/* Description */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-gray-600 mb-4"
              >
                {description}
              </motion.p>

              {/* Points earned */}
              {badge?.points && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-amber-700 font-medium"
                >
                  <span>+{badge.points}</span>
                  <span>Points</span>
                </motion.div>
              )}

              {/* Dismiss hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-4 text-sm text-gray-400"
              >
                Click anywhere to continue
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook to trigger achievement celebrations
export function useAchievementCelebration() {
  const [celebration, setCelebration] = useState<{
    isVisible: boolean;
    badge?: Badge;
    title: string;
    description: string;
  }>({
    isVisible: false,
    title: "",
    description: "",
  });

  const celebrate = (title: string, description: string, badge?: Badge) => {
    setCelebration({
      isVisible: true,
      badge,
      title,
      description,
    });
  };

  const dismiss = () => {
    setCelebration((prev) => ({ ...prev, isVisible: false }));
  };

  return {
    celebration,
    celebrate,
    dismiss,
    CelebrationComponent: () => (
      <AchievementCelebration
        {...celebration}
        onComplete={dismiss}
      />
    ),
  };
}

export default AchievementCelebration;
