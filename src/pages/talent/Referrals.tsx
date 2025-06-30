import {SidebarTrigger} from "@/components/ui/sidebar";
import {ReferralDashboard} from "@/components/referral/ReferralDashboard";

export default function Referrals() {
    return (
        <main className="flex-1 overflow-auto">
            <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
                <div className="flex items-center gap-4 p-6">
                    <SidebarTrigger className="text-slate-400 hover:text-white"/>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Referrals</h1>
                        <p className="text-slate-400">Refer friends and earn rewards</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <ReferralDashboard/>
            </div>
        </main>
    )
}
