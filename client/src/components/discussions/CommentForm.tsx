import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const commentSchema = z.object({
  content: z.string().min(3, { message: "Comment must be at least 3 characters" }),
  userId: z.number(),
  discussionId: z.number(),
  requestAiResponse: z.boolean().optional(),
});

type CommentFormValues = z.infer<typeof commentSchema>;

interface CommentFormProps {
  discussionId: number;
  userId: number;
}

export default function CommentForm({ discussionId, userId }: CommentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
      userId,
      discussionId,
      requestAiResponse: false,
    },
  });
  
  const createComment = useMutation({
    mutationFn: async (values: CommentFormValues) => {
      const response = await apiRequest("POST", "/api/comments", values);
      return response.json();
    },
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/discussions/${discussionId}`] });
      toast({
        title: "Comment added",
        description: "Your comment has been successfully added to the discussion.",
      });
      form.reset({ 
        content: "", 
        userId, 
        discussionId, 
        requestAiResponse: form.getValues().requestAiResponse 
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add comment: ${error.message}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });
  
  const onSubmit = (values: CommentFormValues) => {
    createComment.mutate(values);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea 
                  placeholder="Share your thoughts on this discussion..." 
                  className="min-h-24 resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="requestAiResponse"
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="request-ai"
                />
                <Label htmlFor="request-ai" className="text-sm text-gray-600 cursor-pointer">
                  Request AI perspective
                </Label>
              </div>
            )}
          />
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                Submitting<i className="ri-loader-4-line ml-2 animate-spin"></i>
              </>
            ) : (
              <>
                Post Comment
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
