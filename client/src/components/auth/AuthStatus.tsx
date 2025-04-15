import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { UserCircle, LogOut } from "lucide-react";

interface User {
  id: number;
  displayName: string;
  username: string;
  level: number;
  points: number;
  avatar?: string | null;
}

export default function AuthStatus() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Fetch the current user on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/users/me", {
          credentials: "include",
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      
      if (response.ok) {
        setUser(null);
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out.",
        });
        navigate("/");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center text-sm text-gray-500">
        <div className="animate-pulse w-6 h-6 bg-gray-200 rounded-full mr-2"></div>
        <span>Loading...</span>
      </div>
    );
  }

  // Function to log in with test user (development only)
  const loginWithTestUser = async () => {
    try {
      const response = await fetch("/api/dev/login-test-user", {
        credentials: "include",
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        toast({
          title: "Logged in as Test User",
          description: "You are now logged in as Test User for development purposes.",
        });
      } else {
        throw new Error("Failed to log in test user");
      }
    } catch (error) {
      console.error("Error logging in with test user:", error);
      toast({
        title: "Login Failed",
        description: "Could not log in with test user. See console for details.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/login")}
          className="text-amber-600 hover:text-amber-800 hover:bg-amber-50"
        >
          Login
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/register")}
          className="border-amber-200 text-amber-800 hover:bg-amber-50"
        >
          Register
        </Button>
        {process.env.NODE_ENV === "development" && (
          <Button
            variant="outline"
            size="sm"
            onClick={loginWithTestUser}
            className="border-green-200 text-green-800 hover:bg-green-50"
          >
            Dev Login
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <button 
        className="mr-4 flex items-center cursor-pointer hover:opacity-80"
        onClick={() => navigate("/profile")}
      >
        {user.avatar ? (
          <img 
            src={user.avatar}
            alt={user.displayName}
            className="w-8 h-8 rounded-full mr-2 object-cover border-2 border-amber-300"
          />
        ) : (
          <UserCircle className="w-8 h-8 text-amber-500 mr-2" />
        )}
        <div className="flex flex-col text-left">
          <span className="font-medium text-amber-800">{user.displayName}</span>
          <span className="text-xs text-gray-500">Level {user.level} • {user.points} points</span>
        </div>
      </button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleLogout}
        className="text-gray-500 hover:text-red-500 hover:bg-red-50"
        title="Logout"
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  );
}