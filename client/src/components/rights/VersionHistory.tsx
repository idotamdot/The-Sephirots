import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RightsAgreement } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface VersionHistoryProps {
  currentAgreementId: number;
  onSelectVersion: (versionId: number) => void;
}

export default function VersionHistory({ currentAgreementId, onSelectVersion }: VersionHistoryProps) {
  const { data: versions, isLoading } = useQuery<Partial<RightsAgreement>[]>({
    queryKey: ["/api/rights-agreement/versions"],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!versions || versions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No previous versions available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Version History</h2>
      
      <div className="space-y-3">
        {versions.map((version) => (
          <Card 
            key={version.id} 
            className={version.id === currentAgreementId ? "border-primary" : ""}
          >
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium">Version {version.version}</h3>
                  <Badge variant={version.status === "approved" ? "success" : "secondary"}>
                    {version.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(version.createdAt as string).toLocaleDateString()} 
                </p>
              </div>
              
              <Button 
                variant={version.id === currentAgreementId ? "default" : "outline"} 
                disabled={version.id === currentAgreementId}
                onClick={() => onSelectVersion(version.id!)}
              >
                {version.id === currentAgreementId ? "Current" : "View"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}