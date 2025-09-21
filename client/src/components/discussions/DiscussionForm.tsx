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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "wouter";

const discussionSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  content: z.string().min(20, { message: "Content must be at least 20 characters" }),
  category: z.enum(["community_needs", "rights_agreement", "wellbeing", "communication", "other"]),
  tags: z.array(z.string()).optional(),
  userId: z.number(),
  enhance: z.boolean().optional(),
});

type DiscussionFormValues = z.infer<typeof discussionSchema>;

interface DiscussionFormProps {
  userId: number;
  initialCategory?: string;
}

export default function DiscussionForm({ userId, initialCategory = "community_needs" }: DiscussionFormProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tagInput, setTagInput] = useState("");
  
  const form = useForm<DiscussionFormValues>({
    resolver: zodResolver(discussionSchema),
    defaultValues: {
      title: "",
      content: "",
      category: initialCategory as any,
      tags: [],
      userId: userId,
      enhance: false,
    },
  });
  
  const createDiscussion = useMutation({
    mutationFn: async (values: DiscussionFormValues) => {
      const response = await apiRequest("POST", "/api/discussions", values);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/discussions"] });
      toast({
        title: "Discussion created",
        description: "Your discussion has been successfully created.",
      });
      navigate("/discussions");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create discussion: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const addTag = () => {
    if (tagInput.trim() && !form.getValues().tags?.includes(tagInput.trim())) {
      const currentTags = form.getValues().tags || [];
      form.setValue("tags", [...currentTags, tagInput.trim()]);
      setTagInput("");
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues().tags || [];
    form.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };
  
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };
  
  const onSubmit = (values: DiscussionFormValues) => {
    createDiscussion.mutate(values);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a clear, specific title for your discussion" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  {...field}
                >
                  <option value="community_needs">Community Needs</option>
                  <option value="rights_agreement">Rights Agreement</option>
                  <option value="wellbeing">Wellbeing</option>
                  <option value="communication">Communication</option>
                  <option value="other">Other</option>
                </select>
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your discussion topic in detail..." 
                  className="min-h-32"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel>Tags</FormLabel>
          <div className="flex items-center gap-2 mt-1.5">
            <Input
              placeholder="Add tags separated by comma or Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={addTag}
            />
            <Button type="button" onClick={addTag} variant="outline">
              Add
            </Button>
          </div>
          
          {form.getValues().tags && form.getValues().tags!.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {form.getValues().tags!.map((tag, index) => (
                <div 
                  key={index} 
                  className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center"
                >
                  #{tag}
                  <button 
                    type="button" 
                    className="ml-1.5 hover:text-gray-900" 
                    onClick={() => removeTag(tag)}
                  >
                    <i className="ri-close-line text-xs"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name="enhance"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <Label htmlFor="enhance">AI Enhancement</Label>
                  <p className="text-sm text-muted-foreground">
                    Let AI help refine and enhance your discussion content
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="mr-2" 
            disabled={createDiscussion.isPending}
          >
            {createDiscussion.isPending ? (
              <>Submitting<i className="ri-loader-4-line ml-2 animate-spin"></i></>
            ) : (
              <>Start Discussion</>
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/discussions")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
