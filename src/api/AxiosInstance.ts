import axios from 'axios';
import Cookie from 'js-cookie';
import {getCookie} from "@/utils/CookieManagement";

// Create Axios instance
const axiosInstance = axios.create({
    baseURL: "https://propellanthr.fly.dev/api/v1",
    headers: {
        'Content-Type': 'application/json',
    },
});

// ensure all requests send credentials (cookies, Authorization header, etc.)
axiosInstance.defaults.withCredentials = true;
axios.defaults.withCredentials = true;

// Request interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = getCookie('accessToken');
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

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            clearSessionAndRedirect();
        }

        return Promise.reject(error);
    }
);

// Utility function to clear session and redirect to login
const clearSessionAndRedirect = () => {
    Cookie.remove('accessToken');
    window.location.href = '/login';
};



export default axiosInstance;
