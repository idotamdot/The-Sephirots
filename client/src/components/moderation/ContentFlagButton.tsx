import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Flag, Loader2 } from "lucide-react";

interface ContentFlagButtonProps {
  contentId: number;
  contentType: "discussion" | "comment" | "proposal" | "amendment" | "profile" | "event";
  content: string; // The actual content to analyze
  userId: number; // The current user's ID
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onFlagSuccess?: () => void;
}

export default function ContentFlagButton({
  contentId,
  contentType,
  content,
  userId,
  variant = "ghost",
  size = "icon",
  className,
  onFlagSuccess,
}: ContentFlagButtonProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonType, setReasonType] = useState("");
  const queryClient = useQueryClient();

  // Create flag mutation
  const flagContent = useMutation({
    mutationFn: async (data: {
      contentId: number;
      contentType: string;
      reporterId: number;
      reason: string;
    }) => {
      return apiRequest("POST", "/api/moderation/flags", data);
    },
    onSuccess: () => {
      toast({
        title: "Content reported",
        description: "Thank you for helping keep the community safe.",
      });
      setOpen(false);
      setReason("");
      setReasonType("");
      if (onFlagSuccess) {
        onFlagSuccess();
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to report content. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Auto-moderate mutation
  const autoModerate = useMutation({
    mutationFn: async (data: {
      contentId: number;
      contentType: string;
      content: string;
      userId: number;
    }) => {
      return apiRequest("POST", "/api/moderation/auto-moderate", data);
    },
  });

  const handleSubmit = () => {
    // Form validation
    if (!reasonType) {
      toast({
        title: "Error",
        description: "Please select a reason for reporting.",
        variant: "destructive",
      });
      return;
    }

    const fullReason = reasonType + (reason ? `: ${reason}` : "");

    // Flag the content
    flagContent.mutate({
      contentId,
      contentType,
      reporterId: userId,
      reason: fullReason,
    });

    // Also trigger auto-moderation in the background
    autoModerate.mutate({
      contentId,
      contentType,
      content,
      userId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          title="Report content"
        >
          <Flag className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Content</DialogTitle>
          <DialogDescription>
            Help keep our community safe by reporting content that violates our guidelines.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Reason for reporting</label>
            <Select value={reasonType} onValueChange={setReasonType}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Violation Type</SelectLabel>
                  <SelectItem value="harassment">Harassment or Bullying</SelectItem>
                  <SelectItem value="hate_speech">Hate Speech</SelectItem>
                  <SelectItem value="misinformation">Misinformation</SelectItem>
                  <SelectItem value="explicit">Explicit or Adult Content</SelectItem>
                  <SelectItem value="violence">Violence</SelectItem>
                  <SelectItem value="spam">Spam</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Additional details (optional)</label>
            <Textarea
              placeholder="Please provide any additional details about this report"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={flagContent.isPending || !reasonType}
          >
            {flagContent.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Report"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}