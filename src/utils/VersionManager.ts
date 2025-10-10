/**
 * Version Manager
 * 
 * Manages application version and clears old cache/cookies when version changes.
 * This ensures users always have the latest version without stale data issues.
 */

const APP_VERSION = '2.1.0'; // Increment this when you want to force clear old data
const VERSION_KEY = 'app_version';

/**
 * Check if app version has changed and clear old data if needed
 */
export const checkAndClearOldVersion = (): boolean => {
  try {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    
    if (storedVersion !== APP_VERSION) {
      console.log(`Version changed from ${storedVersion} to ${APP_VERSION}. Clearing old data...`);
      clearOldData();
      localStorage.setItem(VERSION_KEY, APP_VERSION);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking version:', error);
    return false;
  }
};

/**
 * Clear all old authentication and cache data
 */
const clearOldData = (): void => {
  try {
    // Clear all localStorage except version key
    const keysToPreserve = [VERSION_KEY];
    const allKeys = Object.keys(localStorage);
    
    allKeys.forEach(key => {
      if (!keysToPreserve.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear all cookies (including fallback cookies)
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const cookieName = cookie.split('=')[0].trim();
      // Clear cookie with multiple path and domain combinations to ensure complete cleanup
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    });
    
    // Clear cookie fallbacks from all storage
    try {
      const allLocalStorageKeys = Object.keys(localStorage);
      allLocalStorageKeys.forEach(key => {
        if (key.startsWith('cookie_fallback_') && !keysToPreserve.includes(key)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing cookie fallbacks:', error);
    }
    
    console.log('Old data cleared successfully');
  } catch (error) {
    console.error('Error clearing old data:', error);
  }
};

/**
 * Get current app version
 */
export const getCurrentVersion = (): string => {
  return APP_VERSION;
};

/**
 * Force clear all data (useful for logout or troubleshooting)
 */
export const forceClearAllData = (): void => {
  clearOldData();
  localStorage.setItem(VERSION_KEY, APP_VERSION);
};
