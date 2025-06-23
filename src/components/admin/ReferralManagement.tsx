
import { useState } from "react";
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
import { Search, MoreHorizontal, Trophy, Users, Gift, TrendingUp } from "lucide-react";
import type { LeaderboardEntry, ReferralData } from "@/types/referral";

const mockLeaderboard: LeaderboardEntry[] = [
  {
    userId: "1",
    userName: "Alex Johnson",
    userEmail: "alex@example.com",
    totalReferrals: 25,
    completedReferrals: 20,
    totalRewards: 600,
    rank: 1
  },
  {
    userId: "2",
    userName: "Sarah Wilson",
    userEmail: "sarah@example.com",
    totalReferrals: 18,
    completedReferrals: 15,
    totalRewards: 450,
    rank: 2
  },
  {
    userId: "3",
    userName: "Mike Chen",
    userEmail: "mike@example.com",
    totalReferrals: 12,
    completedReferrals: 8,
    totalRewards: 240,
    rank: 3
  }
];

const mockReferrals: ReferralData[] = [
  {
    id: "1",
    referrerId: "user1",
    referredUserId: "user2",
    referredUserEmail: "john@example.com",
    referredUserName: "John Doe",
    status: "completed",
    createdAt: "2024-05-15",
    completedAt: "2024-05-16",
    reward: 30
  },
  {
    id: "2",
    referrerId: "user1",
    referredUserId: "user3",
    referredUserEmail: "jane@example.com",
    referredUserName: "Jane Smith",
    status: "pending",
    createdAt: "2024-06-01"
  }
];

export function ReferralManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"leaderboard" | "referrals">("leaderboard");

  const filteredReferrals = mockReferrals.filter(referral => {
    const matchesSearch = referral.referredUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         referral.referredUserEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || referral.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalReferrals = mockReferrals.length;
  const completedReferrals = mockReferrals.filter(r => r.status === 'completed').length;
  const totalRewards = mockReferrals.reduce((sum, r) => sum + (r.reward || 0), 0);

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
                <p className="text-2xl font-bold">{totalReferrals}</p>
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
                <p className="text-2xl font-bold">{completedReferrals}</p>
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
                <p className="text-2xl font-bold">${totalRewards}</p>
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
                <p className="text-2xl font-bold">{mockLeaderboard.length}</p>
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
          className="flex-1"
        >
          Leaderboard
        </Button>
        <Button
          variant={activeTab === "referrals" ? "default" : "ghost"}
          onClick={() => setActiveTab("referrals")}
          className="flex-1"
        >
          All Referrals
        </Button>
      </div>

      {activeTab === "leaderboard" && (
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
                {mockLeaderboard.map((entry) => (
                  <TableRow key={entry.userId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">#{entry.rank}</span>
                        {entry.rank <= 3 && <Trophy className="w-4 h-4 text-yellow-500" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{entry.userName}</div>
                        <div className="text-sm text-gray-500">{entry.userEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>{entry.totalReferrals}</TableCell>
                    <TableCell>{entry.completedReferrals}</TableCell>
                    <TableCell>${entry.totalRewards}</TableCell>
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
                {filteredReferrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{referral.referredUserName}</div>
                        <div className="text-sm text-gray-500">{referral.referredUserEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>{referral.referrerId}</TableCell>
                    <TableCell>
                      <Badge variant={referral.status === 'completed' ? 'default' : 'secondary'}>
                        {referral.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{referral.createdAt}</TableCell>
                    <TableCell>
                      {referral.reward ? `$${referral.reward}` : '-'}
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
        </Card>
      )}
    </div>
  );
}
