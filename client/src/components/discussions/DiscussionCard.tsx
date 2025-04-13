import { Link } from "wouter";
import { Discussion } from "@/lib/types";
import TopicBadge from "@/components/ui/topic-badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface DiscussionCardProps {
  discussion: Discussion;
}

export default function DiscussionCard({ discussion }: DiscussionCardProps) {
  const timeAgo = formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true });
  
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <TopicBadge category={discussion.category} />
          <span className="text-sm text-gray-500">{timeAgo}</span>
        </div>
        
        <Link href={`/discussions/${discussion.id}`}>
          <a className="block">
            <h3 className="font-heading font-semibold text-lg mb-2 hover:text-primary-600 transition-colors duration-150">
              {discussion.title}
            </h3>
          </a>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {discussion.content}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <i className="ri-message-3-line"></i>
            <span>{discussion.comments?.length || 0} responses</span>
          </div>
          
          {discussion.aiEnhanced && (
            <div className="flex items-center">
              <span className="flex items-center text-sm font-medium text-accent-600">
                <i className="ri-ai-generate mr-1"></i>
                AI Enhanced
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
