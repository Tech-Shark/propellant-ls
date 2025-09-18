import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/AxiosInstance';
import { extractResponseData } from '../api-hooks';

// Query keys
export const jobStatsKeys = {
  all: ['jobStats'] as const,
  overview: () => [...jobStatsKeys.all, 'overview'] as const,
};

// Types
export interface JobStats {
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  pendingJobs: number;
  [key: string]: any;
}

// Get job stats for an organization
export function useJobStats() {
  return useQuery({
    queryKey: jobStatsKeys.overview(),
    queryFn: async () => {
      const response = await axiosInstance.get('/job-post/stats');
      return extractResponseData<JobStats>(response);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
