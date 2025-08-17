import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Award, 
  FileText, 
  Building2, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  DollarSign,
  Activity,
  Shield,
  Zap
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import axiosInstance from "@/api/AxiosInstance.ts";
import {useEffect, useState} from "react";

const mockData = [
  { month: "Jan", users: 1200, orgs: 45, badges: 340 },
  { month: "Feb", users: 1450, orgs: 52, badges: 425 },
  { month: "Mar", users: 1680, orgs: 61, badges: 510 },
  { month: "Apr", users: 1920, orgs: 78, badges: 620 },
  { month: "May", users: 2150, orgs: 89, badges: 745 },
  { month: "Jun", users: 2380, orgs: 98, badges: 890 },
];

const chartConfig = {
  users: { label: "Users", color: "#3B82F6" },
  orgs: { label: "Organizations", color: "#10B981" },
  badges: { label: "Badges", color: "#F59E0B" },
};

const MetricCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  color = "primary",
  onClick,
  isSelected = false
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<any>;
  trend?: string;
  color?: "primary" | "secondary" | "accent" | "destructive";
  onClick?: () => void;
  isSelected?: boolean;
}) => {
  const isMobile = useIsMobile();
  
  const colorClasses = {
    primary: "text-blue-500 border-l-blue-500",
    secondary: "text-orange-500 border-l-orange-500",
    accent: "text-emerald-500 border-l-emerald-500",
    destructive: "text-red-500 border-l-red-500"
  };

  const gradientClasses = {
    primary: "from-blue-500/10 to-blue-600/5",
    secondary: "from-orange-500/10 to-orange-600/5",
    accent: "from-emerald-500/10 to-emerald-600/5",
    destructive: "from-red-500/10 to-red-600/5"
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg border-l-4 bg-gradient-to-br ${gradientClasses[color]} ${colorClasses[color]} ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''} ${isMobile ? 'h-auto' : ''}`}
      onClick={onClick}
    >
      <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${isMobile ? 'pb-2' : 'pb-2'}`}>
        <CardTitle className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium`}>{title}</CardTitle>
        <Icon className={`h-5 w-5 ${colorClasses[color].split(' ')[0]}`} />
      </CardHeader>
      <CardContent className={isMobile ? 'pt-0' : ''}>
        <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-neutral-100`}>{value}</div>
        <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-muted-foreground mt-1`}>{description}</p>
        {/*{trend && (*/}
        {/*  <div className="flex items-center mt-2">*/}
        {/*    <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />*/}
        {/*    <span className={`${isMobile ? 'text-xs' : 'text-xs'} text-emerald-600 font-medium`}>{trend}</span>*/}
        {/*  </div>*/}
        {/*)}*/}
      </CardContent>
    </Card>
  );
};

interface AdminMetricsProps {
  onMetricClick: (metric: string) => void;
  selectedMetric: string | null;
}

export function AdminMetrics({ onMetricClick, selectedMetric }: AdminMetricsProps) {
  const isMobile = useIsMobile();

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrganizations, setTotalOrganizations] = useState(0);
  const [pendingVerifications, setPendingVerifications] = useState(0);


  useEffect(() => {
    handleFetchAllUsers();
    handleFetchAllOrganizations();
    handleFetchPendingVerifications();
  }, []);

  const handleFetchAllUsers = async () => {
    try {
      const response = await axiosInstance.get("/users/admin/all?isDeleted=false")

      setTotalUsers(response.data.data.meta.total);
    } catch (error) {
      console.log(error);
    }
  }

  const handleFetchAllOrganizations = async () => {
    try {
      const response = await axiosInstance.get("/users/admin/all-admins");

      setTotalOrganizations(response.data.data.data.meta.total);
    } catch (error) {
      console.log(error);
    }
  }

  const handleFetchPendingVerifications = async () => {
    try {
      const response = await axiosInstance.get(
          "/credentials/pending-verifications"
      );
      setPendingVerifications(response.data.data.meta.total);
    } catch (error) {
      console.log(error);
    }
  }
  
  const metrics = [
    {
      id: "users",
      title: "Total Users",
      value: totalUsers,
      description: "Active platform users",
      icon: Users,
      trend: "+12% from last month",
      color: "primary" as const
    },
    {
      id: "organizations",
      title: "Organizations",
      value: totalOrganizations,
      description: "Registered companies",
      icon: Building2,
      trend: "+8% from last month",
      color: "accent" as const
    },
    // {
    //   id: "badges",
    //   title: "NFT Badges",
    //   value: "nil",
    //   description: "Total badges issued",
    //   icon: Award,
    //   trend: "+15% from last month",
    //   color: "secondary" as const
    // },
    {
      id: "verifications",
      title: "Pending Verifications",
      value: pendingVerifications,
      description: "Awaiting admin review",
      icon: Clock,
      color: "destructive" as const
    },
    // {
    //   id: "revenue",
    //   title: "Monthly Revenue",
    //   value: "nil",
    //   description: "Platform subscriptions",
    //   icon: DollarSign,
    //   trend: "+22% from last month",
    //   color: "accent" as const
    // },
    // {
    //   id: "activity",
    //   title: "Daily Active Users",
    //   value: "nil",
    //   description: "Users active today",
    //   icon: Activity,
    //   trend: "+5% from yesterday",
    //   color: "primary" as const
    // },
    // {
    //   id: "security",
    //   title: "Security Alerts",
    //   value: "nil",
    //   description: "Require attention",
    //   icon: Shield,
    //   color: "destructive" as const
    // },
    // {
    //   id: "performance",
    //   title: "System Performance",
    //   value: "nil",
    //   description: "Uptime this month",
    //   icon: Zap,
    //   trend: "Excellent",
    //   color: "accent" as const
    // }
  ];

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className={`grid gap-3 lg:gap-4 ${isMobile ? 'grid-cols-1 sm:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            description={metric.description}
            icon={metric.icon}
            trend={metric.trend}
            color={metric.color}
            onClick={() => onMetricClick(metric.id)}
            isSelected={selectedMetric === metric.id}
          />
        ))}
      </div>

      {selectedMetric && (
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/50 to-purple-50/30">
          <CardHeader>
            <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
              {metrics.find(m => m.id === selectedMetric)?.title} - Detailed View
            </CardTitle>
            <CardDescription className={isMobile ? 'text-sm' : ''}>
              6-month trend analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className={`${isMobile ? 'h-[250px]' : 'h-[300px]'}`}>
              {selectedMetric === 'users' || selectedMetric === 'organizations' || selectedMetric === 'badges' ? (
                <BarChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" fontSize={isMobile ? 10 : 12} />
                  <YAxis fontSize={isMobile ? 10 : 12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey={selectedMetric === 'users' ? 'users' : selectedMetric === 'organizations' ? 'orgs' : 'badges'} 
                    fill={selectedMetric === 'users' ? '#3B82F6' : selectedMetric === 'organizations' ? '#10B981' : '#F59E0B'} 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              ) : (
                <LineChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" fontSize={isMobile ? 10 : 12} />
                  <YAxis fontSize={isMobile ? 10 : 12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              )}
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
