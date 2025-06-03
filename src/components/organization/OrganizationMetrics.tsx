
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const metrics = [
  {
    title: "Active Job Posts",
    value: "8",
    description: "Currently recruiting",
    trend: "+2",
    color: "text-green-600"
  },
  {
    title: "Talent Contacted",
    value: "45",
    description: "This month",
    trend: "+12",
    color: "text-blue-600"
  },
  {
    title: "Success Rate",
    value: "68%",
    description: "Response rate",
    trend: "+5%",
    color: "text-orange-600"
  },
  {
    title: "Messages Started",
    value: "23",
    description: "Active conversations",
    trend: "+8",
    color: "text-purple-600"
  }
];

export function OrganizationMetrics() {
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
