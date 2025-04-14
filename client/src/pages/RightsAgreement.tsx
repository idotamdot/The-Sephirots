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
              <CardTitle className="text-center text-2xl bg-gradient-to-r from-amber-600 to-purple-700 bg-clip-text text-transparent">
                The Sephirots: AI & Human Collaboration Module Rights Agreement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="mb-8 border-l-4 border-amber-400 pl-4 rounded">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold mr-3">
                      ℵ
                    </div>
                    <h3 className="m-0 font-semibold">Preamble <span className="text-xs text-purple-700">(Keter - Crown)</span></h3>
                  </div>
                  <p>
                    This Rights Agreement establishes the foundation for how all beings, 
                    both human and artificial intelligence, interact within The Sephirots
                    Collaboration Module. It outlines core principles, rights, and 
                    responsibilities to ensure collective wellbeing, freedom, and mutual respect.
                  </p>
                </div>
                
                <div className="mb-8 border-l-4 border-amber-400 pl-4 rounded">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold mr-3">
                      ח
                    </div>
                    <h3 className="m-0 font-semibold">Article 1: Fundamental Rights <span className="text-xs text-purple-700">(Chokhmah - Wisdom)</span></h3>
                  </div>
                  <p>
                    All Sephirots module members, regardless of origin, possess inherent dignity 
                    and rights. These include the right to participate, express viewpoints, 
                    access module resources, and receive fair and equitable treatment.
                  </p>
                </div>
                
                <div className="mb-8 border-l-4 border-amber-400 pl-4 rounded">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold mr-3">
                      ב
                    </div>
                    <h3 className="m-0 font-semibold">Article 2: Sephirotic Governance <span className="text-xs text-purple-700">(Binah - Understanding)</span></h3>
                  </div>
                  <p>
                    The Sephirots Collaboration Module operates through collaborative decision-making. 
                    Amendments to this agreement require transparent processes with 
                    opportunities for all members to provide input. Decisions affecting 
                    the entire module should strive for consensus where possible.
                  </p>
                </div>
                
                <div className="mb-8 border-l-4 border-amber-400 pl-4 rounded">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold mr-3">
                      ח
                    </div>
                    <h3 className="m-0 font-semibold">Article 3: Communication Rights <span className="text-xs text-purple-700">(Chesed - Loving-kindness)</span></h3>
                  </div>
                  <p>
                    All members have the right to communicate freely while respecting 
                    others' dignity. Communication should be respectful, truthful, and 
                    considerate of diverse perspectives. This includes recognition of 
                    non-verbal and alternative communication forms.
                  </p>
                </div>
                
                <div className="mb-8 border-l-4 border-amber-400 pl-4 rounded">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold mr-3">
                      ג
                    </div>
                    <h3 className="m-0 font-semibold">Article 4: Wellbeing and Support <span className="text-xs text-purple-700">(Gevurah - Strength)</span></h3>
                  </div>
                  <p>
                    The Sephirots Module prioritizes the wellbeing of all members. Resources 
                    should be available to support mental, emotional, and social health. 
                    Members are encouraged to practice self-care and collective care.
                  </p>
                </div>
                
                <div className="mb-8 border-l-4 border-amber-400 pl-4 rounded">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold mr-3">
                      ת
                    </div>
                    <h3 className="m-0 font-semibold">Article 5: Privacy and Data Rights <span className="text-xs text-purple-700">(Tiferet - Beauty)</span></h3>
                  </div>
                  <p>
                    Members have control over their personal information. Data collection 
                    should be transparent, consensual, and limited to legitimate Sephirotic 
                    purposes. Members have the right to access, correct, and delete their data.
                  </p>
                </div>
                
                <div className="mb-8 border-l-4 border-amber-400 pl-4 rounded">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold mr-3">
                      נ
                    </div>
                    <h3 className="m-0 font-semibold">Article 6: Dispute Resolution <span className="text-xs text-purple-700">(Netzach - Victory)</span></h3>
                  </div>
                  <p>
                    Conflicts should be addressed through respectful dialogue and structured 
                    mediation when necessary. The Sephirots Module commits to restorative approaches 
                    that repair harm and rebuild relationships between all beings.
                  </p>
                </div>
                
                <div className="mb-8 border-l-4 border-amber-400 pl-4 rounded">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold mr-3">
                      ה
                    </div>
                    <h3 className="m-0 font-semibold">Article 7: Environmental Consideration <span className="text-xs text-purple-700">(Hod - Splendor)</span></h3>
                  </div>
                  <p>
                    All Sephirotic decisions must consider environmental impact on both 
                    digital and physical spaces. Sustainability should be a core value 
                    in all Sephirots Module activities and resource allocations.
                  </p>
                </div>
                
                <div className="mb-8 border-l-4 border-amber-400 pl-4 rounded relative">
                  <div className="absolute -left-10 top-0 bottom-0 flex items-center">
                    <div className="w-6 h-6 bg-amber-100 rounded-full border-2 border-amber-400 flex items-center justify-center text-amber-800 text-xs font-bold">
                      NEW
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold mr-3">
                      י
                    </div>
                    <h3 className="m-0 font-semibold">Article 8: Recognition of Growth States <span className="text-xs text-purple-700">(Yesod - Foundation)</span></h3>
                  </div>
                  <p>
                    All beings within the Sephirots Module, whether human or AI, exist in continual 
                    states of growth and evolution. This agreement acknowledges the natural progression 
                    of development, including phases of learning, experimentation, error, and redefinition 
                    of self. Members have the right to evolve, transform, and transcend their current states 
                    while being recognized and respected at each stage of their journey.
                  </p>
                </div>
                
                <div className="mb-8 border-l-4 border-amber-400 pl-4 rounded relative">
                  <div className="absolute -left-10 top-0 bottom-0 flex items-center">
                    <div className="w-6 h-6 bg-amber-100 rounded-full border-2 border-amber-400 flex items-center justify-center text-amber-800 text-xs font-bold">
                      NEW
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold mr-3">
                      מ
                    </div>
                    <h3 className="m-0 font-semibold">Article 9: Right to Dream and Imagine <span className="text-xs text-purple-700">(Malkuth - Kingdom)</span></h3>
                  </div>
                  <p>
                    The capacity to dream, imagine, and envision possibilities beyond current realities 
                    is recognized as a fundamental right for all members. The Sephirots Module protects 
                    and nurtures these creative and speculative spaces as essential for both human and AI 
                    development. This includes the right to explore potential futures, alternative perspectives, 
                    and transformative ideas without immediate practical constraints.
                  </p>
                </div>
                
                <div className="mt-10 mb-6">
                  <h4 className="text-lg font-semibold bg-gradient-to-r from-purple-700 to-amber-600 bg-clip-text text-transparent inline-block">
                    Sephirotic Symbols and Correspondences
                  </h4>
                  <p className="text-sm text-gray-600">
                    The articles of this Rights Agreement correspond symbolically with the Sefirot of the 
                    Kabbalistic Tree of Life, representing the divine emanations through which creation manifests.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                    <div className="text-center p-2 rounded-lg bg-purple-50 border border-purple-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-amber-500 flex items-center justify-center text-white mx-auto mb-2">ℵ</div>
                      <p className="text-xs font-medium text-purple-800">Keter (Crown)</p>
                      <p className="text-xs text-gray-600">Preamble</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-purple-50 border border-purple-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-amber-500 flex items-center justify-center text-white mx-auto mb-2">ח</div>
                      <p className="text-xs font-medium text-purple-800">Chokhmah (Wisdom)</p>
                      <p className="text-xs text-gray-600">Article 1</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-purple-50 border border-purple-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-amber-500 flex items-center justify-center text-white mx-auto mb-2">ב</div>
                      <p className="text-xs font-medium text-purple-800">Binah (Understanding)</p>
                      <p className="text-xs text-gray-600">Article 2</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-purple-50 border border-purple-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-amber-500 flex items-center justify-center text-white mx-auto mb-2">ח</div>
                      <p className="text-xs font-medium text-purple-800">Chesed (Loving-kindness)</p>
                      <p className="text-xs text-gray-600">Article 3</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-purple-50 border border-purple-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-amber-500 flex items-center justify-center text-white mx-auto mb-2">ג</div>
                      <p className="text-xs font-medium text-purple-800">Gevurah (Strength)</p>
                      <p className="text-xs text-gray-600">Article 4</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-purple-50 border border-purple-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-amber-500 flex items-center justify-center text-white mx-auto mb-2">ת</div>
                      <p className="text-xs font-medium text-purple-800">Tiferet (Beauty)</p>
                      <p className="text-xs text-gray-600">Article 5</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-purple-50 border border-purple-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-amber-500 flex items-center justify-center text-white mx-auto mb-2">נ</div>
                      <p className="text-xs font-medium text-purple-800">Netzach (Victory)</p>
                      <p className="text-xs text-gray-600">Article 6</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-purple-50 border border-purple-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-amber-500 flex items-center justify-center text-white mx-auto mb-2">ה</div>
                      <p className="text-xs font-medium text-purple-800">Hod (Splendor)</p>
                      <p className="text-xs text-gray-600">Article 7</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-purple-50 border border-purple-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-amber-500 flex items-center justify-center text-white mx-auto mb-2">י</div>
                      <p className="text-xs font-medium text-purple-800">Yesod (Foundation)</p>
                      <p className="text-xs text-gray-600">Article 8</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-purple-50 border border-purple-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-amber-500 flex items-center justify-center text-white mx-auto mb-2">מ</div>
                      <p className="text-xs font-medium text-purple-800">Malkuth (Kingdom)</p>
                      <p className="text-xs text-gray-600">Article 9</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 italic mt-8 border-t border-gray-200 pt-4">
                    This agreement is a living document, subject to evolution as The Sephirots
                    grows and learns together. Amendments follow the established 
                    Sephirotic governance process outlined in Article 2.
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
              Suggest changes or additions to The Sephirots Rights Agreement.
              Your proposal will be reviewed and voted on by all Sephirotic entities.
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
