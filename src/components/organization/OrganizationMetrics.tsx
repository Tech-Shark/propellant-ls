import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertCircle, Loader2 } from "lucide-react";
// Import directly from the specific hook file instead of through the index
import { useJobStats } from "@/lib/react-query/hooks/useJobData";

export function OrganizationMetrics() {
  // Use React Query hook to fetch job stats
  const { data: stats, isLoading, isError, error } = useJobStats();

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading job statistics...</span>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md flex flex-col">
        <div className="flex items-center mb-2">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span className="font-medium">Failed to load job statistics</span>
        </div>
        <div className="text-xs mt-2 bg-red-100 p-2 rounded">
          <p className="mb-1">Possible issues:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Check your internet connection</li>
            <li>Verify your organization permissions</li>
            <li>The API endpoint may be temporarily unavailable</li>
          </ul>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-2 py-1 bg-red-200 hover:bg-red-300 rounded text-red-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">
            Total Posts
          </CardTitle>
          <Badge variant="secondary" className="text-green-600">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-white">
            {stats?.total || 0}
          </div>
          <p className="text-xs text-slate-400">Total Job Posts</p>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">
            Active Jobs
          </CardTitle>
          <Badge variant="secondary" className="text-blue-600">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-white">
            {stats?.activePosts || 0}
          </div>
          <p className="text-xs text-slate-400">Currently Active Jobs</p>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">
            Inactive Jobs
          </CardTitle>
          <Badge variant="secondary" className="text-purple-600">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-white">
            {stats?.inactivePosts || 0}
          </div>
          <p className="text-xs text-slate-400">Inactive Job Posts</p>
        </CardContent>
      </Card>
    </div>
  );
}
