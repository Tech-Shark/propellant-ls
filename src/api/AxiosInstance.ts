import axios from 'axios';
import { getToken, removeToken, isMobileDevice } from '@/utils/TokenStorage';
import { getErrorMessage } from '@/utils/ErrorHandler';

// Define retry configuration type and values
interface RetryConfig {
    retries: number;
    retryDelay: number;
    retryCondition: (error: any) => boolean;
}

const retryConfig: RetryConfig = {
    retries: 3,
    retryDelay: 1000,
    retryCondition: (error) => {
        return !error.response || error.code === 'ECONNABORTED' || error.response.status >= 500;
    }
};

// Create Axios instance
const axiosInstance = axios.create({
    baseURL: "https://propellanthr.fly.dev/api/v1",
    headers: {
        'Content-Type': 'application/json',
    },
    // Add reasonable timeouts for mobile networks
    timeout: 30000, // 30 seconds
});

// ensure all requests send credentials (cookies, Authorization header, etc.)
axiosInstance.defaults.withCredentials = true;
// Only set this for the same origin, not for all axios instances
// axios.defaults.withCredentials = true;

// CORS is handled by the server, not the client
// Removed incorrect Access-Control-Allow-Origin header which was causing preflight errors

// Request interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        // Skip token check for authentication requests
        const isAuthRequest = config.url?.includes('auth/') || false;
        
        // Check token with refresh check for non-auth requests
        const accessToken = getToken(!isAuthRequest);
        
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
            
            // Only log auth headers in development
            if (process.env.NODE_ENV !== 'production') {
                console.log('Auth token found and set in request header');
            }
        } else if (!isAuthRequest) {
            // Only warn for non-auth requests that should have a token
            console.warn('No auth token found! Authentication may fail.');
        }
        
        // Only log headers in development
        if (process.env.NODE_ENV !== 'production') {
            // Log all request headers for debugging but sanitize Authorization
            const sanitizedHeaders = {...config.headers};
            if (sanitizedHeaders.Authorization) {
                sanitizedHeaders.Authorization = 'Bearer [REDACTED]';
            }
            console.log('Request headers:', sanitizedHeaders);
            
            // For POST requests, log the request body (excluding sensitive data for security)
            if (config.method?.toLowerCase() === 'post' && config.data && !config.url?.includes('login')) {
                // Don't log sensitive data like passwords
                console.log('Request to:', config.url);
                const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
                
                // Create a safe copy of the data for logging (exclude passwords)
                const safeData = {...data};
                if (safeData.password) safeData.password = '********';
                if (safeData.token) safeData.token = '[REDACTED]';
                if (safeData.accessToken) safeData.accessToken = '[REDACTED]';
                if (safeData.refreshToken) safeData.refreshToken = '[REDACTED]';
                console.log('Request data (sanitized):', safeData);
            }
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor with retry logic for mobile networks
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Make sure we have a config object even in network errors
        if (!originalRequest && error.message) {
            console.error('Network error without config:', error.message);
            const errorInfo = getErrorMessage(error);
            error.friendlyMessage = errorInfo.friendlyMessage;
            return Promise.reject(error);
        }
        
        // Add retry count tracking
        if (!originalRequest._retryCount) {
            originalRequest._retryCount = 0;
        }
        
        // Prevent retrying on authentication errors - will just waste resources
        if (error.response?.status === 401) {
            const errorInfo = getErrorMessage(error);
            
            // If this is an authentication request that failed, don't retry it
            if (originalRequest.url?.includes('auth/login')) {
                error.friendlyMessage = errorInfo.friendlyMessage;
                return Promise.reject(error);
            }
            
            // For other 401 errors, handle auth expiration
            if (!originalRequest._retry) {
                originalRequest._retry = true;
                
                // Avoid login loops - check if we're already on the login page
                if (!window.location.pathname.includes('/login')) {
                    // Skip toast notifications if we're directly accessing a protected route 
                    // (likely haven't logged in yet)
                    const silentRedirect = !sessionStorage.getItem("wasAuthenticated");
                    clearSessionAndRedirect(silentRedirect);
                }
            }
            
            // Don't retry auth failures
            error.friendlyMessage = errorInfo.friendlyMessage;
            return Promise.reject(error);
        }
        
        // Check if we should retry the request
        const shouldRetry = 
            originalRequest._retryCount < retryConfig.retries && 
            retryConfig.retryCondition(error);
            
        if (shouldRetry) {
            originalRequest._retryCount++;
            
            // Log the retry attempt
            console.log(`Retrying request (${originalRequest._retryCount}/${retryConfig.retries}): ${originalRequest.url}`);
            
            // Wait before retrying (exponential backoff)
            const backoffDelay = retryConfig.retryDelay * Math.pow(2, originalRequest._retryCount - 1);
            await new Promise(resolve => setTimeout(resolve, backoffDelay));
            
            // Adjust timeout for mobile devices (mobile networks might be slower)
            if (isMobileDevice() && originalRequest._retryCount > 1) {
                originalRequest.timeout = 45000; // Increase timeout for mobile retries
            }
            
            // Return the retry request
            return axiosInstance(originalRequest);
        }
        
        // Add user-friendly error message
        const errorInfo = getErrorMessage(error);
        error.friendlyMessage = errorInfo.friendlyMessage;

        return Promise.reject(error);
    }
);

// Last redirect timestamp to prevent multiple redirects in quick succession
let lastRedirectTimestamp = 0;

// Utility function to clear session and redirect to login
const clearSessionAndRedirect = (silentRedirect = false) => {
    try {
        // Prevent multiple redirects within a short timeframe (1 second)
        const now = Date.now();
        if (now - lastRedirectTimestamp < 1000) {
            console.log('Redirect prevented: too soon after last redirect');
            return;
        }
        lastRedirectTimestamp = now;
        
        // Public routes don't need to redirect
        const publicRoutes = ['/login', '/forgot-password', '/reset-password', '/privacypolicy'];
        if (publicRoutes.some(route => window.location.pathname.includes(route))) {
            console.log('Already on a public route, skipping redirect');
            return;
        }
        
        // Remove token
        removeToken();
        
        // Clear user data
        localStorage.removeItem("user");
        
        // Clear was authenticated flag if doing silent redirect
        if (silentRedirect) {
            sessionStorage.removeItem("wasAuthenticated");
        }
        
        // Log the redirection
        console.log(silentRedirect ? 
            'Redirecting to login page (silent)...' : 
            'Session expired or invalid. Redirecting to login page...');
        
        // Store the current URL to redirect back after login
        try {
            if (!silentRedirect) {
                sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
            }
        } catch (e) {
            console.warn('Failed to save redirect URL:', e);
        }
        
        // Redirect immediately for silent redirects, with delay for visible ones
        const delay = silentRedirect ? 0 : 100;
        setTimeout(() => {
            // Check if we're already on the login page to prevent redirect loops
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }, delay);
    } catch (error) {
        console.error('Error during session cleanup:', error);
        // Force redirect even if there's an error
        if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
        }
    }
};



export default axiosInstance;
