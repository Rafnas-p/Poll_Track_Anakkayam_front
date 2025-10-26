// client/src/queryClient.js
import { QueryClient } from '@tanstack/react-query';

// Configure the QueryClient with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Set default query options
      retry: 2, // Retry failed queries twice
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
      cacheTime: 1000 * 60 * 10, // Cache data for 10 minutes
      refetchOnWindowFocus: false, // Disable refetch on window focus
    },
    mutations: {
      // Set default mutation options
      retry: 1, // Retry failed mutations once
    },
  },
});

export default queryClient;