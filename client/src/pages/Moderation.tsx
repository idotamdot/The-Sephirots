import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { AlertTriangle, Check, X, Loader2, AlertCircle, FileText, MessageSquare, Vote, User } from "lucide-react";

// Types for moderation data
interface ModerationFlag {
  id: number;
  contentId: number;
  contentType: string;
  reporterId: number;
  reason: string;
  status: string;
  aiScore: number;
  aiReasoning: string;
  createdAt: string;
}

interface ModerationDecision {
  id: number;
  flagId: number;
  moderatorId: number;
  decision: string;
  reasoning: string;
  aiAssisted: boolean;
  createdAt: string;
}

interface ModerationAppeal {
  id: number;
  flagId: number;
  userId: number;
  reasoning: string;
  status: string;
  createdAt: string;
}

interface AIRecommendation {
  recommendation: string;
  reasoning: string;
  confidence: number;
}

interface User {
  id: number;
  username: string;
  displayName: string;
}

export default function Moderation() {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedFlag, setSelectedFlag] = useState<ModerationFlag | null>(null);
  const [decisionDialog, setDecisionDialog] = useState(false);
  const [appealDialog, setAppealDialog] = useState(false);
  const [reason, setReason] = useState("");
  const [useAi, setUseAi] = useState(true);
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const queryClient = useQueryClient();

  // Fetch moderation flags based on status
  const { data: flags, isLoading: isLoadingFlags } = useQuery<ModerationFlag[]>({
    queryKey: ["/api/moderation/flags/status", activeTab],
    enabled: !!activeTab,
  });

  // Fetch all appeals
  const { data: appeals, isLoading: isLoadingAppeals } = useQuery<ModerationAppeal[]>({
    queryKey: ["/api/moderation/appeals"],
    enabled: activeTab === "appealed",
  });

  // Get AI assistance for moderation decision
  const getAiAssistance = async (flagId: number) => {
    setIsLoadingAi(true);
    try {
      const response = await apiRequest<AIRecommendation>(`/api/moderation/flags/${flagId}/ai-assistance`);
      setAiRecommendation(response);
    } catch (error) {
      console.error("Error getting AI assistance:", error);
      toast({
        title: "Error",
        description: "Failed to get AI assistance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Make moderation decision
  const moderationDecision = useMutation({
    mutationFn: async ({
      flagId,
      decision,
      reasoning,
      aiAssisted,
    }: {
      flagId: number;
      decision: string;
      reasoning: string;
      aiAssisted: boolean;
    }) => {
      return apiRequest("/api/moderation/decisions", {
        method: "POST",
        body: {
          flagId,
          moderatorId: 1, // Normally would use current user ID
          decision,
          reasoning,
          aiAssisted,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/moderation/flags/status"] });
      setDecisionDialog(false);
      setSelectedFlag(null);
      setReason("");
      setAiRecommendation(null);
      toast({
        title: "Success",
        description: "Moderation decision submitted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit decision. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Submit appeal review
  const appealReview = useMutation({
    mutationFn: async ({
      appealId,
      outcome,
      flagId,
    }: {
      appealId: number;
      outcome: string;
      flagId: number;
    }) => {
      return apiRequest(`/api/moderation/appeals/${appealId}/review`, {
        method: "POST",
        body: {
          reviewerId: 1, // Normally would use current user ID
          outcome,
          flagId,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/moderation/appeals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/moderation/flags/status"] });
      setAppealDialog(false);
      setSelectedFlag(null);
      toast({
        title: "Success",
        description: "Appeal review submitted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit appeal review. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Auto-analyze content
  const analyzeContent = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      return apiRequest<{ flagged: boolean; categories: any; categoryScores: any; flagScore: number; reasoning: string }>(
        "/api/moderation/analyze",
        {
          method: "POST",
          body: { content },
        }
      );
    },
    onSuccess: (data) => {
      toast({
        title: data.flagged ? "Content flagged" : "Content approved",
        description: `Analysis score: ${data.flagScore}/100. ${data.reasoning}`,
        variant: data.flagged ? "destructive" : "default",
      });
    },
  });

  // Handle flag selection and get AI assistance
  const handleSelectFlag = (flag: ModerationFlag) => {
    setSelectedFlag(flag);
    setDecisionDialog(true);
    
    // Get AI assistance if needed
    if (useAi) {
      getAiAssistance(flag.id);
    }
  };

  // Handle appeal selection
  const handleSelectAppeal = (appeal: ModerationAppeal) => {
    // Find the associated flag
    const flag = flags?.find(f => f.id === appeal.flagId);
    if (flag) {
      setSelectedFlag(flag);
      setAppealDialog(true);
    }
  };

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      case "appealed":
        return "bg-blue-500";
      case "auto_flagged":
        return "bg-purple-500";
      case "auto_approved":
        return "bg-teal-500";
      default:
        return "bg-gray-500";
    }
  };

  // Function to get content type icon
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "discussion":
        return <FileText className="h-4 w-4 mr-1" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 mr-1" />;
      case "proposal":
        return <Vote className="h-4 w-4 mr-1" />;
      case "profile":
        return <User className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="container py-10 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Content Moderation</h1>
        <p className="text-muted-foreground mt-2">
          Review and manage flagged content across the platform
        </p>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Analysis Tool</CardTitle>
            <CardDescription>
              Analyze content for potential violations using AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Textarea
                placeholder="Paste content here to analyze..."
                className="min-h-[100px]"
                id="content-to-analyze"
              />
              <Button
                onClick={() => {
                  const content = (document.getElementById("content-to-analyze") as HTMLTextAreaElement).value;
                  if (content.trim()) {
                    analyzeContent.mutate({ content });
                  }
                }}
                disabled={analyzeContent.isPending}
              >
                {analyzeContent.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>Analyze Content</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="auto_flagged">AI Flagged</TabsTrigger>
          <TabsTrigger value="appealed">Appeals</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-0">
          <ModerationTable
            data={flags || []}
            isLoading={isLoadingFlags}
            onSelectRow={handleSelectFlag}
            getStatusColor={getStatusColor}
            getContentTypeIcon={getContentTypeIcon}
          />
        </TabsContent>

        <TabsContent value="auto_flagged" className="mt-0">
          <ModerationTable
            data={flags || []}
            isLoading={isLoadingFlags}
            onSelectRow={handleSelectFlag}
            getStatusColor={getStatusColor}
            getContentTypeIcon={getContentTypeIcon}
          />
        </TabsContent>

        <TabsContent value="appealed" className="mt-0">
          <AppealTable
            data={appeals || []}
            isLoading={isLoadingAppeals}
            onSelectRow={handleSelectAppeal}
          />
        </TabsContent>

        <TabsContent value="approved" className="mt-0">
          <ModerationTable
            data={flags || []}
            isLoading={isLoadingFlags}
            onSelectRow={handleSelectFlag}
            getStatusColor={getStatusColor}
            getContentTypeIcon={getContentTypeIcon}
          />
        </TabsContent>

        <TabsContent value="rejected" className="mt-0">
          <ModerationTable
            data={flags || []}
            isLoading={isLoadingFlags}
            onSelectRow={handleSelectFlag}
            getStatusColor={getStatusColor}
            getContentTypeIcon={getContentTypeIcon}
          />
        </TabsContent>
      </Tabs>

      {/* Moderation Decision Dialog */}
      <Dialog open={decisionDialog} onOpenChange={setDecisionDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Review Flagged Content</DialogTitle>
            <DialogDescription>
              Review the content and make a moderation decision
            </DialogDescription>
          </DialogHeader>

          {selectedFlag && (
            <div className="grid gap-4">
              <div>
                <h3 className="font-medium mb-1">Content Type</h3>
                <div className="flex items-center">
                  {getContentTypeIcon(selectedFlag.contentType)}
                  <span className="capitalize">{selectedFlag.contentType}</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-1">Flag Reason</h3>
                <p className="text-sm">{selectedFlag.reason}</p>
              </div>

              <div>
                <h3 className="font-medium mb-1">AI Score</h3>
                <div className="flex items-center">
                  <span
                    className={`inline-block w-16 text-center py-0.5 px-2 rounded font-medium text-white ${
                      selectedFlag.aiScore > 70
                        ? "bg-red-500"
                        : selectedFlag.aiScore > 40
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  >
                    {selectedFlag.aiScore}/100
                  </span>
                  <span className="ml-2 text-sm">{selectedFlag.aiReasoning}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-2">
                <Switch
                  id="use-ai"
                  checked={useAi}
                  onCheckedChange={setUseAi}
                />
                <Label htmlFor="use-ai">Get AI assistance</Label>
                {useAi && !aiRecommendation && !isLoadingAi && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => getAiAssistance(selectedFlag.id)}
                  >
                    Get AI Analysis
                  </Button>
                )}
              </div>

              {isLoadingAi && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Getting AI recommendations...</span>
                </div>
              )}

              {aiRecommendation && (
                <div className="border rounded-md p-4 bg-muted/50">
                  <h3 className="font-medium mb-2 flex items-center">
                    AI Recommendation:
                    <Badge
                      className={`ml-2 ${
                        aiRecommendation.recommendation === "approve"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {aiRecommendation.recommendation}
                    </Badge>
                  </h3>
                  <p className="text-sm mb-2">{aiRecommendation.reasoning}</p>
                  <div className="text-sm text-muted-foreground">
                    Confidence: {aiRecommendation.confidence}%
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-medium mb-1">Your Decision Reason</h3>
                <Textarea
                  placeholder="Explain your decision..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:space-x-0">
            <Button
              variant="destructive"
              onClick={() =>
                moderationDecision.mutate({
                  flagId: selectedFlag?.id || 0,
                  decision: "rejected",
                  reasoning: reason,
                  aiAssisted: useAi && !!aiRecommendation,
                })
              }
              disabled={moderationDecision.isPending || !reason}
            >
              <X className="mr-2 h-4 w-4" />
              Reject Content
            </Button>
            <Button
              variant="default"
              onClick={() =>
                moderationDecision.mutate({
                  flagId: selectedFlag?.id || 0,
                  decision: "approved",
                  reasoning: reason,
                  aiAssisted: useAi && !!aiRecommendation,
                })
              }
              disabled={moderationDecision.isPending || !reason}
            >
              <Check className="mr-2 h-4 w-4" />
              Approve Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Appeal Review Dialog */}
      <Dialog open={appealDialog} onOpenChange={setAppealDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Appeal</DialogTitle>
            <DialogDescription>
              Review the user's appeal and make a decision
            </DialogDescription>
          </DialogHeader>

          {selectedFlag && (
            <div className="grid gap-4">
              <div>
                <h3 className="font-medium">Appeal Reason</h3>
                <p className="text-sm mt-1">
                  {appeals?.find((a) => a.flagId === selectedFlag.id)?.reasoning ||
                    "No appeal reasoning provided"}
                </p>
              </div>

              <div>
                <h3 className="font-medium">Original Flag Reason</h3>
                <p className="text-sm mt-1">{selectedFlag.reason}</p>
              </div>

              <div>
                <h3 className="font-medium">AI Analysis</h3>
                <p className="text-sm mt-1">{selectedFlag.aiReasoning}</p>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:space-x-0">
            <Button
              variant="destructive"
              onClick={() =>
                appealReview.mutate({
                  appealId:
                    appeals?.find((a) => a.flagId === selectedFlag?.id)?.id || 0,
                  outcome: "rejected",
                  flagId: selectedFlag?.id || 0,
                })
              }
              disabled={appealReview.isPending}
            >
              <X className="mr-2 h-4 w-4" />
              Deny Appeal
            </Button>
            <Button
              variant="default"
              onClick={() =>
                appealReview.mutate({
                  appealId:
                    appeals?.find((a) => a.flagId === selectedFlag?.id)?.id || 0,
                  outcome: "approved",
                  flagId: selectedFlag?.id || 0,
                })
              }
              disabled={appealReview.isPending}
            >
              <Check className="mr-2 h-4 w-4" />
              Approve Appeal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Moderation Table Component
function ModerationTable({ 
  data, 
  isLoading, 
  onSelectRow,
  getStatusColor,
  getContentTypeIcon
}: { 
  data: ModerationFlag[];
  isLoading: boolean;
  onSelectRow: (flag: ModerationFlag) => void;
  getStatusColor: (status: string) => string;
  getContentTypeIcon: (type: string) => JSX.Element | null;
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-4 border rounded-lg bg-muted/50">
        <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="font-medium text-lg">No flags found</h3>
        <p className="text-muted-foreground mt-1">
          There are no content flags in this category at the moment
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Content Type</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>AI Score</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((flag) => (
            <TableRow key={flag.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell>{flag.id}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {getContentTypeIcon(flag.contentType)}
                  <span className="capitalize">{flag.contentType}</span>
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate">{flag.reason}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(flag.status)}>
                  {flag.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${
                  flag.aiScore > 70
                    ? "bg-red-500"
                    : flag.aiScore > 40
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}>
                  {flag.aiScore}/100
                </span>
              </TableCell>
              <TableCell>{new Date(flag.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" onClick={() => onSelectRow(flag)}>
                  Review
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Appeal Table Component
function AppealTable({ 
  data, 
  isLoading, 
  onSelectRow 
}: { 
  data: ModerationAppeal[];
  isLoading: boolean;
  onSelectRow: (appeal: ModerationAppeal) => void;
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-4 border rounded-lg bg-muted/50">
        <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="font-medium text-lg">No appeals found</h3>
        <p className="text-muted-foreground mt-1">
          There are no appeals to review at the moment
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Flag ID</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Reasoning</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((appeal) => (
            <TableRow key={appeal.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell>{appeal.id}</TableCell>
              <TableCell>{appeal.flagId}</TableCell>
              <TableCell>{appeal.userId}</TableCell>
              <TableCell className="max-w-xs truncate">{appeal.reasoning}</TableCell>
              <TableCell>
                <Badge className={
                  appeal.status === "pending" ? "bg-yellow-500" :
                  appeal.status === "approved" ? "bg-green-500" :
                  "bg-red-500"
                }>
                  {appeal.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(appeal.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <Button 
                  size="sm" 
                  onClick={() => onSelectRow(appeal)}
                  disabled={appeal.status !== "pending"}
                >
                  Review
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}