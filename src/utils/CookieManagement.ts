import Cookie from "js-cookie";

export const setCookie = (name: string, value: string) => {
    try {
        // Use same-site attribute to help with cross-site issues on mobile browsers
        // Use secure attribute only in production
        const isSecure = window.location.protocol === 'https:';
        
        Cookie.set(
            name,
            value,
            {
                expires: 1,
                path: '/',
                sameSite: 'lax', // Less restrictive than 'strict' to work on mobile
                secure: isSecure, // Only send over HTTPS when in production
            }
        );
        
        // Fallback storage for browsers with restrictive cookie policies (like Opera Mini)
        if (window.localStorage) {
            window.localStorage.setItem(`cookie_fallback_${name}`, value);
        }
    } catch (error) {
        console.error('Error setting cookie:', error);
    }
};

export const getCookie = (name: string) => {
    try {
        // First try to get from cookie
        const cookieValue = Cookie.get(name);
        
        // If not found and we have localStorage, try the fallback
        if (!cookieValue && window.localStorage) {
            return window.localStorage.getItem(`cookie_fallback_${name}`);
        }
        
        return cookieValue;
    } catch (error) {
        console.error('Error getting cookie:', error);
        // Try localStorage as fallback if cookie access fails
        if (window.localStorage) {
            return window.localStorage.getItem(`cookie_fallback_${name}`);
        }
        return null;
    }
};