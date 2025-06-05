
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent 
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

const recentActivity = [
  { action: "New user registration", user: "john@example.com", time: "2 minutes ago" },
  { action: "Verification approved", user: "alice@techcorp.com", time: "5 minutes ago" },
  { action: "Badge issued", user: "mike@developer.com", time: "10 minutes ago" },
  { action: "Organization signup", user: "hr@startup.com", time: "15 minutes ago" },
];

const systemHealth = [
  { component: "API Server", status: "healthy", uptime: 99.9 },
  { component: "Database", status: "healthy", uptime: 100 },
  { component: "File Storage", status: "warning", uptime: 98.5 },
  { component: "Email Service", status: "healthy", uptime: 99.8 },
];

const badgeDistribution = [
  { name: "Gold (Employer)", value: 342, color: "#FFD700" },
  { name: "Silver (Client)", value: 289, color: "#C0C0C0" },
  { name: "Bronze (Colleague)", value: 603, color: "#CD7F32" },
];

const chartConfig = {
  gold: { label: "Gold", color: "#FFD700" },
  silver: { label: "Silver", color: "#C0C0C0" },
  bronze: { label: "Bronze", color: "#CD7F32" },
};

export function PlatformOverview() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Badge Distribution</CardTitle>
            <CardDescription>NFT badges issued by verification type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={badgeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {badgeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Platform component status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {systemHealth.map((item) => (
            <div key={item.component} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.component}</span>
                <Badge 
                  variant={item.status === 'healthy' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {item.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Uptime</span>
                  <span>{item.uptime}%</span>
                </div>
                <Progress value={item.uptime} className="h-2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform events and user actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{activity.action}</div>
                    <div className="text-xs text-gray-500">{activity.user}</div>
                  </div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
