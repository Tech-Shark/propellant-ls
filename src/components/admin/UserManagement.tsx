import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateOrganizationModal } from "./CreateOrganizationModal";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  UserCheck,
  UserX,
  Eye,
  Mail,
  ChevronRight,
  ChevronLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { User } from "@/types/user.ts";
import { convertDate } from "@/utils/helperfunctions.ts";
import { toast } from "sonner";
import {
  useAdminUsers,
  useSuspendUser,
  useUnsuspendUser,
} from "@/lib/react-query/hooks/useUsersManagement";

export function UserManagement() {
  const [roleFilter, setRoleFilter] = useState("all");
  const [params, setParams] = useState({
    page: 1,
    size: 10,
    isDeleted: "false",
    search: "",
  });
  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);

  // Combine params with roleFilter
  const queryParams = {
    ...params,
    role: roleFilter === "all" ? "" : roleFilter,
  };

  // Use React Query hook for fetching users
  const {
    data: usersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminUsers(queryParams);

  // Extract users and pagination data
  const users = usersData?.data || [];
  const pagination = usersData?.pagination || null;

  // Use React Query hooks for user actions
  const suspendUserMutation = useSuspendUser();
  const unsuspendUserMutation = useUnsuspendUser();

  // Track which user is being processed to show loading indicator on the correct row
  const [actionUserId, setActionUserId] = useState<string | null>(null);

  // For search debouncing
  const [searchTerm, setSearchTerm] = useState(params.search || "");

  // Debounce search term changes
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchTerm !== params.search) {
        setParams((prevParams) => ({
          ...prevParams,
          search: searchTerm,
          page: 1, // Reset to first page when searching
        }));
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  const handleParamChange = (name: string, value: string | number) => {
    setParams((prevParams) => ({
      ...prevParams,
      [name]: value,
      // Reset page to 1 when changing search or filters, but not when changing page itself
      ...(name !== "page" ? { page: 1 } : {}),
    }));
  };

  // Update the page when role filter changes
  const handleRoleChange = (role: string) => {
    setRoleFilter(role);
    setParams((prevParams) => ({
      ...prevParams,
      page: 1, // Reset to first page when changing filters
    }));
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      const accountSuspensionReason = prompt(
        "Enter the reason for suspending the user."
      );

      if (!accountSuspensionReason) {
        toast.error("Please enter a reason for suspending the user.");
        return;
      }

      setActionUserId(userId);

      await toast.promise(
        suspendUserMutation.mutateAsync({ userId, accountSuspensionReason }),
        {
          loading: "Suspending user...",
          success: () => "User suspended successfully.",
          error: (err) =>
            `Failed to suspend user: ${err.message || "Unknown error"}`,
        }
      );

      setActionUserId(null);
    } catch (error) {
      console.error("Error suspending user:", error);
      setActionUserId(null);
    }
  };

  const handleUnsuspendUser = async (userId: string) => {
    try {
      const accountSuspensionReason = prompt(
        "Enter the reason for unsuspending the user."
      );

      if (!accountSuspensionReason) {
        toast.error("Please enter a reason for unsuspending the user.");
        return;
      }

      setActionUserId(userId);

      await toast.promise(
        unsuspendUserMutation.mutateAsync({ userId, accountSuspensionReason }),
        {
          loading: "Unsuspending user...",
          success: () => "User unsuspended successfully.",
          error: (err) =>
            `Failed to unsuspend user: ${err.message || "Unknown error"}`,
        }
      );

      setActionUserId(null);
    } catch (error) {
      console.error("Error unsuspending user:", error);
      setActionUserId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage all platform users and their permissions
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateOrgModal(true)}>
              Create Organization Account
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="TALENT">Talent</SelectItem>
                <SelectItem value="ORGANIZATION">Organization</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading users...</span>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="flex items-center p-4 border border-red-200 bg-red-50 rounded-md text-red-700 mb-4">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p>
                Error loading users:{" "}
                {error?.message || "Please try again later"}
              </p>
            </div>
          )}

          {/* Data Table */}
          {!isLoading && !isError && (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Total Referrals</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Suspended</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {user.role === "ORGANIZATION" && user.companyName
                              ? user.companyName
                              : user.fullname || user.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "ADMIN"
                              ? "destructive"
                              : user.role === "ORGANIZATION"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.role === "TALENT" ? user.totalReferrals : "N/A"}
                      </TableCell>
                      <TableCell>{convertDate(user.createdAt)}</TableCell>
                      <TableCell>{convertDate(user.lastLoginAt)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={user.deactivated ? "destructive" : "default"}
                        >
                          {user.deactivated ? "True" : "False"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Message
                            </DropdownMenuItem>
                            {!user.deactivated ? (
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleSuspendUser(user._id)}
                                disabled={
                                  suspendUserMutation.isPending &&
                                  actionUserId === user._id
                                }
                              >
                                {suspendUserMutation.isPending &&
                                actionUserId === user._id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <UserX className="mr-2 h-4 w-4" />
                                )}
                                Suspend User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleUnsuspendUser(user._id)}
                                className="text-green-600"
                                disabled={
                                  unsuspendUserMutation.isPending &&
                                  actionUserId === user._id
                                }
                              >
                                {unsuspendUserMutation.isPending &&
                                actionUserId === user._id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <UserCheck className="mr-2 h-4 w-4" />
                                )}
                                Activate User
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-end gap-5 px-4 py-2">
                {pagination && pagination.page > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border flex items-center gap-2"
                    onClick={() =>
                      handleParamChange("page", pagination.page - 1)
                    }
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <p>Previous Page</p>
                  </Button>
                )}

                {pagination && pagination.page < pagination.lastPage && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border flex items-center gap-2"
                    onClick={() =>
                      handleParamChange("page", pagination.page + 1)
                    }
                  >
                    <p>Next Page</p>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Empty state */}
              {users.length === 0 && !isLoading && (
                <div className="text-center py-8 text-gray-500">
                  No users found matching your search criteria.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateOrganizationModal
        open={showCreateOrgModal}
        onOpenChange={setShowCreateOrgModal}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
