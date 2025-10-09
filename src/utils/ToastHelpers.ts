/**
 * Toast Helpers
 * 
 * Provides consistent toast notification handling with proper error messages
 * across the entire application.
 */

import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';
import { getErrorMessage } from './ErrorHandler';

interface ToastPromiseOptions<T> {
  loadingMessage?: string;
  successMessage?: string | ((data: T) => string);
  errorMessage?: string | ((error: any) => string);
  context?: 'login' | 'signup' | 'upload' | 'update' | 'delete' | 'generic';
}

/**
 * Wrapper for toast.promise that ensures consistent error handling
 * 
 * @param promise The promise to track
 * @param options Configuration for toast messages
 * @returns The original promise
 */
export const toastPromise = <T>(
  promise: Promise<T>,
  options: ToastPromiseOptions<T> = {}
): Promise<T> => {
  const {
    loadingMessage = 'Loading...',
    successMessage = 'Success!',
    errorMessage,
    context = 'generic'
  } = options;

  // Use sonner's toast.promise and return the original promise
  toast.promise(promise, {
    loading: loadingMessage,
    success: (data: T) => {
      if (typeof successMessage === 'function') {
        return successMessage(data);
      }
      
      // Try to extract message from response data
      if (data && typeof data === 'object' && 'data' in data) {
        const responseData = (data as any).data;
        if (responseData?.message) {
          return responseData.message;
        }
      }
      
      return successMessage;
    },
    error: (error: any) => {
      console.error(`Toast promise error (${context}):`, error);
      
      // Custom error message function
      if (typeof errorMessage === 'function') {
        return errorMessage(error);
      }
      
      // Custom error message string
      if (errorMessage) {
        return errorMessage;
      }
      
      // Get standardized error message
      const errorInfo = getErrorMessage(error);
      
      // Context-specific error messages
      let contextMessage = errorInfo.friendlyMessage;
      
      if (axios.isAxiosError(error)) {
        // Always prefer backend error message
        const backendMessage = error.response?.data?.message;
        if (backendMessage) {
          return backendMessage;
        }
        
        // Network errors
        if (!error.response) {
          switch (context) {
            case 'login':
              return 'Connection failed during login. Please check your internet and try again.';
            case 'signup':
              return 'Connection failed during registration. Please check your internet and try again.';
            case 'upload':
              return 'Connection failed during upload. Please check your internet and try again.';
            default:
              return errorInfo.friendlyMessage;
          }
        }
        
        // Add context to error messages when appropriate
        switch (context) {
          case 'login':
            if (error.response?.status === 401) {
              return 'Invalid email or password. Please try again.';
            }
            break;
          case 'signup':
            if (error.response?.status === 400 || error.response?.status === 422) {
              return backendMessage || 'Please check your information and try again.';
            }
            break;
          case 'upload':
            if (error.response?.status === 413) {
              return 'File is too large. Please choose a smaller file.';
            }
            break;
        }
      }
      
      return contextMessage;
    },
  });
  
  // Return the original promise so it can be awaited
  return promise;
};

/**
 * Show success toast with consistent styling
 */
export const showSuccess = (message: string, duration = 3000) => {
  toast.success(message, { duration });
};

/**
 * Show error toast with consistent styling
 */
export const showError = (message: string, duration = 5000) => {
  toast.error(message, { duration });
};

/**
 * Show warning toast with consistent styling
 */
export const showWarning = (message: string, duration = 4000) => {
  toast.warning(message, { duration });
};

/**
 * Show info toast with consistent styling
 */
export const showInfo = (message: string, duration = 3000) => {
  toast.info(message, { duration });
};

/**
 * Extract error message from any error type
 */
export const extractErrorMessage = (error: any, fallback = 'An error occurred'): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 
           (error as any).friendlyMessage || 
           error.message || 
           fallback;
  }
  
  if (error instanceof Error) {
    return error.message || fallback;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return fallback;
};
