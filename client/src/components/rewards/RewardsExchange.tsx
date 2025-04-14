import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/lib/types";

// Define reward types and their categories
const rewardCategories = [
  { 
    id: "digital", 
    name: "Digital Resources",
    description: "Digital spiritual resources to enhance your practice" 
  },
  { 
    id: "physical", 
    name: "Physical Items",
    description: "Tangible spiritual tools and artifacts" 
  },
  { 
    id: "experiences", 
    name: "Spiritual Experiences",
    description: "Guided spiritual experiences and sessions" 
  },
  { 
    id: "community", 
    name: "Community Perks",
    description: "Special access and community benefits" 
  }
];

// Define available rewards
const rewards = [
  {
    id: 1,
    name: "Cosmic Meditation Guide",
    description: "A comprehensive digital guide to sephirotic meditation techniques, unlocking deeper cosmic awareness.",
    points: 1000,
    category: "digital",
    imageUrl: "https://images.unsplash.com/photo-1495727034151-8fdc73e332a8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    stock: 999,
    tags: ["meditation", "digital", "beginner"]
  },
  {
    id: 2,
    name: "Virtual Wisdom Session",
    description: "One-hour personal guidance with a Sephirotic wisdom keeper to help navigate your spiritual journey.",
    points: 2500,
    category: "experiences",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5463357?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    stock: 5,
    tags: ["mentorship", "virtual", "personal"]
  },
  {
    id: 3,
    name: "Handcrafted Sephirot Crystal Set",
    description: "Set of 10 crystals corresponding to each Sephirot on the Tree of Life, energetically attuned.",
    points: 5000,
    category: "physical",
    imageUrl: "https://images.unsplash.com/photo-1509994196812-897f5a6ab49c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    stock: 3,
    tags: ["crystals", "premium", "physical"]
  },
  {
    id: 4,
    name: "Community Council Invitation",
    description: "Join the monthly Sephirotic Council meeting where community governance decisions are discussed.",
    points: 3000,
    category: "community",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5463357?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    stock: 10,
    tags: ["governance", "exclusive", "community"]
  },
  {
    id: 5,
    name: "Divine Light Visualization Course",
    description: "Advanced 7-day course on channeling sephirotic light for personal transformation.",
    points: 2000,
    category: "digital",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    stock: 999,
    tags: ["course", "advanced", "visualization"]
  },
  {
    id: 6,
    name: "Sacred Geometry Art Print",
    description: "Limited edition sacred geometry art print depicting the Tree of Life, signed by the artist.",
    points: 4000,
    category: "physical",
    imageUrl: "https://images.unsplash.com/photo-1545060894-7b18188a1dc0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    stock: 15,
    tags: ["art", "limited", "physical"]
  },
  {
    id: 7,
    name: "Higher Mind Integration Workshop",
    description: "Interactive virtual workshop exploring the connection between higher self and material existence.",
    points: 2200,
    category: "experiences",
    imageUrl: "https://images.unsplash.com/photo-1507494924047-60b8ee826ca9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    stock: 20,
    tags: ["workshop", "interactive", "group"]
  },
  {
    id: 8,
    name: "Exclusive Beta Access: Mind Mapping Tool",
    description: "Be among the first to test new features in our metaphysical mind mapping tool.",
    points: 1500,
    category: "community",
    imageUrl: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    stock: 25,
    tags: ["beta", "software", "exclusive"]
  }
];

export default function RewardsExchange() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Get current user
  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });

  const filteredRewards = selectedCategory 
    ? rewards.filter(reward => reward.category === selectedCategory)
    : rewards;

  const handleRewardSelect = (reward: any) => {
    setSelectedReward(reward);
    setConfirmDialogOpen(true);
  };

  const handleRedeem = () => {
    // Would normally make an API call to redeem the reward
    setConfirmDialogOpen(false);
    
    // Check if user has enough points
    if ((currentUser?.points || 0) < selectedReward.points) {
      toast({
        variant: "destructive",
        title: "Insufficient Points",
        description: `You need ${selectedReward.points - (currentUser?.points || 0)} more points to redeem this reward.`
      });
      return;
    }
    
    setSuccessDialogOpen(true);
    
    // Show success message
    toast({
      title: "Reward Redeemed!",
      description: `You've successfully redeemed ${selectedReward.name}`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Category filters */}
      <div className="flex flex-wrap gap-3">
        <Button 
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
        >
          All Rewards
        </Button>
        
        {rewardCategories.map(category => (
          <Button 
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
      
      {/* Rewards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map(reward => (
          <Card key={reward.id} className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg border-opacity-50 hover:border-amber-300">
            <div className="h-48 overflow-hidden">
              <img 
                src={reward.imageUrl} 
                alt={reward.name} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
            
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{reward.name}</CardTitle>
                <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm font-medium">
                  {reward.points} pts
                </div>
              </div>
              <CardDescription>{reward.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="pb-0 flex-grow">
              <div className="flex flex-wrap gap-1 mb-2">
                {reward.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="bg-amber-50">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Category: {rewardCategories.find(c => c.id === reward.category)?.name}</span>
                <span>{reward.stock} available</span>
              </div>
            </CardContent>
            
            <CardFooter className="pt-4">
              <Button
                className="w-full bg-gradient-to-r from-amber-500 to-sephirot-purple hover:opacity-90"
                onClick={() => handleRewardSelect(reward)}
                disabled={(currentUser?.points || 0) < reward.points}
              >
                {(currentUser?.points || 0) >= reward.points ? "Redeem Reward" : "Need More Points"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Redemption</DialogTitle>
            <DialogDescription>
              Are you sure you want to redeem the following reward?
            </DialogDescription>
          </DialogHeader>
          
          {selectedReward && (
            <div className="flex gap-4 py-2">
              <div className="w-20 h-20 overflow-hidden rounded-md flex-shrink-0">
                <img 
                  src={selectedReward.imageUrl} 
                  alt={selectedReward.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold">{selectedReward.name}</h4>
                <p className="text-sm text-gray-500">{selectedReward.description}</p>
                <div className="mt-2 font-medium text-amber-600">{selectedReward.points} points</div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
            <Button className="bg-gradient-to-r from-amber-500 to-sephirot-purple" onClick={handleRedeem}>
              Confirm Redemption
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redemption Successful!</DialogTitle>
            <DialogDescription>
              Your reward has been redeemed successfully.
            </DialogDescription>
          </DialogHeader>
          
          {selectedReward && (
            <div className="text-center py-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                <i className="ri-check-line text-3xl text-green-600"></i>
              </div>
              
              <h4 className="font-semibold">{selectedReward.name}</h4>
              <p className="text-sm text-gray-500 mt-1">has been added to your rewards</p>
              
              <div className="mt-4 text-sm text-gray-600">
                <p>You will receive an email with details about your reward.</p>
                <p className="mt-1">Check your redemption history for status updates.</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              onClick={() => setSuccessDialogOpen(false)}
              className="w-full bg-amber-500"
            >
              Return to Rewards
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}