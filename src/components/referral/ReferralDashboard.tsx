
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Copy, Users, Trophy, Gift, Share2, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ReferralData, ReferralStats, LeaderboardEntry } from "@/types/referral";

export function ReferralDashboard() {
  const { toast } = useToast();
  const [referralLink] = useState("https://propellant.com/invite/user123");
  
  const [stats] = useState<ReferralStats>({
    totalReferrals: 12,
    completedReferrals: 8,
    pendingReferrals: 4,
    totalRewards: 240,
    rank: 5
  });

  const [referrals] = useState<ReferralData[]>([
    {
      id: '1',
      referrerId: 'user123',
      referredUserId: 'user456',
      referredUserEmail: 'john@example.com',
      referredUserName: 'John Doe',
      status: 'completed',
      createdAt: '2024-01-15',
      completedAt: '2024-01-20',
      reward: 25
    },
    {
      id: '2',
      referrerId: 'user123',
      referredUserId: 'user789',
      referredUserEmail: 'jane@example.com',
      referredUserName: 'Jane Smith',
      status: 'pending',
      createdAt: '2024-01-18'
    }
  ]);

  const [leaderboard] = useState<LeaderboardEntry[]>([
    {
      userId: 'top1',
      userName: 'Alice Johnson',
      userEmail: 'alice@example.com',
      totalReferrals: 45,
      completedReferrals: 42,
      totalRewards: 1050,
      rank: 1
    },
    {
      userId: 'top2',
      userName: 'Bob Wilson',
      userEmail: 'bob@example.com',
      totalReferrals: 38,
      completedReferrals: 35,
      totalRewards: 875,
      rank: 2
    }
  ]);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link Copied!",
      description: "Your referral link has been copied to clipboard."
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Referrals</p>
                <p className="text-2xl font-bold text-white">{stats.totalReferrals}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-white">{stats.completedReferrals}</p>
              </div>
              <Trophy className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Rewards</p>
                <p className="text-2xl font-bold text-white">${stats.totalRewards}</p>
              </div>
              <Gift className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Your Rank</p>
                <p className="text-2xl font-bold text-white">#{stats.rank}</p>
              </div>
              <Crown className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-400" />
            Your Referral Link
          </CardTitle>
          <CardDescription className="text-slate-400">
            Share this link with friends to earn rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={referralLink}
              readOnly
              className="bg-slate-800 border-slate-600 text-white"
            />
            <Button onClick={copyReferralLink} variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500/10">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Referrals */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">My Referrals</CardTitle>
            <CardDescription className="text-slate-400">
              People you've referred to the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {referrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{referral.referredUserName}</p>
                    <p className="text-slate-400 text-sm">{referral.referredUserEmail}</p>
                    <p className="text-slate-500 text-xs">Referred: {referral.createdAt}</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={referral.status === 'completed' ? 'default' : 'secondary'}
                      className={referral.status === 'completed' ? 'bg-emerald-600' : ''}
                    >
                      {referral.status}
                    </Badge>
                    {referral.reward && (
                      <p className="text-emerald-400 text-sm mt-1">+${referral.reward}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Leaderboard</CardTitle>
            <CardDescription className="text-slate-400">
              Top referrers on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboard.map((entry) => (
                <div key={entry.userId} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">#{entry.rank}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{entry.userName}</p>
                      <p className="text-slate-400 text-sm">{entry.completedReferrals} referrals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-medium">${entry.totalRewards}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
