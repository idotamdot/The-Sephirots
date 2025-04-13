import { Link } from "wouter";
import AvatarGroup from "@/components/ui/avatar-group";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function Hero() {
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
    // Mock data for the demo since we don't have a real users endpoint
    enabled: false,
    initialData: [
      {
        id: 1,
        username: 'harmony_ai',
        displayName: 'Harmony AI',
        isAi: true,
        level: 10,
        points: 500,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        username: 'alex_johnson',
        displayName: 'Alex Johnson',
        isAi: false,
        level: 5,
        points: 250,
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        username: 'jamie_lee',
        displayName: 'Jamie Lee',
        isAi: false,
        level: 3,
        points: 150,
        createdAt: new Date().toISOString(),
      },
    ],
  });
  
  return (
    <section className="mb-8">
      <Card className="shadow-sm border border-gray-100">
        <CardContent className="p-6 md:p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-heading font-bold text-3xl md:text-4xl mb-4">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 text-transparent bg-clip-text">
                Harmony
              </span>
            </h1>
            
            <p className="text-gray-600 text-lg mb-6">
              Collaborate with humans and AI to build a better future for all beings, 
              focusing on wellbeing, freedom, and community needs.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <Button size="lg" asChild>
                <Link href="/discussions">
                  <i className="ri-discuss-line mr-2"></i>
                  Join Discussions
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" asChild>
                <Link href="/rights-agreement">
                  <i className="ri-information-line mr-2"></i>
                  How It Works
                </Link>
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex items-center text-sm text-gray-500">
                <Skeleton className="h-7 w-28 mr-3" />
                <Skeleton className="h-4 w-48" />
              </div>
            ) : (
              <div className="flex items-center text-sm text-gray-500">
                <AvatarGroup users={users} max={3} size="sm" className="mr-3" />
                <span>
                  {users.length} humans and {users.filter(u => u.isAi).length} AI collaborators active now
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
