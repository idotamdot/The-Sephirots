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

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: currentUser, isLoading } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });

  const closeSidebar = () => setSidebarOpen(false);

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
        
        {/* ✨ Particle Glow Background Layer */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-skyglow-glow rounded-full opacity-40 blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-skyglow-dark rounded-full opacity-30 blur-2xl animate-orbit"></div>
          <div className="absolute top-10 right-1/3 w-72 h-72 bg-sephirot-purple-light rounded-full opacity-20 blur-2xl animate-pulse-fast"></div>
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