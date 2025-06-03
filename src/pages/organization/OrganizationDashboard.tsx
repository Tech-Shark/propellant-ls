
import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizationSidebar } from "@/components/OrganizationSidebar";
import { OrganizationMetrics } from "@/components/organization/OrganizationMetrics";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, Users, MessageSquare, Building2, Target, TrendingUp } from "lucide-react";

const OrganizationDashboard = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('propellant-organization-onboarding');
    if (!hasSeenOnboarding) {
      setTimeout(() => setShowOnboarding(true), 1000);
    }
  }, []);

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    localStorage.setItem('propellant-organization-onboarding', 'true');
  };

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
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Organization Dashboard</h1>
                  </div>
                  <p className="text-slate-400">Discover and connect with verified talent</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Job Post
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Welcome Banner */}
            <Card className="bg-gradient-to-r from-emerald-600/20 to-blue-600/20 border-emerald-600/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">
                      Find your next great hire! 🎯
                    </h2>
                    <p className="text-slate-300">
                      Post jobs and get matched with verified talent based on blockchain-verified skills.
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowOnboarding(true)}
                    className="border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-white"
                  >
                    Take Tour
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div id="quick-actions">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-400" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Manage your talent acquisition
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <Button 
                      variant="outline" 
                      className="h-24 flex-col gap-3 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-emerald-500"
                    >
                      <Plus className="w-6 h-6 text-emerald-400" />
                      <span className="text-sm">Create Job Post</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-24 flex-col gap-3 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-blue-500"
                    >
                      <Users className="w-6 h-6 text-blue-400" />
                      <span className="text-sm">Browse Talent</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-24 flex-col gap-3 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-purple-500"
                    >
                      <MessageSquare className="w-6 h-6 text-purple-400" />
                      <span className="text-sm">Messages</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-24 flex-col gap-3 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-orange-500"
                    >
                      <Bell className="w-6 h-6 text-orange-400" />
                      <span className="text-sm">Notifications</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Metrics Section */}
            <div id="metrics">
              <OrganizationMetrics />
            </div>

            {/* Recent Job Posts */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Recent Job Posts
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Your latest talent acquisition activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { status: 'success', message: 'Senior React Developer - 12 matches found', time: '2 min ago', color: 'bg-emerald-500' },
                    { status: 'processing', message: 'Data Scientist - Processing matches', time: '15 min ago', color: 'bg-orange-500' },
                    { status: 'success', message: 'UI/UX Designer - 8 matches found', time: '1 hour ago', color: 'bg-blue-500' },
                    { status: 'success', message: 'DevOps Engineer - 15 matches found', time: '2 hours ago', color: 'bg-emerald-500' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
                        <span className="text-slate-300">{activity.message}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs text-slate-400">
                        {activity.time}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <OnboardingTour 
        isOpen={showOnboarding} 
        onClose={handleOnboardingClose} 
      />
    </SidebarProvider>
  );
};

export default OrganizationDashboard;
