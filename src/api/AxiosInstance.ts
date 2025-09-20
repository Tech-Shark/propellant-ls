import axios from 'axios';
import { getToken, removeToken, isMobileDevice, getAuthErrorMessage } from '@/utils/TokenStorage';

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

// Add Access-Control-Allow-Origin header to help with CORS issues on mobile browsers
axiosInstance.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

// Request interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = getToken();
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
            console.log('Auth token found and set in request header');
        } else {
            console.warn('No auth token found! Authentication may fail.');
        }
        
        // Log all request headers for debugging
        console.log('Request headers:', config.headers);
        
        // For POST requests, log the request body
        if (config.method?.toLowerCase() === 'post' && config.data) {
            console.log('Request data:', typeof config.data === 'string' ? JSON.parse(config.data) : config.data);
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
            error.friendlyMessage = getAuthErrorMessage(error);
            return Promise.reject(error);
        }
        
        // Add retry count tracking
        if (!originalRequest._retryCount) {
            originalRequest._retryCount = 0;
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
            await new Promise(resolve => setTimeout(resolve, retryConfig.retryDelay * originalRequest._retryCount));
            
            // Adjust timeout for mobile devices (mobile networks might be slower)
            if (isMobileDevice() && originalRequest._retryCount > 1) {
                originalRequest.timeout = 45000; // Increase timeout for mobile retries
            }
            
            // Return the retry request
            return axiosInstance(originalRequest);
        }

        // Special handling for authentication errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Avoid login loops - check if we're already on the login page
            if (!window.location.pathname.includes('/login')) {
                clearSessionAndRedirect();
            }
        }
        
        // Add user-friendly error message
        error.friendlyMessage = getAuthErrorMessage(error);

        return Promise.reject(error);
    }
);

// Utility function to clear session and redirect to login
const clearSessionAndRedirect = () => {
    try {
        // Remove token
        removeToken();
        
        // Clear user data
        localStorage.removeItem("user");
        
        // Show notification if we have access to UI libraries
        console.log('Session expired or invalid. Redirecting to login page...');
        
        // Redirect with a slight delay to allow console messages to be seen
        setTimeout(() => {
            // Check if we're already on the login page to prevent redirect loops
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }, 100);
    } catch (error) {
        console.error('Error during session cleanup:', error);
        // Force redirect even if there's an error
        window.location.href = '/login';
    }
};



export default axiosInstance;
