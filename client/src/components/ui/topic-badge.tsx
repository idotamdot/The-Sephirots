import { cn } from "@/lib/utils";

interface TopicBadgeProps {
  category: string;
  className?: string;
}

export default function TopicBadge({ category, className }: TopicBadgeProps) {
  let color;
  
  switch (category) {
    case 'community_needs':
      color = "bg-primary-50 text-primary-700";
      break;
    case 'rights_agreement':
      color = "bg-secondary-50 text-secondary-700";
      break;
    case 'wellbeing':
      color = "bg-accent-50 text-accent-700";
      break;
    case 'communication':
      color = "bg-violet-50 text-violet-700";
      break;
    default:
      color = "bg-gray-100 text-gray-700";
  }
  
  // Convert category to display name
  const displayName = category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return (
    <span className={cn(
      "px-3 py-1 text-xs font-medium rounded-full",
      color,
      className
    )}>
      {displayName}
    </span>
  );
}
