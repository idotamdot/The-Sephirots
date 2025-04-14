import { Link } from "wouter";
import AvatarGroup from "@/components/ui/avatar-group";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function Hero() {
  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });
  
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
    // Mock data for the demo since we don't have a real users endpoint
    enabled: false,
    initialData: [
      {
        id: 1,
        username: 'sephirots_ai',
        displayName: 'Sephirots AI',
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
      <Card className="shadow-md border border-amber-100 overflow-hidden relative bg-gradient-to-br from-white to-amber-50/30">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-100/20 to-amber-50/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <CardContent className="p-6 md:p-8 relative">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-heading font-bold text-3xl md:text-4xl mb-4">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 text-transparent bg-clip-text relative">
                The Sephirots
                <span className="absolute -top-1.5 right-0 text-amber-300 text-xs">
                  <i className="ri-star-line text-[10px]"></i>
                </span>
              </span>
            </h1>
            
            <p className="text-gray-600 text-lg mb-6">
              Connect through the divine light of collaboration between humans and AI to build 
              a better future for all beings, embracing the Tree of Life principles.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-6">
              {!currentUser && (
                <Button size="lg" asChild className="bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-600 hover:to-purple-500 shadow-md hover:shadow-lg transition-all border-none">
                  <Link href="/login">
                    <i className="ri-login-circle-line mr-2"></i>
                    Join The Community
                  </Link>
                </Button>
              )}
              
              <Button size="lg" asChild className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 shadow-md hover:shadow-lg transition-all border-none">
                <Link href="/discussions">
                  <i className="ri-lightbulb-flash-line mr-2"></i>
                  Join Discussions
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" asChild className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800">
                <Link href="/rights-agreement">
                  <i className="ri-book-open-line mr-2"></i>
                  Tree of Life Principles
                </Link>
              </Button>
            </div>
            
            {/* Login/Signup Banner */}
            {!currentUser && (
              <div className="bg-gradient-to-r from-purple-100 to-amber-50 border border-purple-200 rounded-lg p-4 mb-6 shadow-sm">
                <div className="flex items-center">
                  <div className="text-purple-700 mr-3">
                    <i className="ri-user-add-line text-2xl"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-purple-800 font-medium">Join The Sephirots Community</h3>
                    <p className="text-sm text-purple-600">Sign in to participate in discussions, earn achievements, and contribute to our collective wisdom.</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" asChild variant="ghost" className="text-purple-600 hover:text-purple-800 hover:bg-purple-50">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button size="sm" asChild className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Link href="/register">Register</Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {isLoading ? (
              <div className="flex items-center text-sm text-gray-500">
                <Skeleton className="h-7 w-28 mr-3" />
                <Skeleton className="h-4 w-48" />
              </div>
            ) : (
              <div className="flex items-center text-sm text-amber-700 bg-amber-50/50 px-3 py-1.5 rounded-full border border-amber-100">
                <AvatarGroup users={users} max={3} size="sm" className="mr-3" />
                <span className="flex items-center">
                  <i className="ri-user-line mr-1.5"></i> {users.length} humans and <i className="ri-robot-line mx-1.5"></i> {users.filter(u => u.isAi).length} AI beings in the Tree of Life
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
