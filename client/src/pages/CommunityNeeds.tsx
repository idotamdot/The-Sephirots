import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Discussion, User } from "@/lib/types";
import DiscussionList from "@/components/discussions/DiscussionList";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DiscussionForm from "@/components/discussions/DiscussionForm";
import { Card, CardContent } from "@/components/ui/card";

export default function CommunityNeeds() {
  const [newDiscussionOpen, setNewDiscussionOpen] = useState(false);
  
  // Get all discussions
  const { data: allDiscussions, isLoading } = useQuery<Discussion[]>({
    queryKey: ["/api/discussions"],
  });
  
  // Get current user for creating new discussions
  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });
  
  // Filter discussions for community needs category
  const communityNeedsDiscussions = allDiscussions?.filter(
    d => d.category === "community_needs"
  ) || [];
  
  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Community Needs</h1>
          <p className="text-gray-600">Discuss and address the shared needs of our growing community</p>
        </div>
        
        <Button size="lg" onClick={() => setNewDiscussionOpen(true)}>
          <i className="ri-add-line mr-2"></i>
          New Community Need
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-primary-50 to-white border-primary-100">
          <CardContent className="p-5">
            <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mb-3">
              <i className="ri-community-line text-xl"></i>
            </div>
            <h3 className="font-medium text-lg mb-2">Accessible Resources</h3>
            <p className="text-gray-600 text-sm">
              Discuss how to make resources accessible to all community members regardless of abilities or constraints.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-secondary-50 to-white border-secondary-100">
          <CardContent className="p-5">
            <div className="w-12 h-12 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center mb-3">
              <i className="ri-shield-check-line text-xl"></i>
            </div>
            <h3 className="font-medium text-lg mb-2">Safety & Security</h3>
            <p className="text-gray-600 text-sm">
              Explore ways to ensure both physical and digital safety for all community members.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-accent-50 to-white border-accent-100">
          <CardContent className="p-5">
            <div className="w-12 h-12 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center mb-3">
              <i className="ri-group-line text-xl"></i>
            </div>
            <h3 className="font-medium text-lg mb-2">Inclusive Collaboration</h3>
            <p className="text-gray-600 text-sm">
              Share ideas on how to make our collaborative processes more inclusive and representative.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <DiscussionList
        title="Community Needs Discussions"
        discussions={communityNeedsDiscussions}
        isLoading={isLoading}
        columns={2}
      />
      
      {/* New Discussion Dialog */}
      <Dialog open={newDiscussionOpen} onOpenChange={setNewDiscussionOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Community Need</DialogTitle>
            <DialogDescription>
              Raise awareness about a community need and invite collaborative solutions.
            </DialogDescription>
          </DialogHeader>
          
          {currentUser && (
            <DiscussionForm 
              userId={currentUser.id} 
              initialCategory="community_needs" 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
