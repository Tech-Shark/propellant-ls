
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
import {Search, MoreHorizontal, Trophy, Users, Gift, TrendingUp, ChevronLeft, ChevronRight} from "lucide-react";
import type { LeaderboardEntry, ReferralData } from "@/types/referral";
import axiosInstance from "@/api/AxiosInstance.ts";
import {ReferralLeaderboardEntry, ReferralRecord, ReferralStats} from "@/utils/global";
import {convertDate} from "@/utils/helperfunctions.ts";


export function ReferralManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"leaderboard" | "referrals">("leaderboard");

  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<ReferralLeaderboardEntry[]>([]);

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

  const [leaderPageData, setLeaderPageData] = useState<{
    lastPage: number,
    page: number,
    size: number,
    total: number
  } | null>(null);

  const [leaderParam, setLeaderParam] = useState({
    page: 1,
    size: 10,
    isDeleted: "false",
  })

  const handleLeaderParamChange = (name: string, value: string) => {
    setLeaderParam({
      ...param,
      [name]: value
    })
  }

  const handleFetchAllReferrers = async () => {
    try {
      const response = await axiosInstance.get("/users/admin/referrals", {
        params: {...param}
      })

      console.log(response.data.data.data);
      setReferrals(response.data.data.data);
      setPageData(response.data.data.meta);
      console.log(response.data.data.meta);
    } catch (error) {
      console.log(error);
    }
  }

  const handleFetchReferralStats = async () => {
    try {
      const response = await axiosInstance.get("/users/admin/referrals/stats", {
        params: {...param}
      })

      console.log(response.data.data);
      setReferralStats(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleFetchLeaderboard = async () => {
    try {
      const response = await axiosInstance.get("/users/admin/referrals/leaderboard?sortBy=totalReferrals", {
        params: {...leaderParam}
      })

      setLeaderboard(response.data.data.data);
      setLeaderPageData(response.data.data.meta);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleFetchAllReferrers();
  }, [param]);

  useEffect(() => {
    handleFetchReferralStats();
  }, []);

  useEffect(() => {
    handleFetchLeaderboard();
  }, [leaderParam]);


  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold">{referralStats?.totalReferrals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{referralStats?.completedReferrals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Gift className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Rewards</p>
                <p className="text-2xl font-bold">{referralStats?.totalRewards} points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{referralStats?.activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <Button
          variant={activeTab === "leaderboard" ? "default" : "ghost"}
          onClick={() => setActiveTab("leaderboard")}
          className="flex-1 text-black"
        >
          Leaderboard
        </Button>
        <Button
          variant={activeTab === "referrals" ? "default" : "ghost"}
          onClick={() => setActiveTab("referrals")}
          className="flex-1 text-black"
        >
          All Referrals
        </Button>
      </div>

      {activeTab === "leaderboard" && (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Referral Leaderboard</CardTitle>
                <CardDescription>Top performing users by referrals</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Total Referrals</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Total Rewards</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboard && leaderboard.map((entry) => (
                        <TableRow key={entry.rank}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">#{entry.rank}</span>
                              {entry.rank <= 3 && <Trophy className="w-4 h-4 text-yellow-500" />}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{entry.user.fullname}</div>
                              <div className="text-sm text-gray-500">{entry.user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{entry.user.totalReferrals}</TableCell>
                          <TableCell>{entry.user.completedReferrals}</TableCell>
                          <TableCell>${entry.user.referralPoint}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Send Bonus</DropdownMenuItem>
                                <DropdownMenuItem>View Referrals</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <div className="flex items-center justify-end gap-5 px-4">
              {
                  leaderPageData?.page > 1 && (
                      <div className="flex justify-center my-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="border flex items-center gap-2"
                            onClick={() => handleLeaderParamChange("page", String(leaderPageData?.page - 1))}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <p>Previous Page</p>
                        </Button>
                      </div>
                  )
              }

              {
                  leaderPageData?.page < leaderPageData?.lastPage && (
                      <div className="flex justify-center my-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="border flex items-center gap-2"
                            onClick={() => handleLeaderParamChange("page", String(leaderPageData?.page + 1))}
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
      )}

      {activeTab === "referrals" && (
        <Card>
          <CardHeader>
            <CardTitle>All Referrals</CardTitle>
            <CardDescription>Manage all referral activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search referrals..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rewarded">Rewarded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Referred User</TableHead>
                  <TableHead>Referrer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reward</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{referral?.referredUser?.fullname}</div>
                        <div className="text-sm text-gray-500">{referral?.referredUser?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{referral?.referrer?.fullname}</TableCell>
                    <TableCell>
                      <Badge variant={referral.status === 'completed' ? 'default' : 'secondary'}>
                        {referral?.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{convertDate(referral?.createdAt)}</TableCell>
                    <TableCell>
                      {referral?.referrer?.reward ? `$${referral?.referrer?.reward}` : '-'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Approve Reward</DropdownMenuItem>
                          <DropdownMenuItem>Send Message</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
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
        </Card>
      )}
    </div>
  );
}
