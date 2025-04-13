import { Comment } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CommentListProps {
  comments: Comment[];
  discussionId: number;
}

export default function CommentList({ comments, discussionId }: CommentListProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const likeComment = useMutation({
    mutationFn: async (commentId: number) => {
      const response = await apiRequest("POST", `/api/comments/${commentId}/like`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/discussions/${discussionId}`] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to like comment: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  if (!comments || comments.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <i className="ri-chat-3-line text-3xl mb-2"></i>
        <p>No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {comment.user?.isAi ? (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white">
                  <i className="ri-robot-line"></i>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                  {comment.user?.displayName.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <h3 className="font-medium mr-2">
                  {comment.user?.displayName || `User #${comment.userId}`}
                </h3>
                {comment.aiGenerated && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent-100 text-accent-700 mr-2">
                    AI
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  {formatRelativeTime(comment.createdAt)}
                </span>
              </div>
              
              <div className="text-gray-700 mb-3">
                <p>{comment.content}</p>
              </div>
              
              <div className="flex items-center text-gray-500 text-sm">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto p-0 hover:text-primary-600 hover:bg-transparent"
                  onClick={() => likeComment.mutate(comment.id)}
                >
                  <i className="ri-thumb-up-line mr-1"></i>
                  <span>{comment.likes}</span>
                </Button>
                
                <span className="mx-2">•</span>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto p-0 hover:text-primary-600 hover:bg-transparent"
                >
                  <i className="ri-reply-line mr-1"></i>
                  <span>Reply</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
