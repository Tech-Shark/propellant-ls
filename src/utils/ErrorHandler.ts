/**
 * Centralized Error Handler
 * 
 * Provides user-friendly error messages for different error types
 * Handles network errors, authentication errors, and other common issues
 */

import { AxiosError } from 'axios';
import { toast } from 'sonner';

export interface ErrorResponse {
  message: string;
  friendlyMessage: string;
  statusCode?: number;
  shouldRetry: boolean;
}

/**
 * Check if device is mobile
 */
const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Check if error is a network error (no internet connection)
 */
const isNetworkError = (error: any): boolean => {
  return (
    !error.response && 
    (error.code === 'ERR_NETWORK' || 
     error.message === 'Network Error' ||
     error.code === 'ECONNABORTED')
  );
};

/**
 * Check if error is a CORS error
 */
const isCORSError = (error: any): boolean => {
  return (
    !error.response && 
    error.message?.toLowerCase().includes('cors')
  );
};

/**
 * Get user-friendly error message
 */
export const getErrorMessage = (error: any): ErrorResponse => {
  const isMobile = isMobileDevice();
  
  // Network/Connection errors
  if (isNetworkError(error)) {
    return {
      message: 'Network Error',
      friendlyMessage: isMobile
        ? "Connection failed. Please check your mobile data or WiFi connection and try again."
        : "Connection failed. Please check your internet connection and try again.",
      shouldRetry: true
    };
  }
  
  // CORS errors
  if (isCORSError(error)) {
    return {
      message: 'CORS Error',
      friendlyMessage: "There was a connection issue with the server. Please try again in a moment.",
      shouldRetry: true
    };
  }
  
  // Handle Axios errors with response
  if (error.response) {
    const status = error.response.status;
    const serverMessage = error.response.data?.message;
    
    switch (status) {
      case 400:
        return {
          message: serverMessage || 'Bad Request',
          friendlyMessage: serverMessage || "Please check your information and try again.",
          statusCode: 400,
          shouldRetry: false
        };
      
      case 401:
        return {
          message: serverMessage || 'Unauthorized',
          friendlyMessage: serverMessage || "Invalid email or password. Please try again.",
          statusCode: 401,
          shouldRetry: false
        };
      
      case 403:
        return {
          message: serverMessage || 'Forbidden',
          friendlyMessage: serverMessage || "You don't have permission to access this resource.",
          statusCode: 403,
          shouldRetry: false
        };
      
      case 404:
        return {
          message: serverMessage || 'Not Found',
          friendlyMessage: serverMessage || "The requested resource was not found.",
          statusCode: 404,
          shouldRetry: false
        };
      
      case 422:
        return {
          message: serverMessage || 'Validation Error',
          friendlyMessage: serverMessage || "Please check your information and try again.",
          statusCode: 422,
          shouldRetry: false
        };
      
      case 429:
        return {
          message: 'Too Many Requests',
          friendlyMessage: "Too many attempts. Please wait a moment and try again.",
          statusCode: 429,
          shouldRetry: true
        };
      
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          message: serverMessage || 'Server Error',
          friendlyMessage: serverMessage || "Our server encountered an error. Please try again in a moment.",
          statusCode: status,
          shouldRetry: true
        };
      
      default:
        return {
          message: serverMessage || 'Unknown Error',
          friendlyMessage: serverMessage || "Something went wrong. Please try again.",
          statusCode: status,
          shouldRetry: true
        };
    }
  }
  
  // Generic errors
  return {
    message: error.message || 'Unknown Error',
    friendlyMessage: "An unexpected error occurred. Please try again.",
    shouldRetry: true
  };
};

/**
 * Display error toast with user-friendly message
 */
export const displayErrorToast = (error: any, customMessage?: string): void => {
  const errorInfo = getErrorMessage(error);
  
  toast.error(customMessage || errorInfo.friendlyMessage, {
    description: process.env.NODE_ENV === 'development' 
      ? errorInfo.message 
      : undefined,
    duration: 5000
  });
};

/**
 * Handle authentication errors specifically
 */
export const handleAuthError = (error: any, context: 'login' | 'signup' | 'upload'): void => {
  const errorInfo = getErrorMessage(error);
  
  let contextMessage = '';
  switch (context) {
    case 'login':
      contextMessage = errorInfo.statusCode === 401 
        ? "Invalid credentials. Please check your email and password."
        : errorInfo.friendlyMessage;
      break;
    case 'signup':
      contextMessage = errorInfo.friendlyMessage;
      break;
    case 'upload':
      contextMessage = errorInfo.friendlyMessage + " Please ensure you're logged in and try again.";
      break;
  }
  
  displayErrorToast(error, contextMessage);
};
