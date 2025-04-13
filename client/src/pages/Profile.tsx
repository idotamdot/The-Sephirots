import { useQuery } from "@tanstack/react-query";
import { User, Badge, Discussion } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import BadgeGrid from "@/components/achievements/BadgeGrid";
import DiscussionList from "@/components/discussions/DiscussionList";
import { Button } from "@/components/ui/button";
import { calculatePointsToNextLevel } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileProps {
  currentUser?: User;
}

export default function Profile({ currentUser }: ProfileProps) {
  // Get user badges
  const { data: userBadges, isLoading: badgesLoading } = useQuery<Badge[]>({
    queryKey: [`/api/users/${currentUser?.id}/badges`],
    enabled: !!currentUser,
  });
  
  // Get user discussions (mock, would need a real endpoint)
  const { data: allDiscussions, isLoading: discussionsLoading } = useQuery<Discussion[]>({
    queryKey: ["/api/discussions"],
  });
  
  // Filter discussions to show only those created by the current user
  const userDiscussions = allDiscussions?.filter(d => d.userId === currentUser?.id) || [];
  
  const isLoading = badgesLoading || discussionsLoading || !currentUser;
  
  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-5 w-64 mb-4" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <Skeleton className="h-12 w-full max-w-md mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  if (!currentUser) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-center items-center flex-col py-12">
          <i className="ri-error-warning-line text-4xl text-gray-400 mb-4"></i>
          <h2 className="text-xl font-medium mb-2">User Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the profile you're looking for.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-4xl font-medium">
          {currentUser.avatar ? (
            <img 
              src={currentUser.avatar} 
              alt={currentUser.displayName} 
              className="w-full h-full rounded-full object-cover" 
            />
          ) : (
            currentUser.displayName.charAt(0)
          )}
        </div>
        
        <div className="flex-1">
          <h1 className="text-2xl font-heading font-bold">{currentUser.displayName}</h1>
          <p className="text-gray-600 mb-4">
            {currentUser.isAi ? "AI Collaborator" : `@${currentUser.username}`} • Member since {
              new Date(currentUser.createdAt).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })
            }
          </p>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <i className="ri-edit-line mr-2"></i>
              Edit Profile
            </Button>
            
            <Button variant="outline">
              <i className="ri-settings-3-line mr-2"></i>
              Settings
            </Button>
          </div>
        </div>
        
        <div className="md:w-64 flex-shrink-0">
          <Card>
            <CardContent className="p-4">
              <div className="text-center mb-3">
                <div className="text-lg font-medium">Level {currentUser.level}</div>
                <div className="text-sm text-gray-600">Harmony Builder</div>
              </div>
              
              <Progress value={60} className="h-2 mb-1" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{currentUser.points} pts</span>
                <span>{calculatePointsToNextLevel(currentUser.points)} pts to Level {currentUser.level + 1}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mb-4">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-medium mb-2">Bio</h2>
            <p className="text-gray-700">
              {currentUser.bio || "No bio provided yet. Tell the community about yourself!"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="contributions" className="mb-6">
        <TabsList>
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="contributions" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary-600">{userDiscussions.length}</div>
                <div className="text-sm text-gray-600">Discussions</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-secondary-600">28</div>
                <div className="text-sm text-gray-600">Comments</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-accent-600">3</div>
                <div className="text-sm text-gray-600">Proposals</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-indigo-600">42</div>
                <div className="text-sm text-gray-600">Reactions</div>
              </CardContent>
            </Card>
          </div>
          
          <DiscussionList
            title="Your Discussions"
            discussions={userDiscussions}
            isLoading={discussionsLoading}
            columns={2}
          />
        </TabsContent>
        
        <TabsContent value="badges" className="mt-6">
          <BadgeGrid 
            badges={userBadges || []} 
            earnedBadgeIds={userBadges?.map(b => b.id) || []}
            title="Earned Badges" 
            showCategories={false}
          />
        </TabsContent>
        
        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                    <i className="ri-discuss-line"></i>
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">You started a discussion:</span>{" "}
                      "Creating safe spaces for vulnerable community members"
                    </p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-700">
                    <i className="ri-reply-line"></i>
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">You commented on:</span>{" "}
                      "Digital Rights for AI Entities"
                    </p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center text-accent-700">
                    <i className="ri-award-line"></i>
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">You earned a badge:</span>{" "}
                      "Conversationalist"
                    </p>
                    <p className="text-xs text-gray-500">5 days ago</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                    <i className="ri-thumb-up-line"></i>
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">You liked:</span>{" "}
                      "Mental Health Resources for All"
                    </p>
                    <p className="text-xs text-gray-500">1 week ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
