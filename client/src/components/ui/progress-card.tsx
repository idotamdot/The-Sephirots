import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressCardProps {
  title: string;
  points: number;
  level: number;
  pointsToNextLevel: number;
  weeklyProgress?: number;
}

export default function ProgressCard({ 
  title, 
  points, 
  level, 
  pointsToNextLevel, 
  weeklyProgress 
}: ProgressCardProps) {
  const progressPercent = Math.floor((points % 100) / (pointsToNextLevel + (points % 100)) * 100);
  
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-700">{title}</h3>
          {weeklyProgress && (
            <span className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-700">
              +{weeklyProgress} this week
            </span>
          )}
        </div>
        
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-gray-900">{points}</span>
          <span className="ml-2 text-sm text-gray-500">points total</span>
        </div>
        
        <div className="mt-4">
          <Progress value={progressPercent} className="h-2" />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">Level {level}</span>
            <span className="text-xs text-gray-500">
              {pointsToNextLevel} points to Level {level + 1}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
