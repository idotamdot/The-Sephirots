import { useQuery } from "@tanstack/react-query";
import { Discussion } from "@/lib/types";
import DiscussionList from "@/components/discussions/DiscussionList";

export default function Highlights() {
  const { data: discussions, isLoading } = useQuery<Discussion[]>({
    queryKey: ["/api/discussions"],
  });
  
  return (
    <DiscussionList
      title="Today's Highlights"
      discussions={discussions || []}
      isLoading={isLoading}
      showViewAll={true}
    />
  );
}
