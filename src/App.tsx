import {BrowserRouter as Router, Routes, Route, Outlet} from 'react-router-dom';
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
import Referrals from './pages/talent/Referrals';
import Wallet from './pages/talent/Wallet';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';

import {AuthProvider} from './context/AuthContext';
import {Toaster} from '@/components/ui/sonner';
import OTPVerification from "@/components/OTPVerification.tsx";
import {useOTPContext} from "@/context/OTPContext.tsx";

function App() {
    const {isVisible, type} = useOTPContext();

    return (
        <div className="min-h-screen bg-background">
            {
                isVisible && (
                    <div
                        className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-50">
                        <OTPVerification/>
                    </div>
                )
            }

            <Toaster position="top-right" richColors/>
            <Outlet/>

            {/*<Routes>*/}
            {/*  /!* Public routes *!/*/}
            {/*  <Route path="/" element={<Index />} />*/}
            {/*  <Route path="/login" element={<Login />} />*/}

            {/*  /!* Talent routes *!/*/}
            {/*  <Route path="/talent/dashboard" element={<TalentDashboard />} />*/}
            {/*  <Route path="/talent/profile" element={<Profile />} />*/}
            {/*  <Route path="/talent/credentials" element={<Credentials />} />*/}
            {/*  <Route path="/talent/verification" element={<Verification />} />*/}
            {/*  <Route path="/talent/analytics" element={<Analytics />} />*/}
            {/*  <Route path="/talent/cv-builder" element={<CVBuilder />} />*/}
            {/*  <Route path="/talent/payment" element={<Payment />} />*/}
            {/*  <Route path="/talent/settings" element={<Settings />} />*/}
            {/*  <Route path="/talent/referrals" element={<Referrals />} />*/}
            {/*  <Route path="/talent/wallet" element={<Wallet />} />*/}

            {/*  /!* Admin routes *!/*/}
            {/*  <Route path="/admin/dashboard" element={<AdminDashboard />} />*/}

            {/*  /!* 404 route *!/*/}
            {/*  <Route path="*" element={<NotFound />} />*/}
            {/*</Routes>*/}
        </div>
    );
}

export default App;
