import { Badge } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface CompleteCollectionProps {
  allBadges: Badge[];
  earnedBadgeIds: number[];
  userName: string;
}

export default function CompleteCollection({ 
  allBadges, 
  earnedBadgeIds, 
  userName 
}: CompleteCollectionProps) {
  // Only display this component if the user has earned at least one badge
  if (earnedBadgeIds.length === 0) return null;

  const totalBadgesCount = allBadges.length;
  const earnedCount = earnedBadgeIds.length;
  const completionPercentage = Math.floor((earnedCount / totalBadgesCount) * 100);
  
  const isComplete = earnedCount === totalBadgesCount;
  const nearCompletion = completionPercentage >= 80 && !isComplete;
  
  // Find rarest (limited edition) badges that are not earned yet
  const unEarnedRareBadges = allBadges.filter(badge => 
    !earnedBadgeIds.includes(badge.id) && 
    badge.isLimited
  ).slice(0, 3);
  
  // Count badges by category
  const categoryProgress = allBadges.reduce((acc, badge) => {
    if (!acc[badge.category]) {
      acc[badge.category] = {
        total: 0,
        earned: 0
      };
    }
    
    acc[badge.category].total += 1;
    if (earnedBadgeIds.includes(badge.id)) {
      acc[badge.category].earned += 1;
    }
    
    return acc;
  }, {} as Record<string, { total: number, earned: number }>);
  
  // Get top 3 categories by completion percentage
  const topCategories = Object.entries(categoryProgress)
    .map(([category, { total, earned }]) => ({
      category,
      total,
      earned,
      percentage: Math.floor((earned / total) * 100)
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3);
  
  return (
    <Card className="relative overflow-hidden border-none bg-gradient-to-br from-purple-50 to-amber-50">
      <CardContent className="p-6">
        {/* Background effects */}
        {isComplete && (
          <>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-300 opacity-20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-400 opacity-20 rounded-full blur-3xl" />
          </>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="flex items-center mb-4">
              <Sparkles className="h-5 w-5 text-amber-500 mr-2" />
              <h3 className="text-lg font-medium">
                {isComplete 
                  ? 'Collection Complete!' 
                  : nearCompletion 
                    ? 'Almost There!'
                    : 'Badge Collection Progress'
                }
              </h3>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">{earnedCount} of {totalBadgesCount} badges earned</span>
                <span className="text-sm text-gray-600">{completionPercentage}% complete</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
            
            {isComplete ? (
              <div className="mt-4">
                <h4 className="font-medium text-amber-700">Congratulations, {userName}!</h4>
                <p className="text-sm text-gray-600 mt-1">
                  You've completed your badge collection, a remarkable achievement that reflects your deep engagement with the Sephirotic community.
                </p>
                <p className="text-sm font-medium text-purple-700 mt-2">
                  Founder status has been awarded to your account.
                </p>
              </div>
            ) : nearCompletion ? (
              <div className="mt-4">
                <h4 className="font-medium text-purple-700">Just a few more to go, {userName}!</h4>
                <p className="text-sm text-gray-600 mt-1">
                  You're on the verge of completing your badge collection. Focus on these rare badges to reach 100%:
                </p>
                
                {unEarnedRareBadges.length > 0 ? (
                  <ul className="mt-2 space-y-1">
                    {unEarnedRareBadges.map(badge => (
                      <li key={badge.id} className="text-sm flex items-center">
                        <i className={`${badge.icon} text-gray-500 mr-2`}></i>
                        <span>{badge.name}</span>
                        {badge.maxSupply && (
                          <span className="ml-2 text-xs text-amber-600">(Limited: only {badge.maxSupply} available)</span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm italic mt-2">
                    Continue participating in discussions and contributing to earn your remaining badges.
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Your strongest categories:
                </p>
                <div className="space-y-3 mt-2">
                  {topCategories.map(({ category, total, earned, percentage }) => (
                    <div key={category}>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium">{category}</span>
                        <span>{earned}/{total} ({percentage}%)</span>
                      </div>
                      <Progress value={percentage} className="h-1.5 mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center">
            <motion.div 
              className={`w-28 h-28 rounded-full flex items-center justify-center ${
                isComplete 
                  ? 'bg-gradient-to-br from-amber-300 to-yellow-500 shadow-xl' 
                  : nearCompletion 
                    ? 'bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg' 
                    : 'bg-gradient-to-br from-gray-200 to-gray-300'
              }`}
              initial={{ scale: 0.9, rotate: -5 }}
              animate={{ 
                scale: isComplete ? [1, 1.05, 1] : 1,
                rotate: isComplete ? [0, 5, 0, -5, 0] : 0
              }}
              transition={{ 
                duration: isComplete ? 2 : 0.5,
                repeat: isComplete ? Infinity : 0,
                repeatDelay: isComplete ? 5 : 0
              }}
            >
              <div className={`text-center ${isComplete ? 'text-white' : nearCompletion ? 'text-white' : 'text-gray-700'}`}>
                <div className="text-3xl font-bold">{completionPercentage}%</div>
                <div className="text-xs uppercase tracking-wider mt-1">Complete</div>
              </div>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}