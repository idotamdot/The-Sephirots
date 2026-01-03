import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { 
  Trophy, 
  Star, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Target,
  Compass,
  Award,
  ChevronRight 
} from "lucide-react";

interface Quest {
  id: number;
  title: string;
  description: string;
  type: "daily" | "weekly" | "onboarding" | "achievement" | "special";
  points: number;
  requirements: Record<string, any>;
  status: "not_started" | "in_progress" | "completed" | "expired";
  progress: Record<string, any>;
  badgeReward?: number;
  expiresAt?: string;
}

const questTypeConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  daily: { icon: <Clock className="w-4 h-4" />, color: "bg-blue-100 text-blue-700", label: "Daily" },
  weekly: { icon: <Target className="w-4 h-4" />, color: "bg-purple-100 text-purple-700", label: "Weekly" },
  onboarding: { icon: <Compass className="w-4 h-4" />, color: "bg-green-100 text-green-700", label: "Getting Started" },
  achievement: { icon: <Trophy className="w-4 h-4" />, color: "bg-amber-100 text-amber-700", label: "Achievement" },
  special: { icon: <Star className="w-4 h-4" />, color: "bg-rose-100 text-rose-700", label: "Special Event" },
};

interface QuestCardProps {
  quest: Quest;
  onComplete?: (questId: number) => void;
}

function QuestCard({ quest, onComplete }: QuestCardProps) {
  const config = questTypeConfig[quest.type];
  
  const calculateProgress = () => {
    const requirements = Object.keys(quest.requirements);
    const completed = requirements.filter(key => {
      const required = quest.requirements[key];
      const current = quest.progress[key];
      if (typeof required === "boolean") return current === required;
      if (typeof required === "number") return (current || 0) >= required;
      return false;
    });
    return (completed.length / requirements.length) * 100;
  };

  const progressPercent = calculateProgress();
  const isComplete = progressPercent >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative rounded-xl border transition-all duration-300 ${
        isComplete 
          ? "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50" 
          : "border-gray-200 bg-white hover:shadow-md"
      }`}
    >
      {/* Completion glow effect */}
      {isComplete && (
        <div className="absolute inset-0 rounded-xl bg-green-200/20 animate-pulse" />
      )}
      
      <div className="relative p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge className={config.color}>
              {config.icon}
              <span className="ml-1">{config.label}</span>
            </Badge>
            {quest.expiresAt && (
              <span className="text-xs text-gray-500">
                Expires {new Date(quest.expiresAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-amber-600">
            <Zap className="w-4 h-4" />
            <span className="font-semibold text-sm">{quest.points}</span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-800 mb-1">{quest.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{quest.description}</p>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Requirements list */}
        <div className="space-y-2">
          {Object.entries(quest.requirements).map(([key, value]) => {
            const current = quest.progress[key];
            const isItemComplete = typeof value === "boolean" 
              ? current === value 
              : (current || 0) >= value;
            
            return (
              <div 
                key={key} 
                className={`flex items-center gap-2 text-sm ${
                  isItemComplete ? "text-green-600" : "text-gray-600"
                }`}
              >
                {isItemComplete ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                )}
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                {typeof value === "number" && (
                  <span className="text-gray-400">
                    ({current || 0}/{value})
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Claim button for completed quests */}
        {isComplete && quest.status !== "completed" && (
          <Button 
            className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            onClick={() => onComplete?.(quest.id)}
          >
            <Award className="w-4 h-4 mr-2" />
            Claim Reward
          </Button>
        )}

        {quest.status === "completed" && (
          <div className="mt-4 text-center py-2 bg-green-100 rounded-lg text-green-700 font-medium">
            <CheckCircle2 className="w-4 h-4 inline-block mr-2" />
            Completed!
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface QuestSystemProps {
  compact?: boolean;
  maxQuests?: number;
}

export default function QuestSystem({ compact = false, maxQuests = 6 }: QuestSystemProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>("all");

  const { data: quests, isLoading } = useQuery<Quest[]>({
    queryKey: ["quests"],
    queryFn: async () => {
      const response = await fetch("/api/quests", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch quests");
      return response.json();
    },
  });

  const completeQuestMutation = useMutation({
    mutationFn: async (questId: number) => {
      const response = await fetch(`/api/quests/${questId}/complete`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to complete quest");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["quests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
      toast({
        title: "Quest Completed! 🎉",
        description: `You've earned ${data.pointsAwarded} points!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredQuests = quests?.filter(quest => {
    if (filter === "all") return true;
    if (filter === "active") return quest.status !== "completed" && quest.status !== "expired";
    if (filter === "completed") return quest.status === "completed";
    return quest.type === filter;
  }).slice(0, maxQuests);

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-600" />
            Active Quests
          </CardTitle>
          <CardDescription>Complete quests to earn rewards</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            </div>
          ) : filteredQuests && filteredQuests.length > 0 ? (
            <div className="space-y-3">
              {filteredQuests.slice(0, 3).map(quest => (
                <div key={quest.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${questTypeConfig[quest.type].color}`}>
                    {questTypeConfig[quest.type].icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{quest.title}</p>
                    <Progress value={30} className="h-1 mt-1" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No active quests</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Your Quests</h2>
          <p className="text-gray-600">Complete quests to earn points and unlock achievements</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: "All" },
          { id: "active", label: "Active" },
          { id: "onboarding", label: "Getting Started" },
          { id: "daily", label: "Daily" },
          { id: "weekly", label: "Weekly" },
          { id: "achievement", label: "Achievements" },
          { id: "completed", label: "Completed" },
        ].map(f => (
          <Button
            key={f.id}
            variant={filter === f.id ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f.id)}
            className={filter === f.id ? "bg-amber-500 hover:bg-amber-600" : ""}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Quest Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      ) : filteredQuests && filteredQuests.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredQuests.map(quest => (
              <QuestCard 
                key={quest.id} 
                quest={quest} 
                onComplete={(id) => completeQuestMutation.mutate(id)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Target className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Quests Found</h3>
            <p className="text-gray-500">
              {filter === "completed" 
                ? "You haven't completed any quests yet. Keep going!" 
                : "Check back later for new quests!"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
