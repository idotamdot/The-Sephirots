import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Badge, Discussion } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import BadgeGrid from "@/components/achievements/BadgeGrid";
import DiscussionList from "@/components/discussions/DiscussionList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { calculatePointsToNextLevel } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, Edit3, Settings, X } from "lucide-react";

interface ProfileProps {
  currentUser?: User;
}

export default function Profile({ currentUser }: ProfileProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(currentUser?.avatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  
  // Mutation for updating user profile
  const updateProfileMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!currentUser) return null;
      
      const userData: Partial<User> = {
        displayName,
        bio
      };
      
      // If we're updating with a new image
      if (profileImage) {
        // Convert the image to base64
        const base64Image = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result as string;
            resolve(base64);
          };
          reader.readAsDataURL(profileImage);
        });
        
        // Add it to the user data
        userData.avatar = base64Image;
        userData.avatarType = 'upload';
      }
      
      const response = await apiRequest(
        "PATCH", 
        `/api/users/${currentUser.id}`, 
        userData
      );
      
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
      
      // Close dialog
      setEditProfileOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image under 5MB.",
        variant: "destructive",
      });
      return;
    }
    
    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setProfileImage(file);
  };
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("displayName", displayName);
    formData.append("bio", bio || "");
    if (profileImage) {
      formData.append("avatar", profileImage);
    }
    
    updateProfileMutation.mutate(formData);
  };
  
  const handleRemoveImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
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
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-4xl font-medium overflow-hidden">
            {currentUser.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt={currentUser.displayName} 
                className="w-full h-full object-cover" 
              />
            ) : (
              currentUser.displayName.charAt(0)
            )}
          </div>
          <button 
            onClick={() => setEditProfileOpen(true)}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Camera className="w-8 h-8 text-white" />
          </button>
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
            <Button 
              variant="outline"
              onClick={() => {
                setDisplayName(currentUser.displayName);
                setBio(currentUser.bio || "");
                setProfileImagePreview(currentUser.avatar || null);
                setEditProfileOpen(true);
              }}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
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
      
      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveProfile}>
            <div className="space-y-4 py-4">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-4xl font-medium overflow-hidden mx-auto border-2 border-amber-200">
                    {profileImagePreview ? (
                      <img 
                        src={profileImagePreview} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      displayName.charAt(0)
                    )}
                  </div>
                  
                  <div className="absolute -bottom-2 -right-2 flex gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4" />
                      <span className="sr-only">Upload new image</span>
                    </Button>
                    
                    {profileImagePreview && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white text-destructive hover:text-destructive"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove image</span>
                      </Button>
                    )}
                  </div>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  minLength={2}
                  maxLength={50}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio || ""}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell the community about yourself..."
                  className="min-h-[100px]"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {(bio?.length || 0)}/500
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditProfileOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="bg-amber-500 hover:bg-amber-600"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Saving...
                  </>
                ) : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
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
