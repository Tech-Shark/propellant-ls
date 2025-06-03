
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import TalentDashboard from "./pages/talent/TalentDashboard";
import CVBuilder from "./pages/talent/CVBuilder";
import Credentials from "./pages/talent/Credentials";
import Profile from "./pages/talent/Profile";
import Settings from "./pages/talent/Settings";
import OrganizationDashboard from "./pages/organization/OrganizationDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function RoleBasedRoute({ allowedRoles, children }: { allowedRoles: string[], children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/" 
        element={
          user ? (
            user.role === 'talent' ? <Navigate to="/talent" replace /> :
            user.role === 'organization' ? <Navigate to="/organization" replace /> :
            user.role === 'admin' ? <Navigate to="/admin" replace /> :
            <Navigate to="/login" replace />
          ) : (
            <Index />
          )
        } 
      />
      <Route 
        path="/talent" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['talent']}>
              <TalentDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/talent/cv-builder" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['talent']}>
              <CVBuilder />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/talent/credentials" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['talent']}>
              <Credentials />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/talent/profile" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['talent']}>
              <Profile />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/talent/settings" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['talent']}>
              <Settings />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/organization/*" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['organization']}>
              <OrganizationDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
