
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

const credentialData = [
  { month: "Jan", verified: 120, pending: 20, rejected: 5 },
  { month: "Feb", verified: 150, pending: 25, rejected: 8 },
  { month: "Mar", verified: 180, pending: 30, rejected: 12 },
  { month: "Apr", verified: 220, pending: 35, rejected: 10 },
  { month: "May", verified: 280, pending: 40, rejected: 15 },
  { month: "Jun", verified: 320, pending: 45, rejected: 18 },
];

const userGrowthData = [
  { month: "Jan", users: 1200, organizations: 45 },
  { month: "Feb", users: 1450, organizations: 52 },
  { month: "Mar", users: 1680, organizations: 61 },
  { month: "Apr", users: 1920, organizations: 78 },
  { month: "May", users: 2150, organizations: 89 },
  { month: "Jun", users: 2380, organizations: 98 },
];

const badgeDistribution = [
  { name: "Software Development", value: 342, color: "#1D4ED8" },
  { name: "Project Management", value: 289, color: "#F97316" },
  { name: "Data Science", value: 156, color: "#10B981" },
  { name: "Design", value: 123, color: "#8B5CF6" },
  { name: "Marketing", value: 98, color: "#EF4444" },
  { name: "Others", value: 226, color: "#6B7280" },
];

const chartConfig = {
  verified: {
    label: "Verified",
    color: "#10B981",
  },
  pending: {
    label: "Pending",
    color: "#F97316",
  },
  rejected: {
    label: "Rejected",
    color: "#EF4444",
  },
  users: {
    label: "Users",
    color: "#1D4ED8",
  },
  organizations: {
    label: "Organizations",
    color: "#8B5CF6",
  },
};

export function DashboardCharts() {
  return (
    <div className="grid gap-6 mt-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Credential Verification Trends</CardTitle>
            <CardDescription>Monthly verification statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={credentialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="verified" fill="var(--color-verified)" />
                <Bar dataKey="pending" fill="var(--color-pending)" />
                <Bar dataKey="rejected" fill="var(--color-rejected)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Platform adoption over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="var(--color-users)" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="organizations" 
                  stroke="var(--color-organizations)" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Badge Distribution by Category</CardTitle>
          <CardDescription>Most popular skill categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <PieChart width={400} height={300}>
              <Pie
                data={badgeDistribution}
                cx={200}
                cy={150}
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
