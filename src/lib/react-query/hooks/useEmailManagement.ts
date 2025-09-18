import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/api/AxiosInstance';
import { handleApiError, extractResponseData } from '../api-hooks';

// Send email to all users
export function useSendEmailToAllUsers() {
  return useMutation({
    mutationFn: async (data: { subject: string; content: string }) => {
      const response = await axiosInstance.post('/admin/send-email/all', data);
      return extractResponseData(response);
    },
    onError: handleApiError,
  });
}

// Send email to specific user
export function useSendEmailToUser() {
  return useMutation({
    mutationFn: async ({ userId, subject, content }: { userId: string; subject: string; content: string }) => {
      const response = await axiosInstance.post(`/admin/send-email/user/${userId}`, {
        subject,
        content
      });
      return extractResponseData(response);
    },
    onError: handleApiError,
  });
}
