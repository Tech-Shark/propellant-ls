
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
  const colorClasses = {
    primary: "text-blue-500",
    secondary: "text-orange-500",
    accent: "text-green-500",
    destructive: "text-red-500"
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${colorClasses[color]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-xs text-green-500">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface AdminMetricsProps {
  onMetricClick: (metric: string) => void;
  selectedMetric: string | null;
}

export function AdminMetrics({ onMetricClick, selectedMetric }: AdminMetricsProps) {
  const metrics = [
    {
      id: "users",
      title: "Total Users",
      value: "2,847",
      description: "Active platform users",
      icon: Users,
      trend: "+12% from last month",
      color: "primary" as const
    },
    {
      id: "organizations",
      title: "Organizations",
      value: "156",
      description: "Registered companies",
      icon: Building2,
      trend: "+8% from last month",
      color: "accent" as const
    },
    {
      id: "badges",
      title: "NFT Badges",
      value: "1,234",
      description: "Total badges issued",
      icon: Award,
      trend: "+15% from last month",
      color: "secondary" as const
    },
    {
      id: "verifications",
      title: "Pending Verifications",
      value: "89",
      description: "Awaiting admin review",
      icon: Clock,
      color: "destructive" as const
    },
    {
      id: "revenue",
      title: "Monthly Revenue",
      value: "$12,450",
      description: "Platform subscriptions",
      icon: DollarSign,
      trend: "+22% from last month",
      color: "accent" as const
    },
    {
      id: "activity",
      title: "Daily Active Users",
      value: "1,456",
      description: "Users active today",
      icon: Activity,
      trend: "+5% from yesterday",
      color: "primary" as const
    },
    {
      id: "security",
      title: "Security Alerts",
      value: "3",
      description: "Require attention",
      icon: Shield,
      color: "destructive" as const
    },
    {
      id: "performance",
      title: "System Performance",
      value: "99.8%",
      description: "Uptime this month",
      icon: Zap,
      trend: "Excellent",
      color: "accent" as const
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        <Card>
          <CardHeader>
            <CardTitle>
              {metrics.find(m => m.id === selectedMetric)?.title} - Detailed View
            </CardTitle>
            <CardDescription>
              6-month trend analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              {selectedMetric === 'users' || selectedMetric === 'organizations' || selectedMetric === 'badges' ? (
                <BarChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey={selectedMetric === 'users' ? 'users' : selectedMetric === 'organizations' ? 'orgs' : 'badges'} 
                    fill={selectedMetric === 'users' ? '#3B82F6' : selectedMetric === 'organizations' ? '#10B981' : '#F59E0B'} 
                  />
                </BarChart>
              ) : (
                <LineChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3B82F6" 
                    strokeWidth={2} 
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
