import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/AxiosInstance';
import { extractResponseData, handleApiError } from '../api-hooks';

// Query keys
export const paymentKeys = {
  all: ['payment'] as const,
  admin: () => [...paymentKeys.all, 'admin'] as const,
  detail: (id: string) => [...paymentKeys.all, 'detail', id] as const,
};

// Types
export interface PaymentMethod {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  accountDetails?: {
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

// Get all payment methods (admin)
export function usePaymentMethods() {
  return useQuery({
    queryKey: paymentKeys.admin(),
    queryFn: async () => {
      const response = await axiosInstance.get('/payment/admin');
      return extractResponseData<PaymentMethod[]>(response);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Create payment method
export function useCreatePaymentMethod() {
  return useMutation({
    mutationFn: async (data: Partial<PaymentMethod>) => {
      const response = await axiosInstance.post('/payment', data);
      return extractResponseData<PaymentMethod>(response);
    },
    onError: handleApiError,
  });
}

// Update payment method
export function useUpdatePaymentMethod() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PaymentMethod> }) => {
      const response = await axiosInstance.patch(`/payment/${id}`, data);
      return extractResponseData<PaymentMethod>(response);
    },
    onError: handleApiError,
  });
}

// Delete payment method
export function useDeletePaymentMethod() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`/payment/${id}`);
      return extractResponseData(response);
    },
    onError: handleApiError,
  });
}
