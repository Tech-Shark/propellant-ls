
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Talent pages
import TalentDashboard from './pages/talent/TalentDashboard';
import Profile from './pages/talent/Profile';
import Credentials from './pages/talent/Credentials';
import Verification from './pages/talent/Verification';
import Analytics from './pages/talent/Analytics';
import CVBuilder from './pages/talent/CVBuilder';
import Payment from './pages/talent/Payment';
import Settings from './pages/talent/Settings';

// Organization pages
import OrganizationDashboard from './pages/organization/OrganizationDashboard';
import CompanyProfile from './pages/organization/CompanyProfile';
import TalentPool from './pages/organization/TalentPool';
import JobPosts from './pages/organization/JobPosts';
import Messages from './pages/organization/Messages';
import OrganizationAnalytics from './pages/organization/Analytics';
import OrganizationPayment from './pages/organization/OrganizationPayment';
import OrganizationSettings from './pages/organization/OrganizationSettings';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';

import { AuthProvider } from './context/AuthContext';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Talent routes */}
            <Route path="/talent/dashboard" element={<TalentDashboard />} />
            <Route path="/talent/profile" element={<Profile />} />
            <Route path="/talent/credentials" element={<Credentials />} />
            <Route path="/talent/verification" element={<Verification />} />
            <Route path="/talent/analytics" element={<Analytics />} />
            <Route path="/talent/cv-builder" element={<CVBuilder />} />
            <Route path="/talent/payment" element={<Payment />} />
            <Route path="/talent/settings" element={<Settings />} />
            
            {/* Organization routes */}
            <Route path="/organization/dashboard" element={<OrganizationDashboard />} />
            <Route path="/organization/profile" element={<CompanyProfile />} />
            <Route path="/organization/talent-pool" element={<TalentPool />} />
            <Route path="/organization/job-posts" element={<JobPosts />} />
            <Route path="/organization/messages" element={<Messages />} />
            <Route path="/organization/analytics" element={<OrganizationAnalytics />} />
            <Route path="/organization/payment" element={<OrganizationPayment />} />
            <Route path="/organization/settings" element={<OrganizationSettings />} />
            
            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
