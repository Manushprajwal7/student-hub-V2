import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes — data served from cache on revisit
      gcTime: 10 * 60 * 1000,         // 10 minutes — keep unused cache entries longer
      refetchOnWindowFocus: false,
      retry: 1,                         // retry once on network error
    },
  },
})

