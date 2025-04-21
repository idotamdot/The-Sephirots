import { Badge } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import BadgeDisplay from "./BadgeDisplay";
import { motion } from "framer-motion";

interface BadgeProgressProps {
  badge: Badge;
  progress: number; // 0-100
  nextRequirement?: string;
  className?: string;
}

export default function BadgeProgress({
  badge,
  progress,
  nextRequirement,
  className
}: BadgeProgressProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-lg p-4 border border-gray-700 ${className}`}
    >
      <div className="flex items-center mb-3">
        <BadgeDisplay badge={badge} size="sm" />
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-white">{badge.name}</h3>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-400 capitalize">{badge.tier} • Level {badge.level}</p>
            <p className="text-xs font-medium text-amber-500">{progress}% Complete</p>
          </div>
        </div>
      </div>
      
      <Progress value={progress} className="h-2 bg-gray-700 mt-2">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full" 
          style={{ width: `${progress}%` }} 
        />
      </Progress>
      
      {nextRequirement && (
        <div className="mt-3">
          <p className="text-xs text-gray-400">Next requirement:</p>
          <p className="text-xs text-gray-300 mt-1">{nextRequirement}</p>
        </div>
      )}
    </motion.div>
  );
}