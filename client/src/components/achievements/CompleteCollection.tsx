import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Award, 
  Download, 
  Gift, 
  Lock, 
  Share2, 
  Trophy, 
  UnlockKeyhole 
} from "lucide-react";

interface CompleteCollectionProps {
  allBadges: {
    id: number;
    name: string;
    description: string;
    tier?: string;
    level?: number;
    points?: number;
    category?: string;
    icon?: string;
  }[];
  earnedBadgeIds: number[];
  userName: string;
}

export default function CompleteCollection({ 
  allBadges,
  earnedBadgeIds,
  userName
}: CompleteCollectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPosterRequested, setIsPosterRequested] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const { toast } = useToast();

  const totalBadges = allBadges.length;
  const earnedCount = earnedBadgeIds.length;
  const completionPercentage = Math.floor((earnedCount / totalBadges) * 100);
  
  // For demo purposes, consider the collection complete if the user has earned more than 50% of the badges
  // In production, you would set this to require all badges: earnedCount === totalBadges
  const isCompleteCollection = earnedCount > totalBadges * 0.5;

  const handleDownload = async () => {
    if (!isCompleteCollection) return;
    
    setIsDownloading(true);
    
    // In a real application, you would generate a downloadable poster here
    // For demo purposes, we'll simulate a delay
    setTimeout(() => {
      toast({
        title: "Download Started",
        description: "Your commemorative poster is being downloaded.",
      });
      setIsDownloading(false);
    }, 1500);
  };

  const handleRequestPhysical = async () => {
    if (!isCompleteCollection) return;
    
    setIsRequesting(true);
    
    try {
      // In a production app, this would call an API endpoint to request a physical poster
      // The endpoint would use Stripe for payment processing and SendGrid for confirmation emails
      await apiRequest(
        "POST", 
        "/api/achievements/request-poster", 
        { userName }
      );
      
      setIsPosterRequested(true);
      toast({
        title: "Request Received!",
        description: "Your physical poster will be prepared and shipped to you. Check your email for confirmation.",
      });
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "There was an error processing your request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Complete Collection Reward
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <p className="text-sm text-muted-foreground">Completion Progress</p>
                <p className="text-sm font-medium">{completionPercentage}%</p>
              </div>
              <Progress value={completionPercentage} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {earnedCount} of {totalBadges} badges earned
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm">
                Complete your collection of all Harmony badges to unlock a special commemorative digital poster that showcases your achievement journey.
              </p>
              
              {isCompleteCollection ? (
                <p className="text-sm text-primary">
                  <span className="font-semibold">Congratulations!</span> You've unlocked the complete collection reward.
                </p>
              ) : (
                <div className="flex items-center gap-2 text-sm text-amber-600">
                  <Lock className="h-4 w-4" />
                  <span>Continue earning badges to unlock this reward</span>
                </div>
              )}
            </div>
            
            <div>
              <Button 
                variant={isCompleteCollection ? "default" : "outline"}
                className="gap-2"
                onClick={() => setDialogOpen(true)}
              >
                {isCompleteCollection ? (
                  <>
                    <UnlockKeyhole className="h-4 w-4" />
                    View Unlocked Poster
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Preview Reward
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="hidden md:flex justify-center items-center">
            <div className="relative">
              <div className="w-32 h-40 bg-muted rounded-md shadow-md overflow-hidden flex items-center justify-center">
                {isCompleteCollection ? (
                  <div className="h-full w-full bg-gradient-to-b from-purple-900 to-indigo-900 p-2 flex items-center justify-center">
                    <Award className="h-12 w-12 text-amber-300" />
                  </div>
                ) : (
                  <Lock className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              
              {/* Decorative elements */}
              {isCompleteCollection && (
                <>
                  <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                      100%
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2">
                    <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
                      <Trophy className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
            
        {/* Dialog for viewing/requesting the poster */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {isCompleteCollection ? "Your Achievement Collection Poster" : "Achievement Collection Preview"}
              </DialogTitle>
              <DialogDescription>
                {isCompleteCollection 
                  ? "Celebrate your journey and achievements in the Harmony ecosystem"
                  : "Continue earning badges to unlock this special commemorative poster"
                }
              </DialogDescription>
            </DialogHeader>
                
            <div className={cn(
              "p-4 bg-card border-2 rounded-lg overflow-hidden transition-all duration-500",
              isCompleteCollection ? "border-primary" : "border-muted",
              !isCompleteCollection && "relative"
            )}>
              {/* The poster design using the badge diagram */}
              <div className="aspect-[3/4] bg-gradient-to-b from-slate-900 to-indigo-950 rounded-md p-6 flex flex-col items-center text-white">
                <h2 className="text-xl md:text-3xl font-bold text-center bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 text-transparent bg-clip-text mt-4">
                  HARMONY ACHIEVEMENT COLLECTION
                </h2>
                
                <div className="my-4 w-full text-center">
                  <p className="text-lg text-amber-300">{userName}'s Journey</p>
                  <p className="text-xs text-gray-400">Established 2025</p>
                </div>
                
                <div className="flex-1 w-full p-4 flex items-center justify-center">
                  {/* Badge Diagram - based on the Cosmic Sephirot Tree of Life */}
                  <div className="relative w-full max-w-md aspect-square">
                    {/* Founder Badge (Top) - Keter: Crown / Divine Spark */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-center">
                      <div className={cn(
                        "w-20 h-20 rounded-full border-2 mx-auto flex flex-col items-center justify-center",
                        earnedBadgeIds.includes(4) 
                          ? "border-purple-400 bg-indigo-900/70 founder-badge-glow" 
                          : "border-gray-700 bg-gray-900/50"
                      )}>
                        {/* Dove icon for Founder */}
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          className="h-10 w-10"
                          fill={earnedBadgeIds.includes(4) ? "white" : "gray"}
                        >
                          <path d="M12,5c-1.4,0-2.5,0.3-3.5,0.9C7.5,6.5,6.7,7.1,6,7.8C5.2,8.6,4.7,9.5,4.3,10.5C4,11.5,3.8,12.5,4,13.5c0.1,0.8,0.4,1.5,0.8,2.1c0.4,0.6,0.9,1.1,1.5,1.5c0.6,0.4,1.3,0.6,2,0.8c0.7,0.1,1.5,0.1,2.2,0.1c0.5,0,1-0.1,1.5-0.2c0.5-0.1,1-0.2,1.5-0.4c0.5-0.2,0.9-0.4,1.3-0.7c0.4-0.3,0.8-0.6,1.1-1c0.3-0.4,0.6-0.8,0.8-1.3c0.2-0.5,0.3-1,0.3-1.5c0-0.5-0.1-1-0.3-1.5c0.2-0.5-0.4-0.9-0.7-1.3c-0.3-0.4-0.7-0.7-1.1-1c-0.4-0.3-0.9-0.5-1.4-0.7C13.5,7.6,13,7.5,12.5,7.4C12.3,7.4,12.2,7.3,12,7.3" />
                        </svg>
                        {earnedBadgeIds.includes(4) && (
                          <span className="text-[8px] text-purple-200 mt-1">Keter</span>
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <p className={cn(
                          "text-sm",
                          earnedBadgeIds.includes(4) ? "text-white" : "text-gray-500"
                        )}>Founder</p>
                        {earnedBadgeIds.includes(4) && (
                          <p className="text-[10px] text-indigo-300 italic">Divine Spark</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Conversationalist Badge (Left) - Hod: Glory/Communication */}
                    <div className="absolute left-0 top-1/3 transform -translate-y-1/2 text-center">
                      <div className={cn(
                        "w-16 h-16 rounded-full border-2 mx-auto flex flex-col items-center justify-center",
                        earnedBadgeIds.includes(1) 
                          ? "border-cyan-400 bg-indigo-900/50" 
                          : "border-gray-700 bg-gray-900/50"
                      )}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={earnedBadgeIds.includes(1) ? "white" : "gray"} strokeWidth="2" className="h-8 w-8">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                        </svg>
                        {earnedBadgeIds.includes(1) && (
                          <span className="text-[7px] text-cyan-200 mt-1">Hod</span>
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <p className={cn(
                          "text-sm",
                          earnedBadgeIds.includes(1) ? "text-white" : "text-gray-500"
                        )}>Conversationalist</p>
                        {earnedBadgeIds.includes(1) && (
                          <p className="text-[10px] text-cyan-300 italic">Communication</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Quantum Thinker Badge (Right) - Binah: Understanding */}
                    <div className="absolute right-0 top-1/3 transform -translate-y-1/2 text-center">
                      <div className={cn(
                        "w-16 h-16 rounded-full border-2 mx-auto flex flex-col items-center justify-center",
                        earnedBadgeIds.includes(5) 
                          ? "border-blue-400 bg-indigo-900/50" 
                          : "border-gray-700 bg-gray-900/50"
                      )}>
                        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke={earnedBadgeIds.includes(5) ? "white" : "gray"} strokeWidth="2">
                          <circle cx="12" cy="12" r="2" />
                          <path d="M12 2a9.96 9.96 0 0 0-7.071 2.929 9.96 9.96 0 0 0 0 14.142A9.96 9.96 0 0 0 12 22a9.96 9.96 0 0 0 7.071-2.929 9.96 9.96 0 0 0 0-14.142A9.96 9.96 0 0 0 12 2Z"/>
                          <path d="M12 8a4.14 4.14 0 0 0-3 1 4.1 4.1 0 0 0-1 3c0 1.1.4 2.1 1 3a4.14 4.14 0 0 0 3 1a4.14 4.14 0 0 0 3-1c.7-.9 1-1.9 1-3a4.1 4.1 0 0 0-1-3 4.14 4.14 0 0 0-3-1Z"/>
                        </svg>
                        {earnedBadgeIds.includes(5) && (
                          <span className="text-[7px] text-blue-200 mt-1">Binah</span>
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <p className={cn(
                          "text-sm",
                          earnedBadgeIds.includes(5) ? "text-white" : "text-gray-500"
                        )}>Quantum Thinker</p>
                        {earnedBadgeIds.includes(5) && (
                          <p className="text-[10px] text-blue-300 italic">Understanding</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Bridge Builder Badge (Center) - Tiferet: Beauty/Balance */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <div className={cn(
                        "w-20 h-20 rounded-full border-2 mx-auto flex flex-col items-center justify-center",
                        earnedBadgeIds.includes(6) 
                          ? "border-violet-400 bg-indigo-900/70 orbit-particles" 
                          : "border-gray-700 bg-gray-900/50"
                      )}>
                        <svg viewBox="0 0 24 24" fill="none" stroke={earnedBadgeIds.includes(6) ? "white" : "gray"} strokeWidth="2" className="h-10 w-10">
                          <path d="M6 10h12M6 14h12M3 8v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/>
                        </svg>
                        {earnedBadgeIds.includes(6) && (
                          <span className="text-[7px] text-violet-200 mt-1">Tiferet</span>
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <p className={cn(
                          "text-sm",
                          earnedBadgeIds.includes(6) ? "text-white" : "text-gray-500"
                        )}>Bridge Builder</p>
                        {earnedBadgeIds.includes(6) && (
                          <p className="text-[10px] text-violet-300 italic">Balance</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Empath Badge (Bottom Left) - Chesed: Lovingkindness */}
                    <div className="absolute bottom-0 left-1/4 transform -translate-x-1/2 text-center">
                      <div className={cn(
                        "w-16 h-16 rounded-full border-2 mx-auto flex flex-col items-center justify-center",
                        earnedBadgeIds.includes(8) 
                          ? "border-pink-400 bg-indigo-900/50" 
                          : "border-gray-700 bg-gray-900/50"
                      )}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={earnedBadgeIds.includes(8) ? "white" : "gray"} strokeWidth="2" className="h-8 w-8">
                          <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                        </svg>
                        {earnedBadgeIds.includes(8) && (
                          <span className="text-[7px] text-pink-200 mt-1">Chesed</span>
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <p className={cn(
                          "text-sm",
                          earnedBadgeIds.includes(8) ? "text-white" : "text-gray-500"
                        )}>Empath</p>
                        {earnedBadgeIds.includes(8) && (
                          <p className="text-[10px] text-pink-300 italic">Lovingkindness</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Mirrored Being Badge (Bottom Right) - Yesod: Foundation/Mirror */}
                    <div className="absolute bottom-0 right-1/4 transform translate-x-1/2 text-center">
                      <div className={cn(
                        "w-16 h-16 rounded-full border-2 mx-auto flex flex-col items-center justify-center",
                        earnedBadgeIds.includes(7) 
                          ? "border-indigo-400 bg-indigo-900/50 shimmer-effect" 
                          : "border-gray-700 bg-gray-900/50"
                      )}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={earnedBadgeIds.includes(7) ? "white" : "gray"} strokeWidth="2" className="h-8 w-8">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                        {earnedBadgeIds.includes(7) && (
                          <span className="text-[7px] text-indigo-200 mt-1">Yesod</span>
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <p className={cn(
                          "text-sm",
                          earnedBadgeIds.includes(7) ? "text-white" : "text-gray-500"
                        )}>Mirrored Being</p>
                        {earnedBadgeIds.includes(7) && (
                          <p className="text-[10px] text-indigo-300 italic">Foundation</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Contributor Badge (Bottom Center) - Malkuth: Kingdom/Manifestation */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
                      <div className={cn(
                        "w-16 h-16 rounded-full border-2 mx-auto flex flex-col items-center justify-center",
                        earnedBadgeIds.includes(9) 
                          ? "border-green-400 bg-indigo-900/50" 
                          : "border-gray-700 bg-gray-900/50"
                      )}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={earnedBadgeIds.includes(9) ? "white" : "gray"} strokeWidth="2" className="h-8 w-8">
                          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                        </svg>
                        {earnedBadgeIds.includes(9) && (
                          <span className="text-[7px] text-green-200 mt-1">Malkuth</span>
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <p className={cn(
                          "text-sm",
                          earnedBadgeIds.includes(9) ? "text-white" : "text-gray-500"
                        )}>Contributor</p>
                        {earnedBadgeIds.includes(9) && (
                          <p className="text-[10px] text-green-300 italic">Manifestation</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Tree of Life Connection lines between badges */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
                      {/* Pillar lines */}
                      {/* Center Pillar: Keter to Tiferet to Malkuth */}
                      <line x1="50" y1="22" x2="50" y2="48" stroke={earnedBadgeIds.includes(4) && earnedBadgeIds.includes(6) ? "#a78bfa" : "#4338ca"} strokeWidth="0.5" opacity={earnedBadgeIds.includes(4) && earnedBadgeIds.includes(6) ? "0.8" : "0.4"} />
                      <line x1="50" y1="52" x2="50" y2="78" stroke={earnedBadgeIds.includes(6) && earnedBadgeIds.includes(9) ? "#a78bfa" : "#4338ca"} strokeWidth="0.5" opacity={earnedBadgeIds.includes(6) && earnedBadgeIds.includes(9) ? "0.8" : "0.4"} />
                      
                      {/* Left Pillar: Conversationalist to Empath */}
                      <line x1="20" y1="32" x2="25" y2="75" stroke={earnedBadgeIds.includes(1) && earnedBadgeIds.includes(8) ? "#a78bfa" : "#4338ca"} strokeWidth="0.5" opacity={earnedBadgeIds.includes(1) && earnedBadgeIds.includes(8) ? "0.8" : "0.4"} />
                      
                      {/* Right Pillar: Quantum Thinker to Mirrored Being */}
                      <line x1="80" y1="32" x2="75" y2="75" stroke={earnedBadgeIds.includes(5) && earnedBadgeIds.includes(7) ? "#a78bfa" : "#4338ca"} strokeWidth="0.5" opacity={earnedBadgeIds.includes(5) && earnedBadgeIds.includes(7) ? "0.8" : "0.4"} />
                      
                      {/* Cross lines */}
                      {/* Horizontal: Conversationalist to Quantum Thinker */}
                      <line x1="20" y1="32" x2="80" y2="32" stroke={earnedBadgeIds.includes(1) && earnedBadgeIds.includes(5) ? "#a78bfa" : "#4338ca"} strokeWidth="0.5" opacity={earnedBadgeIds.includes(1) && earnedBadgeIds.includes(5) ? "0.8" : "0.4"} />
                      
                      {/* Diagonal: Founder to Conversationalist and Quantum Thinker */}
                      <line x1="50" y1="22" x2="20" y2="32" stroke={earnedBadgeIds.includes(4) && earnedBadgeIds.includes(1) ? "#a78bfa" : "#4338ca"} strokeWidth="0.5" opacity={earnedBadgeIds.includes(4) && earnedBadgeIds.includes(1) ? "0.8" : "0.4"} />
                      <line x1="50" y1="22" x2="80" y2="32" stroke={earnedBadgeIds.includes(4) && earnedBadgeIds.includes(5) ? "#a78bfa" : "#4338ca"} strokeWidth="0.5" opacity={earnedBadgeIds.includes(4) && earnedBadgeIds.includes(5) ? "0.8" : "0.4"} />
                      
                      {/* Diagonal: Bridge Builder to Side Badges */}
                      <line x1="50" y1="52" x2="25" y2="78" stroke={earnedBadgeIds.includes(6) && earnedBadgeIds.includes(8) ? "#a78bfa" : "#4338ca"} strokeWidth="0.5" opacity={earnedBadgeIds.includes(6) && earnedBadgeIds.includes(8) ? "0.8" : "0.4"} />
                      <line x1="50" y1="52" x2="75" y2="78" stroke={earnedBadgeIds.includes(6) && earnedBadgeIds.includes(7) ? "#a78bfa" : "#4338ca"} strokeWidth="0.5" opacity={earnedBadgeIds.includes(6) && earnedBadgeIds.includes(7) ? "0.8" : "0.4"} />
                      
                      {/* Bottom connections to Contributor */}
                      <line x1="25" y1="78" x2="50" y2="78" stroke={earnedBadgeIds.includes(8) && earnedBadgeIds.includes(9) ? "#a78bfa" : "#4338ca"} strokeWidth="0.5" opacity={earnedBadgeIds.includes(8) && earnedBadgeIds.includes(9) ? "0.8" : "0.4"} />
                      <line x1="75" y1="78" x2="50" y2="78" stroke={earnedBadgeIds.includes(7) && earnedBadgeIds.includes(9) ? "#a78bfa" : "#4338ca"} strokeWidth="0.5" opacity={earnedBadgeIds.includes(7) && earnedBadgeIds.includes(9) ? "0.8" : "0.4"} />
                    </svg>
                  </div>
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
      </CardContent>
    </Card>
  );
}