import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertAnnotationReplySchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface AnnotationReplyFormProps {
  annotationId: number;
  userId: number;
  onSuccess: () => void;
}

// Create the form schema from the insert schema
const formSchema = insertAnnotationReplySchema.extend({});

type FormValues = z.infer<typeof formSchema>;

export default function AnnotationReplyForm({ 
  annotationId, 
  userId, 
  onSuccess 
}: AnnotationReplyFormProps) {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      annotationId,
      userId,
      content: "",
    },
  });
  
  async function onSubmit(values: FormValues) {
    try {
      const response = await fetch(`/api/annotations/${annotationId}/replies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        throw new Error("Failed to add reply");
      }
      
      toast({
        title: "Reply added",
        description: "Your reply has been added successfully.",
      });
      
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error adding reply:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add reply. Please try again.",
      });
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Add your reply..."
                  className="min-h-20 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <input type="hidden" {...form.register("annotationId")} />
        <input type="hidden" {...form.register("userId")} />
        
        <div className="flex justify-end space-x-2">
          <Button type="submit" size="sm">
            Submit Reply
          </Button>
        </div>
      </form>
    </Form>
  );
}