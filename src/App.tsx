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
import Verification from "./pages/talent/Verification";
import Profile from "./pages/talent/Profile";
import Settings from "./pages/talent/Settings";
import Payment from "./pages/talent/Payment";
import TalentAnalytics from "./pages/talent/Analytics";
import OrganizationDashboard from "./pages/organization/OrganizationDashboard";
import JobPosts from "./pages/organization/JobPosts";
import TalentPool from "./pages/organization/TalentPool";
import Messages from "./pages/organization/Messages";
import Analytics from "./pages/organization/Analytics";
import CompanyProfile from "./pages/organization/CompanyProfile";
import OrganizationSettings from "./pages/organization/OrganizationSettings";
import OrganizationPayment from "./pages/organization/OrganizationPayment";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";

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
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      
      {/* Auto-redirect based on user role */}
      <Route 
        path="/dashboard" 
        element={
          user ? (
            user.role === 'talent' ? <Navigate to="/talent/dashboard" replace /> :
            user.role === 'organization' ? <Navigate to="/organization/dashboard" replace /> :
            user.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> :
            <Navigate to="/login" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      
      {/* Talent Subdomain Routes */}
      <Route 
        path="/talent/dashboard" 
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
        path="/talent/verification" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['talent']}>
              <Verification />
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
        path="/talent/payment" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['talent']}>
              <Payment />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/talent/analytics" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['talent']}>
              <TalentAnalytics />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />

      {/* Organization Subdomain Routes */}
      <Route 
        path="/organization/dashboard" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['organization']}>
              <OrganizationDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/organization/jobs" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['organization']}>
              <JobPosts />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/organization/talent" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['organization']}>
              <TalentPool />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/organization/messages" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['organization']}>
              <Messages />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/organization/analytics" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['organization']}>
              <Analytics />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/organization/profile" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['organization']}>
              <CompanyProfile />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/organization/settings" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['organization']}>
              <OrganizationSettings />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/organization/payment" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['organization']}>
              <OrganizationPayment />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />

      {/* Admin Subdomain Routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />

      {/* Legacy redirects for backward compatibility */}
      <Route path="/talent" element={<Navigate to="/talent/dashboard" replace />} />
      <Route path="/organization" element={<Navigate to="/organization/dashboard" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      
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
