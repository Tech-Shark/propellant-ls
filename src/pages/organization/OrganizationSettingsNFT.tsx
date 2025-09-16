import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizationSidebar } from "@/components/OrganizationSidebar";
import { InfoIcon } from "lucide-react";

const OrganizationSettingsNFT: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-950">
        <OrganizationSidebar />

        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-slate-400 hover:text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Credential Settings
                  </h1>
                  <p className="text-slate-400">
                    Manage your organization's credential settings
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col items-center justify-center p-10 bg-slate-900 border border-slate-700 rounded-lg text-center">
              <InfoIcon className="h-16 w-16 text-blue-400 mb-4" />
              <h2 className="text-xl font-bold text-white mb-4">
                NFT Functionality Removed
              </h2>
              <p className="text-slate-300 mb-4 max-w-md">
                The NFT-based credential functionality has been removed from
                this version of the platform. Credential verification is now
                handled through our standard verification process.
              </p>
              <p className="text-slate-400">
                If you have any questions about credential verification, please
                contact support.
              </p>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default OrganizationSettingsNFT;
