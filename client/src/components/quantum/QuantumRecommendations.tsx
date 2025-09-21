import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { User, Discussion } from '@/lib/types';
import { generateQuantumRecommendations, QuantumRecommendation, RecommendationResult } from '@/lib/quantumRecommendations';
import { useLocation } from 'wouter';

export default function QuantumRecommendations() {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  // Get current user
  const { data: currentUser } = useQuery<User>({
    queryKey: ['/api/users/me'],
  });

  // Get all discussions
  const { data: discussions } = useQuery<Discussion[]>({
    queryKey: ['/api/discussions'],
    queryFn: async () => {
      const response = await fetch('/api/discussions');
      if (!response.ok) throw new Error('Failed to fetch discussions');
      return response.json();
    },
  });

  // Get all users
  const { data: users } = useQuery<User[]>({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
  });

  // Get user badges
  const { data: userBadges } = useQuery({
    queryKey: ['/api/users', currentUser?.id, 'badges'],
    queryFn: async () => {
      if (!currentUser?.id) return [];
      const response = await fetch(`/api/users/${currentUser.id}/badges`);
      if (!response.ok) {
        throw new Error('Failed to fetch user badges');
      }
      return response.json() as Promise<Badge[]>;
    },
    enabled: !!currentUser?.id,
  });

  // Generate quantum recommendations when data is available
  useEffect(() => {
    if (currentUser && discussions && users && userBadges) {
      const results = generateQuantumRecommendations(
        currentUser,
        discussions,
        users,
        userBadges
      );
      setRecommendations(results);
    }
  }, [currentUser, discussions, users, userBadges]);

  // Handle recommendation action
  const handleAction = (recommendation: QuantumRecommendation) => {
    if (!recommendation.action) return;

    switch (recommendation.action.type) {
      case 'navigate':
        if (recommendation.action.path) {
          setLocation(recommendation.action.path);
          toast({
            description: `Navigating to: ${recommendation.title}`,
          });
        }
        break;
      case 'connect':
        if (recommendation.action.path) {
          setLocation(recommendation.action.path);
          toast({
            description: `Connecting with this spiritual energy...`,
          });
        }
        break;
      case 'practice':
        toast({
          title: "Spiritual Practice Activated",
          description: "Find a quiet space and begin this practice when you're ready.",
        });
        break;
      case 'meditate':
      case 'reflect':
        toast({
          title: "Reflection Moment",
          description: "Take a moment to reflect on this insight.",
        });
        break;
      default:
        break;
    }
  };

  if (!recommendations) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse flex space-x-4">
          <div className="bg-gradient-to-r from-purple-300 to-amber-300 h-12 w-12 rounded-full opacity-70"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gradient-to-r from-purple-300 to-amber-300 rounded opacity-70"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-purple-300 to-amber-300 rounded opacity-50 w-5/6"></div>
              <div className="h-4 bg-gradient-to-r from-purple-300 to-amber-300 rounded opacity-30 w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Daily Insight */}
      <Card className="bg-gradient-to-br from-indigo-900/10 to-purple-900/10 border border-purple-200/20 overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl transform translate-x-6 -translate-y-6"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl transform -translate-x-6 translate-y-6"></div>
        
        <CardHeader>
          <CardTitle className="text-lg text-center font-medium text-amber-500">
            Quantum Insight of the Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-base italic">
            "{recommendations.dailyInsight}"
          </p>
        </CardContent>
      </Card>

      {/* Recommendations Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="recommendations">
            <span className="flex items-center gap-2">
              <i className="ri-sparkling-2-line text-amber-500"></i>
              <span>Recommendations</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="synchronicities">
            <span className="flex items-center gap-2">
              <i className="ri-radar-line text-purple-500"></i>
              <span>Synchronicities</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="connections">
            <span className="flex items-center gap-2">
              <i className="ri-links-line text-indigo-500"></i>
              <span>Soul Connections</span>
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations">
          <div className="grid gap-4">
            {recommendations.personalRecommendations.map((recommendation) => (
              <Card key={recommendation.id} className="overflow-hidden flex md:flex-row flex-col transition-transform hover:shadow-md hover:-translate-y-1">
                {recommendation.imageUrl && (
                  <div className="md:w-1/3 h-36 md:h-auto">
                    <img
                      src={recommendation.imageUrl}
                      alt={recommendation.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className={`flex flex-col ${recommendation.imageUrl ? 'md:w-2/3' : 'w-full'}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-medium">{recommendation.title}</CardTitle>
                      <div className="flex items-center">
                        <div className="ml-1 flex items-center gap-1 text-sm">
                          <span
                            className={`inline-block w-3 h-3 rounded-full ${
                              recommendation.resonanceScore > 80
                                ? 'bg-green-500'
                                : recommendation.resonanceScore > 60
                                ? 'bg-amber-500'
                                : 'bg-blue-500'
                            }`}
                          ></span>
                          <span className="text-xs font-medium">
                            {recommendation.resonanceScore}% resonance
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardDescription>{recommendation.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 pt-0">
                    <div className="flex flex-wrap gap-1 mt-1">
                      {recommendation.energySignature.slice(0, 3).map((energy) => (
                        <Badge key={energy} variant="outline" className="bg-purple-50/30">
                          {energy}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      onClick={() => handleAction(recommendation)}
                      className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    >
                      {recommendation.action?.type === 'navigate'
                        ? 'Explore'
                        : recommendation.action?.type === 'connect'
                        ? 'Connect'
                        : recommendation.action?.type === 'practice'
                        ? 'Begin Practice'
                        : recommendation.action?.type === 'meditate'
                        ? 'Meditate'
                        : recommendation.action?.type === 'reflect'
                        ? 'Reflect'
                        : 'Engage'}
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Synchronicities Tab */}
        <TabsContent value="synchronicities">
          <div className="grid gap-4">
            {recommendations.synchronicities.map((synchronicity) => (
              <Card
                key={synchronicity.id}
                className="overflow-hidden border-l-4 border-l-purple-400 transition-all hover:border-l-purple-600"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-medium">{synchronicity.title}</CardTitle>
                    <Badge variant="outline" className="bg-purple-100/30">
                      Synchronicity
                    </Badge>
                  </div>
                  <CardDescription>{synchronicity.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  {synchronicity.action && (
                    <Button
                      onClick={() => handleAction(synchronicity)}
                      size="sm"
                      className="mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    >
                      {synchronicity.action?.type === 'navigate'
                        ? 'Explore'
                        : synchronicity.action?.type === 'connect'
                        ? 'Connect'
                        : synchronicity.action?.type === 'reflect'
                        ? 'Contemplate'
                        : 'Acknowledge'}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Soul Connections Tab */}
        <TabsContent value="connections">
          <div className="grid gap-4">
            {recommendations.entangledUsers.map((user) => (
              <Card key={user.userId} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-medium">{user.username}</CardTitle>
                    <div className="flex items-center gap-1 text-sm">
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${
                          user.resonanceScore > 80
                            ? 'bg-green-500'
                            : user.resonanceScore > 60
                            ? 'bg-amber-500'
                            : 'bg-blue-500'
                        }`}
                      ></span>
                      <span className="text-xs font-medium">{user.resonanceScore}% resonance</span>
                    </div>
                  </div>
                  <CardDescription>
                    Your energies are cosmically aligned. You may have crossed paths in other dimensions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2 pt-0">
                  {user.sharedInterests.length > 0 ? (
                    <div className="mt-1">
                      <p className="text-xs text-gray-500 mb-1">Shared spiritual interests:</p>
                      <div className="flex flex-wrap gap-1">
                        {user.sharedInterests.map((interest) => (
                          <Badge key={interest} variant="outline" className="bg-indigo-50/30">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      Your connection transcends obvious shared interests.
                    </p>
                  )}
                </CardContent>
                <CardFooter className="pt-1">
                  <Button
                    onClick={() => setLocation(`/profile/${user.userId}`)}
                    className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
                  >
                    Connect with Soul
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}