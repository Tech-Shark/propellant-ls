# React Query Implementation

This document outlines the implementation of React Query for data fetching, caching, and state management in the Propellant HR application.

## Implemented Features

### Core React Query Setup

- [x] Configured QueryClient with optimal defaults
- [x] Added React Query DevTools for development
- [x] Set up proper error handling
- [x] Added global loading state management

### Domain-Specific Hooks

- [x] `useUsers` - User management
- [x] `useReferrals` - Referral management
- [x] `useVerifications` - Verification workflow
- [x] `useSettings` - Application settings
- [x] `usePayment` - Payment methods
- [x] `useJobStats` - Job statistics
- [x] `useAdminStats` - Admin dashboard statistics
- [x] `useEmail` - Email templates and sending
- [x] `useAuth` - Authentication and user roles

### Advanced Features

- [x] Prefetching strategy for critical data
- [x] Offline support with persistent cache
- [x] Optimistic updates
- [x] Cache invalidation rules
- [x] Role-based access control

### Refactored Components

- [x] OrganizationMetrics component
- [x] AdminMetrics component
- [x] EmailManagement component
- [x] VerificationManagement component
- [x] UserManagement component
- [x] ReferralManagement component

## Implementation Details

### Folder Structure

```
src/lib/react-query/
├── index.tsx             # React Query Provider setup
├── api-hooks.ts          # Common utilities for API hooks
├── offline-support.tsx   # Offline support implementation
├── prefetch.ts           # Data prefetching strategies
└── hooks/                # Domain-specific hooks
    ├── index.ts          # Export all hooks
    ├── useAuth.ts        # Authentication hooks
    ├── useAdminStats.ts  # Admin dashboard statistics
    ├── useEmail.ts       # Email management
    ├── useJobStats.ts    # Job statistics
    ├── usePayment.ts     # Payment methods
    ├── useReferrals.ts   # Referral management
    ├── useSettings.ts    # Application settings
    ├── useUsers.ts       # User management
    └── useVerifications.ts # Verification workflow
```

### Key Features

#### Offline Support

- Uses `@tanstack/react-query-persist-client` for persistent cache
- Selectively persists critical queries with `persistQuery` utility
- Monitors network connectivity with `useIsOffline` hook

#### Authentication

- Maintains authentication state with `useAuth` hook
- Provides role-based access control with `useHasRole` hook
- Automatically clears query cache on logout

#### Prefetching

- `usePrefetchCriticalData` - Prefetches essential application data
- `usePrefetchUserData` - Prefetches user details when needed
- `usePrefetchAdminData` - Prefetches admin dashboard data

## Usage Examples

### Basic Query

```tsx
import { useUsers } from "@/lib/react-query/hooks";

function UserList() {
  const { data, isLoading, isError } = useUsers();

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage />;

  return (
    <div>
      {data.users.map((user) => (
        <UserCard key={user._id} user={user} />
      ))}
    </div>
  );
}
```

### Mutation with Optimistic Updates

```tsx
import { useUpdateUser } from "@/lib/react-query/hooks";

function UserForm({ user }) {
  const updateUser = useUpdateUser();

  const handleSubmit = (data) => {
    updateUser.mutate({
      id: user._id,
      data,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={updateUser.isPending}>
        {updateUser.isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
```

### Offline Support

```tsx
import { persistQuery } from "@/lib/react-query/offline-support";

// Mark this query for offline persistence
const { data } = useQuery({
  queryKey: ["important-data"],
  queryFn: fetchImportantData,
  ...persistQuery(),
});
```
