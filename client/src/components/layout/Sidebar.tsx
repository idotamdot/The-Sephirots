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
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sephirot-keter-DEFAULT to-sephirot-keter-light flex items-center justify-center">
            <i className="ri-community-line text-white text-xl"></i>
          </div>
          <h1 className="font-heading font-bold text-xl">The Sephirots</h1>
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
                  "flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors duration-150",
                  location === item.path 
                    ? "bg-primary-50 text-primary-700" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <i className={`${item.icon} text-lg`}></i>
                <span>{item.label}</span>
              </Link>
            ))}
        </nav>
        
        {/* User Profile Preview */}
        {currentUser && (
          <div className="mt-auto pt-4 border-t border-gray-200">
            <div className="flex items-center px-2 py-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  {currentUser.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.displayName} 
                      className="w-10 h-10 rounded-full" 
                    />
                  ) : (
                    <span className="text-primary-700 font-medium">
                      {currentUser.displayName.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white"></span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{currentUser.displayName}</p>
                <p className="text-xs text-gray-500">Level {currentUser.level}</p>
              </div>
              <div className="ml-auto">
                <Link href="/profile" className="text-gray-400 hover:text-gray-500">
                  <i className="ri-settings-3-line"></i>
                </Link>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
