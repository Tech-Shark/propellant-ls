import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/AxiosInstance';
import { extractPaginationData, extractResponseData, handleApiError } from '../api-hooks';

// Query keys
export const emailKeys = {
  all: ['emails'] as const,
  list: (params?: Record<string, any>) => [...emailKeys.all, 'list', params] as const,
  templates: () => [...emailKeys.all, 'templates'] as const,
  template: (id: string) => [...emailKeys.all, 'templates', id] as const,
  admin: () => [...emailKeys.all, 'admin'] as const,
};

// Types
export interface EmailTemplate {
  _id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailLog {
  _id: string;
  to: string;
  subject: string;
  status: string;
  sentAt: string;
  template?: string;
}

export interface SendEmailParams {
  subject: string;
  content: string;
  userId?: string;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  [key: string]: any;
}

// Get email logs
export function useEmailLogs(params: PaginationParams = {}) {
  return useQuery({
    queryKey: emailKeys.list(params),
    queryFn: async () => {
      const response = await axiosInstance.get('/email/logs', { params });
      return {
        data: extractResponseData<EmailLog[]>(response),
        pagination: extractPaginationData(response),
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get email templates
export function useEmailTemplates() {
  return useQuery({
    queryKey: emailKeys.templates(),
    queryFn: async () => {
      const response = await axiosInstance.get('/email/templates');
      return extractResponseData<EmailTemplate[]>(response);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get a specific email template
export function useEmailTemplate(templateId: string) {
  return useQuery({
    queryKey: emailKeys.template(templateId),
    queryFn: async () => {
      const response = await axiosInstance.get(`/email/templates/${templateId}`);
      return extractResponseData<EmailTemplate>(response);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!templateId, // Only run if templateId is provided
  });
}

// Create email template
export function useCreateEmailTemplate() {
  return useMutation({
    mutationFn: async (data: Partial<EmailTemplate>) => {
      const response = await axiosInstance.post('/email/templates', data);
      return extractResponseData<EmailTemplate>(response);
    },
    onError: handleApiError,
  });
}

// Update email template
export function useUpdateEmailTemplate() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EmailTemplate> }) => {
      const response = await axiosInstance.patch(`/email/templates/${id}`, data);
      return extractResponseData<EmailTemplate>(response);
    },
    onError: handleApiError,
  });
}

// Delete email template
export function useDeleteEmailTemplate() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`/email/templates/${id}`);
      return extractResponseData(response);
    },
    onError: handleApiError,
  });
}

// Send email
export function useSendEmail() {
  return useMutation({
    mutationFn: async (data: { to: string | string[]; subject: string; body: string; templateId?: string }) => {
      const response = await axiosInstance.post('/email/send', data);
      return extractResponseData(response);
    },
    onError: handleApiError,
  });
}

// Admin: Send email to all users
export function useSendEmailToAllUsers() {
  return useMutation({
    mutationFn: async (data: { subject: string; content: string }) => {
      const response = await axiosInstance.post('/admin/send-email/all', data);
      return extractResponseData(response);
    },
    onError: handleApiError,
  });
}

// Admin: Send email to specific user
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

// Admin: Get all admin email related stats
export function useAdminEmailStats() {
  return useQuery({
    queryKey: emailKeys.admin(),
    queryFn: async () => {
      const response = await axiosInstance.get('/admin/email-stats');
      return extractResponseData(response);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
