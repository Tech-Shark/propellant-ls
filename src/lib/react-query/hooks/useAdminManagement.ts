import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/AxiosInstance';
import { extractResponseData } from '../api-hooks';

// Query keys
export const adminKeys = {
  all: ['admin'] as const,
  list: () => [...adminKeys.all, 'list'] as const,
  stats: () => [...adminKeys.all, 'stats'] as const,
};

// Types
export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  organizationUsers: number;
  talentUsers: number;
}

// Import mock data for development
import { mockAdminList, mockAdminStats, simulateApiDelay } from './mockData';
import { DevSettings } from '@/lib/dev-settings';

// Get admin users list
export function useAdminList() {
  return useQuery({
    queryKey: adminKeys.list(),
    queryFn: async () => {
      try {
        // If mock data is enabled, return it directly
        if (DevSettings.useMockData) {
          if (DevSettings.enableApiLogs) console.log('Using mock admin list data');
          return await simulateApiDelay(mockAdminList);
        }
        
        if (DevSettings.enableApiLogs) console.log('Fetching admin user list...');
        
        try {
          // Try multiple possible endpoints based on backend API structure
          try {
            const response = await axiosInstance.get('/users/admin/all-admins');
            if (DevSettings.enableApiLogs) console.log('Admin user list response:', response);
            return extractResponseData<AdminUser[]>(response);
          } catch (firstEndpointError) {
            // Try alternative endpoint
            const response = await axiosInstance.get('/users/admin/all');
            if (DevSettings.enableApiLogs) console.log('Admin user list response (alt):', response);
            return extractResponseData<AdminUser[]>(response);
          }
        } catch (apiError) {
          console.warn('API error, falling back to mock data:', apiError);
          return await simulateApiDelay(mockAdminList);
        }
      } catch (error) {
        console.error('Error in useAdminList:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1, // Only retry once to avoid excessive failed requests
  });
}

    // Get admin dashboard stats
export function useAdminStats() {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: async () => {
      try {
        // If mock data is enabled, return it directly
        if (DevSettings.useMockData) {
          if (DevSettings.enableApiLogs) console.log('Using mock admin stats data');
          return await simulateApiDelay(mockAdminStats);
        }
        
        if (DevSettings.enableApiLogs) console.log('Fetching admin dashboard stats...');
        
        try {
          // Start with the most likely endpoint based on backend code structure
          // NOTE: Since there's no specific stats endpoint in the backend,
          // we'll try the users endpoint and calculate stats ourselves
          const endpoints = [
            '/users/admin/all'  // This is the actual endpoint from the backend
          ];
          
          // Try each endpoint sequentially
          for (const endpoint of endpoints) {
            try {
              console.log(`Trying endpoint: ${endpoint}`);
              const response = await axiosInstance.get(endpoint);
              if (DevSettings.enableApiLogs) console.log('Admin dashboard stats response:', response);
              return extractResponseData<AdminStats>(response);
            } catch (endpointError) {
              console.warn(`Endpoint ${endpoint} failed:`, endpointError);
              // Continue to next endpoint
            }
          }
          
          // If all endpoints fail, fallback to getting all users and computing stats
          console.warn('All stats endpoints failed, falling back to user list');
          const usersResponse = await axiosInstance.get('/users/admin/all');
          if (DevSettings.enableApiLogs) console.log('Admin all users response:', usersResponse);
          
          const users = extractResponseData<any[]>(usersResponse);
          
          // Create stats from the user list
          const adminStats: AdminStats = {
            totalUsers: users.length || 0,
            activeUsers: users.filter(u => u.isActive !== false).length || 0,
            newUsers: users.filter(u => {
              const createdAt = new Date(u.createdAt);
              const oneMonthAgo = new Date();
              oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
              return createdAt > oneMonthAgo;
            }).length || 0,
            organizationUsers: users.filter(u => u.role === 'ORGANIZATION').length || 0,
            talentUsers: users.filter(u => u.role === 'TALENT').length || 0
          };
          
          return adminStats;
        } catch (apiError) {
          console.warn('API error, falling back to mock data:', apiError);
          return await simulateApiDelay(mockAdminStats);
        }
      } catch (error) {
        console.error('Error in useAdminStats:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1, // Only retry once to avoid excessive failed requests
  });
}