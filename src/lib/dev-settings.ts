// This file contains development settings and feature flags

/**
 * Development feature flags
 * These flags control development-specific behaviors
 */
export const DevSettings = {
  // Set to false to use real backend API calls
  useMockData: false,
  
  // Controls if console logs are enabled for API calls
  enableApiLogs: true,
  
  // Simulates API delay in milliseconds (only for mock data)
  mockApiDelayMs: 800,
};
