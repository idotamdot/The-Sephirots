import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CosmicReactionButtonProps {
  contentId: number;
  contentType: string;
  emojiType: string;
  displayEmoji: string;
  tooltip: string;
  isActive?: boolean;
  count?: number;
  onReactionChange?: () => void;
}

export const CosmicReactionButton = ({
  contentId,
  contentType,
  emojiType,
  displayEmoji,
  tooltip,
  isActive = false,
  count = 0,
  onReactionChange,
}: CosmicReactionButtonProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [active, setActive] = useState(isActive);
  const [reactionId, setReactionId] = useState<number | null>(null);
  const [reactionCount, setReactionCount] = useState(count);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user has already reacted on mount
  useEffect(() => {
    if (user) {
      checkUserReaction();
    }
  }, [user, contentId, contentType, emojiType]);

  const checkUserReaction = async () => {
    try {
      const response = await apiRequest(
        "GET",
        `/api/users/${user?.id}/cosmic-reactions/${contentType}/${contentId}`
      );
      
      const userReactions = await response.json();
      
      // Find if user has reacted with this emoji type
      const userReaction = userReactions.find(
        (reaction: any) => reaction.emojiType === emojiType
      );
      
      if (userReaction) {
        setActive(true);
        setReactionId(userReaction.id);
      } else {
        setActive(false);
        setReactionId(null);
      }
    } catch (error) {
      console.error("Error checking user reaction:", error);
    }
  };

  const handleClick = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to share cosmic reactions.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (active && reactionId) {
        // Remove the reaction
        await apiRequest("DELETE", `/api/cosmic-reactions/${reactionId}`);
        setActive(false);
        setReactionId(null);
        setReactionCount((prev) => Math.max(0, prev - 1));
        
        toast({
          title: "Cosmic energy withdrawn",
          description: `Your ${tooltip} energy has been withdrawn.`,
        });
      } else {
        // Add the reaction
        const response = await apiRequest("POST", "/api/cosmic-reactions", {
          contentId,
          contentType,
          emojiType,
        });
        
        const newReaction = await response.json();
        setActive(true);
        setReactionId(newReaction.id);
        setReactionCount((prev) => prev + 1);
        
        toast({
          title: "Cosmic energy shared",
          description: `You've shared your ${tooltip} energy.`,
        });
      }
      
      // Notify parent component about the change
      if (onReactionChange) {
        onReactionChange();
      }
    } catch (error) {
      console.error("Error toggling reaction:", error);
      toast({
        title: "Something went wrong",
        description: "We couldn't process your cosmic energy at this time.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={active ? "default" : "outline"}
            size="sm"
            className={`cosmic-reaction-button ${active ? "active-cosmic-reaction" : ""}`}
            onClick={handleClick}
            disabled={isLoading}
          >
            <span className="mr-2">{displayEmoji}</span>
            <span>{reactionCount}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-background/90 backdrop-blur-sm border border-muted">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};