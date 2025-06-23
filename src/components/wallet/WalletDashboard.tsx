
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Copy, Wallet, ArrowUpRight, ArrowDownLeft, History, Shield, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { WalletData, Transaction } from "@/types/referral";

export function WalletDashboard() {
  const { toast } = useToast();
  const [showBalance, setShowBalance] = useState(true);
  const [transferAmount, setTransferAmount] = useState('');
  
  const [walletData] = useState<WalletData>({
    address: "0x742d35Cc6641A8C4d4f5C79f9A1B74b9c8a5F2e3",
    balance: 1234.56,
    currency: "USD",
    transactions: [
      {
        id: '1',
        type: 'referral_reward',
        amount: 25.00,
        currency: 'USD',
        status: 'completed',
        timestamp: '2024-01-20T10:30:00Z',
        description: 'Referral reward for John Doe signup',
        txHash: '0xabc123def456'
      },
      {
        id: '2',
        type: 'deposit',
        amount: 500.00,
        currency: 'USD',
        status: 'completed',
        timestamp: '2024-01-18T14:15:00Z',
        description: 'Deposit from bank account',
        txHash: '0xdef789ghi012'
      },
      {
        id: '3',
        type: 'withdrawal',
        amount: 100.00,
        currency: 'USD',
        status: 'pending',
        timestamp: '2024-01-22T09:45:00Z',
        description: 'Withdrawal to bank account'
      }
    ]
  });

  const copyAddress = () => {
    navigator.clipboard.writeText(walletData.address);
    toast({
      title: "Address Copied!",
      description: "Your wallet address has been copied to clipboard."
    });
  };

  const handleDeposit = () => {
    toast({
      title: "Deposit Initiated",
      description: "Your deposit request has been processed."
    });
  };

  const handleWithdraw = () => {
    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to withdraw.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Withdrawal Initiated",
      description: `Withdrawal of $${transferAmount} has been initiated.`
    });
    setTransferAmount('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-600';
      case 'pending':
        return 'bg-orange-600';
      case 'failed':
        return 'bg-red-600';
      default:
        return 'bg-slate-600';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-emerald-400" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-red-400" />;
      case 'referral_reward':
        return <Wallet className="w-4 h-4 text-blue-400" />;
      default:
        return <History className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-600/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wallet className="w-6 h-6 text-blue-400" />
            My Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Balance</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-white">
                  {showBalance ? `$${walletData.balance.toFixed(2)}` : '****.**'}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-slate-400 hover:text-white"
                >
                  {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg">
            <p className="text-slate-400 text-sm">Address:</p>
            <p className="text-white font-mono text-sm flex-1">{walletData.address}</p>
            <Button onClick={copyAddress} variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Deposit Funds</CardTitle>
            <CardDescription className="text-slate-400">
              Add money to your wallet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleDeposit} className="w-full bg-emerald-600 hover:bg-emerald-700">
              <ArrowDownLeft className="w-4 h-4 mr-2" />
              Deposit
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Withdraw Funds</CardTitle>
            <CardDescription className="text-slate-400">
              Transfer money to your bank
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              type="number"
              placeholder="Enter amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white"
            />
            <Button onClick={handleWithdraw} variant="outline" className="w-full border-red-500 text-red-400 hover:bg-red-500/10">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <History className="w-5 h-5 text-slate-400" />
            Transaction History
          </CardTitle>
          <CardDescription className="text-slate-400">
            Your recent wallet transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {walletData.transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="text-white font-medium">{transaction.description}</p>
                    <p className="text-slate-400 text-sm">
                      {new Date(transaction.timestamp).toLocaleDateString()} • 
                      {transaction.txHash ? ` ${transaction.txHash.slice(0, 10)}...` : ' Processing'}
                    </p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className={`font-medium ${
                      transaction.type === 'deposit' || transaction.type === 'referral_reward' 
                        ? 'text-emerald-400' 
                        : 'text-red-400'
                    }`}>
                      {transaction.type === 'deposit' || transaction.type === 'referral_reward' ? '+' : '-'}
                      ${transaction.amount.toFixed(2)}
                    </p>
                  </div>
                  <Badge className={getStatusColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Wallet Security
          </CardTitle>
          <CardDescription className="text-slate-400">
            Manage your wallet security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500/10">
              Backup Wallet
            </Button>
            <Button variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-500/10">
              Recovery Options
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
