import { Amendment } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface AmendmentListProps {
  amendments: Amendment[];
  userId: number;
}

export default function AmendmentList({ amendments, userId }: AmendmentListProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [votingAmendmentId, setVotingAmendmentId] = useState<number | null>(null);
  
  const voteOnAmendment = useMutation({
    mutationFn: async ({ id, support }: { id: number; support: boolean }) => {
      const response = await apiRequest("POST", `/api/amendments/${id}/vote`, {
        support,
        userId,
      });
      return response.json();
    },
    onMutate: (variables) => {
      setVotingAmendmentId(variables.id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/rights-agreement/latest"] });
      toast({
        title: "Vote recorded",
        description: `You ${variables.support ? "supported" : "opposed"} the amendment.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to record vote: ${error.message}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setVotingAmendmentId(null);
    },
  });
  
  if (!amendments || amendments.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <i className="ri-file-list-3-line text-3xl mb-2"></i>
        <p>No amendments to display at this time.</p>
      </div>
    );
  }
  
  // Group amendments by status
  const proposedAmendments = amendments.filter(a => a.status === "proposed");
  const approvedAmendments = amendments.filter(a => a.status === "approved");
  const rejectedAmendments = amendments.filter(a => a.status === "rejected");
  
  return (
    <div className="space-y-8">
      {proposedAmendments.length > 0 && (
        <div>
          <h3 className="text-lg font-heading font-semibold mb-4">Under Consideration</h3>
          <div className="space-y-4">
            {proposedAmendments.map((amendment) => {
              const totalVotes = amendment.votesFor + amendment.votesAgainst;
              const supportPercentage = totalVotes > 0 
                ? Math.round((amendment.votesFor / totalVotes) * 100) 
                : 0;
                
              return (
                <Card key={amendment.id} className="border-l-4 border-l-warning">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800">{amendment.title}</h4>
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                        Proposed
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{amendment.content}</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Support: {supportPercentage}%</span>
                        <span>Total votes: {totalVotes}</span>
                      </div>
                      <Progress value={supportPercentage} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Proposed {formatRelativeTime(amendment.createdAt)}
                      </span>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-destructive/30 text-destructive hover:bg-destructive/10"
                          onClick={() => voteOnAmendment.mutate({ id: amendment.id, support: false })}
                          disabled={votingAmendmentId === amendment.id}
                        >
                          {votingAmendmentId === amendment.id ? (
                            <i className="ri-loader-4-line animate-spin mr-1"></i>
                          ) : (
                            <i className="ri-thumb-down-line mr-1"></i>
                          )}
                          Oppose
                        </Button>
                        
                        <Button 
                          size="sm"
                          onClick={() => voteOnAmendment.mutate({ id: amendment.id, support: true })}
                          disabled={votingAmendmentId === amendment.id}
                        >
                          {votingAmendmentId === amendment.id ? (
                            <i className="ri-loader-4-line animate-spin mr-1"></i>
                          ) : (
                            <i className="ri-thumb-up-line mr-1"></i>
                          )}
                          Support
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
      
      {approvedAmendments.length > 0 && (
        <div>
          <h3 className="text-lg font-heading font-semibold mb-4">Recently Approved</h3>
          <div className="space-y-4">
            {approvedAmendments.map((amendment) => (
              <Card key={amendment.id} className="border-l-4 border-l-success">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">{amendment.title}</h4>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      Approved
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2">{amendment.content}</p>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Approved {formatRelativeTime(amendment.createdAt)}</span>
                    <span>With {Math.round((amendment.votesFor / (amendment.votesFor + amendment.votesAgainst)) * 100)}% support</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {rejectedAmendments.length > 0 && (
        <div>
          <h3 className="text-lg font-heading font-semibold mb-4">Rejected Proposals</h3>
          <div className="space-y-4">
            {rejectedAmendments.map((amendment) => (
              <Card key={amendment.id} className="border-l-4 border-l-destructive">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">{amendment.title}</h4>
                    <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                      Rejected
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2">{amendment.content}</p>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Rejected {formatRelativeTime(amendment.createdAt)}</span>
                    <span>With {Math.round((amendment.votesAgainst / (amendment.votesFor + amendment.votesAgainst)) * 100)}% opposition</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
