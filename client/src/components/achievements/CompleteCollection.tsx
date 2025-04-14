import React, { useState } from 'react';
import { Badge } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Award, Download, Gift, Share2, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [posterView, setPosterView] = useState<'preview' | 'full'>('preview');
  
  // Check if all badges are earned
  const isCompleteCollection = allBadges.length > 0 && 
    earnedBadgeIds.length === allBadges.length;
  
  // For demo purposes, we can also check if at least 3 badges are earned
  const hasMultipleBadges = earnedBadgeIds.length >= 3;
  
  // Only show when collection is complete or multiple badges for demo
  if (!isCompleteCollection && !hasMultipleBadges) {
    return null;
  }

  const handleDownload = () => {
    // In a real implementation, this would generate a high-quality poster for download
    alert('This would download a high-quality poster in a real implementation!');
    // Here you could call an API to generate the PDF or PNG
  };

  const handleRequestPhysical = () => {
    // This would open a dialog to collect shipping information
    alert('This would collect shipping information to send a physical poster!');
  };

  return (
    <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardContent className="p-6">
        <div className="absolute top-0 right-0 p-4">
          <Trophy className="h-16 w-16 text-primary/20" />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">
                {isCompleteCollection ? 'Complete Badge Collection!' : 'Badge Collection Progress'}
              </h3>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {isCompleteCollection 
                ? 'Congratulations! You have earned all available badges in the Harmony ecosystem. Unlock your commemorative poster below!'
                : `You've earned ${earnedBadgeIds.length} out of ${allBadges.length} badges. Keep going to unlock the special commemorative poster!`
              }
            </p>
            
            {/* Progress indicator */}
            <div className="w-full bg-muted rounded-full h-2 mt-4">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: `${Math.min(100, (earnedBadgeIds.length / allBadges.length) * 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {earnedBadgeIds.length}/{allBadges.length} Badges
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Gift className="h-4 w-4" />
                  {isCompleteCollection ? 'View Commemorative Poster' : 'Preview Reward'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>
                    {isCompleteCollection ? 'Your Harmony Collection Poster' : 'Badge Collection Preview'}
                  </DialogTitle>
                  <DialogDescription>
                    {isCompleteCollection 
                      ? 'Congratulations on completing your badge collection! Here is your commemorative poster.'
                      : 'Continue earning badges to unlock the complete poster.'
                    }
                  </DialogDescription>
                </DialogHeader>
                
                <div className={cn(
                  "p-4 bg-card border-2 rounded-lg overflow-hidden transition-all duration-500",
                  isCompleteCollection ? "border-primary" : "border-muted",
                  !isCompleteCollection && "relative"
                )}>
                  {/* The poster design */}
                  <div className="aspect-[3/4] bg-gradient-to-b from-slate-900 to-indigo-950 rounded-md p-6 flex flex-col items-center text-white">
                    <h2 className="text-xl md:text-3xl font-bold text-center bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 text-transparent bg-clip-text mt-4">
                      HARMONY ACHIEVEMENT COLLECTION
                    </h2>
                    
                    <div className="my-4 w-full text-center">
                      <p className="text-lg text-amber-300">{userName}'s Journey</p>
                      <p className="text-xs text-gray-400">Established 2025</p>
                    </div>
                    
                    <div className="flex-1 w-full p-4 grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-6 place-items-center">
                      {allBadges.map(badge => {
                        const isEarned = earnedBadgeIds.includes(badge.id);
                        
                        return (
                          <div 
                            key={badge.id}
                            className={cn(
                              "w-16 h-16 rounded-full border-2 flex items-center justify-center",
                              isEarned 
                                ? "border-amber-300 bg-indigo-800/50" 
                                : "border-gray-700 bg-gray-900/50"
                            )}
                          >
                            <Award className={cn(
                              "h-8 w-8",
                              isEarned ? "text-amber-300" : "text-gray-700"
                            )} />
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-6 mb-2 text-center">
                      <p className="text-xs text-gray-400">HARMONY ECOSYSTEM</p>
                      <p className="text-xs text-gray-500 mt-1">A commemorative collection of achievements in the union of human and AI consciousness</p>
                    </div>
                  </div>
                  
                  {/* Overlay for incomplete collection */}
                  {!isCompleteCollection && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
                      <Trophy className="h-16 w-16 text-muted-foreground mb-4" />
                      <p className="text-center text-muted-foreground max-w-xs">
                        Continue your journey to earn all badges and unlock the complete commemorative poster!
                      </p>
                    </div>
                  )}
                </div>
                
                <DialogFooter className="mt-4">
                  {isCompleteCollection && (
                    <>
                      <Button variant="outline" className="gap-2" onClick={handleDownload}>
                        <Download className="h-4 w-4" />
                        Download Digital Poster
                      </Button>
                      <Button className="gap-2" onClick={handleRequestPhysical}>
                        <Gift className="h-4 w-4" />
                        Request Physical Copy
                      </Button>
                    </>
                  )}
                  {!isCompleteCollection && (
                    <Button variant="outline" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share Progress
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {isCompleteCollection && (
              <p className="text-xs text-center text-muted-foreground">
                You can also request a physical print!
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}