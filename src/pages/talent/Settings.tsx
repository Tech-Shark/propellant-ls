import {useState} from 'react';
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {Separator} from "@/components/ui/separator";
import {Settings2, Bell, Shield, Save} from "lucide-react";
import {useToast} from "@/hooks/use-toast";

export default function Settings() {
    const {toast} = useToast();
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false,
        marketing: false
    });

    const [privacy, setPrivacy] = useState({
        profileVisible: true,
        showEmail: false,
        showPhone: false,
        allowMessages: true
    });

    const handleSave = () => {
        toast({
            title: "Settings Saved",
            description: "Your settings have been successfully updated.",
        });
    };

    return (
        <main className="flex-1 overflow-auto">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger className="text-slate-400 hover:text-white"/>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Settings</h1>
                            <p className="text-slate-400">Manage your account preferences and privacy</p>
                        </div>
                    </div>

                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Save className="w-4 h-4 mr-2"/>
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="p-6 space-y-8">
                {/* Notification Settings */}
                <Card className="bg-slate-900 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Bell className="w-5 h-5 text-yellow-400"/>
                            Notification Preferences
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Choose how you want to receive notifications
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-slate-300">Email Notifications</Label>
                                <p className="text-sm text-slate-500">Receive updates via email</p>
                            </div>
                            <Switch
                                checked={notifications.email}
                                onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                            />
                        </div>

                        <Separator className="bg-slate-700"/>

                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-slate-300">Push Notifications</Label>
                                <p className="text-sm text-slate-500">Browser push notifications</p>
                            </div>
                            <Switch
                                checked={notifications.push}
                                onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                            />
                        </div>

                        <Separator className="bg-slate-700"/>

                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-slate-300">SMS Notifications</Label>
                                <p className="text-sm text-slate-500">Text message alerts</p>
                            </div>
                            <Switch
                                checked={notifications.sms}
                                onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                            />
                        </div>

                        <Separator className="bg-slate-700"/>

                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-slate-300">Marketing Communications</Label>
                                <p className="text-sm text-slate-500">Product updates and newsletters</p>
                            </div>
                            <Switch
                                checked={notifications.marketing}
                                onCheckedChange={(checked) => setNotifications({...notifications, marketing: checked})}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Privacy Settings */}
                <Card className="bg-slate-900 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Shield className="w-5 h-5 text-emerald-400"/>
                            Privacy & Visibility
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Control who can see your information
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-slate-300">Profile Visibility</Label>
                                <p className="text-sm text-slate-500">Make your profile visible to organizations</p>
                            </div>
                            <Switch
                                checked={privacy.profileVisible}
                                onCheckedChange={(checked) => setPrivacy({...privacy, profileVisible: checked})}
                            />
                        </div>

                        <Separator className="bg-slate-700"/>

                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-slate-300">Show Email Address</Label>
                                <p className="text-sm text-slate-500">Display email on public profile</p>
                            </div>
                            <Switch
                                checked={privacy.showEmail}
                                onCheckedChange={(checked) => setPrivacy({...privacy, showEmail: checked})}
                            />
                        </div>

                        <Separator className="bg-slate-700"/>

                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-slate-300">Show Phone Number</Label>
                                <p className="text-sm text-slate-500">Display phone on public profile</p>
                            </div>
                            <Switch
                                checked={privacy.showPhone}
                                onCheckedChange={(checked) => setPrivacy({...privacy, showPhone: checked})}
                            />
                        </div>

                        <Separator className="bg-slate-700"/>

                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-slate-300">Allow Messages</Label>
                                <p className="text-sm text-slate-500">Let organizations contact you directly</p>
                            </div>
                            <Switch
                                checked={privacy.allowMessages}
                                onCheckedChange={(checked) => setPrivacy({...privacy, allowMessages: checked})}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Account Settings */}
                <Card className="bg-slate-900 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Settings2 className="w-5 h-5 text-slate-400"/>
                            Account Settings
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Manage your account security and preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                            Change Password
                        </Button>
                        <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                            Two-Factor Authentication
                        </Button>
                        <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                            Download My Data
                        </Button>
                        <Separator className="bg-slate-700"/>
                        <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                            Delete Account
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
