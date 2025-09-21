import { Badge as BadgeType } from "@/lib/types";
import GenericBadge from "./GenericBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

interface BadgeGridProps {
  badges: BadgeType[];
  title?: string;
  description?: string;
  className?: string;
}

export default function BadgeGrid({
  badges,
  title = "Badges",
  description = "Achievements earned through participation",
  className,
}: BadgeGridProps) {
  // Check if there's a founder badge
  const founderBadge = badges.find(
    (badge) => badge.name.toLowerCase().includes("founder") || badge.category.toLowerCase().includes("founder")
  );

  // Other badges
  const otherBadges = badges.filter(
    (badge) => !(badge.name.toLowerCase().includes("founder") || badge.category.toLowerCase().includes("founder"))
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Display founder badge prominently if exists */}
        {founderBadge && (
          <div className="flex justify-center mb-6">
            <GenericBadge
              badge={founderBadge}
              earned={true}
              size="lg"
            />
          </div>
        )}

        {/* Display other badges in a grid */}
        {otherBadges.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {otherBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        )}

        {/* Display a message if no badges */}
        {badges.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            No badges earned yet. Participate in the community to earn badges!
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Simple badge card for regular badges
function BadgeCard({ badge }: { badge: BadgeType }) {
  return (
    <div className="flex flex-col items-center p-3 border rounded-lg hover:bg-accent/50 transition-colors">
      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-2">
        <Award className="h-8 w-8 text-primary" />
      </div>
      <h4 className="font-medium text-sm text-center">{badge.name}</h4>
      <p className="text-xs text-muted-foreground text-center mt-1 line-clamp-2" title={badge.description}>
        {badge.description}
      </p>
    </div>
  );
}