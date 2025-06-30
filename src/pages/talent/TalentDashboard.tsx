
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TalentSidebar } from "@/components/TalentSidebar";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import {useState} from "react";
import {Outlet} from "react-router-dom";
import {useAuth} from "@/context/AuthContext.tsx";

const TalentDashboard = () => {
  const { showOnboarding, setShowOnboarding } = useAuth();

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    localStorage.setItem('propellant-talent-onboarding', 'true');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-950">
        <TalentSidebar />
        <Outlet />
      </div>

      <OnboardingTour 
        isOpen={showOnboarding} 
        onClose={handleOnboardingClose} 
      />
    </SidebarProvider>
  );
};

export default TalentDashboard;
