import { Switch, Route, useLocation } from "wouter";
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
import QuantumInsights from "@/pages/QuantumInsights";
import AICompanion from "@/pages/AICompanion";
import Profile from "@/pages/Profile";
import Governance from "@/pages/Governance";
import ProposalDetail from "@/pages/ProposalDetail";
import CreateProposal from "@/pages/CreateProposal";
import Moderation from "@/pages/Moderation";
import SupportJourney from "./pages/SupportJourney";
import Donate from "@/pages/Donate";
import Payment from "@/pages/Payment";
import DonationThankYou from "./pages/DonationThankYou";
import BadgeTest from "@/pages/BadgeTest";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import { useEffect, useState } from "react";
import { User } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { AudioProvider } from "@/components/audio/AudioContext";
import AudioControl from "@/components/audio/AudioControl";
import CosmicBackgroundSynchronizer from "@/components/cosmic/CosmicBackgroundSynchronizer";
import { AuthProvider } from "@/hooks/use-auth";
import { OnboardingProvider } from "@/hooks/use-onboarding";
import OnboardingJourney from "@/components/onboarding/OnboardingJourney";

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Use the auth context for user data
  const { user: currentUser, isLoading } = useAuth();

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

  // Get current location for page-specific mood settings
  const [location] = useLocation();
  
  // Determine mood based on current page
  const getMoodForPage = () => {
    if (location.includes('/ai-companion')) return 'calm';
    if (location.includes('/mystical-progress')) return 'mystical';
    if (location.includes('/governance')) return 'focused';
    if (location.includes('/achievements')) return 'celebratory';
    if (location.includes('/quantum-insights')) return 'energetic';
    return undefined; // Let the component determine mood based on time and community activity
  };
  
  return (
    <OnboardingProvider>
      <AudioProvider>
        <div className="relative min-h-screen overflow-hidden">
          {/* Onboarding Journey */}
          <OnboardingJourney />
          
          {/* Audio Control */}
          <AudioControl />
          
          {/* ✨ Cosmic Background Mood Synchronizer */}
          <CosmicBackgroundSynchronizer 
            moodOverride={getMoodForPage()}
            intensity={75}
            interactive={true}
          >
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
                  <Route path="/login" component={Login} />
                  <Route path="/register" component={Register} />
                  <Route path="/forgot-password" component={ForgotPassword} />
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
                  <Route path="/quantum-insights" component={QuantumInsights} />
                  <Route path="/ai-companion" component={AICompanion} />
                  <Route path="/profile">
                    <Profile currentUser={currentUser} />
                  </Route>
                  <Route path="/governance" component={Governance} />
                  <Route path="/governance/new" component={CreateProposal} />
                  <Route path="/governance/:id">
                    {params => <ProposalDetail />}
                  </Route>
                  <Route path="/moderation" component={Moderation} />
                  <Route path="/support-journey" component={SupportJourney} />
                  <Route path="/donate" component={Donate} />
                  <Route path="/payment" component={Payment} />
                  <Route path="/donation-thank-you" component={DonationThankYou} />
                  <Route path="/badge-test" component={BadgeTest} />
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
        </CosmicBackgroundSynchronizer>
      </div>
    </AudioProvider>
    </OnboardingProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;