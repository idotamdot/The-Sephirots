import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RightsAgreement as AgreementType, Amendment } from "@/lib/types";

interface RightsAgreementResponse {
  id: number;
  title: string;
  content: string;
  version: string;
  status: string;
  createdAt: string;
  amendments: Amendment[];
}

export default function RightsAgreement() {
  const { data, isLoading } = useQuery<RightsAgreementResponse>({
    queryKey: ["/api/rights-agreement/latest"],
  });
  
  if (isLoading) {
    return (
      <section className="mb-8">
        <h2 className="text-xl font-heading font-semibold mb-4">Rights Agreement Updates</h2>
        
        <Card className="shadow-sm border border-gray-100">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-6">
              <div>
                <Skeleton className="h-6 w-64 mb-2" />
                <Skeleton className="h-4 w-96" />
              </div>
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
            
            <div className="mb-6">
              <Skeleton className="h-5 w-40 mb-4" />
              <div className="space-y-6">
                <div className="flex gap-3">
                  <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-5 w-64" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-40 mt-1" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-40 mt-1" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }
  
  if (!data) {
    return null;
  }
  
  // Filter amendments by status
  const approvedAmendments = data.amendments.filter(a => a.status === "approved");
  const proposedAmendments = data.amendments.filter(a => a.status === "proposed");
  
  return (
    <section className="mb-8">
      <h2 className="text-xl font-heading font-semibold mb-4">Rights Agreement Updates</h2>
      
      <Card className="shadow-sm border border-gray-100">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-heading font-semibold text-lg">{data.title}</h3>
              <p className="text-gray-600 text-sm">
                A living document defining rights, responsibilities, and protections for all community members
              </p>
            </div>
            <span className="text-xs px-3 py-1 bg-primary-100 text-primary-700 rounded-full font-medium">
              Version {data.version}
            </span>
          </div>
          
          {approvedAmendments.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-2">Recent Amendments</h4>
              <ul className="space-y-3">
                {approvedAmendments.slice(0, 2).map((amendment) => (
                  <li key={amendment.id} className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                      <i className="ri-add-line"></i>
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium text-sm">{amendment.title}</p>
                      <p className="text-gray-600 text-sm">{amendment.content}</p>
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <span>Proposed by User #{amendment.proposedBy} • 2 days ago</span>
                        <span className="mx-2">•</span>
                        <span className="text-success">Approved with 89% support</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {proposedAmendments.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-2">Under Consideration</h4>
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-warning/20 text-warning flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                    <i className="ri-draft-line"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium text-sm">{proposedAmendments[0].title}</p>
                    <p className="text-gray-600 text-sm mb-3">{proposedAmendments[0].content}</p>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <span>Voting period: <span className="text-gray-700">3 days remaining</span></span>
                        <span className="mx-2">•</span>
                        <span>Current support: <span className="text-primary-600">76%</span></span>
                      </div>
                      <Button variant="link" size="sm" className="p-0 h-auto text-primary-600 font-medium hover:text-primary-700">
                        View Details
                      </Button>
                    </div>
                    
                    <Progress value={76} className="h-1.5" />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/rights-agreement">
                <i className="ri-book-open-line mr-1"></i>
                View Full Agreement
              </Link>
            </Button>
            
            <Button variant="link" size="sm" className="text-primary-600 hover:text-primary-700">
              Propose Amendment <i className="ri-arrow-right-s-line ml-1"></i>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
