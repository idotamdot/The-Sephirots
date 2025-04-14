import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CosmicReactionButton } from "./CosmicReactionButton";
import { Skeleton } from "@/components/ui/skeleton";

interface CosmicReactionBarProps {
  contentId: number;
  contentType: string;
  className?: string;
}

interface CosmicEmoji {
  id: number;
  emojiType: string;
  displayEmoji: string;
  tooltip: string;
  description: string;
  sephiroticPath: string;
  pointsGranted: number;
  animationClass: string;
}

interface EnrichedReaction {
  emojiType: string;
  count: number;
  metadata?: CosmicEmoji;
}

export const CosmicReactionBar = ({
  contentId,
  contentType,
  className = "",
}: CosmicReactionBarProps) => {
  const queryClient = useQueryClient();
  const [showConstellationAnimation, setShowConstellationAnimation] = useState(false);

  // Fetch emoji metadata
  const { data: emojiMetadata, isLoading: isLoadingMetadata } = useQuery({
    queryKey: ["/api/cosmic-emoji-metadata"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/cosmic-emoji-metadata");
      return response.json();
    },
  });

  // Fetch reactions for this content
  const { 
    data: reactions, 
    isLoading: isLoadingReactions, 
    refetch: refetchReactions 
  } = useQuery({
    queryKey: ["/api/cosmic-reactions", contentType, contentId],
    queryFn: async () => {
      const response = await apiRequest(
        "GET",
        `/api/cosmic-reactions/${contentType}/${contentId}`
      );
      return response.json();
    },
  });

  // Check for constellation animation trigger
  useEffect(() => {
    if (reactions && reactions.length >= 3) {
      // Only show animation if there are at least 3 different reaction types
      const uniqueReactionTypes = new Set(reactions.map((r: EnrichedReaction) => r.emojiType));
      if (uniqueReactionTypes.size >= 3) {
        setShowConstellationAnimation(true);
        
        // Reset animation after 3 seconds
        const timer = setTimeout(() => {
          setShowConstellationAnimation(false);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [reactions]);

  const handleReactionChange = () => {
    // Invalidate the cache to refetch reactions
    queryClient.invalidateQueries({ queryKey: ["/api/cosmic-reactions", contentType, contentId] });
  };

  if (isLoadingMetadata || isLoadingReactions) {
    return (
      <div className={`flex flex-wrap gap-2 mt-2 ${className}`}>
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    );
  }

  // Ensure we have metadata and reactions data
  if (!emojiMetadata || !reactions) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Constellation animation overlay */}
      {showConstellationAnimation && (
        <div className="absolute inset-0 cosmic-constellation-animation pointer-events-none">
          <div className="stars"></div>
          <div className="twinkling"></div>
        </div>
      )}
      
      {/* Reaction buttons */}
      <div className="flex flex-wrap gap-2 mt-2">
        {emojiMetadata.map((emoji: CosmicEmoji) => {
          // Find if this emoji type has reactions
          const reaction = reactions.find(
            (r: EnrichedReaction) => r.emojiType === emoji.emojiType
          );
          
          return (
            <CosmicReactionButton
              key={emoji.emojiType}
              contentId={contentId}
              contentType={contentType}
              emojiType={emoji.emojiType}
              displayEmoji={emoji.displayEmoji}
              tooltip={emoji.tooltip}
              count={reaction ? reaction.count : 0}
              onReactionChange={handleReactionChange}
            />
          );
        })}
      </div>
    </div>
  );
};