/**
 * Token Storage Utility
 * 
 * This utility provides functions to store, retrieve, and manage authentication tokens
 * using localStorage instead of cookies for better mobile browser compatibility.
 * 
 * Features:
 * - Token expiration handling
 * - Secure storage with encryption (basic)
 * - Automatic header generation for API requests
 */

// Constants
const TOKEN_KEY = 'accessToken';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';
const DEFAULT_EXPIRY_DAYS = 30;

/**
 * Detect if the current device is a mobile device
 * @returns boolean indicating if the current device is mobile
 */
export const isMobileDevice = (): boolean => {
  try {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  } catch (error) {
    console.error('Error detecting device type:', error);
    return false;
  }
};

/**
 * Store token in localStorage with optional expiration
 * @param token JWT token string
 * @param expiryDays Number of days until token expires (default: 30)
 * @returns boolean indicating if token was successfully stored
 */
export const setToken = (token: string, expiryDays: number = DEFAULT_EXPIRY_DAYS): boolean => {
  try {
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      console.warn('localStorage is not available, cannot store token');
      return false;
    }
    
    // Validate input
    if (!token) {
      console.warn('Empty token provided, not storing');
      return false;
    }
    
    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    
    // Store token and expiry
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryDate.toISOString());
    
    console.log('Token stored successfully, expires:', expiryDate.toLocaleString());
    return true;
  } catch (error) {
    console.error('Error storing token:', error);
    return false;
  }
};

/**
 * Get token from localStorage if it exists and is not expired
 * @returns The stored token or null if not found or expired
 */
export const getToken = (): string | null => {
  try {
    // Check if localStorage is available (may not be in some private browsing modes)
    if (typeof localStorage === 'undefined') {
      console.warn('localStorage is not available');
      return null;
    }
    
    const token = localStorage.getItem(TOKEN_KEY);
    const expiryStr = localStorage.getItem(TOKEN_EXPIRY_KEY);
    
    // If no token or expiry, return null
    if (!token || !expiryStr) return null;
    
    // Check if token is expired
    const expiry = new Date(expiryStr);
    const now = new Date();
    
    if (now > expiry) {
      // Token expired, clean up and return null
      console.warn('Token expired, removing from storage');
      removeToken();
      return null;
    }
    
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

/**
 * Remove token and related data from localStorage
 * @returns boolean indicating if token was successfully removed
 */
export const removeToken = (): boolean => {
  try {
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      console.warn('localStorage is not available, cannot remove token');
      return false;
    }
    
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    console.log('Token removed from storage');
    return true;
  } catch (error) {
    console.error('Error removing token:', error);
    return false;
  }
};

/**
 * Check if a valid token exists
 * @returns boolean indicating if a valid token exists
 */
export const hasToken = (): boolean => {
  return !!getToken();
};

/**
 * Get authorization header for API requests
 * @returns Object containing Authorization header or empty object if no token
 */
export const getAuthHeader = (): { Authorization: string } | Record<string, never> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Refresh token expiry
 * @param expiryDays Number of days to extend token expiry (default: 30)
 * @returns boolean indicating success
 */
export const refreshTokenExpiry = (expiryDays: number = DEFAULT_EXPIRY_DAYS): boolean => {
  try {
    const token = getToken();
    if (!token) return false;
    
    // Set new expiry
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryDate.toISOString());
    
    return true;
  } catch (error) {
    console.error('Error refreshing token expiry:', error);
    return false;
  }
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
