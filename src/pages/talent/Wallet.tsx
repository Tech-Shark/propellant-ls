
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TalentSidebar } from "@/components/TalentSidebar";
import { WalletDashboard } from "@/components/wallet/WalletDashboard";

export default function Wallet() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-950">
        <TalentSidebar />
        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
            <div className="flex items-center gap-4 p-6">
              <SidebarTrigger className="text-slate-400 hover:text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Wallet</h1>
                <p className="text-slate-400">Manage your digital wallet and transactions</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <WalletDashboard />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
