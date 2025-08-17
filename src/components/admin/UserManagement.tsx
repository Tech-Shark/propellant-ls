
import {useEffect, useState} from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Search, MoreHorizontal, UserCheck, UserX, Eye, Mail, ChevronRight, ChevronLeft} from "lucide-react";
import axiosInstance from "@/api/AxiosInstance.ts";
import {UserType} from "@/utils/global";
import {User} from "@/types/user.ts";
import {convertDate} from "@/utils/helperfunctions.ts";
import {toast} from "sonner";

export function UserManagement() {
  const [roleFilter, setRoleFilter] = useState("all");

  const [pageData, setPageData] = useState<{
    lastPage: number,
    page: number,
    size: number,
    total: number
  } | null>(null);

  const [param, setParam] = useState({
    page: 1,
    size: 10,
    isDeleted: "false",
  })

  const handleParamChange = (name: string, value: string) => {
    setParam({
      ...param,
      [name]: value
    })
  }

  const [totalUsers, setTotalUsers] = useState<User[] | null>(null);

  useEffect(() => {
    handleFetchAllUsers();
  }, [param, roleFilter]);

  const handleFetchAllUsers = async () => {
    try {
      const response = await axiosInstance.get("/users/admin/all", {
        params: {...param, role: roleFilter === "all" ? "" : roleFilter}
      })

      console.log(response.data);
      setTotalUsers(response.data.data.data);
      setPageData(response.data.data.meta)
      console.log(response.data.data.meta)
    } catch (error) {
      console.log(error);
    }
  }

  const handleSuspendUser = async (userId: string) => {
    try {
      const accountSuspensionReason = prompt("Enter the reason for suspending the user.");

      if (!accountSuspensionReason) {
        toast.error("Please enter a reason for suspending the user.");
        alert("Please enter a reason for suspending the user.");
      }

      const suspendPromise = axiosInstance.patch(`/users/admin/suspend?_id=${userId}`, {
        accountSuspensionReason
      });

      toast.promise(suspendPromise, {
        loading: "Suspending user...",
        success: (response) => {
          handleFetchAllUsers();
          console.log(response);
          return "User suspended successfully."
        },
        error: (error) => {
          console.log(error)
          return "Failed to suspend user."
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  const handleUnSuspendUser = async (userId: string) => {
    try {
      const unSuspendPromise = axiosInstance.patch(`/users/admin/suspend?_id=${userId}`);

      toast.promise(unSuspendPromise, {
        loading: "Unsuspending user...",
        success: (response) => {
          handleFetchAllUsers();
          console.log(response);
          return "User Unsuspended successfully."
        },
        error: (error) => {
          console.log(error)
          return "Failed to Unsuspend user."
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage all platform users and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/*<div className="relative flex-1">*/}
            {/*  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />*/}
            {/*  <Input*/}
            {/*    placeholder="Search users by name or email..."*/}
            {/*    value={searchTerm}*/}
            {/*    name={"search"}*/}
            {/*    onChange={(e) => handleParamChange(e.target.name, e.target.value)}*/}
            {/*    onKeyDown={(e) => {*/}
            {/*      if (e.key === "Enter") {*/}
            {/*        handleFetchAllUsers();*/}
            {/*      }*/}
            {/*    }}*/}
            {/*    onBlur={() => handleFetchAllUsers()}*/}
            {/*    className="pl-10"*/}
            {/*  />*/}
            {/*</div>*/}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
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
                {totalUsers?.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.fullname}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'ADMIN' ? 'destructive' : user.role === 'ORGANIZATION' ? 'secondary' : 'default'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {
                        user.role === 'TALENT' ? user.totalReferrals : "N/A"
                      }
                    </TableCell>
                    <TableCell>{convertDate(user.createdAt)}</TableCell>
                    <TableCell>{convertDate(user.lastLoginAt)}</TableCell>
                    <TableCell>
                      <Badge variant={user.deactivated ? 'destructive' : 'default'}>
                        {
                          user.deactivated ? 'True' : 'False'
                        }
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
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Suspend User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                                onClick={() => handleUnSuspendUser(user._id)}
                                className="text-green-600"
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
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

            <div className="flex items-center justify-end gap-5 px-4">
              {
                pageData?.page > 1 && (
                  <div className="flex justify-center my-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="border flex items-center gap-2"
                        onClick={() => handleParamChange("page", String(pageData?.page - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <p>Previous Page</p>
                    </Button>
                  </div>
                )
              }

              {
                pageData?.page < pageData?.lastPage && (
                  <div className="flex justify-center my-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="border flex items-center gap-2"
                        onClick={() => handleParamChange("page", String(pageData?.page + 1))}
                    >
                      <p>
                        Next Page
                      </p>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )
              }
            </div>
          </div>

          {totalUsers?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found matching your search criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
