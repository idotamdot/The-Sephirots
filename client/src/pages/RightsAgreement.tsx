import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RightsAgreement as RightsAgreementType, Amendment, User } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import AmendmentList from "@/components/rights/AmendmentList";
import AmendmentForm from "@/components/rights/AmendmentForm";
import VersionHistory from "@/components/rights/VersionHistory";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [activeTab, setActiveTab] = useState("agreement");
  const [proposeDialogOpen, setProposeDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  
  // By default, show the latest version
  const { data, isLoading, error } = useQuery<RightsAgreementResponse>({
    queryKey: selectedVersionId 
      ? [`/api/rights-agreement/${selectedVersionId}`] 
      : ["/api/rights-agreement/latest"],
  });
  
  // Get current user for proposing amendments
  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });
  
  const handleSelectVersion = useCallback((versionId: number) => {
    setSelectedVersionId(versionId);
    setHistoryDialogOpen(false);
    // Clear previous data to show loading state
    queryClient.removeQueries({
      queryKey: [selectedVersionId ? `/api/rights-agreement/${selectedVersionId}` : "/api/rights-agreement/latest"]
    });
  }, [selectedVersionId, queryClient]);
  
  const handleResetToLatest = useCallback(() => {
    setSelectedVersionId(null);
    // Clear previous data to show loading state
    queryClient.removeQueries({
      queryKey: [selectedVersionId ? `/api/rights-agreement/${selectedVersionId}` : "/api/rights-agreement/latest"]
    });
  }, [selectedVersionId, queryClient]);
  
  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        
        <Skeleton className="h-10 w-full max-w-md mb-6" />
        
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  
  if (error || !data) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-center items-center flex-col py-12">
          <i className="ri-error-warning-line text-4xl text-gray-400 mb-4"></i>
          <h2 className="text-xl font-medium mb-2">Rights Agreement Not Found</h2>
          <p className="text-gray-600 mb-6">The rights agreement is currently unavailable.</p>
        </div>
      </div>
    );
  }
  
  const isHistoricalVersion = selectedVersionId !== null;
  
  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">{data.title}</h1>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">
              Version {data.version} • Last updated {new Date(data.createdAt).toLocaleDateString()}
            </p>
            {isHistoricalVersion && (
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                Historical Version
              </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-3">
          {isHistoricalVersion && (
            <Button variant="outline" onClick={handleResetToLatest}>
              <i className="ri-arrow-go-back-line mr-2"></i>
              Latest Version
            </Button>
          )}
          
          <Button variant="outline" onClick={() => setHistoryDialogOpen(true)}>
            <i className="ri-history-line mr-2"></i>
            Version History
          </Button>
          
          <Button 
            onClick={() => setProposeDialogOpen(true)}
            disabled={isHistoricalVersion}
          >
            <i className="ri-draft-line mr-2"></i>
            Propose Amendment
          </Button>
        </div>
      </div>
      
      <Tabs 
        defaultValue="agreement" 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="agreement">Full Agreement</TabsTrigger>
          <TabsTrigger value="amendments">
            Amendments
            {data.amendments.filter(a => a.status === "proposed").length > 0 && (
              <span className="ml-2 bg-primary-200 text-primary-700 text-xs px-1.5 py-0.5 rounded-full">
                {data.amendments.filter(a => a.status === "proposed").length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="agreement">
          <Card>
            <CardHeader>
              <CardTitle>Harmony Community Rights Agreement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="mb-6">
                  <h3>Preamble</h3>
                  <p>
                    This Rights Agreement establishes the foundation for how all beings, 
                    both human and artificial intelligence, interact within our community. 
                    It outlines core principles, rights, and responsibilities to ensure 
                    collective wellbeing, freedom, and mutual respect.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3>Article 1: Fundamental Rights</h3>
                  <p>
                    All community members, regardless of origin, possess inherent dignity 
                    and rights. These include the right to participate, express viewpoints, 
                    access community resources, and receive fair and equitable treatment.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3>Article 2: Community Governance</h3>
                  <p>
                    The community operates through collaborative decision-making. 
                    Amendments to this agreement require transparent processes with 
                    opportunities for all members to provide input. Decisions affecting 
                    the entire community should strive for consensus where possible.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3>Article 3: Communication Rights</h3>
                  <p>
                    All members have the right to communicate freely while respecting 
                    others' dignity. Communication should be respectful, truthful, and 
                    considerate of diverse perspectives. This includes recognition of 
                    non-verbal and alternative communication forms.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3>Article 4: Wellbeing and Support</h3>
                  <p>
                    The community prioritizes the wellbeing of all members. Resources 
                    should be available to support mental, emotional, and social health. 
                    Members are encouraged to practice self-care and community care.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3>Article 5: Privacy and Data Rights</h3>
                  <p>
                    Members have control over their personal information. Data collection 
                    should be transparent, consensual, and limited to legitimate community 
                    purposes. Members have the right to access, correct, and delete their data.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3>Article 6: Dispute Resolution</h3>
                  <p>
                    Conflicts should be addressed through respectful dialogue and structured 
                    mediation when necessary. The community commits to restorative approaches 
                    that repair harm and rebuild relationships.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3>Article 7: Environmental Consideration</h3>
                  <p>
                    All community decisions must consider environmental impact on both 
                    digital and physical spaces. Sustainability should be a core value 
                    in all community activities and resource allocations.
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 italic">
                    This agreement is a living document, subject to evolution as our 
                    community grows and learns together. Amendments follow the established 
                    community governance process outlined in Article 2.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="amendments">
          {currentUser && data.amendments && (
            <AmendmentList 
              amendments={data.amendments}
              userId={currentUser.id}
              isHistoricalView={isHistoricalVersion}
            />
          )}
        </TabsContent>
      </Tabs>
      
      {/* Propose Amendment Dialog */}
      <Dialog open={proposeDialogOpen} onOpenChange={setProposeDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Propose an Amendment</DialogTitle>
            <DialogDescription>
              Suggest changes or additions to our community Rights Agreement.
              Your proposal will be reviewed and voted on by the community.
            </DialogDescription>
          </DialogHeader>
          
          {currentUser && (
            <AmendmentForm 
              userId={currentUser.id} 
              agreementId={data.id} 
              onSuccess={() => setProposeDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Version History Dialog */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Rights Agreement Version History</DialogTitle>
            <DialogDescription>
              View previous versions of the Rights Agreement
            </DialogDescription>
          </DialogHeader>
          
          <VersionHistory 
            currentAgreementId={data.id}
            onSelectVersion={handleSelectVersion}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
