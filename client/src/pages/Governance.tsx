import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Proposal, ProposalStatus, ProposalCategory, User } from "@/lib/types";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  ThumbsUp, 
  ThumbsDown, 
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Edit,
  Plus,
  Vote as VoteIcon
} from "lucide-react";

// Helper function to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
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

// Component to display a single proposal card
const ProposalCard = ({ proposal }: { proposal: Proposal }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{proposal.title}</CardTitle>
            <CardDescription>
              Proposed by {proposal.user?.displayName || "Unknown"} on {formatDate(proposal.createdAt)}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
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
      <CardContent>
        <p className="line-clamp-3">{proposal.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <ThumbsUp className="h-4 w-4 mr-1 text-green-500" />
            <span>{proposal.votesFor}</span>
          </div>
          <div className="flex items-center">
            <ThumbsDown className="h-4 w-4 mr-1 text-red-500" />
            <span>{proposal.votesAgainst}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Ends: {formatDate(proposal.votingEndsAt)}</span>
          </div>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href={`/governance/${proposal.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Main Governance page component
export default function Governance() {
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all proposals
  const { data: proposals = [], isLoading, error } = useQuery<Proposal[]>({
    queryKey: ['/api/proposals'],
    staleTime: 60000, // 1 minute
  });

  // Function to filter proposals based on active tab
  const getFilteredProposals = () => {
    switch (activeTab) {
      case "active":
        return proposals.filter((p) => p.status === "active");
      case "passed":
        return proposals.filter((p) => p.status === "passed" || p.status === "implemented");
      case "draft":
        return proposals.filter((p) => p.status === "draft");
      default:
        return proposals;
    }
  };

  const filteredProposals = getFilteredProposals();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Community Governance</h1>
          <p className="text-muted-foreground mt-2">
            Participate in shaping our community's future through collaborative decision-making
          </p>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link href="/governance/new">
            <Plus className="mr-2 h-4 w-4" /> Create Proposal
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-4 w-full md:w-[400px]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="passed">Passed</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Loading proposals...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center py-8">
          <p className="text-red-500">Error loading proposals. Please try again.</p>
        </div>
      ) : filteredProposals.length === 0 ? (
        <div className="text-center py-16 bg-muted rounded-lg">
          <h3 className="text-xl font-medium mb-2">No proposals found</h3>
          <p className="text-muted-foreground mb-6">
            {activeTab === "all" 
              ? "Be the first to create a proposal for our community." 
              : `There are no ${activeTab} proposals at the moment.`}
          </p>
          <Button asChild>
            <Link href="/governance/new">Create a Proposal</Link>
          </Button>
        </div>
      ) : (
        <div>
          {filteredProposals.map((proposal: Proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      )}

      <Separator className="my-8" />

      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">How Governance Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center mr-2">1</div>
              Propose
            </h3>
            <p className="text-muted-foreground">
              Any community member can create proposals for new features, rule changes, or community initiatives.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center mr-2">2</div>
              Discuss & Vote
            </h3>
            <p className="text-muted-foreground">
              Members discuss proposals and cast votes. AI assists in moderating discussions and analyzing proposals.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center mr-2">3</div>
              Implement
            </h3>
            <p className="text-muted-foreground">
              Passed proposals are implemented by community members and AI assistants working together.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}