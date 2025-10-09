import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/AxiosInstance';
import { extractPaginationData, extractResponseData, handleApiError } from '../api-hooks';
import { User } from '@/types/user';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  list: (params?: Record<string, any>) => [...userKeys.all, 'list', params] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
  me: () => [...userKeys.all, 'me'] as const,
};

// Types
export interface PaginationParams {
  page?: number;
  size?: number;
  isDeleted?: string | boolean;
  [key: string]: any;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
  role: string;
  isVerified: boolean;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}

// Get all users (admin)
export function useUsers(params: PaginationParams = {}) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const response = await axiosInstance.get('/users/admin/users', { params });
      return {
        data: extractResponseData<UserResponse[]>(response),
        pagination: extractPaginationData(response),
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get specific user
export function useUser(userId: string) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: async () => {
      const response = await axiosInstance.get(`/users/${userId}`);
      return extractResponseData<UserResponse>(response);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!userId, // Only run if userId is provided
  });
}

// Get current user profile
export function useCurrentUser() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: async () => {
      const response = await axiosInstance.get('/users/me');
      return extractResponseData<UserResponse>(response);
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Update user
export function useUpdateUser() {
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: Partial<User> }) => {
      const response = await axiosInstance.patch(`/users/${userId}`, data);
      return extractResponseData(response);
    },
    onError: handleApiError,
  });
}

// Delete user
export function useDeleteUser() {
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await axiosInstance.delete(`/users/${userId}`);
      return extractResponseData(response);
    },
    onError: handleApiError,
  });
}
