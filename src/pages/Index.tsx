
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardMetrics, DetailedMetrics } from "@/components/DashboardMetrics";
import { DashboardCharts } from "@/components/DashboardCharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Plus, Upload, Search } from "lucide-react";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-40 bg-background border-b border-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                  <p className="text-muted-foreground">Welcome to SkillVerse Platform</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Credential
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Get started with common tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Upload className="w-6 h-6" />
                    Upload Credential
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Badge className="w-6 h-6" />
                    View Badges
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Search className="w-6 h-6" />
                    Find Talent
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Plus className="w-6 h-6" />
                    Create Job
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Metrics Section */}
            <DashboardMetrics />
            
            {/* Detailed Metrics */}
            <DetailedMetrics />
            
            {/* Charts Section */}
            <DashboardCharts />

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">New credential verified for John Doe</span>
                    </div>
                    <span className="text-xs text-muted-foreground">2 min ago</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">TechCorp posted a new job opening</span>
                    </div>
                    <span className="text-xs text-muted-foreground">15 min ago</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">NFT badge minted for Data Science certification</span>
                    </div>
                    <span className="text-xs text-muted-foreground">1 hour ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">New organization registered: StartupXYZ</span>
                    </div>
                    <span className="text-xs text-muted-foreground">3 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
