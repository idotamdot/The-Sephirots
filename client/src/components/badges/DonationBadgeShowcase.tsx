import { useState, useEffect } from "react";
import { Badge } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface DonationBadgeShowcaseProps {
  badges: Badge[];
}

export default function DonationBadgeShowcase({ badges }: DonationBadgeShowcaseProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [particlesActive, setParticlesActive] = useState(false);
  const [animationTrigger, setAnimationTrigger] = useState(0);

  // Get donation tier level
  const getDonationTier = (badge: Badge): "seed" | "tree" | "light" => {
    const name = badge.name.toLowerCase();
    if (name.includes("seed planter")) return "seed";
    if (name.includes("tree tender")) return "tree";
    return "light"; // Light Guardian is the default/highest
  };

  // Organize badges by tier
  const seedBadge = badges.find(b => getDonationTier(b) === "seed");
  const treeBadge = badges.find(b => getDonationTier(b) === "tree");
  const lightBadge = badges.find(b => getDonationTier(b) === "light");

  // Set initial selected badge to the highest tier
  useEffect(() => {
    if (lightBadge) {
      setSelectedBadge(lightBadge);
    } else if (treeBadge) {
      setSelectedBadge(treeBadge);
    } else if (seedBadge) {
      setSelectedBadge(seedBadge);
    }
  }, [badges, seedBadge, treeBadge, lightBadge]);

  // Trigger particle animation periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setParticlesActive(true);
      setTimeout(() => setParticlesActive(false), 3000);
      setAnimationTrigger(prev => prev + 1);
    }, 8000);
    
    return () => clearInterval(timer);
  }, []);

  // Handle badge selection
  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
    setParticlesActive(true);
    setTimeout(() => setParticlesActive(false), 3000);
  };

  // Get badge color scheme based on tier
  const getBadgeColors = (tier: "seed" | "tree" | "light") => {
    switch (tier) {
      case "seed":
        return {
          bgGradient: "from-emerald-500/20 to-green-600/20",
          borderColor: "border-emerald-500/30",
          glowColor: "shadow-emerald-500/30",
          textGradient: "from-emerald-400 to-green-600"
        };
      case "tree":
        return {
          bgGradient: "from-amber-500/20 to-yellow-600/20",
          borderColor: "border-amber-500/30",
          glowColor: "shadow-amber-500/30",
          textGradient: "from-amber-400 to-yellow-600"
        };
      case "light":
        return {
          bgGradient: "from-purple-500/20 to-indigo-600/20",
          borderColor: "border-purple-500/30",
          glowColor: "shadow-purple-500/30",
          textGradient: "from-purple-400 to-indigo-600"
        };
    }
  };

  // Return early if no badges
  if (badges.length === 0) return null;

  // Get colors for selected badge
  const selectedTier = selectedBadge ? getDonationTier(selectedBadge) : "light";
  const colors = getBadgeColors(selectedTier);

  // Get tier title
  const getTierTitle = (tier: "seed" | "tree" | "light") => {
    switch (tier) {
      case "seed": return "Seed Planter";
      case "tree": return "Tree Tender";
      case "light": return "Light Guardian";
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden border-none relative",
      "bg-gradient-to-br", colors.bgGradient,
      "border", colors.borderColor,
      "shadow-lg", colors.glowColor
    )}>
      {/* Animated particles */}
      <AnimatePresence>
        {particlesActive && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={`particle-${i}-${animationTrigger}`}
                initial={{ 
                  opacity: 0,
                  scale: 0,
                  x: "50%",
                  y: "50%",
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, Math.random() * 0.5 + 0.5],
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                }}
                transition={{ 
                  duration: Math.random() * 2 + 1,
                  ease: "easeOut"
                }}
                className={cn(
                  "absolute w-2 h-2 rounded-full",
                  selectedTier === "seed" ? "bg-emerald-500" : 
                  selectedTier === "tree" ? "bg-amber-500" : 
                  "bg-purple-500"
                )}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
      
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Left side - badge display */}
          <div className="flex-shrink-0">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="relative"
            >
              <div className={cn(
                "w-32 h-32 rounded-full flex items-center justify-center relative overflow-hidden",
                "bg-gradient-to-br", 
                selectedTier === "seed" ? "from-emerald-700 to-emerald-900" :
                selectedTier === "tree" ? "from-amber-700 to-amber-900" :
                "from-purple-700 to-purple-900",
                "border-2",
                selectedTier === "seed" ? "border-emerald-400" :
                selectedTier === "tree" ? "border-amber-400" :
                "border-purple-400",
                "shadow-lg",
                selectedTier === "seed" ? "shadow-emerald-500/50" :
                selectedTier === "tree" ? "shadow-amber-500/50" :
                "shadow-purple-500/50"
              )}>
                <motion.div
                  key={selectedBadge?.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="relative z-10 flex items-center justify-center"
                >
                  {selectedTier === "seed" && (
                    <div className="text-5xl">🌱</div>
                  )}
                  {selectedTier === "tree" && (
                    <div className="text-5xl">🌳</div>
                  )}
                  {selectedTier === "light" && (
                    <div className="text-5xl">✨</div>
                  )}
                </motion.div>
                
                {/* Animated glow effects */}
                <div className="absolute inset-0 z-0">
                  <div className={cn(
                    "absolute inset-0 opacity-30 mix-blend-overlay",
                    "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]",
                    selectedTier === "seed" ? "from-emerald-300 to-transparent" :
                    selectedTier === "tree" ? "from-amber-300 to-transparent" :
                    "from-purple-300 to-transparent"
                  )}></div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ 
                      duration: 20, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                    className={cn(
                      "absolute inset-0 opacity-30",
                      "bg-[conic-gradient(var(--tw-gradient-stops))]",
                      selectedTier === "seed" ? "from-emerald-400 via-transparent to-emerald-400" :
                      selectedTier === "tree" ? "from-amber-400 via-transparent to-amber-400" :
                      "from-purple-400 via-transparent to-purple-400"
                    )}
                  ></motion.div>
                </div>
              </div>
              
              {/* Outer ring effects */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -inset-3 rounded-full opacity-20 border-4 border-dashed"
                style={{
                  borderColor: selectedTier === "seed" ? "#10b981" : 
                              selectedTier === "tree" ? "#f59e0b" : 
                              "#8b5cf6"
                }}
              ></motion.div>
            </motion.div>
          </div>
          
          {/* Right side - badge description */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
              <Heart className={cn(
                "w-5 h-5",
                selectedTier === "seed" ? "text-emerald-400" :
                selectedTier === "tree" ? "text-amber-400" :
                "text-purple-400"
              )}/>
              <motion.h2 
                key={selectedBadge?.id + "-title"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "text-xl font-bold bg-gradient-to-br bg-clip-text text-transparent",
                  "from-" + (
                    selectedTier === "seed" ? "emerald-400" :
                    selectedTier === "tree" ? "amber-400" :
                    "purple-400"
                  ),
                  "to-" + (
                    selectedTier === "seed" ? "green-600" :
                    selectedTier === "tree" ? "yellow-600" :
                    "indigo-600"
                  )
                )}
              >
                {selectedBadge?.name || getTierTitle(selectedTier)} Supporter
              </motion.h2>
            </div>
            
            <motion.p 
              key={selectedBadge?.id + "-desc"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-600 dark:text-gray-300 mb-4"
            >
              {selectedBadge?.description || 
                (selectedTier === "seed" ? "Thank you for planting the seeds of our community's growth with your contribution." :
                 selectedTier === "tree" ? "You've helped our community flourish like a mighty tree with your generous support." :
                 "Your magnificent contribution shines like a guiding light, illuminating our path forward.")
              }
            </motion.p>
            
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {seedBadge && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBadgeClick(seedBadge)}
                  className={cn(
                    "px-3 py-1.5 rounded-full flex items-center space-x-1 text-sm font-medium",
                    "transition-all duration-300",
                    selectedBadge?.id === seedBadge.id
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                      : "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                  )}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  <span>Seed Planter</span>
                </motion.button>
              )}
              
              {treeBadge && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBadgeClick(treeBadge)}
                  className={cn(
                    "px-3 py-1.5 rounded-full flex items-center space-x-1 text-sm font-medium",
                    "transition-all duration-300",
                    selectedBadge?.id === treeBadge.id
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                      : "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                  )}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  <span>Tree Tender</span>
                </motion.button>
              )}
              
              {lightBadge && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBadgeClick(lightBadge)}
                  className={cn(
                    "px-3 py-1.5 rounded-full flex items-center space-x-1 text-sm font-medium",
                    "transition-all duration-300",
                    selectedBadge?.id === lightBadge.id
                      ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30"
                      : "bg-purple-500/20 text-purple-700 dark:text-purple-300"
                  )}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  <span>Light Guardian</span>
                </motion.button>
              )}
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700/30">
              <div className="flex items-center justify-center md:justify-start">
                <Gift className="w-4 h-4 mr-2 text-gray-500" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your donation supports the Harmony vision and helps build our community.
                  <span className="hidden md:inline"> Thank you for being a vital part of our growth.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}