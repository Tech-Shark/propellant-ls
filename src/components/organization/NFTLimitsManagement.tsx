import React from "react";
import { useNFTLimits } from "@/context/NFTLimitsContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Settings, RefreshCw, TrendingUp } from "lucide-react";

const NFTLimitsManagement: React.FC = () => {
  const {
    nftCount,
    nftLimit,
    currentPlan,
    resetNFTCount,
    changePlan,
    usagePercentage,
  } = useNFTLimits();

  // Determine progress color based on usage percentage
  const getProgressColor = () => {
    if (usagePercentage < 50) return "bg-emerald-500";
    if (usagePercentage < 80) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Settings className="w-5 h-5 text-blue-400 mr-2" />
          NFT Credential Limits
        </CardTitle>
        <CardDescription className="text-slate-400">
          Manage your organization's NFT credential issuance limits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800 rounded-lg flex flex-col items-center justify-center">
            <p className="text-slate-400 mb-1">Current Plan</p>
            <p className="text-2xl font-bold text-white">{currentPlan}</p>
          </div>

          <div className="p-4 bg-slate-800 rounded-lg flex flex-col items-center justify-center">
            <p className="text-slate-400 mb-1">NFTs Created</p>
            <p className="text-2xl font-bold text-white">{nftCount}</p>
          </div>

          <div className="p-4 bg-slate-800 rounded-lg flex flex-col items-center justify-center">
            <p className="text-slate-400 mb-1">NFT Limit</p>
            <p className="text-2xl font-bold text-white">
              {nftLimit === -1 ? "∞" : nftLimit}
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-800 rounded-lg">
          <p className="text-white mb-2">Usage ({usagePercentage}%)</p>
          <Progress value={usagePercentage} className="h-2 bg-slate-700">
            <div
              className={`h-full ${getProgressColor()}`}
              style={{ width: `${usagePercentage}%` }}
            />
          </Progress>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-white mb-2">Change Plan (For testing)</p>
            <Select
              defaultValue={currentPlan}
              onValueChange={(value) => changePlan(value)}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="FREE">Free Tier (30 NFTs)</SelectItem>
                <SelectItem value="BASIC">Basic Tier (20 NFTs)</SelectItem>
                <SelectItem value="PREMIUM">Premium Tier (50 NFTs)</SelectItem>
                <SelectItem value="ENTERPRISE">
                  Enterprise Tier (Unlimited)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-700"
              onClick={resetNFTCount}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset NFT Counter
            </Button>
          </div>
        </div>

        <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
          <div className="flex items-start">
            <TrendingUp className="w-5 h-5 text-blue-400 mr-2 mt-0.5" />
            <div>
              <p className="text-white font-medium">
                NFT Credential Issuance Limits
              </p>
              <p className="text-slate-300 mt-1">
                These limits are enforced on the frontend only. To implement
                server-side enforcement, backend changes would be required. This
                solution allows for testing and demonstration of plan-based
                limits without modifying the backend.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NFTLimitsManagement;
