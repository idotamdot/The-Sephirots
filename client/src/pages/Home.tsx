import { useQuery } from "@tanstack/react-query";
import Hero from "@/components/home/Hero";
import Highlights from "@/components/home/Highlights";
import RightsAgreement from "@/components/home/RightsAgreement";
import EventsList from "@/components/home/EventsList";
import ProgressSection from "@/components/home/ProgressSection";
import { User } from "@/lib/types";

export default function Home() {
  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });
  
  return (
    <div className="p-4 md:p-6">
      <Hero />
      <Highlights />
      <ProgressSection currentUser={currentUser} />
      <RightsAgreement />
      <EventsList />
    </div>
  );
}
