import { Discussion } from "@/lib/types";
import DiscussionCard from "./DiscussionCard";
import { Skeleton } from "@/components/ui/skeleton";

interface DiscussionListProps {
  discussions: Discussion[];
  isLoading: boolean;
  title?: string;
  showViewAll?: boolean;
  columns?: 1 | 2 | 3;
}

export default function DiscussionList({ 
  discussions,
  isLoading,
  title,
  showViewAll = false,
  columns = 3,
}: DiscussionListProps) {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  }[columns];
  
  const SkeletonCards = () => (
    <>
      {Array(3).fill(0).map((_, i) => (
        <div key={`skeleton-${i}`} className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-12 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      ))}
    </>
  );
  
  return (
    <section className="mb-8">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold">{title}</h2>
          {showViewAll && (
            <a href="/discussions" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
              View All <i className="ri-arrow-right-s-line ml-1"></i>
            </a>
          )}
        </div>
      )}
      
      <div className={`grid ${gridClasses} gap-4`}>
        {isLoading ? (
          <SkeletonCards />
        ) : discussions.length > 0 ? (
          discussions.map((discussion) => (
            <DiscussionCard key={discussion.id} discussion={discussion} />
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-gray-500">
            <i className="ri-discuss-line text-4xl mb-2 block"></i>
            <p>No discussions yet. Be the first to start one!</p>
          </div>
        )}
      </div>
    </section>
  );
}
