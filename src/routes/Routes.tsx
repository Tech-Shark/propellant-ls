import { createBrowserRouter } from "react-router-dom";
import App from "../App.tsx";
import Index from '../pages/Index';
import Login from "@/pages/Login.tsx";
import Dashboard from "@/pages/talent/Dashboard.tsx";
import TalentDashboard from "@/pages/talent/TalentDashboard.tsx";
import Profile from "@/pages/talent/Profile.tsx";
import Credentials from "@/pages/talent/Credentials.tsx";
import CVBuilder from "@/pages/talent/CVBuilder.tsx";
import Referrals from "@/pages/talent/Referrals.tsx";
import Payment from "@/pages/talent/Payment.tsx";
import Settings from '@/pages/talent/Settings';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <Index /> },
            { path: "login", element: <Login /> },
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
                    { path: "payment", element: <Payment /> }
                ]
            }
        ]
    }
]);
