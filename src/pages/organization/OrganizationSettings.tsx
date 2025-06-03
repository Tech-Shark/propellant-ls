
import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizationSidebar } from "@/components/OrganizationSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Bell, Shield, CreditCard, Users, Globe, Mail, Smartphone, AlertTriangle } from "lucide-react";

const OrganizationSettings = () => {
  const [notifications, setNotifications] = useState({
    newTalent: true,
    messages: true,
    jobResponses: true,
    weeklyReport: false,
    marketingEmails: false
  });

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
                  <h1 className="text-2xl font-bold text-white">Settings</h1>
                  <p className="text-slate-400">Manage your account and preferences</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Account Information */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-400" />
                  Account Information
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Update your organization's account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="orgName" className="text-white">Organization Name</Label>
                    <Input id="orgName" defaultValue="Acme Corporation" className="bg-slate-800 border-slate-600 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white">Contact Email</Label>
                    <Input id="email" type="email" defaultValue="contact@acme.com" className="bg-slate-800 border-slate-600 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-white">Phone Number</Label>
                    <Input id="phone" defaultValue="+1 (555) 123-4567" className="bg-slate-800 border-slate-600 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="website" className="text-white">Website</Label>
                    <Input id="website" defaultValue="https://acme.com" className="bg-slate-800 border-slate-600 text-white" />
                  </div>
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Subscription & Billing */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  Subscription & Billing
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your subscription plan and billing information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <h3 className="text-white font-semibold">Professional Plan</h3>
                    <p className="text-slate-400">Unlimited job posts • Advanced analytics • Priority support</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-emerald-600 text-white mb-2">Active</Badge>
                    <p className="text-white font-bold">$99/month</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                    Change Plan
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                    Billing History
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-400" />
                  Notification Preferences
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">New Talent Matches</p>
                      <p className="text-sm text-slate-400">Get notified when new talent matches your job posts</p>
                    </div>
                    <Switch 
                      checked={notifications.newTalent}
                      onCheckedChange={(checked) => setNotifications({...notifications, newTalent: checked})}
                    />
                  </div>
                  <Separator className="bg-slate-700" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">New Messages</p>
                      <p className="text-sm text-slate-400">Receive notifications for new messages from talent</p>
                    </div>
                    <Switch 
                      checked={notifications.messages}
                      onCheckedChange={(checked) => setNotifications({...notifications, messages: checked})}
                    />
                  </div>
                  <Separator className="bg-slate-700" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Job Post Responses</p>
                      <p className="text-sm text-slate-400">Get notified when talent responds to your job posts</p>
                    </div>
                    <Switch 
                      checked={notifications.jobResponses}
                      onCheckedChange={(checked) => setNotifications({...notifications, jobResponses: checked})}
                    />
                  </div>
                  <Separator className="bg-slate-700" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Weekly Reports</p>
                      <p className="text-sm text-slate-400">Receive weekly analytics and performance reports</p>
                    </div>
                    <Switch 
                      checked={notifications.weeklyReport}
                      onCheckedChange={(checked) => setNotifications({...notifications, weeklyReport: checked})}
                    />
                  </div>
                  <Separator className="bg-slate-700" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Marketing Emails</p>
                      <p className="text-sm text-slate-400">Receive updates about new features and tips</p>
                    </div>
                    <Switch 
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked) => setNotifications({...notifications, marketingEmails: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  Privacy & Security
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your privacy settings and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentPassword" className="text-white">Current Password</Label>
                    <Input id="currentPassword" type="password" className="bg-slate-800 border-slate-600 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="text-white">New Password</Label>
                    <Input id="newPassword" type="password" className="bg-slate-800 border-slate-600 text-white" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-400">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                      Enable 2FA
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Profile Visibility</p>
                      <p className="text-sm text-slate-400">Control who can see your organization profile</p>
                    </div>
                    <Select defaultValue="public">
                      <SelectTrigger className="w-32 bg-slate-800 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="verified">Verified Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Update Security Settings
                </Button>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-slate-900 border-red-600/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Danger Zone
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Actions that cannot be undone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-600/10 border border-red-600/30 rounded-lg">
                  <h3 className="text-red-400 font-semibold mb-2">Delete Organization Account</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    This will permanently delete your organization account, all job posts, and remove access to the platform.
                  </p>
                  <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default OrganizationSettings;
