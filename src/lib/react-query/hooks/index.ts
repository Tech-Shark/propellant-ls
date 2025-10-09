// Export all hooks
// Note: We're not using wildcard exports to avoid naming conflicts with common types like PaginationParams
export {
  referralKeys,
  useReferrals,
  useReferralStats,
  useReferralLeaderboard,
  useUpdateReferralStatus,
  useDeleteReferral,
} from './useReferrals';

export {
  userKeys,
  useUsers,
  useUser,
  useCurrentUser,
  useUpdateUser,
  useDeleteUser,
} from './useUsers';

export {
  useAdminUsers,
  useSuspendUser,
  useUnsuspendUser,
} from './useUsersManagement';

export {
  verificationKeys,
  useVerifications,
  useVerificationStats,
  useUpdateVerificationStatus,
} from './useVerifications';

export {
  settingsKeys,
  useSettings,
  useUpdateSettings,
  useSubscriptionPlans,
  useCreateSubscriptionPlan,
  useUpdateSubscriptionPlan,
  useDeleteSubscriptionPlan,
  useSystemConfig,
  useUpdateSystemConfig,
} from './useSettings';

export {
  paymentKeys,
  usePaymentMethods,
  useCreatePaymentMethod,
  useUpdatePaymentMethod,
  useDeletePaymentMethod,
} from './usePayment';

export {
  jobKeys,
  useJobStats,
} from './useJobData';

export {
  adminStatsKeys,
  useUserGrowth,
} from './useAdminStats';

export {
  adminKeys,
  useAdminStats,
  useAdminList,
} from './useAdminManagement';

export {
  emailKeys,
  useEmailLogs,
  useEmailTemplates,
  useEmailTemplate,
  useCreateEmailTemplate,
  useUpdateEmailTemplate,
  useDeleteEmailTemplate,
  useSendEmail,
  useAdminEmailStats,
} from './useEmail';

export {
  useSendEmailToAllUsers,
  useSendEmailToUser,
} from './useEmailManagement';

export {
  authKeys,
  useAuth,
  useHasRole,
} from './useAuth';
