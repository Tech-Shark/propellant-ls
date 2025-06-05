
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Copy, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw,
  Shield,
  Key,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { WalletData, Transaction } from "@/types/referral";

const mockWallet: WalletData = {
  address: "0x742d35cc6479c40e4c4f4d7c2fa9b2e8e2f8b9c1",
  balance: 1250.75,
  currency: "USD",
  transactions: [
    {
      id: "1",
      type: "referral_reward",
      amount: 30,
      currency: "USD",
      status: "completed",
      timestamp: "2024-06-05T10:30:00Z",
      description: "Referral reward for John Doe",
      txHash: "0xabc123..."
    },
    {
      id: "2",
      type: "deposit",
      amount: 500,
      currency: "USD",
      status: "completed",
      timestamp: "2024-06-04T15:20:00Z",
      description: "Bank transfer deposit"
    }
  ]
};

export function WalletDashboard() {
  const { toast } = useToast();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(mockWallet.address);
    toast({
      title: "Address Copied!",
      description: "Your wallet address has been copied to clipboard.",
    });
  };

  const handleDeposit = () => {
    toast({
      title: "Deposit Initiated",
      description: `Deposit of $${depositAmount} has been initiated.`,
    });
    setDepositAmount("");
  };

  const handleWithdraw = () => {
    toast({
      title: "Withdrawal Initiated",
      description: `Withdrawal of $${withdrawAmount} has been initiated.`,
    });
    setWithdrawAmount("");
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'referral_reward':
        return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
      case 'withdrawal':
      case 'transfer':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      default:
        return <RefreshCw className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Wallet className="w-8 h-8" />
              <div>
                <h3 className="text-lg font-semibold">Your Wallet</h3>
                <p className="text-slate-300 text-sm">Propellant Wallet</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-600 text-white">Active</Badge>
          </div>
          
          <div className="mb-4">
            <p className="text-slate-300 text-sm">Total Balance</p>
            <p className="text-3xl font-bold">${mockWallet.balance.toLocaleString()}</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-3 mb-4">
            <p className="text-slate-300 text-xs mb-1">Wallet Address</p>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono flex-1 truncate">{mockWallet.address}</code>
              <Button size="sm" variant="ghost" onClick={copyWalletAddress}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent wallet activity</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockWallet.transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(tx.type)}
                          <span className="capitalize">{tx.type.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>{tx.description}</TableCell>
                      <TableCell className={tx.type === 'withdrawal' || tx.type === 'transfer' ? 'text-red-600' : 'text-green-600'}>
                        {tx.type === 'withdrawal' || tx.type === 'transfer' ? '-' : '+'}${tx.amount}
                      </TableCell>
                      <TableCell>
                        <Badge variant={tx.status === 'completed' ? 'default' : tx.status === 'pending' ? 'secondary' : 'destructive'}>
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(tx.timestamp).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deposit">
          <Card>
            <CardHeader>
              <CardTitle>Deposit Funds</CardTitle>
              <CardDescription>Add money to your Propellant wallet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Amount</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>
              <Button onClick={handleDeposit} className="w-full" disabled={!depositAmount}>
                <ArrowDownLeft className="w-4 h-4 mr-2" />
                Deposit ${depositAmount || '0.00'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Funds</CardTitle>
              <CardDescription>Transfer money from your Propellant wallet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Amount</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>
              <Button onClick={handleWithdraw} variant="outline" className="w-full" disabled={!withdrawAmount}>
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Withdraw ${withdrawAmount || '0.00'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Security</CardTitle>
              <CardDescription>Manage your wallet security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Private Key Backup</p>
                    <p className="text-sm text-gray-600">Securely backup your private key</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">Enable 2FA for extra security</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
