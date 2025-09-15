import React from "react";
// import { useNFTLimits } from "@/context/NFTLimitsContext";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const NFTUsageIndicator: React.FC = () => {
  // Commented out NFT usage functionality
  /*
  const {
    nftCount,
    nftLimit,
    canCreateNFT,
    remainingNFTs,
    usagePercentage,
    currentPlan,
    lastResetDate,
  } = useNFTLimits();

  // Determine progress color based on usage percentage
  const getProgressColor = () => {
    if (usagePercentage < 50) return "bg-emerald-500";
    if (usagePercentage < 80) return "bg-amber-500";
    return "bg-red-500";
  };

  // No need to show for unlimited plans
  if (nftLimit === -1) {
    return (
      <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-medium">NFT Credential Issuance</h3>
          <span className="text-emerald-400 font-semibold">
            Enterprise Plan
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-300">{nftCount} NFTs issued</span>
          <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-medium">
            Unlimited
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-400">
          <p>
            NFT limits are now managed by administrators. Contact admin for
            changes.
          </p>
        </div>
      </div>
    );
  }

  // Format the last reset date nicely
  const formatLastResetDate = () => {
    if (!lastResetDate) return "Never";

    const resetDate = new Date(lastResetDate);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(resetDate);
  };

  // Calculate next reset date (first day of next month)
  const getNextResetDate = () => {
    const today = new Date();
    // First day of next month
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(nextMonth);
  };
  */

  // Simple placeholder component
  return (
    <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-medium">Credential Management</h3>
        <span className="text-emerald-400 font-semibold">
          Organization View
        </span>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-300">
          Manage your organization's credentials
        </span>
      </div>
      {/* Commenting out all the NFT usage-related content
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-300">
          {nftCount} of {nftLimit} NFTs used
        </span>
        <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-medium">
          {remainingNFTs} remaining
        </span>
      </div>
      <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
        <span>Last reset: {formatLastResetDate()}</span>
        <span>Next reset: {getNextResetDate()}</span>
      </div>
      <div className="mb-2 text-xs text-slate-400">
        <p>
          NFT limits are now managed by administrators. Contact admin for
          changes.
        </p>
      </div>
      <Progress value={usagePercentage} className="h-2 bg-slate-700">
        <div
          className={`h-full ${getProgressColor()}`}
          style={{ width: `${usagePercentage}%` }}
        />
      </Progress>

      {!canCreateNFT && (
        <Alert className="mt-3 bg-red-900/20 border-red-900/30 text-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>NFT Limit Reached</AlertTitle>
          <AlertDescription>
            You've reached your plan's NFT limit. Upgrade your subscription to
            verify more credentials.
          </AlertDescription>
        </Alert>
      )}

      {canCreateNFT && usagePercentage > 80 && (
        <Alert className="mt-3 bg-amber-900/20 border-amber-900/30 text-amber-400">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>NFT Limit Approaching</AlertTitle>
          <AlertDescription>
            You're approaching your plan's NFT limit. Consider upgrading your
            subscription soon.
          </AlertDescription>
        </Alert>
      )}
      */}
    </div>
  );
};

export default NFTUsageIndicator;
