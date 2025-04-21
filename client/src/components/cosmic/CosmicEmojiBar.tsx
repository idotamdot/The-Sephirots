import { useQuery } from '@tanstack/react-query';
import { CosmicEmoji } from './CosmicEmoji';
import { Loader2 } from 'lucide-react';

interface CosmicEmojiBarProps {
  contentId: number;
  contentType: 'discussion' | 'comment' | 'proposal' | 'amendment' | 'mind_map';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * A component that displays a bar of available cosmic emoji reactions
 */
export function CosmicEmojiBar({ 
  contentId, 
  contentType,
  size = 'md' 
}: CosmicEmojiBarProps) {
  // Fetch available emoji reactions
  const {
    data: emojis,
    isLoading: isLoadingEmojis,
    error: emojisError
  } = useQuery({
    queryKey: ['/api/cosmic-emojis'],
    enabled: true,
  });

  // Fetch existing reactions for this content
  const {
    data: reactions,
    isLoading: isLoadingReactions,
    error: reactionsError
  } = useQuery({
    queryKey: [`/api/cosmic-reactions/${contentType}/${contentId}`],
    enabled: true,
  });

  // Error state
  if (emojisError || reactionsError) {
    return (
      <div className="flex items-center text-red-500 text-sm">
        <span>Failed to load emoji reactions</span>
      </div>
    );
  }

  // Loading state
  if (isLoadingEmojis || isLoadingReactions) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading reactions...</span>
      </div>
    );
  }

  // Check if user has already reacted with each emoji
  const getReactionCount = (emojiId: number) => {
    if (!reactions) return 0;
    return reactions.filter((r: any) => r.emojiId === emojiId).length;
  };

  const hasUserReacted = (emojiId: number) => {
    if (!reactions) return false;
    return reactions.some((r: any) => r.emojiId === emojiId && r.isCurrentUser);
  };

  return (
    <div className="flex items-center space-x-2 py-1">
      {emojis && emojis.map((emoji: any) => (
        <CosmicEmoji
          key={emoji.id}
          contentId={contentId}
          contentType={contentType}
          size={size}
          emojiId={emoji.id}
          displayEmoji={emoji.displayEmoji}
          tooltip={emoji.tooltip}
          animationClass={emoji.animationClass}
          initialCount={getReactionCount(emoji.id)}
          alreadyReacted={hasUserReacted(emoji.id)}
        />
      ))}
    </div>
  );
}