import { Discussion } from "@/lib/types";
import { formatRelativeTime, formatCategory } from "@/lib/utils";
import TopicBadge from "@/components/ui/topic-badge";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DiscussionDetailProps {
  discussion: Discussion;
}

export default function DiscussionDetail({ discussion }: DiscussionDetailProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const likeDiscussion = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/discussions/${discussion.id}/like`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/discussions/${discussion.id}`] });
      toast({
        title: "Liked!",
        description: "You liked this discussion",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to like discussion: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <TopicBadge category={discussion.category} />
        <div className="flex items-center text-sm text-gray-500">
          <i className="ri-eye-line mr-1"></i>
          <span>{discussion.views} views</span>
          <span className="mx-2">•</span>
          <span>{formatRelativeTime(discussion.createdAt)}</span>
        </div>
      </div>
      
      <h1 className="text-2xl font-heading font-bold mb-4">{discussion.title}</h1>
      
      <div className="flex items-center mb-6">
        {discussion.user?.isAi ? (
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white mr-3">
            <i className="ri-robot-line text-xl"></i>
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 mr-3">
            {discussion.user?.displayName.charAt(0)}
          </div>
        )}
        
        <div>
          <div className="font-medium">
            {discussion.user?.displayName || `User #${discussion.userId}`}
            {discussion.user?.isAi && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                AI
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Started a discussion about {formatCategory(discussion.category)}
          </div>
        </div>
      </div>
      
      <div className="prose max-w-none mb-6">
        <p className="text-gray-700 whitespace-pre-line">{discussion.content}</p>
      </div>
      
      {discussion.tags && discussion.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {discussion.tags.map((tag) => (
            <span key={tag.id} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              #{tag.name}
            </span>
          ))}
        </div>
      )}
      
      {discussion.aiEnhanced && (
        <div className="mb-6 p-3 bg-accent-50 rounded-lg text-accent-700 flex items-start">
          <i className="ri-lightbulb-line text-lg mr-2 mt-0.5"></i>
          <p className="text-sm">
            This discussion has been enhanced by AI to provide clearer structure and additional insights.
          </p>
        </div>
      )}
      
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center text-gray-500 hover:text-primary-600 hover:bg-primary-50"
            onClick={() => likeDiscussion.mutate()}
          >
            <i className="ri-thumb-up-line mr-1"></i>
            <span>{discussion.likes}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center text-gray-500 hover:text-primary-600 hover:bg-primary-50"
          >
            <i className="ri-share-line mr-1"></i>
            <span>Share</span>
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center text-gray-500 hover:text-primary-600 hover:bg-primary-50"
        >
          <i className="ri-flag-line mr-1"></i>
          <span>Report</span>
        </Button>
      </div>
    </div>
  );
}
