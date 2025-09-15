import { useEffect, useState } from "react";
import axiosInstance from "@/api/AxiosInstance";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, X, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PendingContent from "@/components/organization/credential_verification/PendingContent.tsx";
import VerifiedContent from "@/components/organization/credential_verification/VerifiedContent.tsx";
import RejectedContent from "@/components/organization/credential_verification/RejectedContent.tsx";

export interface BackendCredential {
  user?: {
    _id: string;
    fullname?: string;
    email?: string;
  };
  _id: string;
  credentialId: string;
  title: string;
  description: string;
  type: string;
  category: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate: string;
  verifyingOrganization: string;
  verifyingEmail: string;
  message: string;
  externalUrl: string;
  visibility: boolean;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  imageUrl?: string;
  createdAt: string;
  reviewedAt: string | null;
  subject: string;
  evidenceHash: string;
  updatedAt: string;
  ipfsHash: string;
  documentUrl?: string;
  talentName?: string;
  talentEmail?: string;

  // Blockchain-related properties
  owner?: string; // Wallet address of the credential owner
  transactionHash?: string; // Transaction hash of the minting transaction
  blockchainCredentialId?: number; // ID of the credential on the blockchain
  blockchainStatus?: string; // Status of the blockchain transaction
  nftTokenURI?: string; // URI to the NFT token metadata
  blockNumber?: number; // Block number where the transaction was confirmed
  verificationTransactionId?: string; // Transaction ID for credential verification
  blockchainTransactionId?: string; // Transaction ID for blockchain operation
  nftTokenId?: string | number; // Token ID for the NFT
}

// Main component
const CredentialVerification = () => {
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReasonText, setRejectReasonText] = useState("");
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] =
    useState<BackendCredential | null>(null);
  const [pendingRequests, setPendingRequests] = useState<BackendCredential[]>(
    []
  );
  const [verifiedRequests, setVerifiedRequests] = useState<BackendCredential[]>(
    []
  );
  const [rejectedRequests, setRejectedRequests] = useState<BackendCredential[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [imageLoading, setImageLoading] = useState(false);

  // Fetch all credential statuses in parallel
  const fetchAllCredentials = async () => {
    setLoading(true);
    try {
      console.log("Starting credential fetch for organization...");

      // Get the current user's email for debugging
      try {
        const userRes = await axiosInstance.get("/user/me");
        console.log("Current user data:", userRes.data);
        console.log("User email:", userRes.data?.data?.email);
        console.log("User role:", userRes.data?.data?.role);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }

      // Try both potential endpoints to see which one works
      console.log("Trying to fetch organization credentials...");

      try {
        // First, try the specific pending-verifications endpoint
        const pendingTestRes = await axiosInstance.get(
          "/credentials/pending-verifications?page=1&limit=100"
        );
        console.log("Pending verifications test response:", pendingTestRes);
      } catch (err) {
        console.log(
          "Pending-verifications endpoint not available:",
          err.message
        );
      }

      // Use the known working endpoint for the main data fetch
      const [pendingRes, verifiedRes, rejectedRes] = await Promise.all([
        axiosInstance.get(
          `/credentials/retrieve-verifiable-credentials?verificationStatus=PENDING&page=1&limit=100`
        ),
        axiosInstance.get(
          `/credentials/retrieve-verifiable-credentials?verificationStatus=VERIFIED&page=1&limit=100`
        ),
        axiosInstance.get(
          `/credentials/retrieve-verifiable-credentials?verificationStatus=REJECTED&page=1&limit=100`
        ),
      ]);

      // Log raw responses for debugging
      console.log("Pending Response:", pendingRes);
      console.log("Verified Response:", verifiedRes);
      console.log("Rejected Response:", rejectedRes);

      // Log the actual data structures for detailed inspection
      console.log(
        "Pending Data Structure:",
        JSON.stringify(pendingRes.data, null, 2)
      );
      console.log(
        "Verified Data Structure:",
        JSON.stringify(verifiedRes.data, null, 2)
      );
      console.log(
        "Rejected Data Structure:",
        JSON.stringify(rejectedRes.data, null, 2)
      );

      // Extract credential data from the nested response structure - handle multiple possible structures
      const extractCredentials = (response) => {
        console.log("Extracting credentials from response:", response);

        // Based on your provided response structure, extract the credentials array
        // The structure appears to be: data.data.data.credentials
        try {
          if (Array.isArray(response?.data?.data?.data?.credentials)) {
            console.log(
              "Found credentials at path: data.data.data.credentials",
              response.data.data.data.credentials
            );
            return response.data.data.data.credentials;
          }

          // Second most common structure
          if (Array.isArray(response?.data?.data?.credentials)) {
            console.log(
              "Found credentials at path: data.data.credentials",
              response.data.data.credentials
            );
            return response.data.data.credentials;
          }

          // Try other potential structures
          if (Array.isArray(response?.data?.credentials)) {
            console.log(
              "Found credentials at path: data.credentials",
              response.data.credentials
            );
            return response.data.credentials;
          }

          if (Array.isArray(response?.data?.data)) {
            console.log(
              "Found credentials at path: data.data",
              response.data.data
            );
            return response.data.data;
          }

          if (Array.isArray(response?.data)) {
            console.log("Found credentials at path: data", response.data);
            return response.data;
          }

          // Handle the case of empty credentials array explicitly
          if (
            response?.data?.data?.data?.credentials !== undefined &&
            Array.isArray(response.data.data.data.credentials)
          ) {
            console.log("Found empty credentials array");
            return [];
          }

          console.log("No recognized credentials array structure found");
          console.log(
            "Full response data:",
            JSON.stringify(response.data, null, 2)
          );
          return [];
        } catch (error) {
          console.error("Error extracting credentials:", error);
          return [];
        }
      };

      const pendingData = extractCredentials(pendingRes);
      const verifiedData = extractCredentials(verifiedRes);
      const rejectedData = extractCredentials(rejectedRes);

      setPendingRequests(pendingData);
      setVerifiedRequests(verifiedData);
      setRejectedRequests(rejectedData);
    } catch (err) {
      console.log(err);
      toast({
        title: "Error loading credentials",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Debug function to analyze response structure
  const debugResponseStructure = (response) => {
    try {
      console.log("DEBUG - Response Keys:", Object.keys(response));

      if (response.data) {
        console.log("DEBUG - Data Keys:", Object.keys(response.data));

        if (response.data.data) {
          console.log(
            "DEBUG - Data.Data Keys:",
            Object.keys(response.data.data)
          );

          if (response.data.data.data) {
            console.log(
              "DEBUG - Data.Data.Data Keys:",
              Object.keys(response.data.data.data)
            );
          }
        }
      }
    } catch (err) {
      console.error("Error analyzing response structure:", err);
    }
  };

  // Function to test the API directly
  const testCredentialsApi = async () => {
    try {
      const res = await axiosInstance.get(
        "/credentials/retrieve-verifiable-credentials?verificationStatus=PENDING&page=1&limit=100"
      );
      console.log("API TEST - Raw Response:", res);
      debugResponseStructure(res);

      // Try extracting with the correct path based on the structure
      const credentials = res.data?.data?.data?.credentials || [];
      console.log("API TEST - Credentials Array:", credentials);

      return credentials;
    } catch (err) {
      console.error("API TEST - Error:", err);
      return [];
    }
  };

  useEffect(() => {
    fetchAllCredentials();

    // Also run the direct test
    testCredentialsApi();
  }, [toast]);

  const handleApprove = async (credentialId: string) => {
    try {
      const response = await axiosInstance.post(
        `/credentials/${credentialId}/verify`,
        {
          decision: "VERIFIED",
          notes: "Credential approved by organization",
        }
      );

      console.log(response);
      toast({
        title: "Credential approved",
        description: "The credential has been successfully approved",
      });
      fetchAllCredentials();
    } catch (err) {
      console.log(err);
      toast({
        title: "Error approving credential",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async (credentialId: string) => {
    try {
      const response = await axiosInstance.post(
        `/credentials/${credentialId}/verify`,
        {
          decision: "REJECTED",
          notes: rejectReasonText || "Credential rejected by organization",
        }
      );

      console.log(response);
      toast({
        title: "Credential rejected",
        description: "The credential has been rejected",
      });
      fetchAllCredentials();
    } catch (err) {
      console.log(err);
      toast({
        title: "Error rejecting credential",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "PENDING":
        return <Clock className="w-4 h-4 text-orange-400" />;
      case "REJECTED":
        return <X className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "status-success";
      case "PENDING":
        return "status-warning";
      case "REJECTED":
        return "status-error";
      default:
        return "status-default";
    }
  };

  return (
    <main className="flex-1 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-slate-400 hover:text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">
                Credential Verification
              </h1>
              <p className="text-slate-400">
                Review and verify credentials from talents
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-slate-300">
              <Clock className="w-3 h-3 mr-1" />
              {pendingRequests.length} Pending
            </Badge>
            <Badge variant="secondary" className="text-slate-300">
              <Award className="w-3 h-3 mr-1" />
              {verifiedRequests.length} Verified
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs
          defaultValue="pending"
          className="space-y-6"
          onValueChange={setActiveTab}
        >
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-slate-700"
            >
              Pending ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger
              value="verified"
              className="data-[state=active]:bg-slate-700"
            >
              Verified ({verifiedRequests.length})
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className="data-[state=active]:bg-slate-700"
            >
              Rejected ({rejectedRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {/* Temporarily disabled NFT limits */}
            <PendingContent
              pendingRequests={pendingRequests}
              rejectReasonText={rejectReasonText}
              selectedRequest={selectedRequest}
              imageLoading={imageLoading}
              showRejectReason={showRejectReason}
              handleApprove={handleApprove}
              handleReject={handleReject}
              setSelectedRequest={setSelectedRequest}
              setShowRejectReason={setShowRejectReason}
              setRejectReasonText={setRejectReasonText}
              setImageLoading={setImageLoading}
            />
          </TabsContent>

          <TabsContent value="verified">
            <VerifiedContent
              verifiedRequests={verifiedRequests}
              selectedRequest={selectedRequest}
              loading={loading}
              imageLoading={imageLoading}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              setSelectedRequest={setSelectedRequest}
              setImageLoading={setImageLoading}
            />
          </TabsContent>

          <TabsContent value="rejected">
            <RejectedContent
              rejectedRequests={rejectedRequests}
              selectedRequest={selectedRequest}
              loading={loading}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              setSelectedRequest={setSelectedRequest}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default CredentialVerification;
