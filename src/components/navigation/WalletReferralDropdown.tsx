
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  Users, 
  Copy, 
  ArrowUpRight, 
  ArrowDownLeft,
  Trophy,
  Gift
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WalletReferralDropdownProps {
  onOpenWallet: () => void;
  onOpenReferrals: () => void;
}

export function WalletReferralDropdown({ onOpenWallet, onOpenReferrals }: WalletReferralDropdownProps) {
  const { toast } = useToast();
  const walletAddress = "0x742d35cc6479c40e4c4f4d7c2fa9b2e8e2f8b9c1";
  const balance = 1250.75;
  const totalReferrals = 12;

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Address Copied!",
      description: "Your wallet address has been copied to clipboard.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Wallet className="w-4 h-4" />
          <span className="hidden sm:inline">${balance.toLocaleString()}</span>
          <Badge variant="secondary" className="hidden lg:inline-flex">
            {totalReferrals} refs
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Account Overview</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Wallet Section */}
        <div className="p-3 bg-slate-50 rounded-lg mx-2 mb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              <span className="font-medium">Wallet Balance</span>
            </div>
            <span className="text-lg font-bold">${balance.toLocaleString()}</span>
          </div>
          <div className="text-xs text-gray-600 mb-2">
            <code className="bg-gray-100 px-1 rounded">{walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}</code>
            <Button variant="ghost" size="sm" className="ml-1 h-5 w-5 p-0" onClick={copyWalletAddress}>
              <Copy className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              <ArrowDownLeft className="w-3 h-3 mr-1" />
              Deposit
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              Withdraw
            </Button>
          </div>
        </div>

        {/* Referral Section */}
        <div className="p-3 bg-blue-50 rounded-lg mx-2 mb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="font-medium">Referrals</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-3 h-3 text-yellow-500" />
              <span className="font-bold">#{3}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Referred:</span>
            <span className="font-medium">{totalReferrals} users</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Rewards Earned:</span>
            <span className="font-medium text-green-600">$240</span>
          </div>
        </div>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onOpenWallet}>
          <Wallet className="mr-2 h-4 w-4" />
          <span>Manage Wallet</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onOpenReferrals}>
          <Gift className="mr-2 h-4 w-4" />
          <span>Referral Dashboard</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
