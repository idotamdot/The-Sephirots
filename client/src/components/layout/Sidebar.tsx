import { Link, useLocation } from "wouter";
import { User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/lib/icons";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  currentUser?: User;
}

export default function Sidebar({ open, onClose, currentUser }: SidebarProps) {
  const [location] = useLocation();
  
  return (
    <>
      {/* Backdrop for mobile */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 md:relative z-50 md:z-0 w-64 lg:w-72 flex-col bg-white border-r border-gray-200 p-4 transition-transform duration-300 ease-in-out md:transform-none",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button for mobile */}
        <button 
          className="absolute right-4 top-4 md:hidden text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <i className="ri-close-line text-xl"></i>
        </button>
        
        {/* Logo and Platform Name */}
        <div className="flex items-center space-x-2 px-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sephirot-keter-DEFAULT to-sephirot-gold-light flex items-center justify-center relative overflow-hidden shadow-lg">
            <i className="ri-dove-line text-white text-xl z-10"></i>
            <span className="absolute top-0 right-0 text-xs text-white">
              <i className="ri-star-line absolute top-0 right-0 text-[10px] text-white"></i>
              <i className="ri-star-line absolute top-1 right-2 text-[8px] text-white"></i>
              <i className="ri-star-line absolute top-2 right-0 text-[7px] text-white"></i>
            </span>
          </div>
          <h1 className="font-heading font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-300">The Sephirots</h1>
        </div>
        
        {/* Navigation Links */}
        <nav className="space-y-1 flex-1">
          {navigationItems
            .filter(item => !item.adminOnly || (currentUser?.roles?.includes('admin') || currentUser?.roles?.includes('moderator')))
            .map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                onClick={onClose}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out relative",
                  location === item.path 
                    ? "bg-gradient-to-r from-sephirot-gold-light/20 to-amber-50 text-amber-700 border-l-2 border-amber-500 shadow-sm" 
                    : "text-gray-700 hover:bg-amber-50/50 hover:translate-x-1"
                )}
              >
                <i className={`${item.icon} text-lg ${location === item.path ? 'text-amber-600' : 'text-gray-500'}`}></i>
                <span>{item.label}</span>
                {location === item.path && 
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                }
              </Link>
            ))}
        </nav>
        
        {/* User Profile Preview */}
        {currentUser && (
          <div className="mt-auto pt-4 border-t border-gray-200">
            <div className="flex items-center px-2 py-3 bg-gradient-to-r from-amber-50 to-transparent rounded-lg">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200 flex items-center justify-center shadow-sm">
                  {currentUser.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.displayName} 
                      className="w-10 h-10 rounded-full" 
                    />
                  ) : (
                    <span className="text-amber-700 font-medium">
                      {currentUser.displayName.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-md"></span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-amber-800">{currentUser.displayName}</p>
                <p className="text-xs text-amber-600 flex items-center">
                  <i className="ri-award-line mr-1"></i> Level {currentUser.level}
                </p>
              </div>
              <div className="ml-auto">
                <Link href="/profile" className="text-amber-500 hover:text-amber-600 transition-colors">
                  <i className="ri-user-settings-line"></i>
                </Link>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
