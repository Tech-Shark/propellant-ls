import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/api/AxiosInstance';
import { extractResponseData, handleApiError } from '../api-hooks';
import { userKeys } from './useUsers';

// Types
export interface AuthUser {
  _id: string;
  email: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  [key: string]: any;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  role: string;
  [key: string]: any;
}

export interface ResetPasswordData {
  email: string;
  token: string;
  password: string;
}

// Auth query keys
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
  session: () => [...authKeys.all, 'session'] as const,
};

/**
 * Custom hook for handling authentication-related queries and mutations
 */
export function useAuth() {
  const queryClient = useQueryClient();

  // Get current authenticated user
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error: errorUser,
    refetch: refetchUser
  } = useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const response = await axiosInstance.get('/users/me');
      return extractResponseData<AuthUser>(response);
    },
    // Don't refetch on window focus for auth state - can lead to unwanted redirects
    refetchOnWindowFocus: false,
    // Retry only once for auth
    retry: 1,
    // Throw errors to be handled by the error boundary
    throwOnError: false,
  });

  // Login mutation
  const login = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await axiosInstance.post('/auth/login', credentials);
      return extractResponseData(response);
    },
    onSuccess: () => {
      // When login is successful, refetch the user profile
      refetchUser();
      
      // Also invalidate related data that might depend on auth state
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
    onError: handleApiError,
  });

  // Register mutation
  const register = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await axiosInstance.post('/auth/register', data);
      return extractResponseData(response);
    },
    onError: handleApiError,
  });

  // Logout mutation
  const logout = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post('/auth/logout');
      return extractResponseData(response);
    },
    onSuccess: () => {
      // Clear all queries from cache on logout
      queryClient.clear();
    },
    onError: handleApiError,
  });

  // Forgot password mutation
  const forgotPassword = useMutation({
    mutationFn: async (email: string) => {
      const response = await axiosInstance.post('/auth/forgot-password', { email });
      return extractResponseData(response);
    },
    onError: handleApiError,
  });

  // Reset password mutation
  const resetPassword = useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const response = await axiosInstance.post('/auth/reset-password', data);
      return extractResponseData(response);
    },
    onError: handleApiError,
  });

  return {
    user,
    isLoadingUser,
    isErrorUser,
    errorUser,
    refetchUser,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user && !isErrorUser,
  };
}

/**
 * Helper hook to check if user has a specific role
 */
export function useHasRole(role: string | string[]) {
  const { user, isLoadingUser, isErrorUser } = useAuth();
  
  if (isLoadingUser || isErrorUser || !user) {
    return false;
  }

  const userRole = (user as AuthUser).role;
  
  if (Array.isArray(role)) {
    return role.includes(userRole);
  }
  
  return userRole === role;
}
