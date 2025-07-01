import {SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {Award, Bell, FileText, Upload, Users, Zap} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {TalentMetrics} from "@/components/talent/TalentMetrics.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "@/context/AuthContext.tsx";

const Dashboard = () => {
    const { setShowOnboarding } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user has seen onboarding
        const hasSeenOnboarding = localStorage.getItem('propellant-talent-onboarding');
        if (!hasSeenOnboarding) {
            setTimeout(() => setShowOnboarding(true), 1000);
        }
    }, [setShowOnboarding]);

    return (
        <main className="flex-1 overflow-auto">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger className="text-slate-400 hover:text-white" />
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-white">Talent Dashboard</h1>
                            </div>
                            <p className="text-slate-400">Propel your career with verified skills</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                            <Bell className="w-4 h-4" />
                        </Button>
                        <Button onClick={() => navigate("/talent/credentials")} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Credential
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-8">
                {/* Welcome Banner */}
                <Card className="bg-gradient-to-r from-blue-600/20 to-emerald-600/20 border-blue-600/30">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-2">
                                    Welcome back! Ready to propel your career? 🚀
                                </h2>
                                <p className="text-slate-300">
                                    Complete your profile to unlock AI-powered CV generation and verification features.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setShowOnboarding(true)}
                                className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
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
                                <Award className="w-5 h-5 text-blue-400" />
                                Quick Actions
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Manage your career development
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Button
                                    onClick={() => navigate("/talent/cv-builder")}
                                    variant="outline"
                                    className="h-24 flex-col gap-3 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-blue-500"
                                >
                                    <FileText className="w-6 h-6 text-blue-400" />
                                    <span className="text-sm">Generate CV</span>
                                </Button>
                                <Button
                                    onClick={() => navigate("/talent/credentials")}
                                    variant="outline"
                                    className="h-24 flex-col gap-3 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-emerald-500"
                                >
                                    <Upload className="w-6 h-6 text-emerald-400" />
                                    <span className="text-sm">Upload Credentials</span>
                                </Button>
                                {/*<Button */}
                                {/*  variant="outline" */}
                                {/*  className="h-24 flex-col gap-3 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-orange-500"*/}
                                {/*>*/}
                                {/*  <Download className="w-6 h-6 text-orange-400" />*/}
                                {/*  <span className="text-sm">Download CV</span>*/}
                                {/*</Button>*/}
                                {/*<Button */}
                                {/*  variant="outline" */}
                                {/*  className="h-24 flex-col gap-3 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-purple-500"*/}
                                {/*>*/}
                                {/*  <MessageSquare className="w-6 h-6 text-purple-400" />*/}
                                {/*  <span className="text-sm">View Messages</span>*/}
                                {/*</Button>*/}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Metrics Section */}
                {/*<div id="metrics">*/}
                {/*    <TalentMetrics />*/}
                {/*</div>*/}

                {/* Recent Activity */}
                <Card className="bg-slate-900 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-emerald-400" />
                            Recent Activity
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Your latest platform activities
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/*<div className="space-y-4">*/}
                        {/*    {[*/}
                        {/*        { status: 'success', message: 'CV generation completed', time: '2 min ago', color: 'bg-emerald-500' },*/}
                        {/*        { status: 'info', message: 'New message from TechCorp', time: '15 min ago', color: 'bg-blue-500' },*/}
                        {/*        { status: 'warning', message: 'Credential verification pending', time: '1 hour ago', color: 'bg-orange-500' },*/}
                        {/*        { status: 'success', message: 'NFT skill badge earned: React', time: '2 hours ago', color: 'bg-emerald-500' }*/}
                        {/*    ].map((activity, index) => (*/}
                        {/*        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">*/}
                        {/*            <div className="flex items-center gap-3">*/}
                        {/*                <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>*/}
                        {/*                <span className="text-slate-300">{activity.message}</span>*/}
                        {/*            </div>*/}
                        {/*            <Badge variant="secondary" className="text-xs text-slate-400">*/}
                        {/*                {activity.time}*/}
                        {/*            </Badge>*/}
                        {/*        </div>*/}
                        {/*    ))}*/}
                        {/*</div>*/}
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}

export default Dashboard;