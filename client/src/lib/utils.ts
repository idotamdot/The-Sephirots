import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date in a readable way (e.g., "Mon, Oct 10 • 3:00 PM")
export function formatDate(date: Date): string {
  return format(date, "EEE, MMM d • h:mm a");
}

// Format relative time (e.g., "2 days ago")
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}

// Calculate points needed for next level
export function calculatePointsToNextLevel(points: number): number {
  return 100 - (points % 100);
}

// Format a number with K, M suffixes
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Get gradient class based on category
export function getCategoryGradient(category: string): string {
  switch (category) {
    case 'community_needs':
      return "from-primary-500 to-secondary-500";
    case 'rights_agreement':
      return "from-secondary-500 to-purple-500";
    case 'wellbeing':
      return "from-accent-500 to-accent-400";
    case 'communication':
      return "from-primary-500 to-blue-500";
    default:
      return "from-primary-500 to-secondary-500";
  }
}

// Convert snake_case to Title Case
export function formatCategory(category: string): string {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
