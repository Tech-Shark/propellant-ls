
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizationSidebar } from "@/components/OrganizationSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {BarChart3, TrendingUp, Users, MessageSquare, Target, Calendar, Download, CircleMinus} from "lucide-react";
import axiosInstance from "@/api/AxiosInstance.ts";
import {useEffect, useState} from "react";
import {isAxiosError} from "axios";
import {CubeSpinner} from "react-spinners-kit";

interface DemandSkill {
  skill: 'Java',
  count: 2,
  demandRate: 100
}

interface JobPostStats {
  total: number;
  activePosts: number;
  inactivePosts: number;
}

const Analytics = () => {
  const [stats, setStats] = useState<JobPostStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [demandSkillsLoading, setDemandSkillsLoading] = useState(true);

  const [topDemandSkills, setTopDemandSkills] = useState<DemandSkill[]>([]);

  useEffect(() => {
    handleFetchTopSkills();
  }, []);

  const handleFetchTopSkills = async () => {
    setDemandSkillsLoading(true);

    try {
      const response = await axiosInstance.get("/users/organization/top-skills");

      console.log(response);

      setTopDemandSkills(response.data.data as DemandSkill[])
    } catch (error) {
        console.error("Error fetching top skills:", error);
    } finally {
        setDemandSkillsLoading(false);
    }
  }

  useEffect(() => {
    handleFetchStats();
  }, []);

  const handleFetchStats = async () => {
    try {
      const response = await axiosInstance.get(("/job-post/stats"))

      console.log(response.data.data);
      setStats(response.data.data as JobPostStats);
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
              
              {/*<div className="flex items-center gap-3">*/}
              {/*  <Select>*/}
              {/*    <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-white">*/}
              {/*      <Calendar className="w-4 h-4 mr-2" />*/}
              {/*      <SelectValue placeholder="Last 30 days" />*/}
              {/*    </SelectTrigger>*/}
              {/*    <SelectContent className="bg-slate-800 border-slate-600">*/}
              {/*      <SelectItem value="7d">Last 7 days</SelectItem>*/}
              {/*      <SelectItem value="30d">Last 30 days</SelectItem>*/}
              {/*      <SelectItem value="90d">Last 90 days</SelectItem>*/}
              {/*      <SelectItem value="1y">Last year</SelectItem>*/}
              {/*    </SelectContent>*/}
              {/*  </Select>*/}
              {/*  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">*/}
              {/*    <Download className="w-4 h-4 mr-2" />*/}
              {/*    Export*/}
              {/*  </Button>*/}
              {/*</div>*/}
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Total Job Posts</CardTitle>
                  <Target className={`h-4 w-4 text-blue-600`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats?.total}</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Active Job Posts</CardTitle>
                  <Users className={`h-4 w-4 text-emerald-600`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats?.activePosts}</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Inactive Job Posts</CardTitle>
                  <CircleMinus className={`h-4 w-4 text-red-600`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats?.inactivePosts}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-1">
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
                  { demandSkillsLoading ? (
                          <div className="w-full flex items-center justify-center p-10">
                            <CubeSpinner/>
                          </div>
                      ) : topDemandSkills.map((item) => (
                        <div key={item?.skill} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium">{item?.skill}</span>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="border-emerald-600/30 text-emerald-400">
                                {item?.count} count
                              </Badge>
                              <span className="text-sm text-slate-400">{item?.demandRate}%</span>
                            </div>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-orange-600 to-emerald-600 h-2 rounded-full"
                              style={{ width: `${item?.demandRate || 0}%` }}
                            />
                          </div>
                        </div>
                      ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              {/*<Card className="bg-slate-900 border-slate-700">*/}
              {/*  <CardHeader>*/}
              {/*    <CardTitle className="text-white flex items-center gap-2">*/}
              {/*      <Target className="w-5 h-5 text-blue-400" />*/}
              {/*      Recent Activity*/}
              {/*    </CardTitle>*/}
              {/*    <CardDescription className="text-slate-400">*/}
              {/*      Latest actions on your account*/}
              {/*    </CardDescription>*/}
              {/*  </CardHeader>*/}
              {/*  <CardContent className="space-y-4">*/}
              {/*    {recentActivity.map((activity, index) => (*/}
              {/*      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">*/}
              {/*        <div>*/}
              {/*          <p className="text-white font-medium">{activity.action}</p>*/}
              {/*          <p className="text-sm text-slate-400">{activity.detail}</p>*/}
              {/*        </div>*/}
              {/*        <div className="text-right">*/}
              {/*          <Badge */}
              {/*            variant={activity.status === 'success' ? 'default' : */}
              {/*                    activity.status === 'pending' ? 'secondary' : 'outline'}*/}
              {/*            className={*/}
              {/*              activity.status === 'success' ? 'bg-emerald-600' :*/}
              {/*              activity.status === 'pending' ? 'bg-orange-600' :*/}
              {/*              activity.status === 'active' ? 'bg-blue-600' : ''*/}
              {/*            }*/}
              {/*          >*/}
              {/*            {activity.status}*/}
              {/*          </Badge>*/}
              {/*          <p className="text-xs text-slate-400 mt-1">{activity.time}</p>*/}
              {/*        </div>*/}
              {/*      </div>*/}
              {/*    ))}*/}
              {/*  </CardContent>*/}
              {/*</Card>*/}
            </div>

            {/* Performance Chart Placeholder */}
            {/*<Card className="bg-slate-900 border-slate-700">*/}
            {/*  <CardHeader>*/}
            {/*    <CardTitle className="text-white flex items-center gap-2">*/}
            {/*      <TrendingUp className="w-5 h-5 text-emerald-400" />*/}
            {/*      Hiring Performance*/}
            {/*    </CardTitle>*/}
            {/*    <CardDescription className="text-slate-400">*/}
            {/*      Your recruitment metrics over time*/}
            {/*    </CardDescription>*/}
            {/*  </CardHeader>*/}
            {/*  <CardContent>*/}
            {/*    <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center">*/}
            {/*      <div className="text-center">*/}
            {/*        <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-2" />*/}
            {/*        <p className="text-slate-400">Chart visualization coming soon</p>*/}
            {/*        <p className="text-sm text-slate-500">Connect your data to see detailed analytics</p>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </CardContent>*/}
            {/*</Card>*/}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Analytics;
