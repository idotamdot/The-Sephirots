import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Type for the options object
type RequestOptions = {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
};

// Function overloads to support different call patterns
export async function apiRequest<T = any>(url: string): Promise<T>;
export async function apiRequest<T = any>(url: string, options: RequestOptions): Promise<T>;
export async function apiRequest<T = any>(method: string, url: string, data?: unknown): Promise<T>;

// Implementation
export async function apiRequest<T = any>(
  urlOrMethod: string,
  urlOrOptions?: string | RequestOptions,
  data?: unknown
): Promise<T> {
  let url: string;
  let method: string = 'GET';
  let requestData: unknown | undefined;
  let headers: Record<string, string> = {};

  // Handle different parameter patterns
  if (typeof urlOrOptions === 'undefined') {
    // apiRequest(url)
    url = urlOrMethod;
  } else if (typeof urlOrOptions === 'string') {
    // apiRequest(method, url, data?)
    method = urlOrMethod;
    url = urlOrOptions;
    requestData = data;
  } else {
    // apiRequest(url, options)
    url = urlOrMethod;
    method = urlOrOptions.method || 'GET';
    requestData = urlOrOptions.body;
    headers = urlOrOptions.headers || {};
  }

  // Add content-type header for JSON data
  if (requestData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    method,
    headers,
    body: requestData ? JSON.stringify(requestData) : undefined,
    credentials: 'include',
  });

  await throwIfResNotOk(res);
  
  // Return the parsed JSON response if content exists, otherwise an empty object
  try {
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    }
    return {} as T;
  } catch (e) {
    return {} as T;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
