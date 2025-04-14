import { Link } from "wouter";
import { User } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface HeaderProps {
  onMenuClick: () => void;
  currentUser?: User;
  isLoading: boolean;
}

export default function Header({ onMenuClick, currentUser, isLoading }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 md:px-6 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Mobile Logo and Menu Button */}
        <div className="flex items-center md:hidden">
          <button 
            className="mr-2 text-gray-600 hover:text-gray-900 focus:outline-none" 
            aria-label="Open sidebar menu"
            onClick={onMenuClick}
          >
            <i className="ri-menu-line text-2xl"></i>
          </button>
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sephirot-keter-DEFAULT to-sephirot-keter-light flex items-center justify-center">
              <i className="ri-community-line text-white text-lg"></i>
            </div>
            <span className="font-heading font-bold">The Sephirots</span>
          </Link>
        </div>
        
        {/* Search Bar */}
        <div className="hidden md:flex flex-1 mx-8 max-w-lg relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <i className="ri-search-line text-gray-400"></i>
          </div>
          <Input 
            type="search" 
            className="pl-10"
            placeholder="Search discussions, topics, or users" 
          />
        </div>
        
        {/* User Actions */}
        <div className="flex items-center space-x-4">
          <button className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 relative" aria-label="Notifications">
            <i className="ri-notification-3-line text-xl"></i>
            <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full"></span>
          </button>
          <button className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100" aria-label="Messages">
            <i className="ri-message-3-line text-xl"></i>
          </button>
          <div className="md:hidden">
            {isLoading ? (
              <Skeleton className="w-8 h-8 rounded-full" />
            ) : currentUser ? (
              <Link href="/profile" className="block">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  {currentUser.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.displayName} 
                      className="w-8 h-8 rounded-full" 
                    />
                  ) : (
                    <span className="text-primary-700 font-medium">
                      {currentUser.displayName.charAt(0)}
                    </span>
                  )}
                </div>
              </Link>
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
