import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/AxiosInstance';
import { extractResponseData, handleApiError } from '../api-hooks';

// Query keys
export const settingsKeys = {
  all: ['settings'] as const,
  details: () => [...settingsKeys.all, 'details'] as const,
  subscriptionPlans: () => [...settingsKeys.all, 'subscriptionPlans'] as const,
  systemConfig: () => [...settingsKeys.all, 'systemConfig'] as const,
};

// Types
export interface SettingsData {
  referralRewardSetting: {
    enrollmentReward: number;
    invitationReward: number;
    recruitmentReward: number;
  };
  referralStatementSettings: {
    enrollmentStatement: string;
    invitationStatement: string;
    recruitmentStatement: string;
  };
  [key: string]: any;
}

export interface SubscriptionPlan {
  _id?: string;
  name: string;
  price: number;
  features: string[];
  description?: string;
  active?: boolean;
}

export interface SystemConfig {
  _id?: string;
  name: string;
  value: any;
  description?: string;
  category?: string;
  type?: string;
}

// Get settings
export function useSettings() {
  return useQuery({
    queryKey: settingsKeys.details(),
    queryFn: async () => {
      const response = await axiosInstance.get('/settings');
      return extractResponseData<SettingsData>(response);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Update settings
export function useUpdateSettings() {
  return useMutation({
    mutationFn: async (data: Partial<SettingsData>) => {
      const response = await axiosInstance.patch('/settings', data);
      return extractResponseData(response);
    },
    onError: handleApiError,
  });
}

// Get subscription plans
export function useSubscriptionPlans() {
  return useQuery({
    queryKey: settingsKeys.subscriptionPlans(),
    queryFn: async () => {
      const response = await axiosInstance.get('/settings/subscription-plans');
      return extractResponseData<SubscriptionPlan[]>(response);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Create subscription plan
export function useCreateSubscriptionPlan() {
  return useMutation({
    mutationFn: async (data: SubscriptionPlan) => {
      const response = await axiosInstance.post('/settings/subscription-plans', data);
      return extractResponseData<SubscriptionPlan>(response);
    },
    onError: handleApiError,
  });
}

// Update subscription plan
export function useUpdateSubscriptionPlan() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SubscriptionPlan> }) => {
      const response = await axiosInstance.patch(`/settings/subscription-plans/${id}`, data);
      return extractResponseData<SubscriptionPlan>(response);
    },
    onError: handleApiError,
  });
}

// Delete subscription plan
export function useDeleteSubscriptionPlan() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`/settings/subscription-plans/${id}`);
      return extractResponseData(response);
    },
    onError: handleApiError,
  });
}

// Get system config settings
export function useSystemConfig() {
  return useQuery({
    queryKey: settingsKeys.systemConfig(),
    queryFn: async () => {
      const response = await axiosInstance.get('/settings/system-config');
      return extractResponseData<SystemConfig[]>(response);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Update system config setting
export function useUpdateSystemConfig() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SystemConfig> }) => {
      const response = await axiosInstance.patch(`/settings/system-config/${id}`, data);
      return extractResponseData<SystemConfig>(response);
    },
    onError: handleApiError,
  });
}
