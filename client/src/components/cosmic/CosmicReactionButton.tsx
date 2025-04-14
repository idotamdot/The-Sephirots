import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';

interface CosmicReactionButtonProps {
  emojiType: string;
  displayEmoji: string;
  tooltip: string;
  contentId: number;
  contentType: 'discussion' | 'comment' | 'proposal' | 'amendment';
  count?: number;
  initialReacted?: boolean;
  onReactionChange?: (newCount: number, hasReacted: boolean) => void;
}

const CosmicReactionButton = ({
  emojiType,
  displayEmoji,
  tooltip,
  contentId,
  contentType,
  count = 0,
  initialReacted = false,
  onReactionChange
}: CosmicReactionButtonProps) => {
  const [hasReacted, setHasReacted] = useState(initialReacted);
  const [reactionCount, setReactionCount] = useState(count);
  const [isAnimating, setIsAnimating] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Apply animation class based on reaction count
  const getMilestoneClass = () => {
    if (reactionCount >= 50) return 'milestone-3';
    if (reactionCount >= 20) return 'milestone-2';
    if (reactionCount >= 10) return 'milestone-1';
    return '';
  };

  const toggleReaction = async () => {
    if (!isAuthenticated) {
      // Optionally show login prompt
      alert('Please log in to react to content');
      return;
    }

    try {
      const response = await apiRequest('POST', '/api/cosmic-reactions/toggle', {
        emojiType,
        contentId,
        contentType,
        userId: user?.id
      });

      if (response.ok) {
        const data = await response.json();
        const newHasReacted = !hasReacted;
        const newCount = hasReacted ? reactionCount - 1 : reactionCount + 1;
        
        setHasReacted(newHasReacted);
        setReactionCount(newCount);
        
        // Trigger animation when adding a reaction
        if (newHasReacted) {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 500);
        }

        // Notify parent component if callback provided
        if (onReactionChange) {
          onReactionChange(newCount, newHasReacted);
        }
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  };

  // Animation class for the emoji
  const getAnimationClass = () => {
    if (isAnimating) return 'reaction-just-added';
    return hasReacted ? `${emojiType.replace(/_/g, '-')} active` : '';
  };

  return (
    <div 
      className={`cosmic-reaction-btn ${hasReacted ? 'reacted' : ''} ${getMilestoneClass()}`}
      onClick={toggleReaction}
    >
      <span className={`reaction-emoji ${getAnimationClass()}`}>
        {displayEmoji}
      </span>
      
      {reactionCount > 0 && (
        <span className="cosmic-reaction-count">
          {reactionCount}
        </span>
      )}
      
      <div className="cosmic-tooltip">
        {tooltip}
      </div>
    </div>
  );
};

export default CosmicReactionButton;