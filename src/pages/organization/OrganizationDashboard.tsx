import {SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {Bell, Building2, MessageSquare, Plus, Target, TrendingUp, Users} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {OrganizationMetrics} from "@/components/organization/OrganizationMetrics.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {useAuth} from "@/context/AuthContext.tsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axiosInstance from "@/api/AxiosInstance.ts";
import {isAxiosError} from "axios";
import {JobListing} from "@/utils/global";

export const OrganizationDashboard = () => {
    const { setShowOnboarding } = useAuth();
    const navigate = useNavigate();
    const [showTour, setShowTour] = useState(true);
    const [recentJobPosts, setRecentJobPosts] = useState<JobListing[]>([]);

    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem('propellant-organization-onboarding');
        if (!hasSeenOnboarding) {
            setTimeout(() => {
                setShowOnboarding(true)
            }, 1000);
        }

        localStorage.setItem('propellant-organization-onboarding', 'true');
        setShowTour(false);
    }, [setShowOnboarding]);



    useEffect(() => {
        handleFetchJobPosts();
    }, []);

    const handleFetchJobPosts = async () => {
        try {
            const response = await axiosInstance.get(("/job-post/organization"))
            setRecentJobPosts(response.data.data.data.splice(0, 5) as JobListing[]);
        } catch (error) {
            if (isAxiosError(error)) {
                console.log(error)
                return error.response?.data.message;
            } else {
                return "Something went wrong. Please try again later.";
            }
        }
    }

    return (
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
                        <Button onClick={() => navigate("/organization/jobs")} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            Job Posts
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-8">
                {/* Welcome Banner */}
                {
                    showTour && (
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
                    )
                }

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
                            <div className="grid gap-4 md:grid-cols-2">
                                {/*<Button*/}
                                {/*    variant="outline"*/}
                                {/*    className="h-24 flex-col gap-3 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-emerald-500"*/}
                                {/*>*/}
                                {/*    <Plus className="w-6 h-6 text-emerald-400" />*/}
                                {/*    <span className="text-sm">Create Job Post</span>*/}
                                {/*</Button>*/}
                                <Button
                                    onClick={() => navigate("/organization/talent")}
                                    variant="outline"
                                    className="h-24 flex-col gap-3 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-blue-500"
                                >
                                    <Users className="w-6 h-6 text-blue-400" />
                                    <span className="text-sm">Browse Talent</span>
                                </Button>
                                <Button
                                    onClick={() => navigate("/organization/messages")}
                                    variant="outline"
                                    className="h-24 flex-col gap-3 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-purple-500"
                                >
                                    <MessageSquare className="w-6 h-6 text-purple-400" />
                                    <span className="text-sm">Messages</span>
                                </Button>
                                {/*<Button*/}
                                {/*    variant="outline"*/}
                                {/*    className="h-24 flex-col gap-3 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-orange-500"*/}
                                {/*>*/}
                                {/*    <Bell className="w-6 h-6 text-orange-400" />*/}
                                {/*    <span className="text-sm">Notifications</span>*/}
                                {/*</Button>*/}
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
                            {recentJobPosts?.map((activity, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 bg-emerald-500 rounded-full`}></div>
                                        <span className="text-slate-300">{activity.title}</span>
                                    </div>
                                    <Badge variant="default" className="text-xs text-white">
                                        {/*2 hours ago*/}
                                        {new Date(activity.createdAt || '').toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}