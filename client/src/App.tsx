import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import Discussions from "@/pages/Discussions";
import Discussion from "@/pages/Discussion";
import RightsAgreement from "@/pages/RightsAgreement";
import CommunityNeeds from "@/pages/CommunityNeeds";
import Wellbeing from "@/pages/Wellbeing";
import Achievements from "@/pages/Achievements";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/lib/types";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Get current user
  const { data: currentUser, isLoading } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });

  // Close sidebar when route changes
  const closeSidebar = () => setSidebarOpen(false);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener("keydown", handleEsc);
    
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={closeSidebar} currentUser={currentUser} />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          currentUser={currentUser}
          isLoading={isLoading}
        />
        
        <div className="flex-1 overflow-y-auto bg-gray-50">
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
            <Route path="/profile">
              <Profile currentUser={currentUser} />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </div>
        
        {/* Mobile Navigation */}
        <MobileNav />
      </main>
      
      {/* Mobile New Discussion Button */}
      <div className="md:hidden fixed bottom-20 right-5">
        <button className="w-14 h-14 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg flex items-center justify-center animate-pulse-slow">
          <i className="ri-add-line text-2xl"></i>
        </button>
      </div>
    </div>
  );
}

export default App;
