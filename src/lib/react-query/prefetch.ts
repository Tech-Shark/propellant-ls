import { useEffect } from 'react';
import { queryClient } from './index';

/**
 * Custom hook to prefetch critical application data
 * This helps improve perceived performance by starting data fetches early
 */
export function usePrefetchCriticalData() {
  useEffect(() => {
    // Prefetch admin dashboard stats
    queryClient.prefetchQuery({
      queryKey: ['admin', 'stats'],
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Prefetch verification stats
    queryClient.prefetchQuery({
      queryKey: ['verifications', 'stats'],
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Prefetch referral stats
    queryClient.prefetchQuery({
      queryKey: ['referrals', 'stats'],
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Prefetch current user profile
    queryClient.prefetchQuery({
      queryKey: ['users', 'me'],
      staleTime: 1000 * 60 * 2, // 2 minutes
    });
    
    // Prefetch application settings
    queryClient.prefetchQuery({
      queryKey: ['settings', 'details'],
      staleTime: 1000 * 60 * 10, // 10 minutes
    });
    
    // Prefetch payment methods
    queryClient.prefetchQuery({
      queryKey: ['payment', 'admin'],
      staleTime: 1000 * 60 * 10, // 10 minutes
    });
  }, []);
}

/**
 * Custom hook to prefetch user-specific data when user navigates to a user detail page
 */
export function usePrefetchUserData(userId: string) {
  useEffect(() => {
    if (userId) {
      queryClient.prefetchQuery({
        queryKey: ['users', 'detail', userId],
        staleTime: 1000 * 60 * 5, // 5 minutes
      });
    }
  }, [userId]);
}

/**
 * Custom hook to prefetch admin dashboard specific data
 * This should be used when an admin logs in or navigates to the admin section
 */
export function usePrefetchAdminData() {
  useEffect(() => {
    // Prefetch subscription plans
    queryClient.prefetchQuery({
      queryKey: ['settings', 'subscriptionPlans'],
      staleTime: 1000 * 60 * 10, // 10 minutes
    });
    
    // Prefetch system configuration
    queryClient.prefetchQuery({
      queryKey: ['settings', 'systemConfig'],
      staleTime: 1000 * 60 * 10, // 10 minutes
    });
    
    // Prefetch admin user list
    queryClient.prefetchQuery({
      queryKey: ['admin', 'list'],
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
    
    // Prefetch admin stats
    queryClient.prefetchQuery({
      queryKey: ['admin', 'stats'],
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  }, []);
}
