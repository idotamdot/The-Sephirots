import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import './CosmicReactions.css';

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
  const [reactionCount, setReactionCount] = useState<number>(count);
  const [hasReacted, setHasReacted] = useState<boolean>(initialReacted);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  // Set milestone class based on reaction count
  const getMilestoneClass = () => {
    if (reactionCount >= 25) return 'milestone-3';
    if (reactionCount >= 10) return 'milestone-2';
    if (reactionCount >= 5) return 'milestone-1';
    return '';
  };

  // Get the CSS class for the emoji based on its type
  const getEmojiClass = () => {
    const baseClass = 'reaction-emoji';
    // Convert the emoji type to a CSS-friendly class name
    const typeClass = emojiType.replace(/_/g, '-');
    return `${baseClass} ${typeClass}`;
  };

  const handleReaction = async () => {
    if (!isAuthenticated) {
      // Handle non-authenticated user case
      alert('Please sign in to react to content');
      return;
    }

    try {
      const response = await apiRequest('POST', '/api/cosmic-reactions/toggle', {
        emojiType,
        contentId,
        contentType
      });

      const data = await response.json();
      
      // Update state
      setReactionCount(data.count);
      setHasReacted(data.hasReacted);
      setIsAnimating(true);
      
      // Notify parent component if callback provided
      if (onReactionChange) {
        onReactionChange(data.count, data.hasReacted);
      }
      
      // Reset animation flag after animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  };

  const buttonClasses = [
    'cosmic-reaction-btn',
    hasReacted ? 'reacted' : '',
    getMilestoneClass(),
    isAnimating ? 'reaction-just-added' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={buttonClasses} onClick={handleReaction}>
      <div className={getEmojiClass()}>
        {displayEmoji}
      </div>
      {reactionCount > 0 && (
        <div className="cosmic-reaction-count">{reactionCount}</div>
      )}
      <div className="cosmic-tooltip">{tooltip}</div>
    </div>
  );
};

export default CosmicReactionButton;