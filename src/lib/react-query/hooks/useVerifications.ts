import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/AxiosInstance";
import { extractResponseData, handleApiError } from "../api-hooks";

// Define the VerificationStats interface
export interface VerificationStats {
  totalVerifications: number;
  pendingVerifications: number;
  approvedVerifications: number;
  rejectedVerifications: number;
}

// Query keys
export const verificationKeys = {
  all: ["verifications"] as const,
  list: (params?: Record<string, any>) => [...verificationKeys.all, "list", params] as const,
  detail: (id: string) => [...verificationKeys.all, "detail", id] as const,
  stats: () => [...verificationKeys.all, "stats"] as const,
};

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
      try {
        // Use the correct endpoint based on your API response
        const response = await axiosInstance.get("/credentials/all", { params });
        
        // Extract data based on the structure you provided
        let credentials = [];
        let pagination = { page: 1, limit: 10, total: 0 };
        
        // Handle the specific nested structure from your API
        if (response?.data?.data?.data?.credentials) {
          credentials = response.data.data.data.credentials;
          if (response?.data?.data?.data?.pagination) {
            pagination = response.data.data.data.pagination;
          }
        } 
        // Handle alternative structure
        else if (response?.data?.data?.credentials) {
          credentials = response.data.data.credentials;
          if (response?.data?.data?.pagination) {
            pagination = response.data.data.pagination;
          }
        }
        // Handle another possible structure
        else if (response?.data?.data?.data?.data) {
          credentials = response.data.data.data.data;
        }
        else if (response?.data?.data?.data) {
          const dataObj = response.data.data.data;
          
          // Check if dataObj is an object with a 'credentials' property
          if (typeof dataObj === 'object' && dataObj !== null && 'credentials' in dataObj && Array.isArray(dataObj.credentials)) {
            // Extract pagination if available
            if ('pagination' in dataObj && dataObj.pagination) {
              pagination = dataObj.pagination;
            }
            credentials = dataObj.credentials;
          } else {
            credentials = dataObj;
          }
        }
        // Fall back to direct data access
        else if (Array.isArray(response?.data?.data)) {
          credentials = response.data.data;
        }
        
        // If filtering by verificationStatus is needed
        if (params.verificationStatus && credentials.length > 0) {
          credentials = credentials.filter(
            cred => cred.verificationStatus === params.verificationStatus
          );
        }
        
        return {
          data: credentials,
          pagination: pagination
        };
      } catch (error) {
        console.error("Error fetching credentials:", error);
        return {
          data: [],
          pagination: { page: 1, limit: 10, total: 0 }
        };
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get verification stats
export function useVerificationStats() {
  return useQuery<VerificationStats, Error>({
    queryKey: verificationKeys.stats(),
    queryFn: async (): Promise<VerificationStats> => {
      try {
        const response = await axiosInstance.get("/credentials/verification-stats");
        console.log("Verification Stats API Response:", response);
        
        // Extract the nested data structure - log all possible paths
        console.log("Data structure options:", {
          directData: response?.data,
          dataData: response?.data?.data,
          dataDataData: response?.data?.data?.data,
          possibleFields: {
            total: response?.data?.data?.total || response?.data?.total,
            totalPending: response?.data?.data?.totalPending || response?.data?.totalPending || response?.data?.data?.pending || response?.data?.pending,
            totalVerified: response?.data?.data?.totalVerified || response?.data?.totalVerified || response?.data?.data?.verified || response?.data?.verified || response?.data?.data?.approved || response?.data?.approved,
            totalRejected: response?.data?.data?.totalRejected || response?.data?.totalRejected || response?.data?.data?.rejected || response?.data?.rejected,
          }
        });
        
        // Try different paths to find the stats based on common API patterns
        const stats = response?.data?.data?.data || response?.data?.data || response?.data || {};
        
        // Map the API fields to our interface, with multiple fallbacks
        return {
          totalVerifications: stats.total || stats.totalVerifications || 0,
          pendingVerifications: stats.totalPending || stats.pending || stats.pendingVerifications || 0,
          approvedVerifications: stats.totalVerified || stats.verified || stats.approved || stats.approvedVerifications || 0,
          rejectedVerifications: stats.totalRejected || stats.rejected || stats.rejectedVerifications || 0
        };
      } catch (error) {
        console.error("Error fetching verification stats:", error);
        
        // Return empty stats as fallback
        return {
          totalVerifications: 0,
          pendingVerifications: 0,
          approvedVerifications: 0,
          rejectedVerifications: 0
        };
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2 // Retry twice on failure
  });
}

// Get specific verification
export function useVerification(id: string) {
  return useQuery<VerificationRecord, Error>({
    queryKey: verificationKeys.detail(id),
    queryFn: async (): Promise<VerificationRecord> => {
      try {
        const response = await axiosInstance.get(`/users/admin/credentials/${id}`);
        return extractResponseData<VerificationRecord>(response);
      } catch (error) {
        console.error(`Error fetching credential with ID ${id}:`, error);
        throw error;
      }
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
      notes,
    }: {
      id: string;
      status: "VERIFIED" | "REJECTED" | "PENDING";
      notes?: string;
    }) => {
      try {
        const response = await axiosInstance.post(`/credentials/${id}/verify`, {
          decision: status,
          notes: notes || (status === "REJECTED" ? "Rejected by admin" : "Verified by admin"),
        });
        return extractResponseData(response);
      } catch (error) {
        console.error("Error updating verification status:", error);
        throw error;
      }
    },
    onError: handleApiError,
  });
}

// Delete verification
export function useDeleteVerification() {
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await axiosInstance.delete(`/users/admin/credentials/${id}`);
        return extractResponseData(response);
      } catch (error) {
        console.error(`Error deleting credential with ID ${id}:`, error);
        throw error;
      }
    },
    onError: handleApiError,
  });
}
