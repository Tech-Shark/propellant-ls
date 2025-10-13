/**
 * Centralized logging utility with environment-aware log levels
 * 
 * SECURITY: Production builds should strip all console.log statements
 * to prevent information disclosure via browser console.
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

/**
 * Sanitize sensitive data from objects before logging
 */
const sanitizeData = (data: any): any => {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sensitiveKeys = [
    'password',
    'token',
    'accessToken',
    'refreshToken',
    'apiKey',
    'secret',
    'authorization',
    'cookie',
    'sessionId',
  ];

  const sanitized = Array.isArray(data) ? [...data] : { ...data };

  Object.keys(sanitized).forEach((key) => {
    const lowerKey = key.toLowerCase();
    if (sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  });

  return sanitized;
};

/**
 * Logger utility with environment-aware logging
 */
export const logger = {
  /**
   * Debug-level logging - only in development
   */
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[DEBUG]', ...args.map(sanitizeData));
    }
  },

  /**
   * Info-level logging - development and test only
   */
  info: (...args: any[]) => {
    if (isDevelopment || isTest) {
      console.info('[INFO]', ...args.map(sanitizeData));
    }
  },

  /**
   * Warning-level logging - always logged but sanitized
   */
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args.map(sanitizeData));
  },

  /**
   * Error-level logging - always logged but sanitized
   */
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args.map(sanitizeData));
  },

  /**
   * Log API responses (development only)
   */
  apiResponse: (endpoint: string, data: any) => {
    if (isDevelopment) {
      console.log(`[API Response] ${endpoint}:`, sanitizeData(data));
    }
  },

  /**
   * Log API requests (development only)
   */
  apiRequest: (method: string, endpoint: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[API Request] ${method.toUpperCase()} ${endpoint}`, data ? sanitizeData(data) : '');
    }
  },
};

export default logger;
