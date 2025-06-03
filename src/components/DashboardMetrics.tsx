
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
  AlertCircle 
} from "lucide-react";

const MetricCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  color = "primary" 
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<any>;
  trend?: string;
  color?: "primary" | "secondary" | "accent" | "destructive";
}) => {
  const colorClasses = {
    primary: "text-primary",
    secondary: "text-orange-500",
    accent: "text-green-500",
    destructive: "text-red-500"
  };

  return (
    <Card>
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

export function DashboardMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Users"
        value="2,847"
        description="Active talent profiles"
        icon={Users}
        trend="+12% from last month"
        color="primary"
      />
      
      <MetricCard
        title="NFT Badges Issued"
        value="1,234"
        description="Verified credentials"
        icon={Award}
        trend="+8% from last month"
        color="accent"
      />
      
      <MetricCard
        title="Pending Verifications"
        value="89"
        description="Awaiting review"
        icon={Clock}
        color="secondary"
      />
      
      <MetricCard
        title="Organizations"
        value="156"
        description="Registered employers"
        icon={Building2}
        trend="+5% from last month"
        color="primary"
      />
    </div>
  );
}

export function DetailedMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Credential Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Verified</span>
            </div>
            <Badge variant="secondary">1,234</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm">Pending</span>
            </div>
            <Badge variant="outline">89</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm">Rejected</span>
            </div>
            <Badge variant="destructive">12</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-green-500" />
            Popular Badges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Software Development</span>
            <Badge>342</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Project Management</span>
            <Badge>289</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Data Science</span>
            <Badge>156</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-purple-500" />
            Organization Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Active Employers</span>
            <Badge variant="secondary">142</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Job Postings</span>
            <Badge variant="secondary">67</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Verifications Requested</span>
            <Badge variant="secondary">234</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
