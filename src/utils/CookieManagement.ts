import Cookie from "js-cookie";

/**
 * Enhanced Cookie Management with multi-layer fallback
 * Supports Chrome, Opera Mini, and all major browsers
 * Includes secure cookie handling with localStorage fallback
 */

export const setCookie = (name: string, value: string) => {
    try {
        // Use same-site attribute to help with cross-site issues on mobile browsers
        // Use secure attribute only in production
        const isSecure = window.location.protocol === 'https:';
        
        // Try to set cookie with optimal settings
        Cookie.set(
            name,
            value,
            {
                expires: 30, // 30 days instead of 1 for better persistence
                path: '/',
                sameSite: 'lax', // Less restrictive than 'strict' to work on mobile
                secure: isSecure, // Only send over HTTPS when in production
            }
        );
        
        // Multi-layer fallback storage for browsers with restrictive cookie policies
        // This ensures authentication works even in Opera Mini, Chrome incognito, etc.
        if (window.localStorage) {
            try {
                window.localStorage.setItem(`cookie_fallback_${name}`, value);
                window.localStorage.setItem(`cookie_fallback_${name}_timestamp`, Date.now().toString());
            } catch (storageError) {
                console.warn('localStorage fallback failed:', storageError);
            }
        }
        
        // Additional fallback for sessionStorage
        if (window.sessionStorage) {
            try {
                window.sessionStorage.setItem(`cookie_fallback_${name}`, value);
            } catch (sessionError) {
                console.warn('sessionStorage fallback failed:', sessionError);
            }
        }
    } catch (error) {
        console.error('Error setting cookie:', error);
        // Even if cookie setting fails, try to save to localStorage
        try {
            if (window.localStorage) {
                window.localStorage.setItem(`cookie_fallback_${name}`, value);
            }
        } catch (fallbackError) {
            console.error('All storage methods failed:', fallbackError);
        }
    }
};

export const getCookie = (name: string) => {
    try {
        // First try to get from cookie
        const cookieValue = Cookie.get(name);
        
        // If found in cookie, return it
        if (cookieValue) {
            return cookieValue;
        }
        
        // Try localStorage fallback
        if (window.localStorage) {
            const localValue = window.localStorage.getItem(`cookie_fallback_${name}`);
            if (localValue) {
                return localValue;
            }
        }
        
        // Try sessionStorage fallback
        if (window.sessionStorage) {
            const sessionValue = window.sessionStorage.getItem(`cookie_fallback_${name}`);
            if (sessionValue) {
                return sessionValue;
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error getting cookie:', error);
        // Try all fallbacks if cookie access fails
        try {
            if (window.localStorage) {
                const localValue = window.localStorage.getItem(`cookie_fallback_${name}`);
                if (localValue) return localValue;
            }
            if (window.sessionStorage) {
                return window.sessionStorage.getItem(`cookie_fallback_${name}`);
            }
        } catch (fallbackError) {
            console.error('All retrieval methods failed:', fallbackError);
        }
        return null;
    }
};

/**
 * Remove cookie and all fallback storage
 */
export const removeCookie = (name: string) => {
    try {
        Cookie.remove(name, { path: '/' });
        
        if (window.localStorage) {
            window.localStorage.removeItem(`cookie_fallback_${name}`);
            window.localStorage.removeItem(`cookie_fallback_${name}_timestamp`);
        }
        
        if (window.sessionStorage) {
            window.sessionStorage.removeItem(`cookie_fallback_${name}`);
        }
    } catch (error) {
        console.error('Error removing cookie:', error);
    }
};