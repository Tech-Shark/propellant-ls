
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const metrics = [
  {
    title: "Profile Completeness",
    value: "85%",
    description: "Complete your profile",
    trend: "+5%",
    color: "text-green-600"
  },
  {
    title: "Job Applications",
    value: "12",
    description: "This month",
    trend: "+3",
    color: "text-blue-600"
  },
  {
    title: "Profile Views",
    value: "156",
    description: "Last 30 days",
    trend: "+23",
    color: "text-orange-600"
  },
  {
    title: "Credentials Verified",
    value: "8/10",
    description: "Verification complete",
    trend: "+2",
    color: "text-purple-600"
  }
];

export function TalentMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <Badge variant="secondary" className={metric.color}>
              {metric.trend}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
