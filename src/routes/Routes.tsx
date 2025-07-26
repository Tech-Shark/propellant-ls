import { createBrowserRouter } from "react-router-dom";
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
import OrganizationPayment from "@/pages/organization/OrganizationPayment.tsx";
import CompanyProfile from "@/pages/organization/CompanyProfile.tsx";
import OrganizationAnalytics from "@/pages/organization/Analytics.tsx";
import { OrganizationDashboard } from "@/pages/organization/OrganizationDashboard.tsx";
import Messages from "@/pages/organization/Messages.tsx";
import AdminDashboard from "@/pages/admin/AdminDashboard.tsx";
import TermsAndConditions from "@/pages/TermsAndConditions";
import PrivacyPolicy from "@/pages/PrivacyPolicy";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Index /> },
      { path: "login", element: <Login /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      {
        path: "talent",
        element: <TalentDashboard />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "profile", element: <Profile /> },
          { path: "credentials", element: <Credentials /> },
          { path: "cv-builder", element: <CVBuilder /> },
          { path: "referrals", element: <Referrals /> },
          { path: "settings", element: <Settings /> },
          { path: "payment", element: <Payment /> },
          { path: "template", element: <ModernCVTemplate /> },
        ],
      },
      {
        path: "organization",
        element: <OrganizationLayout />,
        children: [
          { index: true, element: <OrganizationDashboard /> },
          { path: "profile", element: <CompanyProfile /> },
          { path: "jobs", element: <JobPosts /> },
          { path: "talent", element: <TalentPool /> },
          { path: "messages", element: <Messages /> },
          { path: "settings", element: <OrganizationSettings /> },
          { path: "payment", element: <OrganizationPayment /> },
          { path: "analytics", element: <OrganizationAnalytics /> },
        ],
      },
      {
        path: "admin",
        element: <AdminDashboard />,
      },
    //   { path: "terms-and-conditions", element: <TermsAndConditions /> },
      { path: "privacypolicy", element: <PrivacyPolicy /> },
    ],
  },
]);
