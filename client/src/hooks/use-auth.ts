import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: number;
  username: string;
  displayName: string;
  avatar: string | null;
  bio: string | null;
  level: number;
  points: number;
  isAdmin?: boolean;
}

export function useAuth() {
  const queryClient = useQueryClient();
  
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["/api/users/me"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/users/me");
        return response.json();
      } catch (err) {
        // Return null if not authenticated, don't throw an error
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        const response = await apiRequest("POST", "/api/auth/login", {
          username,
          password,
        });

        if (response.ok) {
          queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
          return { success: true, user: await response.json() };
        }

        const error = await response.json();
        return { success: false, error: error.error || "Login failed" };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Login failed",
        };
      }
    },
    [queryClient]
  );

  const register = useCallback(
    async (username: string, password: string, displayName: string) => {
      try {
        const response = await apiRequest("POST", "/api/auth/register", {
          username,
          password,
          displayName,
        });

        if (response.ok) {
          queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
          return { success: true, user: await response.json() };
        }

        const error = await response.json();
        return { success: false, error: error.error || "Registration failed" };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Registration failed",
        };
      }
    },
    [queryClient]
  );

  const logout = useCallback(async () => {
    try {
      const response = await apiRequest("POST", "/api/auth/logout");
      if (response.ok) {
        queryClient.setQueryData(["/api/users/me"], null);
        queryClient.invalidateQueries();
        return { success: true };
      }

      const error = await response.json();
      return { success: false, error: error.error || "Logout failed" };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Logout failed",
      };
    }
  }, [queryClient]);

  return {
    user,
    isLoading,
    isError,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };
}