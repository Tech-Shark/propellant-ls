import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types/user";
import axiosInstance from "@/api/AxiosInstance.ts";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useOTPContext } from "@/context/OTPContext.tsx";
import {
  getToken,
  setToken,
  removeToken,
  isMobileDevice,
} from "@/utils/TokenStorage";

// Extended AxiosError type to include our custom friendlyMessage
interface ExtendedAxiosError extends AxiosError {
  friendlyMessage?: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ status: boolean; userRole: string }>;
  register: (
    phone: string,
    email: string,
    password: string,
    termsAndConditionsAccepted: boolean,
    role: UserRole,
    referralCode?: string
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  fetchUser: () => Promise<boolean>;
  showOnboarding: boolean;
  setShowOnboarding: (value: boolean) => void;
  hasRequiredRole: (requiredRoles: UserRole[]) => boolean;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const { setType, setIsVisible, setUrl } = useOTPContext();

  // Initialize the context with default values
  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Function to fetch user data from the API
  const fetchUser = async () => {
    console.log("fetching user...");
    try {
      const response = await axiosInstance.get("users", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        // Shorter timeout for profile fetch to improve mobile experience
        timeout: isMobileDevice() ? 15000 : 30000,
      });

      if (response?.data?.data) {
        console.log("User data refreshed:", response.data.data);

        try {
          localStorage.setItem("user", JSON.stringify(response.data.data));
        } catch (storageError) {
          console.warn(
            "Failed to store user data in localStorage:",
            storageError
          );
          // Continue anyway since we have the data in memory
        }

        setUser(response.data.data);
        return true;
      } else {
        console.warn("User data response was empty or invalid");
        return false;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);

      // Special handling for mobile devices
      if (isMobileDevice() && !navigator.onLine) {
        toast.error(
          "Network connection lost. Please check your internet connection."
        );
      }

      // Don't show error on initial load, just for refreshes
      if (user !== null) {
        const errorMessage = axios.isAxiosError(error)
          ? (error as ExtendedAxiosError).friendlyMessage ||
            "Failed to refresh your profile."
          : "Could not update your profile information.";

        toast.error(errorMessage, { duration: 3000 });
      }

      return false;
    }
  };

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      return;
    }
    const accessToken = getToken();
    if (accessToken) {
      fetchUser();
    }
  }, []);

  // Function to handle user login
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    let status = false;
    let userRole = "TALENT";

    // Check for empty inputs
    if (!email || !password) {
      toast.error("Please enter both email and password");
      setIsLoading(false);
      return { status: false, userRole: "TALENT" };
    }

    try {
      const loginPromise = axiosInstance.post("auth/login", {
        email,
        password,
      });

      toast.promise(loginPromise, {
        loading: "Logging in...",
        success: (response) => {
          if (!response?.data?.data?.accessToken) {
            console.error("No access token received from server");
            throw new Error("Login failed - no access token received");
          }

          // Store token with proper error handling
          const tokenSaved = setToken(response?.data.data.accessToken);
          if (!tokenSaved && isMobileDevice()) {
            // Handle storage failures on mobile
            toast.warning(
              "Login succeeded but had trouble storing your session. You may need to login again later."
            );
          }

          fetchUser();
          status = true;
          userRole = response?.data.data.role || "TALENT";
          return response?.data.message || "Login successful!";
        },
        error: (error) => {
          // Check for specific error conditions with user-friendly messages
          if (axios.isAxiosError(error)) {
            // Email verification needed
            if (error.response?.data?.appErrorCode === "EMAIL_NOT_VERIFIED") {
              setUrl("/auth/verify-email");
              setIsVisible(true);
              setType("VERIFY_EMAIL");
              return "Please verify your email";
            }

            // Mobile-specific network issues
            if (isMobileDevice() && !error.response) {
              return "Network connection issue. Please check your mobile data or WiFi connection.";
            }

            // Invalid credentials
            if (error.response?.status === 401) {
              return "Invalid email or password. Please try again.";
            }

            console.log("Login error:", error);

            // Try to get meaningful error message
            return (
              error.response?.data?.message ||
              (error as ExtendedAxiosError).friendlyMessage ||
              error.message ||
              "Login failed. Please try again."
            );
          } else {
            console.error("Non-Axios login error:", error);
            return "Something went wrong. Please try again later.";
          }
        },
      });

      await loginPromise;
      return { status, userRole };
    } catch (unexpectedError) {
      // This catches any errors not handled in the toast.promise
      console.error("Unexpected login error:", unexpectedError);
      toast.error("Unexpected error during login. Please try again.");
      return { status: false, userRole: "TALENT" };
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle user registration
  const register = async (
    phone: string,
    email: string,
    password: string,
    termsAndConditionsAccepted: boolean,
    role: UserRole,
    referralCode?: string
  ) => {
    setIsLoading(true);

    let status = false;

    try {
      const registerPromise = axiosInstance.post("auth/register", {
        phone,
        email,
        password,
        termsAndConditionsAccepted,
        role,
        referralCode,
      });

      toast.promise(registerPromise, {
        loading: "Loading...",
        success: (response) => {
          console.log(response?.data);
          setUrl("/auth/verify-email");
          setIsVisible(true);
          setType("VERIFY_EMAIL");
          status = true;
          return response?.data.message;
        },
        error: (error) => {
          if (axios.isAxiosError(error)) {
            return error.response?.data.message;
          } else {
            return "Something went wrong. Please try again later.";
          }
        },
      });

      await registerPromise;
      return status;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle user logout
  const logout = () => {
    try {
      // Clear user data from state
      setUser(null);

      // Try to clear localStorage data
      try {
        localStorage.removeItem("user");
      } catch (error) {
        console.warn("Failed to remove user data from localStorage", error);
      }

      // Remove token from storage
      const tokenRemoved = removeToken();
      if (!tokenRemoved) {
        console.warn("Failed to remove token from storage");
      }

      // Notify user
      toast.success("Logged out successfully", {
        duration: 2000,
        onDismiss: () => {
          // Redirect to login page after toast is dismissed
          window.location.href = "/login";
        },
      });

      // Set a fallback redirect in case toast dismissal doesn't work
      setTimeout(() => {
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }, 2500);
    } catch (error) {
      console.error("Error during logout:", error);

      // Force redirect even if there's an error
      window.location.href = "/login";
    }
  };

  // Function to check if the current user has one of the required roles
  const hasRequiredRole = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  // Function to check if the user is authenticated
  const isAuthenticated = (): boolean => {
    return !!user && !!getToken();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
        fetchUser,
        showOnboarding,
        setShowOnboarding,
        hasRequiredRole,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
