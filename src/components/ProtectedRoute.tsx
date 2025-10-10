import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { hasToken } from "@/utils/TokenStorage";
import { UserRole } from "@/types/user";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

/**
 * A component to protect routes from unauthorized access
 *
 * @param children - The components to render if the user is authenticated
 * @param allowedRoles - Optional array of roles allowed to access this route
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
}) => {
  const { user, isLoading, fetchUser } = useAuth();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);

  // Use refs to track if verification has been attempted and was authenticated
  const verificationAttempted = React.useRef(false);
  const wasAuthenticatedRef = React.useRef(
    sessionStorage.getItem("wasAuthenticated") === "true"
  );

  // Combined useEffect for both auth verification and wasAuthenticated tracking
  useEffect(() => {
    // Auth verification logic
    const verifyAuth = async () => {
      // Only run verification once to prevent infinite loops
      if (verificationAttempted.current) return;

      // Mark that we've attempted verification
      verificationAttempted.current = true;

      try {
        // Quick check if we have a token before attempting any verification
        if (!hasToken()) {
          setIsVerifying(false);
          return;
        }

        // If we don't have user data but have a token, try to fetch user data
        if (!user && hasToken()) {
          await fetchUser();
        }
      } catch (error) {
        console.error("Error verifying authentication:", error);
        // On error, still mark as complete to avoid infinite loading
        toast.error("Authentication check failed. Please try logging in again.");
      } finally {
        setIsVerifying(false);
      }
    };

    // Run verification immediately
    verifyAuth();

    // Keep track that user was authenticated in this session
    // Only set this once to avoid unnecessary re-renders
    if (user && hasToken() && !wasAuthenticatedRef.current) {
      sessionStorage.setItem("wasAuthenticated", "true");
      wasAuthenticatedRef.current = true;
    }
  }, [user, fetchUser]);

  // Handle redirect for no token case (outside of loading check to prevent infinite loops)
  const hasValidToken = hasToken();

  // Quick redirect if there's clearly no token
  if (!hasValidToken && !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Show loading state while verifying authentication
  if (isLoading || isVerifying) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-orange-500"></div>
          <p className="text-lg text-slate-300">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user || !hasToken()) {
    // Don't show error toast when directly accessing a protected route
    // Only show toast if user was previously authenticated and then lost authentication
    if (sessionStorage.getItem("wasAuthenticated")) {
      toast.error("Authentication required", {
        description: "Please log in to access this page.",
        duration: 4000,
      });
    }

    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Tracking wasAuthenticated is now handled in the combined useEffect above

  // Check if user has the required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    toast.error("Access denied", {
      description: `You don't have permission to access this page.`,
      duration: 4000,
    });

    // Redirect to the appropriate dashboard based on user role
    let redirectPath = "/";
    switch (user.role) {
      case "TALENT":
        redirectPath = "/talent";
        break;
      case "ORGANIZATION":
        redirectPath = "/organization";
        break;
      case "ADMIN":
        redirectPath = "/admin";
        break;
      default:
        redirectPath = "/";
    }

    return <Navigate to={redirectPath} replace />;
  }

  // If we're here, the user is authenticated and authorized
  return <>{children}</>;
};

/**
 * Component specifically for protecting talent routes
 */
export const TalentRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ProtectedRoute allowedRoles={["TALENT", "ADMIN"]}>
      {children}
    </ProtectedRoute>
  );
};

/**
 * Component specifically for protecting organization routes
 */
export const OrganizationRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ProtectedRoute allowedRoles={["ORGANIZATION", "ADMIN"]}>
      {children}
    </ProtectedRoute>
  );
};

/**
 * Component specifically for protecting admin routes
 */
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <ProtectedRoute allowedRoles={["ADMIN"]}>{children}</ProtectedRoute>;
};

/**
 * Component for public routes that should redirect to dashboard if already logged in
 */
export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const location = useLocation();
  // Use memoization to prevent unnecessary re-renders
  const shouldRedirect = React.useMemo(() => {
    // Only redirect for auth pages
    const isAuthPage = [
      "/login",
      "/forgot-password",
      "/reset-password",
    ].includes(location.pathname);

    // Only redirect if we have a user
    return isAuthPage && user;
  }, [location.pathname, user]);

  // If logged in and trying to access auth pages, redirect to appropriate dashboard
  if (shouldRedirect && user) {
    let redirectPath = "/";
    switch (user.role) {
      case "TALENT":
        redirectPath = "/talent";
        break;
      case "ORGANIZATION":
        redirectPath = "/organization";
        break;
      case "ADMIN":
        redirectPath = "/admin";
        break;
      default:
        redirectPath = "/";
    }

    return <Navigate to={redirectPath} replace />;
  }

  // For public pages, just render the content
  return <>{children}</>;
};
