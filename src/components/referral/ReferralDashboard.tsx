
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Copy, Share2, Trophy, Users, Gift, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ReferralData, ReferralStats, LeaderboardEntry } from "@/types/referral";

const mockReferralStats: ReferralStats = {
  totalReferrals: 12,
  completedReferrals: 8,
  pendingReferrals: 4,
  totalRewards: 240,
  rank: 3
};

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

const mockLeaderboard: LeaderboardEntry[] = [
  {
    userId: "user1",
    userName: "Alex Johnson",
    userEmail: "alex@example.com",
    totalReferrals: 25,
    completedReferrals: 20,
    totalRewards: 600,
    rank: 1
  },
  {
    userId: "user2",
    userName: "Sarah Wilson",
    userEmail: "sarah@example.com",
    totalReferrals: 18,
    completedReferrals: 15,
    totalRewards: 450,
    rank: 2
  }
];

export function ReferralDashboard() {
  const { toast } = useToast();
  const [referralLink] = useState("https://propellant.com/ref/alex-johnson-123");

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link Copied!",
      description: "Your referral link has been copied to clipboard.",
    });
  };

  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Propellant',
        text: 'Join me on Propellant and get rewarded!',
        url: referralLink,
      });
    } else {
      copyReferralLink();
    }
  };

  return (
    <div className="space-y-6">
      {/* Referral Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-blue-700">Total Referrals</p>
                <p className="text-2xl font-bold text-blue-900">{mockReferralStats.totalReferrals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Gift className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-green-700">Total Rewards</p>
                <p className="text-2xl font-bold text-green-900">${mockReferralStats.totalRewards}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-purple-700">Leaderboard Rank</p>
                <p className="text-2xl font-bold text-purple-900">#{mockReferralStats.rank}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-orange-700">Pending</p>
                <p className="text-2xl font-bold text-orange-900">{mockReferralStats.pendingReferrals}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>Share this link to earn rewards for each successful referral</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input value={referralLink} readOnly className="flex-1" />
            <Button onClick={copyReferralLink} variant="outline">
              <Copy className="w-4 h-4" />
            </Button>
            <Button onClick={shareReferralLink}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* My Referrals */}
      <Card>
        <CardHeader>
          <CardTitle>My Referrals</CardTitle>
          <CardDescription>Track the status of people you've referred</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Referred</TableHead>
                <TableHead>Reward</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReferrals.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell className="font-medium">{referral.referredUserName}</TableCell>
                  <TableCell>{referral.referredUserEmail}</TableCell>
                  <TableCell>
                    <Badge variant={referral.status === 'completed' ? 'default' : 'secondary'}>
                      {referral.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{referral.createdAt}</TableCell>
                  <TableCell>
                    {referral.reward ? `$${referral.reward}` : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Referral Leaderboard</CardTitle>
          <CardDescription>See how you rank against other top referrers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Total Referrals</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Total Rewards</TableHead>
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
                  <TableCell className="font-medium">{entry.userName}</TableCell>
                  <TableCell>{entry.totalReferrals}</TableCell>
                  <TableCell>{entry.completedReferrals}</TableCell>
                  <TableCell>${entry.totalRewards}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
