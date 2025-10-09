import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/AxiosInstance';
import { ReferralLeaderboardEntry, ReferralRecord, ReferralStats } from '@/utils/global';
import { extractPaginationData, extractResponseData, handleApiError } from '../api-hooks';

// Query keys
export const referralKeys = {
  all: ['referrals'] as const,
  list: (params?: Record<string, any>) => [...referralKeys.all, 'list', params] as const,
  stats: () => [...referralKeys.all, 'stats'] as const,
  leaderboard: (params?: Record<string, any>) => [...referralKeys.all, 'leaderboard', params] as const,
};

// Types
export interface PaginationParams {
  page?: number;
  size?: number;
  isDeleted?: string | boolean;
  [key: string]: any;
}

export interface PaginationResponse<T> {
  data: T[];
  meta: {
    page: number;
    size: number;
    total: number;
    lastPage: number;
  };
}

// Get all referrals (paginated)
export function useReferrals(params: PaginationParams = {}) {
  return useQuery({
    queryKey: referralKeys.list(params),
    queryFn: async () => {
      const response = await axiosInstance.get('/users/admin/referrals', { params });
      return {
        data: extractResponseData<ReferralRecord[]>(response),
        pagination: extractPaginationData(response),
      };
    },
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}

// Get referral stats
export function useReferralStats() {
  return useQuery({
    queryKey: referralKeys.stats(),
    queryFn: async () => {
      const response = await axiosInstance.get('/users/admin/referrals/stats');
      return extractResponseData<ReferralStats>(response);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get referral leaderboard
export function useReferralLeaderboard(params: PaginationParams = {}) {
  return useQuery({
    queryKey: referralKeys.leaderboard(params),
    queryFn: async () => {
      const response = await axiosInstance.get('/users/admin/referrals/leaderboard', {
        params: { ...params, sortBy: 'totalReferrals' },
      });
      return {
        data: extractResponseData<ReferralLeaderboardEntry[]>(response),
        pagination: extractPaginationData(response),
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Update referral status
export function useUpdateReferralStatus() {
  return useMutation({
    mutationFn: async ({
      referralId,
      status
    }: {
      referralId: string;
      status: 'PENDING' | 'COMPLETED' | 'REWARDED';
    }) => {
      const response = await axiosInstance.patch(`/users/admin/referrals/${referralId}/status`, {
        status
      });
      return extractResponseData(response);
    },
    onError: handleApiError,
  });
}

// Delete referral
export function useDeleteReferral() {
  return useMutation({
    mutationFn: async (referralId: string) => {
      const response = await axiosInstance.delete(`/users/admin/referrals/${referralId}`);
      return extractResponseData(response);
    },
    onError: handleApiError,
  });
}
