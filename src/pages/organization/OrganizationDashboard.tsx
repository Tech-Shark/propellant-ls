
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizationSidebar } from "@/components/OrganizationSidebar";
import { OrganizationMetrics } from "@/components/organization/OrganizationMetrics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Plus, Users, MessageSquare } from "lucide-react";

const OrganizationDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <OrganizationSidebar />
        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-40 bg-background border-b border-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Organization Dashboard</h1>
                  <p className="text-muted-foreground">Find and connect with top talent</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Job Post
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your talent acquisition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Plus className="w-6 h-6" />
                    Create Job Post
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Users className="w-6 h-6" />
                    Browse Talent
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <MessageSquare className="w-6 h-6" />
                    Messages
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Bell className="w-6 h-6" />
                    Notifications
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Metrics Section */}
            <OrganizationMetrics />

            {/* Recent Job Posts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Job Posts</CardTitle>
                <CardDescription>Your latest talent acquisition activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Senior React Developer - 12 matches found</span>
                    </div>
                    <span className="text-xs text-muted-foreground">2 min ago</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">Data Scientist - Processing matches</span>
                    </div>
                    <span className="text-xs text-muted-foreground">15 min ago</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">UI/UX Designer - 8 matches found</span>
                    </div>
                    <span className="text-xs text-muted-foreground">1 hour ago</span>
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

export default OrganizationDashboard;
