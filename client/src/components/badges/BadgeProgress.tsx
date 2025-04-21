import React from 'react';
import { Badge } from '@shared/schema';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Sparkles } from 'lucide-react';
import { Badge as UIBadge } from '@/components/ui/badge';

interface BadgeProgressItem {
  id: number;
  userId: number;
  badgeId: number;
  currentProgress: number;
  maxProgress: number;
  progressPercentage: number;
  lastUpdated: Date;
  createdAt: Date;
  badge: Badge;
}

interface BadgeProgressProps {
  progressItems: BadgeProgressItem[];
  isLoading: boolean;
  error: Error | null;
}

export function BadgeProgress({ progressItems, isLoading, error }: BadgeProgressProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 mt-4">
        <Card className="animate-pulse bg-muted">
          <CardHeader className="pb-2">
            <div className="h-4 w-1/2 bg-muted-foreground/20 rounded"></div>
            <div className="h-3 w-3/4 bg-muted-foreground/20 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="h-5 w-full bg-muted-foreground/20 rounded-full mb-2"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse bg-muted">
          <CardHeader className="pb-2">
            <div className="h-4 w-1/2 bg-muted-foreground/20 rounded"></div>
            <div className="h-3 w-3/4 bg-muted-foreground/20 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="h-5 w-full bg-muted-foreground/20 rounded-full mb-2"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-destructive/10 border-destructive">
        <CardHeader>
          <CardTitle>Error Loading Progress</CardTitle>
          <CardDescription>We had trouble loading your badge progress</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (progressItems.length === 0) {
    return (
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>No Badges In Progress</CardTitle>
          <CardDescription>
            You don't have any badges currently in progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Continue participating in the community to make progress toward new badges
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {progressItems.map((progressItem) => (
        <Card key={progressItem.id} className="overflow-hidden">
          <div 
            className={`h-1 bg-gradient-to-r from-primary/50 to-primary`} 
            style={{ width: `${progressItem.progressPercentage}%` }}
          />
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                {getIconForBadgeCategory(progressItem.badge.category)}
                {progressItem.badge.name}
              </CardTitle>
              <UIBadge variant="outline" className="capitalize">
                {progressItem.badge.tier}
              </UIBadge>
            </div>
            <CardDescription>
              {progressItem.badge.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="mb-1 flex justify-between text-sm">
              <span>Progress: {progressItem.currentProgress} / {progressItem.maxProgress}</span>
              <span>{progressItem.progressPercentage}%</span>
            </div>
            <Progress value={progressItem.progressPercentage} className="h-2" />
            <div className="mt-2 text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" /> 
              Last updated: {new Date(progressItem.lastUpdated).toLocaleDateString()}
            </div>
          </CardContent>
          <CardFooter className="pt-0 pb-3">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">{progressItem.badge.requirement}</span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function getIconForBadgeCategory(category: string) {
  // You can add more icons based on categories
  return <Sparkles className="h-4 w-4" />;
}