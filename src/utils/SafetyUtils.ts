import { toast } from "sonner";
import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html The HTML content to sanitize
 * @returns Sanitized HTML string
 */
export const sanitizeHTML = (html: string): string => {
  // Configure DOMPurify to allow certain tags and attributes
  const config = {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'br', 'hr',
      'ul', 'ol', 'li', 'a', 'strong', 'em', 'b', 'i', 'u', 'img', 'table',
      'thead', 'tbody', 'tr', 'th', 'td', 'section', 'article', 'header',
      'footer', 'small', 'mark', 'sub', 'sup'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'style', 'id', 
      'target', 'rel', 'width', 'height'
    ],
    KEEP_CONTENT: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM_IMPORT: false,
    WHOLE_DOCUMENT: false,
    SANITIZE_DOM: true
  };
  
  return DOMPurify.sanitize(html, config);
};

/**
 * Shows a friendly error message for different error types
 * @param error The error object
 * @param defaultMessage Default message to show if error can't be parsed
 */
export const showFriendlyError = (error: any, defaultMessage = "Something went wrong"): void => {
  let errorMessage = defaultMessage;
  
  // Try to extract meaningful error message
  if (error?.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error?.message) {
    errorMessage = error.message;
  } else if (error?.friendlyMessage) {
    errorMessage = error.friendlyMessage;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  // For network errors, provide more helpful message
  if (
    errorMessage.includes('Network Error') || 
    errorMessage.includes('CORS') ||
    errorMessage.includes('Failed to fetch')
  ) {
    errorMessage = "Connection issue. Please check your internet connection and try again.";
    
    // Specific message for mobile
    if (navigator.userAgent.match(/Android|iPhone|iPad|iPod|mobile|tablet/i)) {
      errorMessage = "Connection issue. If you're on mobile, try switching to WiFi or using a different browser.";
    }
  }
  
  toast.error(errorMessage, {
    duration: 4000,
    id: 'error-toast' // Prevent duplicate toasts for the same error
  });
};

/**
 * Handles form validation errors and shows appropriate messages
 * @param error Validation error object
 */
export const handleFormValidationErrors = (error: any): void => {
  if (error?.errors && Array.isArray(error.errors)) {
    // Handle multiple validation errors
    error.errors.forEach((err: any) => {
      toast.error(err.message || "Invalid form input", { duration: 3000 });
    });
  } else if (error?.message) {
    toast.error(error.message, { duration: 3000 });
  } else {
    toast.error("Please check your form inputs and try again", { duration: 3000 });
  }
};

/**
 * Detects if the user is on a mobile device
 * @returns Boolean indicating if user is on mobile
 */
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Creates a throttled function that only invokes the provided function at most once per specified interval
 * @param func The function to throttle
 * @param delay The number of milliseconds to throttle invocations to
 * @returns A new, throttled, function
 */
export const throttle = (func: Function, delay: number) => {
  let lastCall = 0;
  return function(...args: any[]) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
};

export default {
  sanitizeHTML,
  showFriendlyError,
  handleFormValidationErrors,
  isMobileDevice,
  throttle
};