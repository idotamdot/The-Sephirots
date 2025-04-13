import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AmendmentAnalysis } from "@/lib/types";

const amendmentSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  content: z.string().min(20, { message: "Content must be at least 20 characters" }),
  proposedBy: z.number(),
  agreementId: z.number(),
  status: z.string().default("proposed"),
});

type AmendmentFormValues = z.infer<typeof amendmentSchema>;

interface AmendmentFormProps {
  userId: number;
  agreementId: number;
  onSuccess?: () => void;
}

export default function AmendmentForm({ userId, agreementId, onSuccess }: AmendmentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [analysis, setAnalysis] = useState<AmendmentAnalysis | null>(null);
  
  const form = useForm<AmendmentFormValues>({
    resolver: zodResolver(amendmentSchema),
    defaultValues: {
      title: "",
      content: "",
      proposedBy: userId,
      agreementId: agreementId,
      status: "proposed",
    },
  });
  
  const createAmendment = useMutation({
    mutationFn: async (values: AmendmentFormValues) => {
      const response = await apiRequest("POST", "/api/amendments", values);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/rights-agreement/latest"] });
      
      // Show analysis if available
      if (data.analysis) {
        setAnalysis(data.analysis);
      }
      
      toast({
        title: "Amendment proposed",
        description: "Your amendment has been submitted for community consideration.",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to propose amendment: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (values: AmendmentFormValues) => {
    createAmendment.mutate(values);
  };
  
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amendment Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="E.g., Article 3.4: Digital Privacy Rights" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proposed Text</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Clearly describe the amendment you'd like to propose..." 
                    className="min-h-32"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={createAmendment.isPending}>
              {createAmendment.isPending ? (
                <>Submitting<i className="ri-loader-4-line ml-2 animate-spin"></i></>
              ) : (
                <>Propose Amendment</>
              )}
            </Button>
          </div>
        </form>
      </Form>
      
      {analysis && (
        <Card className="mt-6 border-accent-200">
          <CardContent className="p-5">
            <h3 className="text-lg font-medium mb-3 text-accent-700">
              <i className="ri-ai-generate mr-2"></i>
              AI Analysis of Your Proposal
            </h3>
            
            {analysis.strengths.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-sm text-gray-700 mb-2">Strengths</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-gray-600">{strength}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {analysis.considerations.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-sm text-gray-700 mb-2">Considerations</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.considerations.map((consideration, index) => (
                    <li key={index} className="text-sm text-gray-600">{consideration}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {analysis.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Recommendations</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="text-sm text-gray-600">{recommendation}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
