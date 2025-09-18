// Export common types
export interface PaginationParams {
  page?: number;
  size?: number;
  isDeleted?: string | boolean;
  [key: string]: any;
}

// Re-export the hooks we need
export { 
  // Referral hooks
  referralKeys, useReferrals, useReferralStats, useReferralLeaderboard,
  useUpdateReferralStatus, useDeleteReferral
} from './hooks/useReferrals';

export {
  // User hooks
  userKeys, useUsers, useUser, useCurrentUser, useUpdateUser, useDeleteUser
} from './hooks/useUsers';

export {
  // Verification hooks
  verificationKeys, useVerifications, useVerificationStats, useVerification,
  useUpdateVerificationStatus, useDeleteVerification
} from './hooks/useVerifications';

// Export the provider
export { ReactQueryProvider } from './index';
