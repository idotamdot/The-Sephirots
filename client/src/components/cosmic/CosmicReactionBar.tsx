import { useState, useEffect, useRef } from 'react';
import { apiRequest } from '@/lib/queryClient';
import CosmicReactionButton from './CosmicReactionButton';

interface ReactionData {
  emojiType: string;
  displayEmoji: string;
  tooltip: string;
  description: string;
  sephiroticPath: string;
  count: number;
  hasReacted: boolean;
}

interface CosmicReactionBarProps {
  contentId: number;
  contentType: 'discussion' | 'comment' | 'proposal' | 'amendment';
  layout?: 'horizontal' | 'vertical' | 'grid';
  size?: 'small' | 'medium' | 'large';
  showBackground?: boolean;
  enableConstellation?: boolean;
}

const CosmicReactionBar = ({
  contentId,
  contentType,
  layout = 'horizontal',
  size = 'medium',
  showBackground = true,
  enableConstellation = true
}: CosmicReactionBarProps) => {
  const [reactions, setReactions] = useState<ReactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalReactions, setTotalReactions] = useState(0);
  const [showConstellations, setShowConstellations] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch reactions from API
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        setLoading(true);
        const response = await apiRequest('GET', `/api/cosmic-reactions/${contentType}/${contentId}`);
        
        if (response.ok) {
          const data = await response.json();
          setReactions(data.reactions);
          
          // Calculate total reactions
          const total = data.reactions.reduce((sum: number, reaction: ReactionData) => sum + reaction.count, 0);
          setTotalReactions(total);
          
          // Show constellation effect if total reactions exceeds threshold
          if (enableConstellation && total >= 10) {
            setShowConstellations(true);
          }
        } else {
          setError('Failed to load reactions');
        }
      } catch (err) {
        setError('An error occurred while fetching reactions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReactions();
  }, [contentId, contentType, enableConstellation]);

  // Create constellation lines between reactions when they reach thresholds
  useEffect(() => {
    if (!showConstellations || !containerRef.current || reactions.length < 2) {
      return;
    }

    const container = containerRef.current;
    const constellation = container.querySelector('.constellation');
    
    if (!constellation) return;

    // Clear previous lines
    while (constellation.firstChild) {
      constellation.removeChild(constellation.firstChild);
    }

    // Get positions of reaction buttons
    const reactionButtons = Array.from(container.querySelectorAll('.cosmic-reaction-btn'));
    
    // Create lines between buttons with substantial reactions
    reactionButtons.forEach((btn, i) => {
      const btnRect = btn.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      // Only connect buttons that have enough reactions
      if (reactions[i].count < 5) return;
      
      for (let j = i + 1; j < reactionButtons.length; j++) {
        if (reactions[j].count < 5) continue;
        
        const targetBtn = reactionButtons[j];
        const targetRect = targetBtn.getBoundingClientRect();
        
        // Calculate coordinates relative to container
        const x1 = btnRect.left + btnRect.width / 2 - containerRect.left;
        const y1 = btnRect.top + btnRect.height / 2 - containerRect.top;
        const x2 = targetRect.left + targetRect.width / 2 - containerRect.left;
        const y2 = targetRect.top + targetRect.height / 2 - containerRect.top;
        
        // Calculate line properties
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        
        // Create line element
        const line = document.createElement('div');
        line.className = 'constellation-line';
        line.style.width = `${length}px`;
        line.style.left = `${x1}px`;
        line.style.top = `${y1}px`;
        line.style.transform = `rotate(${angle}deg)`;
        
        constellation.appendChild(line);
      }
    });
    
    // Make constellation visible
    (constellation as HTMLElement).classList.add('active');
  }, [showConstellations, reactions]);

  // Event handler for reaction changes
  const handleReactionChange = (emojiType: string, newCount: number, hasReacted: boolean) => {
    setReactions(prevReactions => {
      const updatedReactions = prevReactions.map(reaction => 
        reaction.emojiType === emojiType 
          ? { ...reaction, count: newCount, hasReacted } 
          : reaction
      );
      
      // Calculate new total
      const newTotal = updatedReactions.reduce((sum, reaction) => sum + reaction.count, 0);
      setTotalReactions(newTotal);
      
      // Show constellation effect if total reactions exceeds threshold
      if (enableConstellation && newTotal >= 10 && !showConstellations) {
        setShowConstellations(true);
        
        // Trigger energy surge animation
        const container = containerRef.current;
        if (container) {
          const surge = container.querySelector('.energy-surge');
          if (surge) {
            surge.classList.add('active');
            setTimeout(() => {
              surge.classList.remove('active');
            }, 2000);
          }
        }
      }
      
      return updatedReactions;
    });
  };

  const containerClassName = `cosmic-reactions-container ${layout} size-${size} ${showBackground ? 'with-background' : ''}`;

  if (loading) {
    return <div className={containerClassName}>Loading cosmic reactions...</div>;
  }

  if (error) {
    return <div className={containerClassName}>Error: {error}</div>;
  }

  if (reactions.length === 0) {
    return <div className={containerClassName}>No reactions available</div>;
  }

  return (
    <div className={containerClassName} ref={containerRef}>
      {showBackground && (
        <div className="cosmic-background active">
          <div className="stars"></div>
          <div className="twinkling"></div>
        </div>
      )}
      
      {enableConstellation && (
        <>
          <div className="constellation"></div>
          <div className="energy-surge"></div>
        </>
      )}
      
      <div className="cosmic-reaction-bar">
        {reactions.map((reaction) => (
          <CosmicReactionButton
            key={reaction.emojiType}
            emojiType={reaction.emojiType}
            displayEmoji={reaction.displayEmoji}
            tooltip={reaction.tooltip}
            contentId={contentId}
            contentType={contentType}
            count={reaction.count}
            initialReacted={reaction.hasReacted}
            onReactionChange={(newCount, hasReacted) => 
              handleReactionChange(reaction.emojiType, newCount, hasReacted)
            }
          />
        ))}
      </div>
      
      {totalReactions > 0 && (
        <div className="reaction-summary">
          {reactions
            .filter(r => r.count > 0)
            .sort((a, b) => b.count - a.count)
            .slice(0, 3)
            .map(reaction => (
              <div key={reaction.emojiType} className="reaction-summary-item">
                <span className="reaction-summary-emoji">{reaction.displayEmoji}</span>
                <span>{reaction.count}</span>
              </div>
            ))
          }
          {totalReactions > 5 && (
            <div className="reaction-summary-total">
              {totalReactions} total
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CosmicReactionBar;