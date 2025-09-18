import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Eye,
  Loader2,
} from "lucide-react";
import { CredentialsData } from "@/utils/global";
import { convertDate } from "@/utils/helperfunctions.ts";
import { toast } from "sonner";
import {
  useVerifications,
  useUpdateVerificationStatus,
  useVerificationStats,
} from "@/lib/react-query/hooks";
import { useQueryClient } from "@tanstack/react-query";

export function VerificationManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const queryClient = useQueryClient();

  // Fetch verifications with React Query
  const {
    data: verificationsData,
    isLoading,
    isError,
  } = useVerifications({
    page: 1,
    size: 50,
    verificationStatus:
      statusFilter !== "all" ? statusFilter.toUpperCase() : undefined,
  });

  const credentials = verificationsData?.data || [];

  // Get verification stats
  const { data: statsData } = useVerificationStats();

  // Mutations for updating verification status
  const updateVerificationStatus = useUpdateVerificationStatus();

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "employer":
        return "bg-yellow-500";
      case "colleague":
        return "bg-orange-500";
      case "client":
        return "bg-gray-500";
      default:
        return "bg-blue-500";
    }
  };

  // Filter credentials based on search term and filters
  const filteredCredentials = credentials.filter((credential) => {
    const matchesSearch =
      searchTerm === "" ||
      (credential?.user?.fullname || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (credential?.title || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === "all" ||
      (credential?.type || "").toLowerCase() === typeFilter.toLowerCase();

    // Status filter is handled in the API query

    return matchesSearch && matchesType;
  });

  const handleApprove = async (credentialId: string) => {
    updateVerificationStatus.mutate(
      {
        id: credentialId,
        status: "APPROVED",
      },
      {
        onSuccess: () => {
          toast.success("Verification approved!");
          // Invalidate queries to refetch data
          queryClient.invalidateQueries({ queryKey: ["verifications"] });
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Error approving verification!"
          );
        },
      }
    );
  };

  const handleReject = async (credentialId: string) => {
    updateVerificationStatus.mutate(
      {
        id: credentialId,
        status: "REJECTED",
        rejectionReason: "Insufficient or invalid information",
      },
      {
        onSuccess: () => {
          toast.success("Verification rejected!");
          // Invalidate queries to refetch data
          queryClient.invalidateQueries({ queryKey: ["verifications"] });
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Error rejecting verification!"
          );
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {statsData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">
                    {statsData.pendingVerifications}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold">
                    {statsData.approvedVerifications}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold">
                    {statsData.rejectedVerifications}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Search className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">
                    {statsData.totalVerifications}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Verification Management</CardTitle>
          <CardDescription>
            Review and manage skill verification requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by talent or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="VERIFIED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="employer">Employer</SelectItem>
                <SelectItem value="colleague">Colleague</SelectItem>
                <SelectItem value="client">Client</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : isError ? (
              <div className="p-4 bg-red-50 text-red-700 rounded-md">
                Failed to load verifications. Please try again.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Talent</TableHead>
                    <TableHead>Skill/Experience</TableHead>
                    <TableHead>Verifier</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCredentials.length > 0 ? (
                    filteredCredentials.map((verification) => (
                      <TableRow key={verification._id}>
                        <TableCell className="font-medium">
                          {verification?.userId?.role === "ORGANIZATION" &&
                          verification?.userId?.companyName
                            ? verification?.userId?.companyName
                            : verification?.userId?.firstName +
                                " " +
                                verification?.userId?.lastName || "N/A"}
                        </TableCell>
                        <TableCell>
                          {verification?.name ||
                            verification?.credentialType ||
                            "N/A"}
                        </TableCell>
                        <TableCell>
                          {verification?.verifiedBy || "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${getBadgeColor(
                                verification?.credentialType?.toLowerCase() ||
                                  "default"
                              )}`}
                            ></div>
                            <span className="capitalize">
                              {verification?.credentialType || "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              verification?.verificationStatus === "VERIFIED"
                                ? "default"
                                : verification?.verificationStatus ===
                                  "REJECTED"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {verification?.verificationStatus === "PENDING" && (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {verification?.verificationStatus ===
                              "VERIFIED" && (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            )}
                            {verification?.verificationStatus ===
                              "REJECTED" && (
                              <XCircle className="w-3 h-3 mr-1" />
                            )}
                            {(
                              verification?.verificationStatus || "PENDING"
                            ).toLowerCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {verification?.createdAt
                            ? convertDate(verification.createdAt)
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {verification?.verificationStatus === "PENDING" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700"
                                  onClick={() =>
                                    handleApprove(verification._id)
                                  }
                                  disabled={updateVerificationStatus.isPending}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleReject(verification._id)}
                                  disabled={updateVerificationStatus.isPending}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-6 text-gray-500"
                      >
                        No verification requests found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          {!isLoading && !isError && filteredCredentials.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No verification requests found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
