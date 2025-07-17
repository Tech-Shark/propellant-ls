
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizationSidebar } from "@/components/OrganizationSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Users, MessageSquare, Target, Calendar, Download } from "lucide-react";

const Analytics = () => {
  const metrics = [
    {
      title: "Total Job Posts",
      value: "24",
      change: "+3 this month",
      trend: "up",
      icon: Target,
      color: "text-blue-600"
    },
    {
      title: "Talent Contacted",
      value: "156",
      change: "+28 this week",
      trend: "up",
      icon: Users,
      color: "text-emerald-600"
    },
    {
      title: "Response Rate",
      value: "68%",
      change: "+5% vs last month",
      trend: "up",
      icon: MessageSquare,
      color: "text-orange-600"
    },
    {
      title: "Successful Hires",
      value: "12",
      change: "+4 this quarter",
      trend: "up",
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ];

  const topSkills = [
    { skill: "React", demand: 95, hires: 8 },
    { skill: "Python", demand: 87, hires: 6 },
    { skill: "TypeScript", demand: 82, hires: 5 },
    { skill: "Node.js", demand: 78, hires: 4 },
    { skill: "AWS", demand: 71, hires: 3 }
  ];

  const recentActivity = [
    { action: "Job Post Created", detail: "Senior React Developer", time: "2 hours ago", status: "active" },
    { action: "Talent Contacted", detail: "Sarah Chen - React Developer", time: "4 hours ago", status: "pending" },
    { action: "Message Received", detail: "Michael Rodriguez replied", time: "6 hours ago", status: "success" },
    { action: "Hire Completed", detail: "Emily Johnson - UX Designer", time: "2 days ago", status: "success" },
    { action: "Job Post Closed", detail: "Data Scientist Position", time: "3 days ago", status: "closed" }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-950">
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-slate-400 hover:text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Analytics</h1>
                  <p className="text-slate-400">Track your hiring performance and insights</p>
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

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Top Skills in Demand */}
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-orange-400" />
                    Top Skills in Demand
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Most requested skills in your job posts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topSkills.map((item) => (
                    <div key={item.skill} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{item.skill}</span>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="border-emerald-600/30 text-emerald-400">
                            {item.hires} hires
                          </Badge>
                          <span className="text-sm text-slate-400">{item.demand}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-orange-600 to-emerald-600 h-2 rounded-full"
                          style={{ width: `${item.demand}%` }}
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
                    <Target className="w-5 h-5 text-blue-400" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Latest actions on your account
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
                          variant={activity.status === 'success' ? 'default' : 
                                  activity.status === 'pending' ? 'secondary' : 'outline'}
                          className={
                            activity.status === 'success' ? 'bg-emerald-600' :
                            activity.status === 'pending' ? 'bg-orange-600' :
                            activity.status === 'active' ? 'bg-blue-600' : ''
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
                  Hiring Performance
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Your recruitment metrics over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-400">Chart visualization coming soon</p>
                    <p className="text-sm text-slate-500">Connect your data to see detailed analytics</p>
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
