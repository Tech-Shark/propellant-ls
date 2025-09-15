import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizationSidebar } from "@/components/OrganizationSidebar";
import NFTLimitsManagement from "@/components/organization/NFTLimitsManagement";
import { NFTLimitsProvider } from "@/context/NFTLimitsContext";

const OrganizationSettingsNFT: React.FC = () => {
  return (
    <NFTLimitsProvider>
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
                      NFT Credential Settings
                    </h1>
                    <p className="text-slate-400">
                      Manage your organization's NFT credential limits and usage
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <NFTLimitsManagement />

              <div className="mt-8 p-6 bg-slate-900 border border-slate-700 rounded-lg">
                <h2 className="text-xl font-bold text-white mb-4">
                  About NFT Credential Limits
                </h2>
                <p className="text-slate-300 mb-4">
                  Each organization plan comes with a limit on the number of NFT
                  credentials that can be issued:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-2">
                      Free Tier
                    </h3>
                    <p className="text-slate-300">30 NFT credentials</p>
                  </div>

                  <div className="p-4 bg-slate-800 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-2">
                      Basic Tier
                    </h3>
                    <p className="text-slate-300">20 NFT credentials</p>
                  </div>

                  <div className="p-4 bg-slate-800 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-2">
                      Premium Tier
                    </h3>
                    <p className="text-slate-300">50 NFT credentials</p>
                  </div>

                  <div className="p-4 bg-slate-800 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-2">
                      Enterprise Tier
                    </h3>
                    <p className="text-slate-300">Unlimited NFT credentials</p>
                  </div>
                </div>

                <p className="text-slate-400">
                  These limits are implemented on the frontend only for
                  demonstration purposes. For a production environment,
                  backend-side validation would also be necessary.
                </p>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </NFTLimitsProvider>
  );
};

export default OrganizationSettingsNFT;
