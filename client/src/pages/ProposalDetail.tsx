import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { User, Proposal, ProposalStatus, ProposalCategory, Vote } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  ThumbsDown,
  ThumbsUp,
  Vote as VoteIcon,
  XCircle,
} from "lucide-react";

// Helper function to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

// Helper to get status badge color
const getStatusColor = (status: ProposalStatus) => {
  switch (status) {
    case "draft": return "bg-gray-500";
    case "active": return "bg-blue-500";
    case "passed": return "bg-green-500";
    case "rejected": return "bg-red-500";
    case "implemented": return "bg-purple-500";
    default: return "bg-gray-500";
  }
};

// Helper to get status icon
const StatusIcon = ({ status }: { status: ProposalStatus }) => {
  switch (status) {
    case "draft": return <Edit className="h-4 w-4 mr-1" />;
    case "active": return <VoteIcon className="h-4 w-4 mr-1" />;
    case "passed": return <CheckCircle2 className="h-4 w-4 mr-1" />;
    case "rejected": return <XCircle className="h-4 w-4 mr-1" />;
    case "implemented": return <CheckCircle2 className="h-4 w-4 mr-1" />;
    default: return <AlertCircle className="h-4 w-4 mr-1" />;
  }
};

// Helper to get category badge color
const getCategoryColor = (category: ProposalCategory) => {
  switch (category) {
    case "community_rules": return "bg-indigo-500";
    case "feature_request": return "bg-cyan-500";
    case "moderation_policy": return "bg-yellow-500";
    case "resource_allocation": return "bg-orange-500";
    case "protocol_change": return "bg-pink-500";
    case "other": return "bg-gray-500";
    default: return "bg-gray-500";
  }
};

// Format category for display
const formatCategory = (category: ProposalCategory) => {
  return category.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

// Vote card component
const VoteCard = ({ vote }: { vote: Vote }) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarFallback>{vote.user?.displayName.charAt(0) || '?'}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{vote.user?.displayName || "Unknown User"}</span>
          </div>
          <Badge variant={vote.vote ? "default" : "destructive"}>
            {vote.vote ? <ThumbsUp className="h-3 w-3 mr-1" /> : <ThumbsDown className="h-3 w-3 mr-1" />}
            {vote.vote ? "Supports" : "Opposes"}
          </Badge>
        </div>
        <CardDescription>{formatDate(vote.createdAt)}</CardDescription>
      </CardHeader>
      {vote.reason && (
        <CardContent>
          <p className="text-sm">{vote.reason}</p>
        </CardContent>
      )}
    </Card>
  );
};

// Main proposal detail component
export default function ProposalDetail() {
  const [, params] = useRoute("/governance/:id");
  const proposalId = params?.id ? parseInt(params.id) : -1;
  const [voteReason, setVoteReason] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current user
  const { data: currentUser } = useQuery<User>({
    queryKey: ['/api/users/me'],
  });

  // Fetch the proposal details
  const {
    data: proposal,
    isLoading,
    error,
  } = useQuery<Proposal & { votes: Vote[] }>({
    queryKey: [`/api/proposals/${proposalId}`],
    enabled: proposalId > 0,
  });

  // Calculate voting progress percentage
  const getVotingProgress = () => {
    if (!proposal) return 0;
    const totalVotes = proposal.votesFor + proposal.votesAgainst;
    return Math.min(100, Math.round((totalVotes / proposal.votesRequired) * 100));
  };

  // Check if current user has already voted
  const hasUserVoted = () => {
    if (!proposal?.votes || !currentUser) return false;
    return proposal.votes.some((vote: Vote) => vote.userId === currentUser.id);
  };

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ vote }: { vote: boolean }) => {
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      return apiRequest(`/api/proposals/${proposalId}/vote`, "POST", {
        userId: currentUser.id,
        vote,
        reason: voteReason || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/proposals/${proposalId}`] });
      toast({
        title: "Vote submitted",
        description: "Your vote has been recorded.",
      });
      setVoteReason("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit your vote. Please try again.",
        variant: "destructive",
      });
      console.error("Vote error:", error);
    },
  });

  // Handle vote submission
  const handleVote = (inSupport: boolean) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "You need to sign in to vote on proposals.",
        variant: "destructive",
      });
      return;
    }

    voteMutation.mutate({ vote: inSupport });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-16">
          <p>Loading proposal...</p>
        </div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-16">
          <p className="text-red-500">Error loading proposal. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/governance">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Governance
        </Link>
      </Button>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">{proposal.title}</CardTitle>
              <CardDescription className="mt-2">
                <div className="flex items-center">
                  <Avatar className="h-5 w-5 mr-2">
                    <AvatarFallback>{proposal.user?.displayName.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                  Proposed by {proposal.user?.displayName || "Unknown"} on {formatDate(proposal.createdAt)}
                </div>
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className={getCategoryColor(proposal.category)}>
                {formatCategory(proposal.category)}
              </Badge>
              <Badge className={getStatusColor(proposal.status)}>
                <StatusIcon status={proposal.status} />
                {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose max-w-none">
            <p className="whitespace-pre-line">{proposal.description}</p>
          </div>

          {proposal.implementationDetails && proposal.status === "implemented" && (
            <div className="bg-muted p-4 rounded-lg mt-4">
              <h3 className="font-medium mb-2">Implementation Details</h3>
              <p className="text-sm">{proposal.implementationDetails}</p>
            </div>
          )}

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex flex-col md:flex-row justify-between mb-2">
              <h3 className="font-medium">Voting Progress</h3>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm">Ends: {formatDate(proposal.votingEndsAt)}</span>
              </div>
            </div>
            <Progress value={getVotingProgress()} className="h-2 mb-2" />
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <ThumbsUp className="h-4 w-4 mr-1 text-green-500" />
                <span>{proposal.votesFor} votes for</span>
              </div>
              <div>
                {proposal.votesFor + proposal.votesAgainst} / {proposal.votesRequired} votes required
              </div>
              <div className="flex items-center">
                <ThumbsDown className="h-4 w-4 mr-1 text-red-500" />
                <span>{proposal.votesAgainst} votes against</span>
              </div>
            </div>
          </div>
        </CardContent>
        {proposal.status === "active" && (
          <CardFooter className="flex flex-col">
            {hasUserVoted() ? (
              <div className="bg-muted w-full p-4 rounded-lg text-center">
                <p>You have already voted on this proposal</p>
              </div>
            ) : (
              <div className="w-full space-y-4">
                <Textarea
                  placeholder="Share your reasoning for your vote (optional)"
                  value={voteReason}
                  onChange={(e) => setVoteReason(e.target.value)}
                  className="w-full"
                />
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    onClick={() => handleVote(true)}
                    className="flex-1"
                    disabled={voteMutation.isPending}
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Support
                  </Button>
                  <Button
                    onClick={() => handleVote(false)}
                    variant="outline"
                    className="flex-1"
                    disabled={voteMutation.isPending}
                  >
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    Oppose
                  </Button>
                </div>
              </div>
            )}
          </CardFooter>
        )}
      </Card>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Votes ({proposal.votes?.length || 0})</h2>
        {!proposal.votes || proposal.votes.length === 0 ? (
          <div className="bg-muted p-6 rounded-lg text-center">
            <p className="text-muted-foreground">No votes have been cast yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {proposal.votes.map((vote: Vote) => (
              <VoteCard key={vote.id} vote={vote} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}