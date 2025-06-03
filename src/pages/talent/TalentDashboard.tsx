
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TalentSidebar } from "@/components/TalentSidebar";
import { TalentMetrics } from "@/components/talent/TalentMetrics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Upload, FileText, Download, MessageSquare } from "lucide-react";

const TalentDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <TalentSidebar />
        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-40 bg-background border-b border-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Talent Dashboard</h1>
                  <p className="text-muted-foreground">Manage your profile and career growth</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Credential
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your career development</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <FileText className="w-6 h-6" />
                    Generate CV
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Upload className="w-6 h-6" />
                    Upload Credentials
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Download className="w-6 h-6" />
                    Download CV
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <MessageSquare className="w-6 h-6" />
                    View Messages
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Metrics Section */}
            <TalentMetrics />

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest platform activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">CV generation completed</span>
                    </div>
                    <span className="text-xs text-muted-foreground">2 min ago</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">New message from TechCorp</span>
                    </div>
                    <span className="text-xs text-muted-foreground">15 min ago</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">Credential verification pending</span>
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

export default TalentDashboard;
