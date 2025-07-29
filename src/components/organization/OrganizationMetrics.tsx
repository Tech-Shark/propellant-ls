
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {useEffect, useState} from "react";
import axiosInstance from "@/api/AxiosInstance.ts";
import {isAxiosError} from "axios";
import {TrendingUp} from "lucide-react";

const metrics = [
  {
    title: "Active Job Posts",
    value: "8",
    description: "Currently recruiting",
    trend: "+2",
    color: "text-green-600"
  },
  // {
  //   title: "Talent Contacted",
  //   value: "45",
  //   description: "This month",
  //   trend: "+12",
  //   color: "text-blue-600"
  // },
  // {
  //   title: "Success Rate",
  //   value: "68%",
  //   description: "Response rate",
  //   trend: "+5%",
  //   color: "text-orange-600"
  // },
  // {
  //   title: "Messages Started",
  //   value: "23",
  //   description: "Active conversations",
  //   trend: "+8",
  //   color: "text-purple-600"
  // }
];

interface JobPostStats {
  total: number;
  activePosts: number;
  inactivePosts: number;
}

export function OrganizationMetrics() {
  const [stats, setStats] = useState<JobPostStats | null>(null);

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
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          <Badge variant="secondary" className="text-green-600">
            <TrendingUp className="w-5 h-5 text-white" />
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.total}</div>
          <p className="text-xs text-muted-foreground">Total Job Posts</p>
        </CardContent>
      </Card>
    </div>
  );
}
