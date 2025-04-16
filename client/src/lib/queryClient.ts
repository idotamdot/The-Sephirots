import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000, // 10 seconds
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

type ApiRequestOptions = {
  on401?: "throw" | "returnNull";
};

export const getQueryFn =
  (options: ApiRequestOptions = {}) =>
  async ({ queryKey }: { queryKey: unknown[] }) => {
    const url = queryKey[0] as string;
    
    const res = await fetch(url, {
      credentials: "include", // Include cookies in request
    });
    
    if (!res.ok) {
      if (res.status === 401 && options.on401 === "returnNull") {
        return null;
      }
      
      const error = await res.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(error.error || `API error: ${res.status}`);
    }
    
    return res.json();
  };

export async function apiRequest(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  url: string,
  body?: unknown,
) {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include", // Include cookies in request
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `API error: ${res.status}`);
  }
  
  return res;
}