import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App.tsx";
import Index from "../pages/Index";
import Login from "@/pages/Login.tsx";
import Dashboard from "@/pages/talent/Dashboard.tsx";
import TalentDashboard from "@/pages/talent/TalentDashboard.tsx";
import Profile from "@/pages/talent/Profile.tsx";
import Credentials from "@/pages/talent/Credentials.tsx";
import CVBuilder from "@/pages/talent/CVBuilder.tsx";
import Referrals from "@/pages/talent/Referrals.tsx";
import Payment from "@/pages/talent/Payment.tsx";
import Settings from "@/pages/talent/Settings";
import ForgotPassword from "@/pages/ForgotPassword.tsx";
import ResetPassword from "@/pages/ResetPassword.tsx";
import ModernCVTemplate from "@/components/CVTemplates/ModernCVTemplate.tsx";
import OrganizationLayout from "@/pages/organization/OrganizationLayout.tsx";
import JobPosts from "@/pages/organization/JobPosts.tsx";
import TalentPool from "@/pages/organization/TalentPool.tsx";
import OrganizationSettings from "@/pages/organization/OrganizationSettings.tsx";
import OrganizationPayment from "@/pages/organization/OrganizationPaymentFixed.tsx";
import CompanyProfile from "@/pages/organization/CompanyProfile.tsx";
import OrganizationAnalytics from "@/pages/organization/Analytics.tsx";
import { OrganizationDashboard } from "@/pages/organization/OrganizationDashboard.tsx";
import Messages from "@/pages/organization/Messages.tsx";
import CredentialVerification from "@/pages/organization/CredentialVerification.tsx";
import AdminDashboard from "@/pages/admin/AdminDashboard.tsx";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import PaymentSuccess from "@/pages/payment/PaymentSuccess";
import NotFound from "@/pages/NotFound";
import {
  ProtectedRoute,
  TalentRoute,
  OrganizationRoute,
  AdminRoute,
  PublicRoute,
} from "@/components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Public routes
      {
        path: "",
        element: (
          <PublicRoute>
            <Index />
          </PublicRoute>
        ),
      },
      {
        path: "login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        ),
      },
      {
        path: "reset-password",
        element: (
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        ),
      },
      {
        path: "privacypolicy",
        element: (
          <PublicRoute>
            <PrivacyPolicy />
          </PublicRoute>
        ),
      },

      // Protected routes for Talent
      {
        path: "talent",
        element: (
          <TalentRoute>
            <TalentDashboard />
          </TalentRoute>
        ),
        children: [
          { index: true, element: <Dashboard /> },
          { path: "profile", element: <Profile /> },
          { path: "credentials", element: <Credentials /> },
          { path: "cv-builder", element: <CVBuilder /> },
          { path: "referrals", element: <Referrals /> },
          { path: "settings", element: <Settings /> },
          { path: "payment", element: <Payment /> },
          { path: "template", element: <ModernCVTemplate /> },
          // Catch-all for any undefined talent routes
          { path: "*", element: <Navigate to="/not-found" replace /> },
        ],
      },

      // Protected routes for Organization
      {
        path: "organization",
        element: (
          <OrganizationRoute>
            <OrganizationLayout />
          </OrganizationRoute>
        ),
        children: [
          { index: true, element: <OrganizationDashboard /> },
          { path: "profile", element: <CompanyProfile /> },
          { path: "jobs", element: <JobPosts /> },
          { path: "talent", element: <TalentPool /> },
          { path: "messages", element: <Messages /> },
          { path: "settings", element: <OrganizationSettings /> },
          { path: "payment", element: <OrganizationPayment /> },
          { path: "analytics", element: <OrganizationAnalytics /> },
          { path: "credentials", element: <CredentialVerification /> },
          // Catch-all for any undefined organization routes
          { path: "*", element: <Navigate to="/not-found" replace /> },
        ],
      },

      // Protected routes for Admin
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      // Direct route for admin credentials
      {
        path: "admin/credentials",
        element: (
          <AdminRoute>
            <CredentialVerification />
          </AdminRoute>
        ),
      },

      // Protected but accessible to all authenticated users
      {
        path: "payment/success",
        element: (
          <ProtectedRoute>
            <PaymentSuccess />
          </ProtectedRoute>
        ),
      },

      // 404 page for all undefined routes
      {
        path: "not-found",
        element: (
          <PublicRoute>
            <NotFound />
          </PublicRoute>
        ),
      },
      { path: "*", element: <Navigate to="/not-found" replace /> },
    ],
  },
]);
