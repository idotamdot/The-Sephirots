import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Annotation, AnnotationReply } from "@shared/schema";
// Import from index to avoid circular dependencies
import { AnnotationReplyForm, AnnotationForm } from ".";

type AnnotationWithUserAndReplies = Annotation & {
  user: {
    id: number;
    displayName: string;
    avatar?: string | null;
  } | null;
  replies: (AnnotationReply & {
    user: {
      id: number;
      displayName: string;
      avatar?: string | null;
    } | null;
  })[];
};

interface AnnotationListProps {
  proposalId: number;
  currentUserId: number;
}

export default function AnnotationList({ proposalId, currentUserId }: AnnotationListProps) {
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  
  const { data: annotations, isLoading, isError, refetch } = useQuery<AnnotationWithUserAndReplies[]>({
    queryKey: ['/api/proposals', proposalId, 'annotations'],
    queryFn: () => fetch(`/api/proposals/${proposalId}/annotations`).then(res => res.json())
  });
  
  const handleAddReply = () => {
    refetch();
    setReplyingTo(null);
  };
  
  const handleResolveAnnotation = async (annotationId: number) => {
    try {
      await fetch(`/api/annotations/${annotationId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUserId }),
      });
      refetch();
    } catch (error) {
      console.error('Failed to resolve annotation:', error);
    }
  };
  
  if (isLoading) {
    return <div className="text-center p-4">Loading annotations...</div>;
  }
  
  if (isError) {
    return <div className="text-center text-red-500 p-4">Error loading annotations</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Annotations & Comments</h3>
        <AnnotationForm proposalId={proposalId} userId={currentUserId} onSuccess={refetch} />
      </div>
      
      {annotations && annotations.length > 0 ? (
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {annotations.map((annotation) => (
              <Card key={annotation.id} className={annotation.status === 'resolved' ? 'border-green-200 bg-green-50' : ''}>
                <CardHeader className="pb-2 pt-4 px-4 flex flex-row justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={annotation.user?.avatar || ''} alt={annotation.user?.displayName || 'User'} />
                      <AvatarFallback>{annotation.user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{annotation.user?.displayName || 'Unknown User'}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(annotation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={
                    annotation.type === 'suggestion' ? 'outline' :
                    annotation.type === 'question' ? 'secondary' : 'default'
                  }>
                    {annotation.type}
                  </Badge>
                </CardHeader>
                <CardContent className="px-4 py-2">
                  <div className="text-sm">{annotation.content}</div>
                  {annotation.status === 'resolved' && (
                    <p className="text-xs text-green-600 mt-2">
                      Resolved by {annotation.resolvedBy ? 'a team member' : 'author'}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="px-4 pt-0 pb-3 flex flex-col items-start">
                  {annotation.status !== 'resolved' && (
                    <div className="flex space-x-2 mb-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setReplyingTo(replyingTo === annotation.id ? null : annotation.id)}
                      >
                        {replyingTo === annotation.id ? 'Cancel' : 'Reply'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleResolveAnnotation(annotation.id)}
                      >
                        Resolve
                      </Button>
                    </div>
                  )}
                  
                  {replyingTo === annotation.id && (
                    <div className="w-full mb-3">
                      <AnnotationReplyForm 
                        annotationId={annotation.id} 
                        userId={currentUserId} 
                        onSuccess={handleAddReply} 
                      />
                    </div>
                  )}
                  
                  {annotation.replies && annotation.replies.length > 0 && (
                    <div className="w-full mt-2 space-y-3">
                      <Separator />
                      {annotation.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start space-x-2 pt-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={reply.user?.avatar || ''} alt={reply.user?.displayName || 'User'} />
                            <AvatarFallback>{reply.user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-baseline">
                              <p className="text-xs font-medium">{reply.user?.displayName || 'Unknown User'}</p>
                              <span className="mx-2 text-xs text-muted-foreground">
                                {new Date(reply.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center p-8 text-muted-foreground">
          No annotations yet. Be the first to add one!
        </div>
      )}
    </div>
  );
}