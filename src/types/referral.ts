
export interface ReferralData {
  id: string;
  referrerId: string;
  referredUserId: string;
  referredUserEmail: string;
  referredUserName: string;
  status: 'pending' | 'completed' | 'rewarded';
  createdAt: string;
  completedAt?: string;
  reward?: number;
}

export interface ReferralStats {
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  totalRewards: number;
  rank: number;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  userEmail: string;
  totalReferrals: number;
  completedReferrals: number;
  totalRewards: number;
  rank: number;
}

export interface WalletData {
  address: string;
  balance: number;
  currency: string;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'referral_reward' | 'transfer';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  description: string;
  txHash?: string;
}
