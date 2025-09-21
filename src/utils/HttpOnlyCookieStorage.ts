/**
 * HttpOnly Cookie Token Storage
 * 
 * This utility provides a secure way to handle authentication using HttpOnly cookies.
 * HttpOnly cookies provide better security against XSS attacks compared to localStorage.
 * 
 * This requires the backend to be configured to set and clear HttpOnly cookies.
 * Mobile support: Modern mobile browsers support HttpOnly cookies.
 */

import axios from 'axios';
import { isMobileDevice } from './TokenStorage';
import axiosInstance from '@/api/AxiosInstance';

// Constants
const TOKEN_ENDPOINT = '/auth/refresh-token';
const LOGOUT_ENDPOINT = '/auth/logout';

/**
 * Check if the user has a valid session cookie
 * We do this by making a lightweight request to the refresh token endpoint
 * @returns Promise<boolean> indicating if the user has a valid session
 */
export const hasValidSession = async (): Promise<boolean> => {
  try {
    const response = await axiosInstance.get(TOKEN_ENDPOINT);
    return response.status === 200;
  } catch (error) {
    console.log('No valid session found');
    return false;
  }
};

/**
 * Make a request to the backend to set an HttpOnly cookie
 * @param email User's email
 * @param password User's password
 * @returns Success status and any error message
 */
export const loginWithHttpOnlyCookie = async (
  email: string, 
  password: string
): Promise<{ success: boolean, message?: string }> => {
  try {
    await axiosInstance.post('/auth/login', {
      email,
      password,
      useCookies: true // Tell backend to use HttpOnly cookies
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error logging in with HttpOnly cookie:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Login failed'
    };
  }
};

/**
 * Clear the HttpOnly cookie by calling the logout endpoint
 * @returns Success status
 */
export const clearHttpOnlyCookie = async (): Promise<boolean> => {
  try {
    await axiosInstance.post(LOGOUT_ENDPOINT);
    return true;
  } catch (error) {
    console.error('Error clearing HttpOnly cookie:', error);
    return false;
  }
};

/**
 * Get authentication header for API requests
 * With HttpOnly cookies, the browser automatically sends the cookies
 * with each request to the same domain, so no explicit header is needed
 * @returns Empty object since cookies are automatically sent
 */
export const getAuthHeaderForHttpOnlyCookie = (): Record<string, never> => {
  return {};
};

/**
 * Get a user-friendly error message for authentication failures
 * @param error The error object
 * @returns A user-friendly error message
 */
export const getAuthErrorMessage = (error: any): string => {
  // Check if we're on a mobile device
  const isMobile = isMobileDevice();
  
  // Network error
  if (!error.response) {
    return isMobile
      ? "Connection failed. Please check your mobile data or WiFi connection."
      : "Network error. Please check your internet connection.";
  }
  
  // Handle specific error status codes
  switch (error.response?.status) {
    case 401:
      return "Your session has expired. Please login again.";
    case 403:
      return "You don't have permission to access this resource.";
    case 404:
      return "The requested resource was not found.";
    case 500:
      return "Our server encountered an error. Please try again later.";
    default:
      // Get message from response if available
      const serverMessage = error.response?.data?.message;
      if (serverMessage) return serverMessage;
      
      return "An error occurred. Please try again later.";
  }
};

/**
 * NOTE: To implement HttpOnly cookies for authentication,
 * the backend needs these endpoints:
 * 
 * 1. POST /auth/login - Accepts email/password and sets HttpOnly cookie
 * 2. POST /auth/logout - Clears the HttpOnly cookie
 * 3. GET /auth/refresh-token - Refreshes token if session is valid
 * 
 * The backend should be configured with the proper CORS settings:
 * - credentials: true
 * - Proper origin configuration
 * 
 * Example backend cookie setting (NestJS):
 * ```
 * response.cookie('token', token, {
 *   httpOnly: true,
 *   secure: process.env.NODE_ENV === 'production',
 *   sameSite: 'strict',
 *   maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
 * });
 * ```
 */