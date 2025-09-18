import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/AxiosInstance";
import { extractPaginationData, extractResponseData, handleApiError } from "../api-hooks";
import { mockVerificationStats, simulateApiDelay, VerificationStats } from "./mockData";
import { DevSettings } from "@/lib/dev-settings";

// Query keys
export const verificationKeys = {
  all: ["verifications"] as const,
  list: (params?: Record<string, any>) => [...verificationKeys.all, "list", params] as const,
  detail: (id: string) => [...verificationKeys.all, "detail", id] as const,
  stats: () => [...verificationKeys.all, "stats"] as const,
};

// Re-export VerificationStats for convenience
export type { VerificationStats };

// Types
export interface VerificationRecord {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    companyName?: string;
  };
  name?: string;
  credentialType: string;
  verificationStatus: string;
  issueDate: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
  description?: string;
  verifiedBy?: string;
  verificationDate?: string;
  rejectionReason?: string;
  [key: string]: any;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  isDeleted?: string | boolean;
  verificationStatus?: string;
  [key: string]: any;
}

// Get all verifications
export function useVerifications(params: PaginationParams = {}) {
  return useQuery<{ data: VerificationRecord[], pagination: any }, Error>({
    queryKey: verificationKeys.list(params),
    queryFn: async (): Promise<{ data: VerificationRecord[], pagination: any }> => {
      const response = await axiosInstance.get("/users/admin/credentials", { params });
      return {
        data: extractResponseData<VerificationRecord[]>(response),
        pagination: extractPaginationData(response),
      };
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get verification stats
export function useVerificationStats() {
  return useQuery<VerificationStats, Error>({
    queryKey: verificationKeys.stats(),
    queryFn: async (): Promise<VerificationStats> => {
      // If mock data is enabled, return it directly
      if (DevSettings.useMockData) {
        if (DevSettings.enableApiLogs) console.log("Using mock verification stats data");
        // Create a delay and return the mock data with correct typing
        return new Promise<VerificationStats>((resolve) => {
          setTimeout(() => {
            resolve({
              totalVerifications: mockVerificationStats.totalVerifications,
              pendingVerifications: mockVerificationStats.pendingVerifications,
              approvedVerifications: mockVerificationStats.approvedVerifications,
              rejectedVerifications: mockVerificationStats.rejectedVerifications
            });
          }, DevSettings.mockApiDelayMs);
        });
      }
      
      if (DevSettings.enableApiLogs) console.log("Fetching verification stats...");
      
      try {
        // This is the correct endpoint based on the backend controller
        const response = await axiosInstance.get("/credentials/verification-stats");
        if (DevSettings.enableApiLogs) console.log("Verification stats response:", response);
        
        // The API returns a structure like { data: { totalPending, totalVerified, totalRejected, overdue, total } }
        // We need to map this to our VerificationStats interface
        const apiData = extractResponseData<any>(response);
        
        // Map the API response to our interface
        const stats: VerificationStats = {
          totalVerifications: apiData.total || 0,
          pendingVerifications: apiData.totalPending || 0,
          approvedVerifications: apiData.totalVerified || 0,
          rejectedVerifications: apiData.totalRejected || 0
        };
        
        return stats;
      } catch (firstError) {
        console.warn("Primary endpoint failed, trying fallback:", firstError);
        
        try {
          // Fallback: Try to get credentials and count manually
          const response = await axiosInstance.get("/credentials/all");
          if (DevSettings.enableApiLogs) console.log("All credentials response:", response);
          const credentials = extractResponseData<any[]>(response);
          
          // Create stats from the credentials list
          const stats: VerificationStats = {
            totalVerifications: credentials.length || 0,
            pendingVerifications: credentials.filter(c => c.verificationStatus === "PENDING").length || 0,
            approvedVerifications: credentials.filter(c => c.verificationStatus === "VERIFIED" || c.verificationStatus === "APPROVED").length || 0,
            rejectedVerifications: credentials.filter(c => c.verificationStatus === "REJECTED").length || 0
          };
          
          return stats;
        } catch (secondError) {
          console.error("All credential endpoints failed:", secondError);
          // Fall back to mock data as a last resort
          console.warn("API errors, falling back to mock data");
          const mockStats: VerificationStats = {
            totalVerifications: mockVerificationStats.totalVerifications,
            pendingVerifications: mockVerificationStats.pendingVerifications,
            approvedVerifications: mockVerificationStats.approvedVerifications,
            rejectedVerifications: mockVerificationStats.rejectedVerifications
          };
          return mockStats;
        }
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1 // Only retry once to avoid excessive failed requests
  });
}

// Get specific verification
export function useVerification(id: string) {
  return useQuery<VerificationRecord, Error>({
    queryKey: verificationKeys.detail(id),
    queryFn: async (): Promise<VerificationRecord> => {
      const response = await axiosInstance.get(`/users/admin/credentials/${id}`);
      return extractResponseData<VerificationRecord>(response);
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: !!id // Only run if id is provided
  });
}

// Update verification status
export function useUpdateVerificationStatus() {
  return useMutation({
    mutationFn: async ({
      id,
      status,
      rejectionReason,
    }: {
      id: string;
      status: "PENDING" | "APPROVED" | "REJECTED";
      rejectionReason?: string;
    }) => {
      const response = await axiosInstance.patch(`/users/admin/credentials/${id}/status`, {
        status,
        rejectionReason,
      });
      return extractResponseData(response);
    },
    onError: handleApiError,
  });
}

// Delete verification
export function useDeleteVerification() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`/users/admin/credentials/${id}`);
      return extractResponseData(response);
    },
    onError: handleApiError,
  });
}
