import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/AxiosInstance';
import { extractResponseData } from '../api-hooks';

// Query keys
export const jobKeys = {
  all: ['jobs'] as const,
  stats: () => [...jobKeys.all, 'stats'] as const,
};

// Types
export interface JobStats {
  total: number;
  activePosts: number;
  inactivePosts: number;
  [key: string]: any;
}

// Get job stats for an organization
export function useJobStats() {
  return useQuery({
    queryKey: jobKeys.stats(),
    queryFn: async () => {
      const response = await axiosInstance.get('/job-post/stats');
      return extractResponseData<JobStats>(response);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
