import { hasToken, getToken } from './TokenStorage';

/**
 * Interface for authenticated user information
 */
export interface AuthUser {
  role: string;
  id: string;
  email: string;
  isAuthenticated: boolean;
}

/**
 * Check if the current user is authenticated
 * @returns boolean indicating if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return hasToken();
};

/**
 * Check if the current token has the specified role
 * (Note: This doesn't verify with the backend, just checks the stored user data)
 * 
 * @param role The role to check
 * @returns boolean indicating if user has the role
 */
export const hasRole = (role: string): boolean => {
  try {
    const userData = localStorage.getItem('user');
    if (!userData) return false;
    
    const user = JSON.parse(userData);
    return user && user.role === role;
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
};

/**
 * Get the current authenticated user info from localStorage
 * @returns AuthUser object or null if not authenticated
 */
export const getAuthUser = (): AuthUser | null => {
  try {
    if (!isAuthenticated()) return null;
    
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    
    const user = JSON.parse(userData);
    return {
      role: user.role,
      id: user.id,
      email: user.email,
      isAuthenticated: true
    };
  } catch (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
};

/**
 * Redirect to the appropriate dashboard based on user role
 * @returns The redirect path
 */
export const getDashboardPath = (): string => {
  try {
    const userData = localStorage.getItem('user');
    if (!userData) return '/login';
    
    const user = JSON.parse(userData);
    switch (user.role) {
      case 'TALENT':
        return '/talent';
      case 'ORGANIZATION':
        return '/organization';
      case 'ADMIN':
        return '/admin';
      default:
        return '/';
    }
  } catch (error) {
    console.error('Error determining dashboard path:', error);
    return '/login';
  }
};