import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/AxiosInstance';
import { extractResponseData } from '../api-hooks';

// Query keys
export const adminStatsKeys = {
  all: ['adminStats'] as const,
  overview: () => [...adminStatsKeys.all, 'overview'] as const,
  admins: () => [...adminStatsKeys.all, 'admins'] as const,
  users: (timeframe: string) => [...adminStatsKeys.all, 'users', timeframe] as const,
};

// Types
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  organizationUsers: number;
  talentUsers: number;
  [key: string]: any;
}

export interface AdminData {
  _id: string;
  email: string;
  fullname: string;
  role: string;
  lastLoginAt: string;
  createdAt: string;
  [key: string]: any;
}

// Get admin dashboard stats
export function useAdminStats() {
  return useQuery({
    queryKey: adminStatsKeys.overview(),
    queryFn: async () => {
      const response = await axiosInstance.get('/users/admin/dashboard');
      return extractResponseData<AdminStats>(response);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get list of admin users
export function useAdminList() {
  return useQuery({
    queryKey: adminStatsKeys.admins(),
    queryFn: async () => {
      const response = await axiosInstance.get('/users/admin/all-admins');
      return extractResponseData<AdminData[]>(response);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get user growth by timeframe
export function useUserGrowth(timeframe: string = 'week') {
  return useQuery({
    queryKey: adminStatsKeys.users(timeframe),
    queryFn: async () => {
      const response = await axiosInstance.get(`/users/admin/user-growth?timeframe=${timeframe}`);
      return extractResponseData(response);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
