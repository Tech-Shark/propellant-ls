# React Query Implementation Guide

## Completed Tasks

### 1. Core Setup

- Created React Query provider in `src/lib/react-query/index.tsx`
- Added the provider to main app entry point (`main.tsx`)
- Created base API hooks layer in `src/lib/react-query/api-hooks.ts`

### 2. Domain-Specific Hooks

- Created Referral-specific hooks in `src/lib/react-query/hooks/useReferrals.ts`:

  - `useReferrals`: Fetch all referrals with pagination
  - `useReferralStats`: Fetch referral statistics
  - `useReferralLeaderboard`: Fetch referral leaderboard data
  - `useUpdateReferralStatus`: Update referral status
  - `useDeleteReferral`: Delete a referral

- Created User-specific hooks in `src/lib/react-query/hooks/useUsers.ts`:

  - `useUsers`: Fetch all users with pagination
  - `useUser`: Fetch specific user
  - `useCurrentUser`: Fetch current user profile
  - `useUpdateUser`: Update user
  - `useDeleteUser`: Delete user

- Created Verification-specific hooks in `src/lib/react-query/hooks/useVerifications.ts`:
  - `useVerifications`: Fetch all verifications with pagination
  - `useVerificationStats`: Fetch verification statistics
  - `useVerification`: Fetch specific verification
  - `useUpdateVerificationStatus`: Update verification status
  - `useDeleteVerification`: Delete a verification

### 3. Component Refactoring

- Refactored `ReferralManagement.tsx` to use React Query hooks:
  - Replaced direct Axios calls with hooks
  - Added loading states and error handling
  - Implemented proper cache invalidation for mutations
- Refactored `VerificationManagement.tsx` to use React Query hooks:
  - Added statistics dashboard
  - Implemented data fetching with loading and error states
  - Added optimistic updates for approve/reject actions

## Next Steps

### 1. Complete Component Refactoring

- Refactor `UserManagement.tsx` to use React Query hooks
- Refactor `NFTManagement.tsx` to use React Query hooks
- Refactor other components that make API calls

### 2. Additional Hooks to Create

- Authentication hooks (`useLogin`, `useRegister`, `useLogout`)
- Organization-specific hooks
- Payment-related hooks
- CV/Resume-related hooks

### 3. Cache Invalidation Strategy

- Implement consistent cache invalidation strategy across components
- Add cache tags for related entities
- Configure global query error handling

### 4. Performance Optimizations

- Enable/configure suspense mode where applicable
- Adjust stale times based on data freshness requirements
- Add prefetching for common user flows
- Implement infinite queries for large data lists

## Best Practices

1. **Use Query Keys Consistently**: Follow the pattern of using arrays with nested objects for query keys.

2. **Handle Loading & Error States**: Always provide visual feedback during loading and clear error messages.

3. **Cache Invalidation**: After mutations, invalidate related queries to keep data fresh.

4. **Type Safety**: Use TypeScript interfaces for all API responses and parameters.

5. **Stale Time Management**: Set appropriate staleTime based on how frequently data changes.

## React Query References

- [TanStack Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [React Query Patterns](https://tkdodo.eu/blog/practical-react-query)
- [Cache Invalidation Strategies](https://tanstack.com/query/latest/docs/react/guides/query-invalidation)
