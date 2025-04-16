import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Discussion } from "@/lib/types";
import DiscussionList from "@/components/discussions/DiscussionList";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DiscussionForm from "@/components/discussions/DiscussionForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Discussions() {
  const [newDiscussionOpen, setNewDiscussionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: allDiscussions, isLoading } = useQuery<Discussion[]>({
    queryKey: ["/api/discussions"],
  });
  
  // Get current user for creating new discussions
  const { data: currentUser } = useQuery<any>({
    queryKey: ["/api/users/me"],
  });
  
  const filterDiscussions = (discussions: Discussion[] | undefined, category?: string) => {
    if (!discussions) return [];
    if (!category || category === "all") return discussions;
    return discussions.filter(d => d.category === category);
  };
  
  const filteredDiscussions = filterDiscussions(allDiscussions, activeTab === "all" ? undefined : activeTab);
  
  // For first-time setup, create a user ID if currentUser is not available
  const defaultUserId = 1; // This will be used if no user is found

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Discussions</h1>
          <p className="text-gray-600">Collaborate and engage with the community on important topics</p>
        </div>
        
        <Button size="lg" onClick={() => setNewDiscussionOpen(true)}>
          <i className="ri-add-line mr-2"></i>
          New Discussion
        </Button>
      </div>
      
      {/* Debug info - only visible in development mode */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
          <h3 className="text-sm font-medium text-purple-800">Authentication Status</h3>
          <div className="mt-1 text-xs">
            <p>Current user: {currentUser ? 'Logged in as ' + currentUser.username : 'Not logged in'}</p>
            <p>User ID to use: {currentUser?.id || defaultUserId}</p>
          </div>
        </div>
      )}
      
      <Tabs 
        defaultValue="all" 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="all">All Topics</TabsTrigger>
          <TabsTrigger value="community_needs">Community Needs</TabsTrigger>
          <TabsTrigger value="rights_agreement">Rights Agreement</TabsTrigger>
          <TabsTrigger value="wellbeing">Wellbeing</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <DiscussionList 
            discussions={filteredDiscussions} 
            isLoading={isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="community_needs">
          <DiscussionList 
            discussions={filteredDiscussions} 
            isLoading={isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="rights_agreement">
          <DiscussionList 
            discussions={filteredDiscussions} 
            isLoading={isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="wellbeing">
          <DiscussionList 
            discussions={filteredDiscussions} 
            isLoading={isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="communication">
          <DiscussionList 
            discussions={filteredDiscussions} 
            isLoading={isLoading} 
          />
        </TabsContent>
      </Tabs>
      
      {/* New Discussion Dialog */}
      <Dialog open={newDiscussionOpen} onOpenChange={setNewDiscussionOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Discussion</DialogTitle>
            <DialogDescription>
              Start a collaborative discussion on any topic relevant to our community.
            </DialogDescription>
          </DialogHeader>
          
          {/* Always render the form, using defaultUserId as a fallback */}
          <DiscussionForm 
            userId={currentUser?.id || defaultUserId} 
            initialCategory={activeTab === "all" ? "community_needs" : activeTab} 
          />
          
          {/* Show warning if not logged in */}
          {!currentUser && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <h3 className="text-sm font-medium text-amber-800">Not logged in</h3>
              <p className="mt-1 text-xs text-amber-700">
                You're creating this discussion as the first user (ID: {defaultUserId}).
                In a production environment, you would need to log in first.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
