import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { User } from "@/lib/types";

// Types for rewards
interface Reward {
  id: number;
  title: string;
  description: string;
  pointsCost: number;
  category: "digital" | "physical" | "experience" | "community" | "training";
  tags: string[];
  image?: string;
  available: boolean;
  estimatedDelivery?: string;
  featured?: boolean;
  limited?: boolean;
  remaining?: number;
}

// Sample rewards data
const REWARDS: Reward[] = [
  {
    id: 1,
    title: "One-on-One Session with Spiritual Guide",
    description: "A personalized 60-minute session with a respected spiritual guide to help you navigate your spiritual journey.",
    pointsCost: 2500,
    category: "experience",
    tags: ["guidance", "personal", "development"],
    available: true,
    estimatedDelivery: "Schedule within 2 weeks",
    featured: true
  },
  {
    id: 2,
    title: "Handcrafted Sephirotic Meditation Beads",
    description: "Ethically sourced natural stone beads with the 10 Sephiroth symbols, handmade by our community artisans.",
    pointsCost: 3000,
    category: "physical",
    tags: ["meditation", "handcrafted", "symbolic"],
    available: true,
    estimatedDelivery: "3-4 weeks shipping",
    remaining: 12,
    limited: true
  },
  {
    id: 3,
    title: "Tree of Life Illuminated Art Print",
    description: "Museum-quality print of the Tree of Life with gold leaf accents, signed by the artist.",
    pointsCost: 1800,
    category: "physical",
    tags: ["art", "decor", "symbolic"],
    available: true,
    estimatedDelivery: "2-3 weeks shipping"
  },
  {
    id: 4,
    title: "Advanced Meditation Techniques Course",
    description: "Six-week online course teaching advanced meditation techniques based on Kabbalistic principles.",
    pointsCost: 2200,
    category: "training",
    tags: ["learning", "meditation", "kabbalah"],
    available: true
  },
  {
    id: 5,
    title: "Community Retreat Scholarship",
    description: "Partial scholarship towards our annual in-person spiritual retreat (covers 50% of costs).",
    pointsCost: 5000,
    category: "community",
    tags: ["retreat", "in-person", "fellowship"],
    available: true,
    estimatedDelivery: "Next retreat: October 2025",
    featured: true,
    limited: true,
    remaining: 5
  },
  {
    id: 6,
    title: "Digital Library Access Pass",
    description: "One-year access to our extensive digital library of rare spiritual texts and commentaries.",
    pointsCost: 1500,
    category: "digital",
    tags: ["library", "digital", "learning"],
    available: true
  }
];

// Rewards by category
const getRewardsByCategory = (category: string) => {
  if (category === "all") return REWARDS;
  return REWARDS.filter(reward => reward.category === category);
};

// Component for displaying rewards and exchanging points
export default function RewardsExchange() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedReward, setSelectedReward] = useState<number | null>(null);
  const [confirmingReward, setConfirmingReward] = useState(false);
  
  // Get current user
  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });
  
  // Calculate if user has enough points for a reward
  const canAffordReward = (pointsCost: number) => {
    return (currentUser?.points || 0) >= pointsCost;
  };
  
  // Handle reward selection
  const handleSelectReward = (rewardId: number) => {
    setSelectedReward(rewardId);
    setConfirmingReward(false);
  };
  
  // Handle reward redemption
  const handleRedeemReward = () => {
    setConfirmingReward(true);
  };
  
  // Confirm reward redemption
  const confirmRedemption = () => {
    // In a real implementation, this would call an API to redeem the reward
    alert("Reward redeemed successfully! Check your email for details.");
    setConfirmingReward(false);
    setSelectedReward(null);
  };
  
  // Get the selected reward details
  const selectedRewardDetails = selectedReward 
    ? REWARDS.find(r => r.id === selectedReward) 
    : null;
  
  // Calculate progress towards next tier
  const TIER_THRESHOLDS = [0, 1000, 5000, 10000, 25000];
  const currentPoints = currentUser?.points || 0;
  const currentTierIndex = TIER_THRESHOLDS.findIndex(threshold => currentPoints < threshold) - 1;
  const currentTier = Math.max(0, currentTierIndex);
  const nextTier = currentTier + 1;
  
  const currentTierThreshold = TIER_THRESHOLDS[currentTier] || 0;
  const nextTierThreshold = TIER_THRESHOLDS[nextTier] || currentTierThreshold;
  const tierProgress = nextTierThreshold > currentTierThreshold
    ? Math.floor(((currentPoints - currentTierThreshold) / (nextTierThreshold - currentTierThreshold)) * 100)
    : 100;
  
  return (
    <div className="space-y-6">
      {/* User's points and progress */}
      <div className="bg-gradient-to-r from-amber-50 to-purple-50 p-6 rounded-lg shadow-sm border border-amber-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <div className="mr-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-300 flex items-center justify-center shadow-inner">
                <i className="ri-coins-line text-2xl text-white"></i>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Your Spiritual Points</h3>
              <p className="text-3xl font-bold text-amber-600">{currentUser?.points || 0}</p>
            </div>
          </div>
          
          <div className="flex flex-col justify-center md:col-span-2">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-600">
                Tier {currentTier}: {TIER_THRESHOLDS[currentTier]} points
              </span>
              <span className="text-sm font-medium text-gray-600">
                Tier {nextTier}: {TIER_THRESHOLDS[nextTier]} points
              </span>
            </div>
            <Progress value={tierProgress} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              {tierProgress}% progress to next tier • {nextTierThreshold - currentPoints} points needed
            </p>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rewards categories and list */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Rewards</TabsTrigger>
              <TabsTrigger value="digital">Digital</TabsTrigger>
              <TabsTrigger value="physical">Physical</TabsTrigger>
              <TabsTrigger value="experience">Experiences</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
              <TabsTrigger value="training">Training</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeCategory} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getRewardsByCategory(activeCategory).map(reward => (
                  <Card 
                    key={reward.id}
                    className={`overflow-hidden hover:shadow-md transition-all cursor-pointer ${
                      selectedReward === reward.id ? 'ring-2 ring-primary-500' : ''
                    } ${!canAffordReward(reward.pointsCost) ? 'opacity-70' : ''}`}
                    onClick={() => handleSelectReward(reward.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <Badge className="bg-primary-100 text-primary-800 hover:bg-primary-200">
                          {reward.category.charAt(0).toUpperCase() + reward.category.slice(1)}
                        </Badge>
                        {reward.featured && (
                          <Badge variant="secondary">
                            <i className="ri-award-fill mr-1"></i>
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="mt-2">{reward.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{reward.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {reward.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      {reward.limited && (
                        <div className="text-xs text-amber-600 flex items-center mb-1">
                          <i className="ri-timer-line mr-1"></i>
                          Limited availability ({reward.remaining} remaining)
                        </div>
                      )}
                      
                      {reward.estimatedDelivery && (
                        <div className="text-xs text-gray-600">
                          <i className="ri-calendar-line mr-1"></i>
                          {reward.estimatedDelivery}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <div className="font-medium text-amber-700">
                        <i className="ri-coins-line mr-1"></i>
                        {reward.pointsCost} points
                      </div>
                      <Button 
                        variant={canAffordReward(reward.pointsCost) ? "default" : "outline"}
                        size="sm"
                        disabled={!canAffordReward(reward.pointsCost)}
                      >
                        {canAffordReward(reward.pointsCost) 
                          ? "Select" 
                          : `Need ${reward.pointsCost - (currentUser?.points || 0)} more`}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Selected reward details and redemption */}
        <div>
          {selectedReward ? (
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Reward Details</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                {selectedRewardDetails && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-primary-900">{selectedRewardDetails.title}</h3>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {selectedRewardDetails.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-gray-600">{selectedRewardDetails.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Category:</span>
                        <span className="font-medium">{selectedRewardDetails.category.charAt(0).toUpperCase() + selectedRewardDetails.category.slice(1)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Cost:</span>
                        <span className="font-medium text-amber-600">{selectedRewardDetails.pointsCost} points</span>
                      </div>
                      {selectedRewardDetails.estimatedDelivery && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Delivery:</span>
                          <span className="font-medium">{selectedRewardDetails.estimatedDelivery}</span>
                        </div>
                      )}
                      {selectedRewardDetails.limited && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Availability:</span>
                          <span className="font-medium text-amber-600">Limited ({selectedRewardDetails.remaining} left)</span>
                        </div>
                      )}
                    </div>
                    
                    {confirmingReward ? (
                      <div className="bg-amber-50 p-4 rounded-lg mt-4">
                        <h4 className="font-medium text-amber-800 mb-2">Confirm Redemption</h4>
                        <p className="text-sm text-amber-700 mb-4">
                          You are about to exchange {selectedRewardDetails.pointsCost} points for this reward. This action cannot be undone.
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setConfirmingReward(false)}>
                            Cancel
                          </Button>
                          <Button onClick={confirmRedemption}>
                            Confirm
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 mt-4">
                        <Button 
                          className="flex-1" 
                          onClick={handleRedeemReward}
                          disabled={!canAffordReward(selectedRewardDetails.pointsCost)}
                        >
                          <i className="ri-exchange-funds-line mr-1"></i>
                          Redeem Reward
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="text-sm text-gray-500 italic">
                  Rewards are subject to availability and terms of service.
                </div>
              </CardFooter>
            </Card>
          ) : (
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Rewards Exchange</CardTitle>
                <CardDescription>
                  Exchange your spiritual points for meaningful rewards that enhance your journey.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium text-amber-800 mb-2">How It Works</h4>
                    <ul className="text-sm text-amber-700 space-y-2 list-disc list-inside">
                      <li>Earn points through participation and contributions</li>
                      <li>Select rewards that resonate with your journey</li>
                      <li>Redeem points for physical items, experiences, or digital content</li>
                      <li>Receive confirmation and tracking details via email</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Featured Rewards</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      {REWARDS.filter(r => r.featured).map(reward => (
                        <li key={reward.id} className="flex justify-between">
                          <span>{reward.title}</span>
                          <span className="font-medium">{reward.pointsCost} pts</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Select a reward from the list to see details</p>
                    <i className="ri-arrow-left-line text-2xl text-gray-400"></i>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-gray-500 italic">
                  New rewards are added regularly. Check back often!
                </div>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}