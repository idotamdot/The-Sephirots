import QuestSystem from "@/components/quests/QuestSystem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/lib/types";
import { Zap, Target, Trophy } from "lucide-react";

export default function Quests() {
  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });

  return (
    <div className="container py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-br from-amber-500 to-purple-600 bg-clip-text text-transparent mb-2">
          Quest System
        </h1>
        <p className="text-gray-600">
          Complete daily, weekly, and achievement quests to earn points and unlock exclusive badges.
        </p>
      </div>

      {/* Stats Overview */}
      {currentUser && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Total Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{currentUser.points}</div>
              <p className="text-sm text-gray-500 mt-1">Earned through quests and contributions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Current Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{currentUser.level}</div>
              <p className="text-sm text-gray-500 mt-1">Keep completing quests to level up</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-500" />
                Quest Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">0 days</div>
              <p className="text-sm text-gray-500 mt-1">Complete daily quests to build a streak</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quest System */}
      <QuestSystem />

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quest Types</CardTitle>
            <CardDescription>Different types of quests available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Daily Quests</h4>
                  <p className="text-xs text-gray-600">Quick tasks that refresh every 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-purple-700" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Weekly Quests</h4>
                  <p className="text-xs text-gray-600">Larger goals with bigger rewards, resets weekly</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Achievement Quests</h4>
                  <p className="text-xs text-gray-600">Special one-time challenges that unlock badges</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rewards & Benefits</CardTitle>
            <CardDescription>What you can earn from quests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm font-medium">Experience Points</span>
                <span className="text-amber-600 font-semibold">10-100 pts</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm font-medium">Exclusive Badges</span>
                <span className="text-purple-600 font-semibold">Special Rewards</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm font-medium">Level Progression</span>
                <span className="text-blue-600 font-semibold">Faster Growth</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">Community Recognition</span>
                <span className="text-green-600 font-semibold">Prestige</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
