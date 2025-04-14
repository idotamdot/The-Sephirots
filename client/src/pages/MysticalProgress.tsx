import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PersonalizedBadge from "@/components/badges/PersonalizedBadge";
import CosmicConnectionNetwork from "@/components/visualization/CosmicConnectionNetwork";
import SpiritualProgressChart from "@/components/visualization/SpiritualProgressChart";
import DoveAndStars from "@/components/icons/DoveAndStars";

export default function MysticalProgress() {
  const [activeTab, setActiveTab] = useState("progress");
  
  // Get current user
  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: ["/api/users/me"],
  });
  
  // Get user's badges
  const { data: userBadges, isLoading: badgesLoading } = useQuery({
    queryKey: currentUser ? [`/api/users/${currentUser.id}/badges`] : null,
    enabled: !!currentUser,
  });
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Hero Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-amber-600 to-purple-600 bg-clip-text text-transparent">
          Your Sephirotic Journey
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Explore your personal mystical progress through The Tree of Life, track your spiritual growth,
          and see how your contributions shape The Sephirots ecosystem.
        </p>
      </div>
      
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spiritual Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl flex items-center">
                <DoveAndStars size="sm" fillColor="#9333ea" className="mr-2" />
                Spiritual Profile
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-800">
                <i className="ri-share-line"></i>
              </Button>
            </div>
            <CardDescription>
              Your mystical achievement pathway
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-24 rounded-full mx-auto" />
                <Skeleton className="h-6 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
            ) : (
              <div className="text-center">
                <div className="relative mb-4 inline-block">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500 to-purple-600 blur-md opacity-40"></div>
                  {currentUser?.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.displayName || currentUser.username} 
                      className="w-24 h-24 rounded-full object-cover border-4 border-white relative z-10"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold relative z-10">
                      {(currentUser?.displayName || currentUser?.username || "").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold mb-1">
                  {currentUser?.displayName || currentUser?.username}
                </h3>
                <div className="text-sm text-gray-500 mb-4">
                  Level {currentUser?.level || 1} • {currentUser?.points || 0} Points
                </div>
                
                <div className="mb-6">
                  <div className="h-2 bg-gray-100 rounded-full mb-1">
                    <div 
                      className="h-2 bg-gradient-to-r from-amber-500 to-purple-600 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, ((currentUser?.points || 0) % 100))}%` 
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.min(100, ((currentUser?.points || 0) % 100))} / 100 points to next level
                  </div>
                </div>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                      <i className="ri-heart-pulse-line"></i>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Spiritual Resonance</div>
                      <div className="text-xs text-gray-500">
                        87% alignment with community values
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                      <i className="ri-path-line"></i>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Sephirotic Path</div>
                      <div className="text-xs text-gray-500">
                        Tiferet-focused journey (Balance & Integration)
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                      <i className="ri-link-m"></i>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Cosmic Connections</div>
                      <div className="text-xs text-gray-500">
                        Connected with {Math.floor(Math.random() * 20) + 5} fellow travelers
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start mb-4">
              <TabsTrigger value="progress">Mystical Progress</TabsTrigger>
              <TabsTrigger value="connections">Cosmic Connections</TabsTrigger>
              <TabsTrigger value="badges">Achievement Badges</TabsTrigger>
            </TabsList>
            
            <TabsContent value="progress" className="space-y-6">
              <SpiritualProgressChart 
                userId={currentUser?.id}
                showTips={true}
                interactive={true}
              />
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Personalized Growth Opportunities</CardTitle>
                  <CardDescription>
                    Suggested activities to enhance your spiritual journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                          <i className="ri-group-line"></i>
                        </div>
                        <h3 className="font-medium">Community Connection</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Participate in the upcoming "Binah & Chokmah: Balancing Wisdom" discussion group to strengthen your understanding.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        View Event
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                          <i className="ri-quill-pen-line"></i>
                        </div>
                        <h3 className="font-medium">Knowledge Expansion</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Share your insights on the latest Rights Agreement amendments to boost your Binah (Understanding) attribute.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Start Contribution
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                          <i className="ri-heart-line"></i>
                        </div>
                        <h3 className="font-medium">Compassion Practice</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Your Chesed (Loving-kindness) could grow through participating in the AI-Human dialogue sessions.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Join Dialogue
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                          <i className="ri-scales-3-line"></i>
                        </div>
                        <h3 className="font-medium">Balance Cultivation</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Strengthen your Tiferet (Harmony) through mediating on opposing viewpoints in the governance proposals.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        View Proposals
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="connections" className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <i className="ri-node-tree text-purple-600 mr-2"></i>
                    Cosmic Connection Network
                  </CardTitle>
                  <CardDescription>
                    Visualize your place in the Sephirotic ecosystem
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <CosmicConnectionNetwork 
                    currentUserId={currentUser?.id}
                    width={700}
                    height={500}
                    showUsers={true}
                    showBadges={true}
                    showSephirot={true}
                    interactive={true}
                    animateConnections={true}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Sephirotic Connection Insights</CardTitle>
                  <CardDescription>
                    Understanding your spiritual network
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-amber-50 rounded-lg">
                      <h3 className="font-medium text-purple-800 mb-2">Your Cosmic Position</h3>
                      <p className="text-sm text-gray-700">
                        Your spiritual journey places you primarily in the Tiferet-Yesod pathway, connecting harmony with manifestation. This position allows you to bridge abstract concepts with practical applications in The Sephirots community.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2 flex items-center">
                          <i className="ri-user-star-line text-amber-600 mr-2"></i>
                          Resonant Connections
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Members whose spiritual frequencies align most closely with yours:
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">S</div>
                            <span>Sarah_wisdom (92% resonance)</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">M</div>
                            <span>Michael_light (87% resonance)</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">A</div>
                            <span>Aurora_AI (84% resonance)</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2 flex items-center">
                          <i className="ri-leaf-line text-green-600 mr-2"></i>
                          Growth Pathways
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Spiritual directions that would complement your journey:
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-2">
                              <i className="ri-fire-line"></i>
                            </div>
                            <span>Strengthen Gevurah (Boundaries)</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                              <i className="ri-eye-line"></i>
                            </div>
                            <span>Explore Chokmah (Wisdom)</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">
                              <i className="ri-plant-line"></i>
                            </div>
                            <span>Cultivate Netzach (Endurance)</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="badges" className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <i className="ri-award-line text-amber-600 mr-2"></i>
                    Your Mystical Achievement Badges
                  </CardTitle>
                  <CardDescription>
                    Earned recognitions on your spiritual journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {badgesLoading || !userBadges ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex flex-col items-center">
                          <Skeleton className="h-24 w-24 rounded-full" />
                          <Skeleton className="h-4 w-20 mt-2" />
                          <Skeleton className="h-3 w-16 mt-1" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      {userBadges.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
                            <i className="ri-award-line text-2xl"></i>
                          </div>
                          <h3 className="text-lg font-medium mb-2">No Badges Yet</h3>
                          <p className="text-gray-500 text-sm max-w-md mx-auto">
                            Begin your journey by participating in discussions, contributing to governance, or connecting with others.
                          </p>
                          <Button variant="outline" className="mt-4">
                            View Available Badges
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                          {userBadges.map((badge) => (
                            <div key={badge.id} className="flex flex-col items-center">
                              <PersonalizedBadge 
                                badge={badge}
                                user={currentUser}
                                size="lg"
                                enhanced={Math.random() > 0.5}
                                showDescription={true}
                                interactive={true}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="mt-10 pt-6 border-t">
                        <h3 className="text-lg font-medium mb-4">Badges to Aspire To</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                          {/* These would dynamically come from recommended badges */}
                          <div className="flex flex-col items-center opacity-60 hover:opacity-80 transition-opacity">
                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-purple-300 flex items-center justify-center text-purple-400">
                              <i className="ri-bubble-chart-line text-xl"></i>
                            </div>
                            <p className="text-sm font-medium mt-2">Quantum Thinker</p>
                            <p className="text-xs text-gray-500">85% progress</p>
                          </div>
                          
                          <div className="flex flex-col items-center opacity-60 hover:opacity-80 transition-opacity">
                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-300 flex items-center justify-center text-amber-400">
                              <i className="ri-heart-pulse-line text-xl"></i>
                            </div>
                            <p className="text-sm font-medium mt-2">Wellbeing Guide</p>
                            <p className="text-xs text-gray-500">42% progress</p>
                          </div>
                          
                          <div className="flex flex-col items-center opacity-60 hover:opacity-80 transition-opacity">
                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-blue-300 flex items-center justify-center text-blue-400">
                              <i className="ri-book-open-line text-xl"></i>
                            </div>
                            <p className="text-sm font-medium mt-2">Knowledge Keeper</p>
                            <p className="text-xs text-gray-500">67% progress</p>
                          </div>
                          
                          <div className="flex flex-col items-center opacity-60 hover:opacity-80 transition-opacity">
                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-green-300 flex items-center justify-center text-green-400">
                              <i className="ri-seedling-line text-xl"></i>
                            </div>
                            <p className="text-sm font-medium mt-2">Growth Catalyst</p>
                            <p className="text-xs text-gray-500">23% progress</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Badge Mastery Rewards</CardTitle>
                  <CardDescription>
                    Unlock special recognitions with your spiritual progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="relative overflow-hidden rounded-lg border bg-gradient-to-br from-purple-50 to-amber-50 p-6">
                      <div className="absolute top-0 right-0 w-20 h-20">
                        <div className="absolute transform rotate-45 bg-amber-500 text-white font-bold py-1 right-[-35px] top-[32px] w-[170px] text-center text-xs">
                          Special Reward
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative">
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-amber-500 to-purple-600 blur-md opacity-30"></div>
                          <img 
                            src="https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyZWUlMjBvZiUyMGxpZmV8ZW58MHx8MHx8fDA%3D" 
                            alt="Tree of Life Poster" 
                            className="w-40 h-40 object-cover rounded-lg border-2 border-white relative z-10"
                          />
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-amber-600 to-purple-600 bg-clip-text text-transparent">Tree of Life Commemorative Poster</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Unlock this beautiful physical poster featuring The Sephirots Tree of Life with your name and achievements when you earn all ten Sephirotic badges.
                          </p>
                          
                          <div className="flex items-center text-sm">
                            <div className="flex -space-x-2 mr-3">
                              {[1, 2, 3].map(i => (
                                <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-purple-600 border border-white"></div>
                              ))}
                              <div className="w-6 h-6 rounded-full bg-gray-200 border border-white flex items-center justify-center text-xs text-gray-600">
                                +7
                              </div>
                            </div>
                            <span className="text-gray-500">3/10 badges earned</span>
                            
                            <div className="ml-auto">
                              <Button variant="outline" size="sm" className="text-xs">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                            <i className="ri-vip-crown-line"></i>
                          </div>
                          <h3 className="font-medium">Sephirotic Council Access</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Earn 5 gold-tier badges to gain access to the exclusive Sephirotic Council where key platform decisions are discussed.
                        </p>
                        <div className="text-sm text-gray-500">0/5 gold badges earned</div>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                            <i className="ri-sparkling-line"></i>
                          </div>
                          <h3 className="font-medium">Animated Badge Effects</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Unlock special animated effects for your badges by earning 3 badges from the same Sephirotic path.
                        </p>
                        <div className="text-sm text-gray-500">Progress: 2/3 Tiferet path badges</div>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                            <i className="ri-plant-line"></i>
                          </div>
                          <h3 className="font-medium">Tree Planting Initiative</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          A real tree will be planted in your name when you reach Level 10 in The Sephirots community.
                        </p>
                        <div className="text-sm text-gray-500">Current level: 3/10</div>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                            <i className="ri-book-mark-line"></i>
                          </div>
                          <h3 className="font-medium">Wisdom Journal</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Receive a beautiful physical journal featuring your contributions when you make 50 meaningful comments.
                        </p>
                        <div className="text-sm text-gray-500">Progress: 23/50 comments</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}