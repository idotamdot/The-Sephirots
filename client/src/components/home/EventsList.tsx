import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventsList() {
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });
  
  if (isLoading) {
    return (
      <section>
        <h2 className="text-xl font-heading font-semibold mb-4">Upcoming Community Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, i) => (
            <Card key={`skeleton-${i}`} className="overflow-hidden">
              <Skeleton className="h-36 w-full" />
              <CardContent className="p-5">
                <Skeleton className="h-6 w-4/5 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }
  
  if (!events || events.length === 0) {
    return null;
  }
  
  return (
    <section>
      <h2 className="text-xl font-heading font-semibold mb-4">Upcoming Community Events</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => {
          // Determine gradient based on category
          let gradient;
          switch (event.category) {
            case 'wellbeing':
              gradient = "from-primary-500 to-secondary-500";
              break;
            case 'communication':
              gradient = "from-accent-500 to-accent-400";
              break;
            case 'rights_agreement':
              gradient = "from-secondary-500 to-purple-500";
              break;
            default:
              gradient = "from-primary-500 to-blue-500";
          }
          
          return (
            <Card 
              key={event.id} 
              className="overflow-hidden group hover:shadow-md transition-shadow duration-200"
            >
              <div className={`h-36 bg-gradient-to-r ${gradient} relative`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <span className="inline-block px-3 py-1 bg-white text-gray-800 text-xs font-medium rounded-full shadow-sm">
                    {formatDate(new Date(event.dateTime))}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-5">
                <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary-600 transition-colors duration-150">
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
                  <Button variant="link" size="sm" className="p-0 h-auto text-primary-600 font-medium hover:text-primary-700">
                    Set Reminder
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
