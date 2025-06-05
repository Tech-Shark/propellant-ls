
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TalentSidebar } from "@/components/TalentSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Eye, MessageSquare, Award, Calendar, Download, Target, Trophy } from "lucide-react";

const Analytics = () => {
  const metrics = [
    {
      title: "Profile Views",
      value: "1,234",
      change: "+15% this month",
      trend: "up",
      icon: Eye,
      color: "text-blue-600"
    },
    {
      title: "Messages Received",
      value: "87",
      change: "+23 this week",
      trend: "up",
      icon: MessageSquare,
      color: "text-emerald-600"
    },
    {
      title: "Verification Rate",
      value: "89%",
      change: "+12% vs last month",
      trend: "up",
      icon: Award,
      color: "text-orange-600"
    },
    {
      title: "Job Matches",
      value: "42",
      change: "+8 this quarter",
      trend: "up",
      icon: Target,
      color: "text-purple-600"
    }
  ];

  const skillPerformance = [
    { skill: "React", views: 245, matches: 18, verifications: 3, trend: 95 },
    { skill: "TypeScript", views: 189, matches: 14, verifications: 2, trend: 87 },
    { skill: "Node.js", views: 156, matches: 12, verifications: 2, trend: 82 },
    { skill: "Python", views: 134, matches: 8, verifications: 1, trend: 78 },
    { skill: "AWS", views: 98, matches: 6, verifications: 1, trend: 71 }
  ];

  const recentActivity = [
    { action: "Profile Viewed", detail: "TechCorp viewed your profile", time: "2 hours ago", status: "view" },
    { action: "Message Received", detail: "Sarah from StartupXYZ sent a message", time: "4 hours ago", status: "message" },
    { action: "Skill Verified", detail: "React Development verified by John Manager", time: "6 hours ago", status: "verified" },
    { action: "Job Match", detail: "Matched with Senior Developer position", time: "1 day ago", status: "match" },
    { action: "Badge Earned", detail: "Gold badge for Project Leadership", time: "2 days ago", status: "badge" }
  ];

  const profileStrength = {
    completeness: 92,
    verifications: 8,
    endorsements: 15,
    activeSkills: 12
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-950">
        <TalentSidebar />
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-slate-400 hover:text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Analytics</h1>
                  <p className="text-slate-400">Track your profile performance and career insights</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Select>
                  <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-white">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Last 30 days" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric) => (
                <Card key={metric.title} className="bg-slate-900 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">{metric.title}</CardTitle>
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{metric.value}</div>
                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {metric.change}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Profile Strength */}
            <Card className="bg-gradient-to-r from-blue-600/20 to-emerald-600/20 border-blue-600/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Profile Strength</h3>
                    <p className="text-slate-300">Your profile optimization score</p>
                  </div>
                  <div className="text-3xl font-bold text-blue-400">{profileStrength.completeness}%</div>
                </div>
                <Progress value={profileStrength.completeness} className="h-3 mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-white">{profileStrength.verifications}</div>
                    <div className="text-sm text-slate-400">Verifications</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{profileStrength.endorsements}</div>
                    <div className="text-sm text-slate-400">Endorsements</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{profileStrength.activeSkills}</div>
                    <div className="text-sm text-slate-400">Active Skills</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">A+</div>
                    <div className="text-sm text-slate-400">Overall Grade</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Skill Performance */}
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    Skill Performance
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    How your skills are performing in the market
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {skillPerformance.map((item) => (
                    <div key={item.skill} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{item.skill}</span>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="border-blue-600/30 text-blue-400">
                            {item.matches} matches
                          </Badge>
                          <Badge variant="outline" className="border-emerald-600/30 text-emerald-400">
                            {item.verifications} verified
                          </Badge>
                          <span className="text-sm text-slate-400">{item.views} views</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-emerald-600 h-2 rounded-full"
                          style={{ width: `${item.trend}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-orange-400" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Latest interactions with your profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                      <div>
                        <p className="text-white font-medium">{activity.action}</p>
                        <p className="text-sm text-slate-400">{activity.detail}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={activity.status === 'verified' || activity.status === 'badge' ? 'default' : 
                                  activity.status === 'match' ? 'secondary' : 'outline'}
                          className={
                            activity.status === 'verified' || activity.status === 'badge' ? 'bg-emerald-600' :
                            activity.status === 'match' ? 'bg-blue-600' :
                            activity.status === 'message' ? 'bg-orange-600' : ''
                          }
                        >
                          {activity.status}
                        </Badge>
                        <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart Placeholder */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Career Progress
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Your career metrics and growth over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-400">Chart visualization coming soon</p>
                    <p className="text-sm text-slate-500">Track your career growth and achievements</p>
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

export default Analytics;
