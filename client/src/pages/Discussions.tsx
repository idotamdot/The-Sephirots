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
  const { data: currentUser } = useQuery({
    queryKey: ["/api/users/me"],
  });
  
  const filterDiscussions = (discussions: Discussion[] | undefined, category?: string) => {
    if (!discussions) return [];
    if (!category || category === "all") return discussions;
    return discussions.filter(d => d.category === category);
  };
  
  const filteredDiscussions = filterDiscussions(allDiscussions, activeTab === "all" ? undefined : activeTab);
  
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
          
          {currentUser && (
            <DiscussionForm 
              userId={currentUser.id} 
              initialCategory={activeTab === "all" ? "community_needs" : activeTab} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
