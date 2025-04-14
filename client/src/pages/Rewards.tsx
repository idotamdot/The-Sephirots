import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/lib/types";
import RewardsExchange from "@/components/rewards/RewardsExchange";
import StarfieldBackground from "@/components/mindmap/StarfieldBackground";

export default function Rewards() {
  const [activeTab, setActiveTab] = useState("rewards");
  
  // Get current user
  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });

  return (
    <div className="container py-6 max-w-7xl mx-auto relative">
      <div className="relative z-10">
        {/* Page header */}
        <div className="flex flex-col mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-br from-sephirot-purple to-amber-500 bg-clip-text text-transparent">
            Spiritual Journey Rewards
          </h1>
          <p className="text-gray-600 mt-1">
            Exchange your earned points for meaningful spiritual tools, experiences, and resources.
          </p>
        </div>
        
        {/* Main content */}
        <Tabs defaultValue="rewards" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6 w-[400px]">
            <TabsTrigger value="rewards">Rewards Exchange</TabsTrigger>
            <TabsTrigger value="history">Redemption History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rewards">
            <RewardsExchange />
          </TabsContent>
          
          <TabsContent value="history">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Redemption History</CardTitle>
                  <CardDescription>
                    Track the status of your redeemed rewards and past redemptions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Placeholder for redemption history */}
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-amber-100 mx-auto flex items-center justify-center mb-4">
                      <i className="ri-history-line text-2xl text-amber-500"></i>
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Redemptions Yet</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      You haven't redeemed any rewards yet. Explore our rewards collection and exchange your points for meaningful experiences and items.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Earn More Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <i className="ri-bubble-chart-line text-amber-500 mt-0.5 mr-2"></i>
                        <span>Participate in community discussions</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-lightbulb-line text-amber-500 mt-0.5 mr-2"></i>
                        <span>Share original spiritual insights</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-government-line text-amber-500 mt-0.5 mr-2"></i>
                        <span>Vote on community proposals</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-user-heart-line text-amber-500 mt-0.5 mr-2"></i>
                        <span>Help others on their spiritual journey</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Point Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">
                      Points represent the value you've contributed to our spiritual community. They can be exchanged for items that enhance your practice.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>1000 points</span>
                        <span className="font-medium">≈ Digital resource access</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>2500 points</span>
                        <span className="font-medium">≈ Guided session with mentor</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>5000+ points</span>
                        <span className="font-medium">≈ Tangible spiritual tools</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center mr-4">
                        <i className="ri-coins-line text-2xl text-white"></i>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-amber-600">{currentUser?.points || 0}</p>
                        <p className="text-sm text-gray-500">Total Points Available</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-500 mb-2">Point Activity</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Last earned:</span>
                          <span className="font-medium">50 points, 2 days ago</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total redeemed:</span>
                          <span className="font-medium">0 points</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}