import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/lib/icons";
import { Music, Play, Pause } from "lucide-react";
import { useAudio } from "@/components/audio/AudioContext";
import { Button } from "@/components/ui/button";

export default function MobileNav() {
  const [location] = useLocation();
  const { 
    audioEnabled, 
    toggleAudio, 
    isPlaying, 
    setIsPlaying 
  } = useAudio();
  
  // Only show mobile navigation items that make sense on mobile (limit to 3 to make room for music)
  const mobileNavItems = navigationItems.slice(0, 3);
  
  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 z-10">
      <div className="flex justify-around items-center">
        {mobileNavItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={cn(
              "flex flex-col items-center",
              location === item.path ? "text-amber-600" : "text-gray-500"
            )}
          >
            <i className={`${item.icon} text-xl ${
              location === item.path ? 'text-amber-600' : 
              item.path === "/" ? 'text-blue-500' :
              item.path === "/discussions" ? 'text-indigo-500' :
              item.path === "/governance" ? 'text-amber-500' :
              item.path === "/rights-agreement" ? 'text-purple-500' :
              'text-gray-500'
            }`}></i>
            <span className="text-xs mt-1">{item.label.split(' ')[0]}</span>
          </Link>
        ))}
        
        {/* Music Control in Nav */}
        <button
          onClick={audioEnabled ? togglePlay : toggleAudio}
          className="flex flex-col items-center text-amber-500"
        >
          {!audioEnabled ? (
            <>
              <Music size={20} />
              <span className="text-xs mt-1">Music</span>
            </>
          ) : (
            <>
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              <span className="text-xs mt-1">{isPlaying ? 'Pause' : 'Play'}</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
}
