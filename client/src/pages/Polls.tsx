import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/transitions/PageTransition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Vote, TrendingUp, Calendar, Users, CheckCircle2 } from "lucide-react";

interface Poll {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  options: PollOption[];
  totalVotes: number;
  hasVoted: boolean;
  userVoteOptionId?: number;
  endsAt?: string;
  quarterYear?: string;
}

interface PollOption {
  id: number;
  text: string;
  voteCount: number;
}

interface PollStatistic {
  quarterYear: string;
  totalPolls: number;
  totalVotes: number;
  participationRate: number;
  topCategories: { category: string; count: number }[];
}

export default function Polls() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("active");

  // Fetch polls
  const { data: polls, isLoading } = useQuery<Poll[]>({
    queryKey: ["polls", activeTab],
    queryFn: async () => {
      const response = await fetch(`/api/polls?status=${activeTab}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch polls");
      return response.json();
    },
  });

  // Fetch quarterly statistics
  const { data: statistics } = useQuery<PollStatistic[]>({
    queryKey: ["poll-statistics"],
    queryFn: async () => {
      const response = await fetch("/api/polls/statistics", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch statistics");
      return response.json();
    },
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ pollId, optionId }: { pollId: number; optionId: number }) => {
      const response = await fetch(`/api/polls/${pollId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to submit vote");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      toast({
        title: "Vote Submitted",
        description: "Thank you for participating in the community poll!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Vote",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleVote = (pollId: number, optionId: number) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to participate in polls.",
        variant: "destructive",
      });
      return;
    }
    voteMutation.mutate({ pollId, optionId });
  };

  const calculatePercentage = (voteCount: number, totalVotes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((voteCount / totalVotes) * 100);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case "closed":
        return <Badge className="bg-gray-100 text-gray-700">Closed</Badge>;
      case "archived":
        return <Badge className="bg-amber-100 text-amber-700">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-2"
          >
            Community Polls
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Share your voice and discover what matters most to our community.
            Results are compiled quarterly to guide our collective direction.
          </motion.p>
        </div>

        {/* Statistics Summary */}
        {statistics && statistics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-700">
                  <BarChart3 className="w-5 h-5" />
                  Quarterly Statistics - {statistics[0].quarterYear}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-600">{statistics[0].totalPolls}</p>
                    <p className="text-sm text-gray-600">Total Polls</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{statistics[0].totalVotes}</p>
                    <p className="text-sm text-gray-600">Total Votes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-pink-600">{statistics[0].participationRate}%</p>
                    <p className="text-sm text-gray-600">Participation Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {statistics[0].topCategories?.[0]?.category || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">Top Category</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tabs for poll status */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Vote className="w-4 h-4" />
              Active
            </TabsTrigger>
            <TabsTrigger value="closed" className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="archived" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Archive
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Polls List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : polls && polls.length > 0 ? (
          <StaggerContainer className="grid gap-6 md:grid-cols-2">
            {polls.map((poll) => (
              <StaggerItem key={poll.id}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{poll.title}</CardTitle>
                        <CardDescription>{poll.description}</CardDescription>
                      </div>
                      {getStatusBadge(poll.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {poll.totalVotes} votes
                      </span>
                      {poll.quarterYear && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {poll.quarterYear}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {poll.options.map((option) => {
                        const percentage = calculatePercentage(option.voteCount, poll.totalVotes);
                        const isUserVote = poll.userVoteOptionId === option.id;
                        const showResults = poll.hasVoted || poll.status !== "active";

                        return (
                          <div key={option.id} className="relative">
                            {poll.status === "active" && !poll.hasVoted ? (
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left h-auto py-3 hover:bg-indigo-50 hover:border-indigo-300"
                                onClick={() => handleVote(poll.id, option.id)}
                                disabled={voteMutation.isPending}
                              >
                                {option.text}
                              </Button>
                            ) : (
                              <div
                                className={`relative overflow-hidden rounded-lg border p-3 ${
                                  isUserVote ? "border-indigo-400 bg-indigo-50" : "border-gray-200"
                                }`}
                              >
                                <div
                                  className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                                <div className="relative flex items-center justify-between">
                                  <span className="font-medium">
                                    {option.text}
                                    {isUserVote && (
                                      <CheckCircle2 className="w-4 h-4 inline-block ml-2 text-indigo-600" />
                                    )}
                                  </span>
                                  <span className="text-sm font-semibold text-indigo-700">
                                    {percentage}%
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {poll.hasVoted && poll.status === "active" && (
                      <p className="mt-4 text-sm text-center text-green-600 flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        You've voted in this poll
                      </p>
                    )}
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Vote className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Polls Available</h3>
              <p className="text-gray-500">
                {activeTab === "active"
                  ? "There are no active polls at the moment. Check back soon!"
                  : activeTab === "closed"
                  ? "No closed polls to display."
                  : "No archived polls available."}
              </p>
            </CardContent>
          </Card>
        )}

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-800">How Community Polls Work</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center">
                    <Vote className="w-6 h-6 text-amber-600" />
                  </div>
                  <h4 className="font-semibold mb-1">1. Participate</h4>
                  <p className="text-sm text-gray-600">
                    Vote on active polls to share your perspective on community topics.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-amber-600" />
                  </div>
                  <h4 className="font-semibold mb-1">2. See Results</h4>
                  <p className="text-sm text-gray-600">
                    After voting, view real-time results and community trends.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-amber-600" />
                  </div>
                  <h4 className="font-semibold mb-1">3. Quarterly Reports</h4>
                  <p className="text-sm text-gray-600">
                    Every 3 months, comprehensive statistics guide our collective direction.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
