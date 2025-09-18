import axiosInstance from "@/api/AxiosInstance";
import { AxiosError, AxiosResponse } from "axios";
import { queryClient } from "./index";

// Base URL for API endpoints
export const API_BASE_URL = "/";

// Error handling for queries and mutations
export const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    return {
      message: error.response?.data?.message || "An error occurred",
      statusCode: error.response?.status,
      data: error.response?.data,
    };
  }
  return {
    message: "An unexpected error occurred",
    statusCode: 500,
    data: null,
  };
};

// Helper to extract data from responses
export const extractResponseData = <T,>(response: AxiosResponse): T => {
  // Handle different response structures
  if (response.data?.data?.data) {
    return response.data.data.data as T;
  }
  if (response.data?.data) {
    return response.data.data as T;
  }
  return response.data as T;
};

// Helper to extract pagination metadata
export const extractPaginationData = (response: AxiosResponse) => {
  if (response.data?.data?.meta) {
    return response.data.data.meta;
  }
  return null;
};

// Helper to invalidate related queries
export const invalidateRelatedQueries = (queryKeys: string[]) => {
  queryKeys.forEach((key) => {
    queryClient.invalidateQueries({ queryKey: [key] });
  });
};
