import {SidebarProvider} from "@/components/ui/sidebar";
import {OrganizationSidebar} from "@/components/OrganizationSidebar";
import {OnboardingTour} from "@/components/onboarding/OnboardingTour";
import {useAuth} from "@/context/AuthContext.tsx";
import {Outlet} from "react-router-dom";

const OrganizationLayout = () => {
    const {showOnboarding, setShowOnboarding} = useAuth();

    const handleOnboardingClose = () => {
        setShowOnboarding(false);
        localStorage.setItem('propellant-organization-onboarding', 'true');
    };

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-slate-950">
                <OrganizationSidebar/>
                <Outlet/>
            </div>

            <OnboardingTour
                isOpen={showOnboarding}
                onClose={handleOnboardingClose}
            />
        </SidebarProvider>
    );
};

export default OrganizationLayout;
