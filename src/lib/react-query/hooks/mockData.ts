// Mock data for development and testing
// This file provides static data when API endpoints are unavailable

// Admin dashboard stats
export const mockAdminStats = {
  totalUsers: 1243,
  activeUsers: 987,
  newUsers: 156,
  organizationUsers: 78,
  talentUsers: 1165,
};

// Admin user list
export const mockAdminList = [
  {
    id: "1",
    email: "admin@propellant.com",
    firstName: "Admin",
    lastName: "User",
    role: "SUPER_ADMIN",
    isActive: true,
    lastLoginAt: "2025-09-17T15:32:11.000Z",
    createdAt: "2025-01-10T09:00:00.000Z",
  },
  {
    id: "2",
    email: "manager@propellant.com",
    firstName: "Manager",
    lastName: "Admin",
    role: "ADMIN",
    isActive: true,
    lastLoginAt: "2025-09-18T08:15:42.000Z",
    createdAt: "2025-02-15T10:30:00.000Z",
  },
  {
    id: "3",
    email: "support@propellant.com",
    firstName: "Support",
    lastName: "Staff",
    role: "ADMIN",
    isActive: true,
    lastLoginAt: "2025-09-17T19:45:22.000Z",
    createdAt: "2025-03-22T11:20:00.000Z",
  },
];

// Define the VerificationStats interface here to avoid circular dependencies
export interface VerificationStats {
  totalVerifications: number;
  pendingVerifications: number;
  approvedVerifications: number;
  rejectedVerifications: number;
}

// Verification stats
export const mockVerificationStats: VerificationStats = {
  totalVerifications: 845,
  pendingVerifications: 47,
  approvedVerifications: 723,
  rejectedVerifications: 75,
};

// For simulating API delay
import { DevSettings } from '@/lib/dev-settings';

export const simulateApiDelay = async (data: any, delayMs = DevSettings.mockApiDelayMs) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delayMs);
  });
};
