import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import Discussions from "@/pages/Discussions";
import Discussion from "@/pages/Discussion";
import RightsAgreement from "@/pages/RightsAgreement";
import CommunityNeeds from "@/pages/CommunityNeeds";
import Wellbeing from "@/pages/Wellbeing";
import Achievements from "@/pages/Achievements";
import MysticalProgress from "@/pages/MysticalProgress";
import MindMapExplorer from "@/pages/MindMapExplorer";
import WisdomMarketplace from "@/pages/WisdomMarketplace";
import Rewards from "@/pages/Rewards";
import Profile from "@/pages/Profile";
import Governance from "@/pages/Governance";
import ProposalDetail from "@/pages/ProposalDetail";
import CreateProposal from "@/pages/CreateProposal";
import Moderation from "@/pages/Moderation";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/lib/types";
import { AudioProvider } from "@/components/audio/AudioContext";
import AudioControl from "@/components/audio/AudioControl";
import StarfieldBackground from "@/components/mindmap/StarfieldBackground";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [starfieldSeed, setStarfieldSeed] = useState<number>(Date.now());

  const { data: currentUser, isLoading } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });

  const closeSidebar = () => setSidebarOpen(false);

  // Update starfield every hour
  useEffect(() => {
    const interval = setInterval(() => {
      setStarfieldSeed(Date.now());
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <AudioProvider>
      <div className="relative min-h-screen bg-gradient-to-br from-skyglow-light via-white to-skyglow-dark text-blue-900 overflow-hidden">
        {/* Audio Control */}
        <AudioControl />
        
        {/* ✨ Cosmic Starfield Background */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <StarfieldBackground 
            starsCount={450}
            speed={0.05}
            backgroundColor="rgba(4, 3, 20, 0.85)"
            interactive={true}
            seed={starfieldSeed}
          />
        </div>

        <div className="relative flex h-screen overflow-hidden z-10">
          {/* Sidebar */}
          <Sidebar open={sidebarOpen} onClose={closeSidebar} currentUser={currentUser} />

          {/* Main Content */}
          <main className="flex-1 flex flex-col overflow-hidden">
            <Header
              onMenuClick={() => setSidebarOpen(true)}
              currentUser={currentUser}
              isLoading={isLoading}
            />

            <div className="flex-1 overflow-y-auto bg-gray-50 bg-opacity-70 backdrop-blur-md">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/discussions" component={Discussions} />
                <Route path="/discussions/:id">
                  {params => <Discussion id={parseInt(params.id)} />}
                </Route>
                <Route path="/rights-agreement" component={RightsAgreement} />
                <Route path="/community-needs" component={CommunityNeeds} />
                <Route path="/wellbeing" component={Wellbeing} />
                <Route path="/achievements" component={Achievements} />
                <Route path="/mystical-progress" component={MysticalProgress} />
                <Route path="/mindmap" component={MindMapExplorer} />
                <Route path="/wisdom-marketplace" component={WisdomMarketplace} />
                <Route path="/rewards" component={Rewards} />
                <Route path="/profile">
                  <Profile currentUser={currentUser} />
                </Route>
                <Route path="/governance" component={Governance} />
                <Route path="/governance/new" component={CreateProposal} />
                <Route path="/governance/:id">
                  {params => <ProposalDetail />}
                </Route>
                <Route path="/moderation" component={Moderation} />
                <Route component={NotFound} />
              </Switch>
            </div>

            {/* Mobile Navigation */}
            <MobileNav />
          </main>

          {/* Mobile New Discussion Button */}
          <div className="md:hidden fixed bottom-20 right-5 z-20">
            <button className="w-14 h-14 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg flex items-center justify-center animate-pulse-slow">
              <i className="ri-add-line text-2xl"></i>
            </button>
          </div>
        </div>
      </div>
    </AudioProvider>
  );
}

export default App;