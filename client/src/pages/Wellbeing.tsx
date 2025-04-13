import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Discussion, User, Event } from "@/lib/types";
import DiscussionList from "@/components/discussions/DiscussionList";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DiscussionForm from "@/components/discussions/DiscussionForm";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";

export default function Wellbeing() {
  const [newDiscussionOpen, setNewDiscussionOpen] = useState(false);
  
  // Get all discussions
  const { data: allDiscussions, isLoading: discussionsLoading } = useQuery<Discussion[]>({
    queryKey: ["/api/discussions"],
  });
  
  // Get wellbeing events
  const { data: events, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });
  
  // Get current user for creating new discussions
  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });
  
  // Filter discussions for wellbeing category
  const wellbeingDiscussions = allDiscussions?.filter(
    d => d.category === "wellbeing"
  ) || [];
  
  // Filter events for wellbeing category
  const wellbeingEvents = events?.filter(
    e => e.category === "wellbeing"
  ) || [];
  
  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Wellbeing</h1>
          <p className="text-gray-600">Support the mental, emotional, and social health of our community</p>
        </div>
        
        <Button size="lg" onClick={() => setNewDiscussionOpen(true)}>
          <i className="ri-add-line mr-2"></i>
          New Wellbeing Topic
        </Button>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-heading font-semibold mb-4">Community Wellbeing Metrics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-5">
              <h3 className="text-lg font-medium mb-3">Resource Accessibility</h3>
              <Progress value={75} className="h-2 mb-2" />
              <p className="text-sm text-gray-600">
                75% of mental health resources are currently accessible to all community members
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <h3 className="text-lg font-medium mb-3">Support Network</h3>
              <Progress value={62} className="h-2 mb-2" />
              <p className="text-sm text-gray-600">
                62% of community members report feeling supported by the community
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <h3 className="text-lg font-medium mb-3">Wellbeing Engagement</h3>
              <Progress value={88} className="h-2 mb-2" />
              <p className="text-sm text-gray-600">
                88% increase in participation in wellbeing initiatives this month
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {wellbeingEvents.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-heading font-semibold mb-4">Upcoming Wellbeing Events</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wellbeingEvents.map((event) => (
              <Card 
                key={event.id} 
                className="overflow-hidden group hover:shadow-md transition-shadow duration-200"
              >
                <div className="h-36 bg-gradient-to-r from-accent-500 to-accent-400 relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <span className="inline-block px-3 py-1 bg-white text-gray-800 text-xs font-medium rounded-full shadow-sm">
                      {formatDate(new Date(event.dateTime))}
                    </span>
                  </div>
                </div>
                
                <CardContent className="p-5">
                  <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-accent-600 transition-colors duration-150">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <i className="ri-group-line mr-1.5"></i>
                      <span>{event.attendees} attending</span>
                    </div>
                    <Button variant="link" size="sm" className="p-0 h-auto text-accent-600 font-medium hover:text-accent-700">
                      Set Reminder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <DiscussionList
        title="Wellbeing Discussions"
        discussions={wellbeingDiscussions}
        isLoading={discussionsLoading}
        columns={2}
      />
      
      {/* New Discussion Dialog */}
      <Dialog open={newDiscussionOpen} onOpenChange={setNewDiscussionOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Wellbeing Topic</DialogTitle>
            <DialogDescription>
              Share resources, insights, or questions related to community wellbeing.
            </DialogDescription>
          </DialogHeader>
          
          {currentUser && (
            <DiscussionForm 
              userId={currentUser.id} 
              initialCategory="wellbeing" 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
