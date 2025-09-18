import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";
import { OfflineEnabledQueryProvider } from "./offline-support";

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
      retry: 1,
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
