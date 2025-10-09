import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/AxiosInstance';
import { extractPaginationData, extractResponseData, handleApiError, invalidateRelatedQueries } from '../api-hooks';
import { userKeys } from './useUsers';

// Types
export interface AdminUserParams {
  page?: number;
  size?: number;
  isDeleted?: string | boolean;
  role?: string;
  search?: string;
  [key: string]: any;
}

export interface AdminUserResponse {
  _id: string;
  fullname?: string;
  email: string;
  companyName?: string;
  role: string;
  deactivated: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
  totalReferrals?: number;
}

// Get all users (admin)
export function useAdminUsers(params: AdminUserParams = {}) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const response = await axiosInstance.get('/users/admin/all', { params });
      return {
        data: extractResponseData<AdminUserResponse[]>(response),
        pagination: extractPaginationData(response),
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Suspend user
export function useSuspendUser() {
  return useMutation({
    mutationFn: async ({ userId, accountSuspensionReason }: { userId: string; accountSuspensionReason: string }) => {
      const response = await axiosInstance.patch(`/users/admin/suspend?_id=${userId}`, {
        accountSuspensionReason,
      });
      return extractResponseData(response);
    },
    onSuccess: () => {
      invalidateRelatedQueries([userKeys.all[0]]);
    },
    onError: handleApiError,
  });
}

// Unsuspend user
export function useUnsuspendUser() {
  return useMutation({
    mutationFn: async ({ userId, accountSuspensionReason }: { userId: string; accountSuspensionReason: string }) => {
      const response = await axiosInstance.patch(`/users/admin/unsuspend?_id=${userId}`, {
        accountSuspensionReason,
      });
      return extractResponseData(response);
    },
    onSuccess: () => {
      invalidateRelatedQueries([userKeys.all[0]]);
    },
    onError: handleApiError,
  });
}
