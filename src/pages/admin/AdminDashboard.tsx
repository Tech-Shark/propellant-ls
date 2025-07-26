import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminSidebar } from "@/components/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminMetrics } from "@/components/admin/AdminMetrics";
import { UserManagement } from "@/components/admin/UserManagement";
import { VerificationManagement } from "@/components/admin/VerificationManagement";
import { PlatformOverview } from "@/components/admin/PlatformOverview";
import { ReferralManagement } from "@/components/admin/ReferralManagement";
import {
  Users,
  Building2,
  Award,
  FileText,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Menu,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function AdminDashboard() {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const MobileHeader = () => (
    <div className="lg:hidden">
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <AdminSidebar />
            </SheetContent>
          </Sheet>
          <div>
            <h1 className="text-xl font-bold text-white">Admin</h1>
            <p className="text-blue-100 text-sm">Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-xs text-blue-100">Online</span>
        </div>
      </div>
    </div>
  );

  const DesktopContent = () => (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-1 text-sm lg:text-base truncate">
                  Platform overview and management
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white whitespace-nowrap"
                >
                  Super Admin
                </Badge>
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-gray-600 hidden sm:inline whitespace-nowrap">
                  System Online
                </span>
              </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4 lg:space-y-6">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 h-auto">
                <TabsTrigger value="overview" className="text-xs lg:text-sm">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="users" className="text-xs lg:text-sm">
                  Users
                </TabsTrigger>
                <TabsTrigger
                  value="verifications"
                  className="text-xs lg:text-sm"
                >
                  Verifications
                </TabsTrigger>
                <TabsTrigger value="referrals" className="text-xs lg:text-sm">
                  Referrals
                </TabsTrigger>
                <TabsTrigger value="analytics" className="text-xs lg:text-sm">
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 lg:space-y-6">
                <AdminMetrics
                  onMetricClick={setSelectedMetric}
                  selectedMetric={selectedMetric}
                />
                <PlatformOverview />
              </TabsContent>

              <TabsContent value="users" className="space-y-4 lg:space-y-6">
                <UserManagement />
              </TabsContent>

              <TabsContent
                value="verifications"
                className="space-y-4 lg:space-y-6"
              >
                <VerificationManagement />
              </TabsContent>

              <TabsContent value="referrals" className="space-y-4 lg:space-y-6">
                <ReferralManagement />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4 lg:space-y-6">
                <div className="grid gap-4 lg:gap-6">
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <CardTitle className="text-lg lg:text-xl">
                        Platform Analytics
                      </CardTitle>
                      <CardDescription>
                        Detailed platform performance metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-gray-500">
                        <Activity className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                        <p className="text-sm lg:text-base">
                          Advanced analytics dashboard coming soon...
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );

  const MobileContent = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80">
                <AdminSidebar />
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="text-xl font-bold text-white">Admin</h1>
              <p className="text-blue-100 text-sm">Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs text-blue-100">Online</span>
          </div>
        </div>
      </div>

      <main className="p-4">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 h-auto bg-white shadow-sm">
            <TabsTrigger value="overview" className="text-xs">
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs">
              Users
            </TabsTrigger>
          </TabsList>
          <TabsList className="grid w-full grid-cols-3 h-auto bg-white shadow-sm">
            <TabsTrigger value="verifications" className="text-xs">
              Verifications
            </TabsTrigger>
            <TabsTrigger value="referrals" className="text-xs">
              Referrals
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <AdminMetrics
              onMetricClick={setSelectedMetric}
              selectedMetric={selectedMetric}
            />
            <PlatformOverview />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>

          <TabsContent value="verifications" className="space-y-4">
            <VerificationManagement />
          </TabsContent>

          <TabsContent value="referrals" className="space-y-4">
            <ReferralManagement />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-lg">Platform Analytics</CardTitle>
                <CardDescription className="text-sm">
                  Detailed platform performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 text-gray-500">
                  <Activity className="w-10 h-10 mx-auto mb-3 text-blue-500" />
                  <p className="text-sm">
                    Advanced analytics dashboard coming soon...
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );

  return isMobile ? <MobileContent /> : <DesktopContent />;
}
