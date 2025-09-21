import { useState } from 'react';
import { Badge } from '@/lib/types';
import { GenericBadge, FounderBadge } from '@/components/badges';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface BadgeGridProps {
  badges: Badge[];
  earnedBadgeIds: number[];
  showCategories?: boolean;
}

export default function BadgeGrid({ badges, earnedBadgeIds, showCategories = false }: BadgeGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string | null>(null);
  
  const categories = Array.from(new Set(badges.map(badge => badge.category)));
  
  // Filter badges by search term and category
  const filteredBadges = badges.filter(badge => {
    const matchesSearch = 
      badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (badge.symbolism && badge.symbolism.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filter ? badge.category === filter : true;
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort badges by tier priority and then by name
  const sortedBadges = [...filteredBadges].sort((a, b) => {
    const tierPriority: Record<string, number> = {
      'founder': 4,
      'platinum': 3,
      'gold': 2,
      'silver': 1,
      'bronze': 0
    };
    
    const aTierValue = tierPriority[a.tier as keyof typeof tierPriority] || 0;
    const bTierValue = tierPriority[b.tier as keyof typeof tierPriority] || 0;
    
    if (aTierValue !== bTierValue) {
      return bTierValue - aTierValue;
    }
    
    return a.name.localeCompare(b.name);
  });
  
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search badges..."
            className="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {showCategories && (
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={filter === null ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilter(null)}
            >
              All
            </Button>
            
            {categories.map(category => (
              <Button
                key={category}
                variant={filter === category ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        )}
      </div>
      
      {sortedBadges.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-gray-500">No badges match your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sortedBadges.map(badge => {
            const isEarned = earnedBadgeIds.includes(badge.id);
            
            return (
              <div key={badge.id} className="flex flex-col items-center">
                {badge.tier === 'founder' ? (
                  <FounderBadge
                    badge={{
                      ...badge,
                      tier: badge.tier || 'founder',
                      level: badge.level || 1,
                      points: badge.points || 0
                    }} 
                    earned={isEarned}
                    size="md"
                  />
                ) : (
                  <GenericBadge 
                    badge={{
                      ...badge,
                      tier: badge.tier || 'bronze',
                      level: badge.level || 1,
                      points: badge.points || 0
                    }} 
                    earned={isEarned}
                    size="md"
                  />
                )}
                
                <div className="text-center mt-2">
                  <h4 className="font-medium text-sm">{badge.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{badge.category}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}