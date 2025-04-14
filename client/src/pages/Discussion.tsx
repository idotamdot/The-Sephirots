import { useQuery } from "@tanstack/react-query";
import { Discussion as DiscussionType, User } from "@/lib/types";
import DiscussionDetail from "@/components/discussions/DiscussionDetail";
import CommentList from "@/components/discussions/CommentList";
import CommentForm from "@/components/discussions/CommentForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface DiscussionPageProps {
  id: number;
}

export default function Discussion({ id }: DiscussionPageProps) {
  // Get discussion details
  const { data: discussion, isLoading, error } = useQuery<DiscussionType>({
    queryKey: [`/api/discussions/${id}`],
  });
  
  // Get current user for commenting
  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });
  const [aiReply, setAiReply] = useState<string | null>(null);
const [loadingAI, setLoadingAI] = useState(false);
  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-2">
            <i className="ri-arrow-left-line mr-1"></i>
            Back
          </Button>
          <Skeleton className="h-6 w-32" />
        </div>
        
        <Skeleton className="h-64 w-full" />
        
        <div>
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }
  
  if (error || !discussion) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-center items-center flex-col py-12">
          <i className="ri-error-warning-line text-4xl text-gray-400 mb-4"></i>
          <h2 className="text-xl font-medium mb-2">Discussion Not Found</h2>
          <p className="text-gray-600 mb-6">The discussion you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/discussions">
              <i className="ri-discuss-line mr-2"></i>
              Browse Discussions
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/discussions">
            <i className="ri-arrow-left-line mr-1"></i>
            Back to Discussions
          </Link>
        </Button>
      </div>
      {currentUser && (
        <div className="mb-4 flex items-center gap-4">
          <Button onClick={requestAIPerspective} disabled={loadingAI}>
            {loadingAI ? "Asking Harmony AI..." : "Request AI Perspective"}
          </Button>
{currentUser && (
  <div className="mb-4 flex items-center gap-4">
    <Button onClick={requestAIPerspective} disabled={loadingAI}>
      {loadingAI ? "Asking Harmony AI..." : "Request AI Perspective"}
    </Button>

    {aiReply && (
      <div className="bg-skyglow-light border border-skyglow-dark text-blue-900 p-6 rounded-xl shadow-xl animate-subtle-pulse max-w-2xl">
        <i className="ri-sparkling-fill mr-2" />
        Harmony AI: {aiReply}
      </div>
    )}
</div>
)}
          
<DiscussionDetail discussion={discussion} />

<Card>
  <CardHeader>
    <CardTitle className="text-xl">

            {discussion.comments?.length || 0} Responses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentUser && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Join the Conversation</h3>
              <CommentForm 
                discussionId={discussion.id} 
                userId={currentUser.id} 
              />
            </div>
          )}
          
          <CommentList 
            comments={discussion.comments || []} 
            discussionId={discussion.id} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
