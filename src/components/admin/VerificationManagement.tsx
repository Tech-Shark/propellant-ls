import { useState, useMemo } from "react";
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
  Award,
  FileText,
} from "lucide-react";
import { CredentialsData } from "@/utils/global";
import { convertDate } from "@/utils/helperfunctions.ts";
import { toast } from "sonner";
import {
  useVerifications,
  useUpdateVerificationStatus,
} from "@/lib/react-query/hooks";
import { CredentialDetailModal } from "./CredentialDetailModal";
import { useQueryClient } from "@tanstack/react-query";

export function VerificationManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedCredential, setSelectedCredential] = useState<any | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"status" | "date" | "type">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

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

  // Calculate verification stats directly from fetched data
  const localStatsData = useMemo(() => {
    // Count verifications by status
    const pendingCount = credentials.filter(
      (cred) => cred.verificationStatus === "PENDING"
    ).length;
    const approvedCount = credentials.filter(
      (cred) => cred.verificationStatus === "VERIFIED"
    ).length;
    const rejectedCount = credentials.filter(
      (cred) => cred.verificationStatus === "REJECTED"
    ).length;
    const totalCount = credentials.length;

    return {
      totalVerifications: totalCount,
      pendingVerifications: pendingCount,
      approvedVerifications: approvedCount,
      rejectedVerifications: rejectedCount,
    };
  }, [credentials]);

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

  // Filter and sort credentials based on search term and filters
  const filteredCredentials = credentials
    .filter((credential) => {
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
    })
    .sort((a, b) => {
      // Sort by selected criteria
      if (sortBy === "status") {
        // Define status order for sorting: PENDING -> VERIFIED -> REJECTED
        const statusOrder = {
          PENDING: 1,
          VERIFIED: 2,
          REJECTED: 3,
        };
        const statusA = statusOrder[a.verificationStatus] || 999;
        const statusB = statusOrder[b.verificationStatus] || 999;
        return sortOrder === "asc" ? statusA - statusB : statusB - statusA;
      } else if (sortBy === "date") {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "type") {
        const typeA = (
          a.type ||
          a.credentialType ||
          a.category ||
          ""
        ).toLowerCase();
        const typeB = (
          b.type ||
          b.credentialType ||
          b.category ||
          ""
        ).toLowerCase();
        return sortOrder === "asc"
          ? typeA.localeCompare(typeB)
          : typeB.localeCompare(typeA);
      }

      // Default sort by date (newest first)
      return sortOrder === "asc"
        ? new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
        : new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime();
    });

  // Calculate counts for the filtered data
  const filteredStats = {
    pending: filteredCredentials.filter(
      (c) => c.verificationStatus === "PENDING"
    ).length,
    approved: filteredCredentials.filter(
      (c) => c.verificationStatus === "VERIFIED"
    ).length,
    rejected: filteredCredentials.filter(
      (c) => c.verificationStatus === "REJECTED"
    ).length,
    total: filteredCredentials.length,
  };

  const handleApprove = async (credentialId: string) => {
    updateVerificationStatus.mutate(
      {
        id: credentialId,
        status: "VERIFIED", // Use VERIFIED to match the backend expectation
        notes: "Credential approved by admin",
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
        notes: "Insufficient or invalid information", // Use notes instead of rejectionReason
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
      <div className="bg-slate-900 rounded-lg overflow-hidden shadow mb-6">
        <div className="p-4">
          <h2 className="text-white text-lg font-semibold mb-3">
            Overview of credential verification status
          </h2>

          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-300 text-sm">
              Total Verification Requests
            </span>
            <span className="text-white text-2xl font-bold">
              {localStatsData.totalVerifications}
            </span>
          </div>

          {/* Simple progress bar */}
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
            {localStatsData.totalVerifications > 0 && (
              <>
                <div
                  className="h-full bg-yellow-500 float-left"
                  style={{
                    width: `${
                      (localStatsData.pendingVerifications /
                        localStatsData.totalVerifications) *
                      100
                    }%`,
                    minWidth:
                      localStatsData.pendingVerifications > 0 ? "5px" : "0",
                  }}
                />
                <div
                  className="h-full bg-green-500 float-left"
                  style={{
                    width: `${
                      (localStatsData.approvedVerifications /
                        localStatsData.totalVerifications) *
                      100
                    }%`,
                    minWidth:
                      localStatsData.approvedVerifications > 0 ? "5px" : "0",
                  }}
                />
                <div
                  className="h-full bg-red-500 float-left"
                  style={{
                    width: `${
                      (localStatsData.rejectedVerifications /
                        localStatsData.totalVerifications) *
                      100
                    }%`,
                    minWidth:
                      localStatsData.rejectedVerifications > 0 ? "5px" : "0",
                  }}
                />
              </>
            )}
          </div>

          {/* Status badges - Matching your screenshot exactly */}
          <div className="flex justify-between">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center mr-1.5">
                <Clock className="w-3 h-3 text-yellow-900" />
              </div>
              <span className="text-yellow-500 font-medium text-sm">
                Pending: {localStatsData.pendingVerifications}
              </span>
            </div>

            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-1.5">
                <CheckCircle className="w-3 h-3 text-green-900" />
              </div>
              <span className="text-green-500 font-medium text-sm">
                Approved: {localStatsData.approvedVerifications}
              </span>
            </div>

            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center mr-1.5">
                <XCircle className="w-3 h-3 text-red-900" />
              </div>
              <span className="text-red-500 font-medium text-sm">
                Rejected: {localStatsData.rejectedVerifications}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verification Management</CardTitle>
          <CardDescription>
            Review and manage skill verification requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            {/* Search and Filters - Better mobile layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="relative md:col-span-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by talent or skill..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 md:gap-4 md:col-span-6">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
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
                  <SelectTrigger className="w-full">
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
            </div>

            {/* Sort Controls - More mobile friendly */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs md:text-sm text-gray-500 font-medium mb-1 md:mb-0 mr-1">
                Sort by:
              </span>
              <div className="flex flex-wrap">
                <Button
                  variant={sortBy === "status" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (sortBy === "status") {
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    } else {
                      setSortBy("status");
                      setSortOrder("asc");
                    }
                  }}
                  className="h-8 px-2.5 text-xs md:text-sm rounded-r-none border-r-0"
                >
                  Status{" "}
                  {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                </Button>
                <Button
                  variant={sortBy === "date" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (sortBy === "date") {
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    } else {
                      setSortBy("date");
                      setSortOrder("desc");
                    }
                  }}
                  className="h-8 px-2.5 text-xs md:text-sm rounded-none border-x-0"
                >
                  Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                </Button>
                <Button
                  variant={sortBy === "type" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (sortBy === "type") {
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    } else {
                      setSortBy("type");
                      setSortOrder("asc");
                    }
                  }}
                  className="h-8 px-2.5 text-xs md:text-sm rounded-l-none border-l-0"
                >
                  Type {sortBy === "type" && (sortOrder === "asc" ? "↑" : "↓")}
                </Button>
              </div>
            </div>
          </div>

          {/* Filtered Results Summary - Better mobile layout */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            <Badge
              variant="outline"
              className="bg-yellow-50 text-yellow-600 h-8 text-xs flex items-center justify-center px-2 md:px-3"
            >
              <Clock className="w-3 h-3 mr-1" /> {filteredStats.pending} Pending
            </Badge>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-600 h-8 text-xs flex items-center justify-center px-2 md:px-3"
            >
              <CheckCircle className="w-3 h-3 mr-1" /> {filteredStats.approved}{" "}
              Approved
            </Badge>
            <Badge
              variant="outline"
              className="bg-red-50 text-red-600 h-8 text-xs flex items-center justify-center px-2 md:px-3"
            >
              <XCircle className="w-3 h-3 mr-1" /> {filteredStats.rejected}{" "}
              Rejected
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-600 h-8 text-xs flex items-center justify-center px-2 md:px-3"
            >
              {filteredStats.total} Total in current view
            </Badge>
          </div>

          <div className="border rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : isError ? (
              <div className="p-4 bg-red-50 text-red-700 rounded-md">
                Failed to load verifications. Please try again.
              </div>
            ) : (
              <div>
                {/* Desktop View - Table (hidden on mobile) */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Talent</TableHead>
                        <TableHead>Skill/Experience</TableHead>
                        <TableHead>Verifier</TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => {
                            if (sortBy === "type") {
                              setSortOrder(
                                sortOrder === "asc" ? "desc" : "asc"
                              );
                            } else {
                              setSortBy("type");
                              setSortOrder("asc");
                            }
                          }}
                        >
                          Type{" "}
                          {sortBy === "type" &&
                            (sortOrder === "asc" ? " ↑" : " ↓")}
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => {
                            if (sortBy === "status") {
                              setSortOrder(
                                sortOrder === "asc" ? "desc" : "asc"
                              );
                            } else {
                              setSortBy("status");
                              setSortOrder("asc");
                            }
                          }}
                        >
                          Status{" "}
                          {sortBy === "status" &&
                            (sortOrder === "asc" ? " ↑" : " ↓")}
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => {
                            if (sortBy === "date") {
                              setSortOrder(
                                sortOrder === "asc" ? "desc" : "asc"
                              );
                            } else {
                              setSortBy("date");
                              setSortOrder("desc");
                            }
                          }}
                        >
                          Submitted{" "}
                          {sortBy === "date" &&
                            (sortOrder === "asc" ? " ↑" : " ↓")}
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCredentials.length > 0 ? (
                        filteredCredentials.map((verification) => (
                          <TableRow key={verification._id}>
                            <TableCell className="font-medium">
                              {verification?.user?.email ||
                                (verification?.user?._id &&
                                  (verification?.userId?.role ===
                                    "ORGANIZATION" &&
                                  verification?.userId?.companyName
                                    ? verification?.userId?.companyName
                                    : verification?.userId?.firstName +
                                        " " +
                                        verification?.userId?.lastName ||
                                      "N/A")) ||
                                "N/A"}
                            </TableCell>
                            <TableCell>
                              {verification?.title ||
                                verification?.name ||
                                verification?.credentialType ||
                                "N/A"}
                            </TableCell>
                            <TableCell>
                              {verification?.verifyingOrganization ||
                                verification?.issuingOrganization ||
                                verification?.verifiedBy ||
                                "N/A"}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-3 h-3 rounded-full ${getBadgeColor(
                                    (
                                      verification?.type ||
                                      verification?.credentialType ||
                                      ""
                                    )?.toLowerCase() || "default"
                                  )}`}
                                ></div>
                                <span className="capitalize">
                                  {verification?.type ||
                                    verification?.credentialType ||
                                    verification?.category ||
                                    "N/A"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  verification?.verificationStatus ===
                                  "VERIFIED"
                                    ? "default"
                                    : verification?.verificationStatus ===
                                      "REJECTED"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {verification?.verificationStatus ===
                                  "PENDING" && (
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
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-600"
                                  onClick={() => {
                                    // Convert verification record to match expected credential structure
                                    const credentialForModal = {
                                      ...verification,
                                      title:
                                        verification?.title ||
                                        verification?.name ||
                                        verification?.credentialType,
                                      type:
                                        verification?.type ||
                                        verification?.credentialType ||
                                        verification?.category,
                                      verificationStatus:
                                        verification?.verificationStatus ||
                                        "PENDING",
                                      issueDate: verification?.issueDate,
                                      expiryDate: verification?.expiryDate,
                                      issuingOrganization:
                                        verification?.verifyingOrganization ||
                                        verification?.issuingOrganization,
                                      description: verification?.description,
                                      // Keep original array of attachments if available
                                      attachments:
                                        verification?.attachments || [],
                                      // Also keep imageUrl for backwards compatibility
                                      imageUrl:
                                        verification?.attachments?.[0] || null,
                                      user:
                                        verification?.user ||
                                        verification?.userId,
                                      // Add IPFS hash for document viewing
                                      ipfsHash:
                                        verification?.ipfsHash ||
                                        verification?.evidenceHash,
                                    };
                                    setSelectedCredential(credentialForModal);
                                    setIsModalOpen(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-1" /> View
                                </Button>

                                {/* Document Viewer Button - Show only when document is available */}
                                {(verification?.ipfsHash ||
                                  verification?.evidenceHash ||
                                  verification?.imageUrl) && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-green-50 border-green-200 hover:bg-green-100 text-green-600"
                                    onClick={() => {
                                      // Use the same conversion but immediately open document viewer
                                      const credentialForModal = {
                                        ...verification,
                                        title:
                                          verification?.title ||
                                          verification?.name ||
                                          verification?.credentialType,
                                        ipfsHash:
                                          verification?.ipfsHash ||
                                          verification?.evidenceHash,
                                        imageUrl: verification?.imageUrl,
                                      };
                                      setSelectedCredential(credentialForModal);
                                      // Set modal open and immediately trigger document view
                                      setIsModalOpen(true);
                                      // Add a small delay to ensure the modal is open before focusing on document
                                      setTimeout(() => {
                                        const documentSection =
                                          document.querySelector(
                                            "[data-document-section]"
                                          );
                                        if (documentSection) {
                                          documentSection.scrollIntoView({
                                            behavior: "smooth",
                                          });
                                        }
                                      }, 300);
                                    }}
                                  >
                                    <FileText className="w-4 h-4 mr-1" />{" "}
                                    Document
                                  </Button>
                                )}
                                {verification?.verificationStatus ===
                                  "PENDING" && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-green-600 hover:text-green-700"
                                      onClick={() =>
                                        handleApprove(verification._id)
                                      }
                                      disabled={
                                        updateVerificationStatus.isPending
                                      }
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700"
                                      onClick={() =>
                                        handleReject(verification._id)
                                      }
                                      disabled={
                                        updateVerificationStatus.isPending
                                      }
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
                </div>

                {/* Mobile View - Card-based layout */}
                <div className="md:hidden">
                  {filteredCredentials.length > 0 ? (
                    <div className="divide-y">
                      {filteredCredentials.map((verification) => (
                        <div key={verification._id} className="p-4 space-y-3">
                          {/* Title and status */}
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-medium text-sm">
                              {verification?.title ||
                                verification?.name ||
                                verification?.credentialType ||
                                "N/A"}
                            </h4>
                            <Badge
                              variant={
                                verification?.verificationStatus === "VERIFIED"
                                  ? "default"
                                  : verification?.verificationStatus ===
                                    "REJECTED"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="ml-auto whitespace-nowrap"
                            >
                              {verification?.verificationStatus ===
                                "PENDING" && <Clock className="w-3 h-3 mr-1" />}
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
                          </div>

                          {/* Mobile card content */}
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Talent:</span>
                              <span className="font-medium text-right">
                                {verification?.user?.email ||
                                  (verification?.user?._id &&
                                    (verification?.userId?.role ===
                                      "ORGANIZATION" &&
                                    verification?.userId?.companyName
                                      ? verification?.userId?.companyName
                                      : verification?.userId?.firstName +
                                          " " +
                                          verification?.userId?.lastName ||
                                        "N/A")) ||
                                  "N/A"}
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-gray-500">Verifier:</span>
                              <span className="font-medium text-right">
                                {verification?.verifyingOrganization ||
                                  verification?.issuingOrganization ||
                                  verification?.verifiedBy ||
                                  "N/A"}
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-gray-500">Type:</span>
                              <div className="flex items-center gap-1 capitalize">
                                <div
                                  className={`w-2.5 h-2.5 rounded-full ${getBadgeColor(
                                    (
                                      verification?.type ||
                                      verification?.credentialType ||
                                      ""
                                    )?.toLowerCase() || "default"
                                  )}`}
                                ></div>
                                <span>
                                  {verification?.type ||
                                    verification?.credentialType ||
                                    verification?.category ||
                                    "N/A"}
                                </span>
                              </div>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-gray-500">Submitted:</span>
                              <span>
                                {verification?.createdAt
                                  ? convertDate(verification.createdAt)
                                  : "N/A"}
                              </span>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex justify-end gap-2 pt-2">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const credentialForModal = {
                                    ...verification,
                                    title:
                                      verification?.title ||
                                      verification?.name ||
                                      verification?.credentialType,
                                    type:
                                      verification?.type ||
                                      verification?.credentialType ||
                                      verification?.category,
                                    verificationStatus:
                                      verification?.verificationStatus ||
                                      "PENDING",
                                    issueDate: verification?.issueDate,
                                    expiryDate: verification?.expiryDate,
                                    issuingOrganization:
                                      verification?.verifyingOrganization ||
                                      verification?.issuingOrganization,
                                    description: verification?.description,
                                    // Keep original array of attachments if available
                                    attachments:
                                      verification?.attachments || [],
                                    // Also keep imageUrl for backwards compatibility
                                    imageUrl:
                                      verification?.attachments?.[0] || null,
                                    user:
                                      verification?.user ||
                                      verification?.userId,
                                    // Add IPFS hash for document viewing
                                    ipfsHash:
                                      verification?.ipfsHash ||
                                      verification?.evidenceHash,
                                  };
                                  setSelectedCredential(credentialForModal);
                                  setIsModalOpen(true);
                                }}
                                className="h-8 px-2 bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-600"
                              >
                                <Eye className="w-3.5 h-3.5 mr-1" /> View
                              </Button>

                              {/* Document Viewer Button - Show only when document is available */}
                              {(verification?.ipfsHash ||
                                verification?.evidenceHash ||
                                verification?.imageUrl) && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-2 bg-green-50 border-green-200 hover:bg-green-100 text-green-600"
                                  onClick={() => {
                                    const credentialForModal = {
                                      ...verification,
                                      title:
                                        verification?.title ||
                                        verification?.name ||
                                        verification?.credentialType,
                                      ipfsHash:
                                        verification?.ipfsHash ||
                                        verification?.evidenceHash,
                                      imageUrl: verification?.imageUrl,
                                    };
                                    setSelectedCredential(credentialForModal);
                                    setIsModalOpen(true);
                                    setTimeout(() => {
                                      const documentSection =
                                        document.querySelector(
                                          "[data-document-section]"
                                        );
                                      if (documentSection) {
                                        documentSection.scrollIntoView({
                                          behavior: "smooth",
                                        });
                                      }
                                    }, 300);
                                  }}
                                >
                                  <FileText className="w-3.5 h-3.5 mr-1" />{" "}
                                  Document
                                </Button>
                              )}
                            </div>

                            {verification?.verificationStatus === "PENDING" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-green-600 border-green-200 hover:bg-green-50 h-8 px-2"
                                  onClick={() =>
                                    handleApprove(verification._id)
                                  }
                                  disabled={updateVerificationStatus.isPending}
                                >
                                  <CheckCircle className="w-3.5 h-3.5 mr-1" />{" "}
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50 h-8 px-2"
                                  onClick={() => handleReject(verification._id)}
                                  disabled={updateVerificationStatus.isPending}
                                >
                                  <XCircle className="w-3.5 h-3.5 mr-1" />{" "}
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No verification requests found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {!isLoading && !isError && filteredCredentials.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No verification requests found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Credential Detail Modal */}
      {selectedCredential && (
        <CredentialDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          credential={selectedCredential}
          onApprove={() => {
            handleApprove(selectedCredential._id);
            setIsModalOpen(false);
          }}
          onReject={() => {
            handleReject(selectedCredential._id);
            setIsModalOpen(false);
          }}
          isPending={updateVerificationStatus.isPending}
        />
      )}
    </div>
  );
}
