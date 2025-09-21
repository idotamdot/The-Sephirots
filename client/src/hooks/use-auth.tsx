import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { User } from "@/lib/types";

type LoginData = {
  username: string;
  password: string;
};

type RegisterData = {
  username: string;
  password: string;
  displayName: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [authError, setAuthError] = useState<Error | null>(null);

  // Fetch current user
  const {
    data: user,
    isLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const res = await fetch("/api/users/me", {
        credentials: "include", // Important for sending cookies/session info
      });
      
      if (!res.ok) {
        if (res.status === 404 || res.status === 401) {
          return null; // User not logged in
        }
        throw new Error("Failed to fetch user");
      }
      
      return res.json();
    },
    retry: false,
  });

  // Update error state when fetch error changes
  useEffect(() => {
    if (fetchError) {
      setAuthError(fetchError as Error);
    }
  }, [fetchError]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Login failed");
      }
      
      return res.json();
    },
    onSuccess: (userData) => {
      // Invalidate and refetch user query
      queryClient.setQueryData(["auth", "user"], userData);
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
    onError: (error) => {
      setAuthError(error as Error);
      toast({
        title: "Login Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Registration failed");
      }
      
      return res.json();
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(["auth", "user"], userData);
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
    onError: (error) => {
      setAuthError(error as Error);
      toast({
        title: "Registration Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Logout failed");
      }
    },
    onSuccess: () => {
      // Clear user data and refetch
      queryClient.setQueryData(["auth", "user"], null);
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
    onError: (error) => {
      toast({
        title: "Logout Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  // Login function
  const login = async (credentials: LoginData) => {
    await loginMutation.mutateAsync(credentials);
  };

  // Register function
  const register = async (userData: RegisterData) => {
    await registerMutation.mutateAsync(userData);
  };

  // Logout function
  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isLoading || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
        error: authError,
        isAuthenticated: !!user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}