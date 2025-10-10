import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";
import { OfflineEnabledQueryProvider } from "./offline-support";
import { toast } from "sonner";

// Create a client
// Instead of creating the client directly, we'll create it inside the component
// This is necessary for offline support with PersistQueryClientProvider
// because it needs a fresh QueryClient instance if hydration fails
const defaultQueryClientOptions = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      retry: (failureCount: number, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry up to 1 time for 5xx errors (server errors) and network errors
        return failureCount < 1;
      },
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: false, // Don't retry mutations by default
      onError: (error: any) => {
        console.error("Mutation error:", error);
        // Global error handler for mutations
        const message = error?.response?.data?.message || error?.message || "An error occurred";
        toast.error("Operation failed", {
          description: message,
        });
      },
    },
  },
};

// Create a client for outside component use (prefetching, etc.)
const queryClient = new QueryClient(defaultQueryClientOptions);

interface ReactQueryProviderProps {
  children: ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  // Create a new client instance for the provider
  // This is needed for proper offline support with PersistQueryClientProvider
  const [queryClientInstance] = useState(
    () => new QueryClient(defaultQueryClientOptions)
  );

  return (
    <OfflineEnabledQueryProvider queryClient={queryClientInstance}>
      {children}
      {/* React Query Devtools - only shown in development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </OfflineEnabledQueryProvider>
  );
}

export { queryClient };
