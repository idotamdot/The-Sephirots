import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Form schema
const proposalFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be at most 100 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.enum(["community_rules", "feature_request", "moderation_policy", "resource_allocation", "protocol_change", "other"]),
  votesRequired: z.number().min(3, "At least 3 votes are required").max(100, "Maximum 100 votes can be required"),
  votingEndsAt: z.date().refine(date => date > new Date(), "End date must be in the future"),
});

// Helper function to add days to a date
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export default function CreateProposal() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Default voting end date (7 days from now)
  const defaultEndDate = addDays(new Date(), 7);

  // Form setup
  const form = useForm<z.infer<typeof proposalFormSchema>>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "feature_request",
      votesRequired: 10,
      votingEndsAt: defaultEndDate,
    },
  });

  // Fetch current user
  const { data: currentUser, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ['/api/users/me'],
  });

  // Proposal creation mutation
  const createProposalMutation = useMutation({
    mutationFn: async (values: z.infer<typeof proposalFormSchema>) => {
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      
      const response = await apiRequest("POST", "/api/proposals", {
        ...values,
        status: "draft", // Start as draft
        proposedBy: currentUser.id,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Proposal created",
        description: "Your proposal has been created successfully!",
      });
      
      // Redirect to the proposal page
      setTimeout(() => {
        setLocation(`/governance/${data.id}`);
      }, 1000);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create proposal. Please try again.",
        variant: "destructive",
      });
      console.error("Create proposal error:", error);
    },
  });

  // Form submission handler
  const onSubmit = (values: z.infer<typeof proposalFormSchema>) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "You need to sign in to create a proposal.",
        variant: "destructive",
      });
      return;
    }
    
    createProposalMutation.mutate(values);
  };

  if (isLoadingUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-16">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <div onClick={() => setLocation("/governance")} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Governance
        </div>
      </Button>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Proposal</CardTitle>
          <CardDescription>
            Submit your ideas for improving our community. All proposals will be
            reviewed and voted on by community members.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proposal Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a clear, descriptive title" {...field} />
                    </FormControl>
                    <FormDescription>
                      A concise title that clearly explains your proposal
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your proposal in detail..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed explanation of your proposal, including its purpose,
                      benefits, and any potential impacts or considerations
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="community_rules">Community Rules</SelectItem>
                          <SelectItem value="feature_request">Feature Request</SelectItem>
                          <SelectItem value="moderation_policy">Moderation Policy</SelectItem>
                          <SelectItem value="resource_allocation">Resource Allocation</SelectItem>
                          <SelectItem value="protocol_change">Protocol Change</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the category that best fits your proposal
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="votesRequired"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required Votes</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={3}
                          max={100}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Number of votes required to pass or reject the proposal
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="votingEndsAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Voting End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        The date when voting on this proposal will end
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/governance")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createProposalMutation.isPending}
                >
                  {createProposalMutation.isPending ? "Creating..." : "Submit Proposal"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="bg-muted flex-col text-sm p-6">
          <p className="font-medium mb-2">How the proposal process works:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Submit your proposal (it will start in "Draft" status)</li>
            <li>Review and finalize your proposal before setting it to "Active"</li>
            <li>Community members and AI assistants will discuss and vote on active proposals</li>
            <li>If approved, your proposal will be implemented by the community</li>
          </ol>
        </CardFooter>
      </Card>
    </div>
  );
}