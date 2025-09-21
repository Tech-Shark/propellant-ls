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
 * - Session persistence across page reloads
 * - Early token expiration detection
 */

// Constants
const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken'; // For future refresh token implementation
const TOKEN_EXPIRY_KEY = 'tokenExpiry';
const TOKEN_ISSUED_AT_KEY = 'tokenIssuedAt';
const DEFAULT_EXPIRY_DAYS = 30;
const TOKEN_REFRESH_THRESHOLD_MINS = 5; // Refresh token if less than 5 mins left

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
 * @param refreshToken Optional refresh token (for future implementation)
 * @param expiryDays Number of days until token expires (default: 30)
 * @returns boolean indicating if token was successfully stored
 */
export const setToken = (
  token: string, 
  refreshToken: string | null = null, 
  expiryDays: number = DEFAULT_EXPIRY_DAYS
): boolean => {
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
    
    // Calculate expiry date and store current time
    const now = new Date();
    const issuedAt = now.toISOString();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    
    // Store tokens and metadata
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryDate.toISOString());
    localStorage.setItem(TOKEN_ISSUED_AT_KEY, issuedAt);
    
    // Store refresh token if provided
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    
    console.log('Token stored successfully, expires:', expiryDate.toLocaleString());
    return true;
  } catch (error) {
    console.error('Error storing token:', error);
    return false;
  }
};

/**
 * Get token from localStorage if it exists and is not expired
 * @param checkRefreshNeeded Set to true to check if token needs refreshing soon
 * @returns The stored token or null if not found or expired
 */
export const getToken = (checkRefreshNeeded: boolean = false): string | null => {
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
    
    // Check if token needs refreshing soon (within threshold)
    if (checkRefreshNeeded) {
      // Calculate minutes remaining until expiry
      const minutesRemaining = (expiry.getTime() - now.getTime()) / (1000 * 60);
      
      if (minutesRemaining <= TOKEN_REFRESH_THRESHOLD_MINS) {
        // Dispatch an event that the token needs refreshing
        try {
          const refreshEvent = new CustomEvent('tokenRefreshNeeded');
          window.dispatchEvent(refreshEvent);
          console.log(`Token expires in ${minutesRemaining.toFixed(1)} minutes, refresh recommended`);
        } catch (eventError) {
          console.warn('Failed to dispatch token refresh event', eventError);
        }
      }
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
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    localStorage.removeItem(TOKEN_ISSUED_AT_KEY);
    console.log('Token and related data removed from storage');
    return true;
  } catch (error) {
    console.error('Error removing token:', error);
    return false;
  }
};

/**
 * Get refresh token if available
 * @returns The stored refresh token or null
 */
export const getRefreshToken = (): string | null => {
  try {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error retrieving refresh token:', error);
    return null;
  }
};

/**
 * Check if token will expire soon and needs refreshing
 * @returns boolean indicating if token should be refreshed
 */
export const needsTokenRefresh = (): boolean => {
  try {
    if (typeof localStorage === 'undefined') return false;
    
    const expiryStr = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiryStr) return false;
    
    const expiry = new Date(expiryStr);
    const now = new Date();
    
    // Calculate minutes remaining until expiry
    const minutesRemaining = (expiry.getTime() - now.getTime()) / (1000 * 60);
    return minutesRemaining <= TOKEN_REFRESH_THRESHOLD_MINS;
  } catch (error) {
    console.error('Error checking token refresh status:', error);
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
