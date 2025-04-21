import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

// Types
export interface CosmicEmojiProps {
  contentId: number;
  contentType: 'discussion' | 'comment' | 'proposal' | 'amendment' | 'mind_map';
  size?: 'sm' | 'md' | 'lg';
  initialCount?: number;
  disabled?: boolean;
  emojiId: number;
  displayEmoji: string;
  tooltip: string;
  animationClass: string;
  alreadyReacted?: boolean;
}

export function CosmicEmoji({
  contentId,
  contentType,
  size = 'md',
  initialCount = 0,
  disabled = false,
  emojiId,
  displayEmoji,
  tooltip,
  animationClass,
  alreadyReacted = false
}: CosmicEmojiProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [count, setCount] = useState(initialCount);
  const [hasReacted, setHasReacted] = useState(alreadyReacted);
  const [isAnimating, setIsAnimating] = useState(false);

  // Size class mapping
  const sizeClasses = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-8 h-8 text-base',
    lg: 'w-10 h-10 text-lg',
  };

  // Define response type for toggle reaction
  interface ToggleReactionResponse {
    added?: boolean;
    removed?: boolean;
    count?: number;
  }

  // Toggle reaction mutation (handles both adding and removing)
  const toggleReactionMutation = useMutation<ToggleReactionResponse, Error, void>({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/cosmic-reactions/toggle', {
        contentId,
        contentType,
        emojiId
      });
      return await response.json();
    },
    onSuccess: (data) => {
      if (data.added) {
        // Reaction was added
        if (typeof data.count === 'number') {
          setCount(data.count);
        } else {
          setCount(prevCount => prevCount + 1);
        }
        setHasReacted(true);
        
        // Show animation
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      } else if (data.removed) {
        // Reaction was removed
        if (typeof data.count === 'number') {
          setCount(data.count);
        } else {
          setCount(prevCount => Math.max(0, prevCount - 1));
        }
        setHasReacted(false);
      }
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: [`/api/cosmic-reactions/${contentType}/${contentId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/user-reactions/${contentType}/${contentId}`] });
      
      // Update user points
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to toggle reaction',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const handleClick = () => {
    if (disabled || !user) return;
    
    // Use our single toggle mutation instead of separate add/remove mutations
    toggleReactionMutation.mutate();
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`
              ${sizeClasses[size]} 
              ${hasReacted ? 'opacity-100' : 'opacity-70'} 
              ${isAnimating ? animationClass : ''}
              ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
              ${hasReacted ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-transparent'} 
              rounded-full flex items-center justify-center transition-all
              hover:bg-purple-100 dark:hover:bg-purple-900/30
              focus:outline-none focus:ring-2 focus:ring-purple-400
              relative
            `}
            onClick={handleClick}
            disabled={disabled || !user}
          >
            <span className="text-2xl">{displayEmoji}</span>
            
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs max-w-[200px] text-center">
          <p>{tooltip}</p>
          {!user && <p className="text-gray-400 italic mt-1">Sign in to react</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}