import { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  FileText,
  Link2,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Plus,
  Award,
  Building,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { Credential, CredentialsData } from "@/utils/global";
import { credentialTypes, credentialCategories } from "@/utils/constant";
import { toast } from "sonner";
import axiosInstance from "@/api/AxiosInstance.ts";
import axios from "axios";
import { CubeSpinner } from "react-spinners-kit";
import { isPdfBySignature } from "@/utils/helperfunctions.ts";
import {
  getExplorerAddressUrl,
  getExplorerTransactionUrl,
  getExplorerNftUrl,
} from "@/lib/utils";
import { toastPromise, extractErrorMessage } from "@/utils/ToastHelpers";

export default function Credentials() {
  const [isUploading, setIsUploading] = useState(false);
  const [credentials, setCredentials] = useState<CredentialsData[]>();
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const getCredentials = async () => {
      axiosInstance
        .get("/credentials")
        .then((response) => {
          // Log the entire response to understand its structure
          console.log("Full API response:", response?.data);

          // Deep inspect response structure for debugging
          console.log("Response data keys:", Object.keys(response?.data || {}));
          if (response?.data?.data) {
            console.log(
              "Response data.data keys:",
              Object.keys(response?.data?.data || {})
            );

            // Check specific data structure for credentials path
            if (response?.data?.data?.credentials) {
              console.log(
                "Credentials data type:",
                typeof response.data.data.credentials
              );
              if (Array.isArray(response.data.data.credentials)) {
                console.log(
                  "Credentials array found! Length:",
                  response.data.data.credentials.length
                );

                // Log important ID fields for debugging
                if (response.data.data.credentials.length > 0) {
                  const sample = response.data.data.credentials[0];
                  console.log("ID Fields in first credential:", {
                    _id: sample._id,
                    credentialId: sample.credentialId,
                    id: sample.id,
                    blockchainCredentialId: sample.blockchainCredentialId,
                  });
                }

                console.log(
                  "First credential:",
                  response.data.data.credentials[0]
                );
              } else {
                console.log(
                  "Credentials is not an array but:",
                  response.data.data.credentials
                );
              }
            }
          }

          // Try multiple paths to find credentials array based on API response structure
          let credentialsData = null;

          try {
            // Check for wallet address in the API response
            const checkForWalletAddress = (credentials) => {
              if (!Array.isArray(credentials) || credentials.length === 0)
                return false;

              const sample = credentials[0];
              const hasWalletAddress = !!(
                sample.walletAddress ||
                sample.userWalletAddress ||
                sample.talentWalletAddress ||
                sample.walletAddr
              );

              console.log("Wallet address check:", {
                hasWalletAddress,
                sample: {
                  walletAddress: sample.walletAddress,
                  userWalletAddress: sample.userWalletAddress,
                  talentWalletAddress: sample.talentWalletAddress,
                  walletAddr: sample.walletAddr,
                },
              });

              return hasWalletAddress;
            };

            // CRITICAL FIX: Based on the API response structure in the console log,
            // we need to explicitly check for the 'credentials' array in response.data.data
            if (
              response?.data?.data?.credentials &&
              Array.isArray(response.data.data.credentials)
            ) {
              console.log(
                "Found credentials in data.data.credentials path, count:",
                response.data.data.credentials.length
              );
              credentialsData = response.data.data.credentials;
              checkForWalletAddress(credentialsData);
            }
            // If credentials is not an array but contains an array of results
            else if (
              response?.data?.data?.credentials?.results &&
              Array.isArray(response.data.data.credentials.results)
            ) {
              console.log(
                "Found credentials in data.data.credentials.results path, count:",
                response.data.data.credentials.results.length
              );
              credentialsData = response.data.data.credentials.results;
            }
            // Check other common API response structures
            else if (
              response?.data?.data?.data &&
              Array.isArray(response.data.data.data)
            ) {
              console.log(
                "Found credentials in data.data.data path, count:",
                response.data.data.data.length
              );
              credentialsData = response.data.data.data;
            } else if (
              response?.data?.data &&
              Array.isArray(response.data.data)
            ) {
              console.log(
                "Found credentials in data.data path, count:",
                response.data.data.length
              );
              credentialsData = response.data.data;
            } else if (
              response?.data?.credentials &&
              Array.isArray(response.data.credentials)
            ) {
              console.log(
                "Found credentials in data.credentials path, count:",
                response.data.credentials.length
              );
              credentialsData = response.data.credentials;
            } else if (Array.isArray(response?.data)) {
              console.log(
                "Found credentials directly in data path, count:",
                response.data.length
              );
              credentialsData = response.data;
            }
            // If none of the above paths work, try to find any array in the response
            else {
              console.log("Searching for credentials array in the response...");

              // Recursive function to find the first array in the response
              const findFirstArray = (
                obj: any,
                path = ""
              ): [any[] | null, string] => {
                if (!obj || typeof obj !== "object") return [null, path];

                if (Array.isArray(obj) && obj.length > 0) {
                  return [obj, path];
                }

                for (const key in obj) {
                  const newPath = path ? `${path}.${key}` : key;
                  const [result, resultPath] = findFirstArray(
                    obj[key],
                    newPath
                  );
                  if (result) return [result, resultPath];
                }

                return [null, path];
              };

              const [foundArray, arrayPath] = findFirstArray(response.data);
              if (foundArray) {
                console.log(
                  `Found an array at path: ${arrayPath}, count: ${foundArray.length}`
                );
                credentialsData = foundArray;
              }
            }
          } catch (error) {
            console.error("Error finding credentials in response:", error);
          }

          // Log the extracted credentials data for debugging
          console.log("Extracted credentials data:", credentialsData);

          if (Array.isArray(credentialsData)) {
            // Process array of credentials
            const processedCredentials = credentialsData.map((cred) => {
              // Create a copy to avoid mutating the original response
              const processedCred = { ...cred };

              // CRITICAL FIX: Ensure each credential has the MongoDB _id field
              // This ensures all our operations use the MongoDB _id consistently
              if (!processedCred._id && processedCred.id) {
                console.warn(
                  `Credential missing _id field, using id field instead:`,
                  {
                    id: processedCred.id,
                    credentialId: processedCred.credentialId,
                  }
                );
                processedCred._id = processedCred.id;
              }

              // CRITICAL FIX: If still no _id but has credentialId, use that as fallback
              // (though this should not happen with proper API response)
              if (!processedCred._id && processedCred.credentialId) {
                console.warn(
                  `Credential missing both _id and id fields, falling back to credentialId:`,
                  {
                    credentialId: processedCred.credentialId,
                  }
                );
                processedCred._id = processedCred.credentialId;
              }

              // Log the ID we're using for operations
              console.log(
                `Using MongoDB _id for credential operations: ${processedCred._id}`
              );

              // Normalize status from various possible fields
              if (!processedCred.status) {
                // Check all possible status fields in priority order
                if (processedCred.verificationStatus) {
                  processedCred.status = processedCred.verificationStatus;
                } else if (processedCred.blockchainStatus === "MINTED") {
                  processedCred.status = "VERIFIED";
                } else if (processedCred.attestationStatus === "VERIFIED") {
                  processedCred.status = "VERIFIED";
                } else if (processedCred.verifiedAt) {
                  processedCred.status = "VERIFIED";
                } else if (
                  processedCred.blockchainStatus === "PENDING_ISSUANCE" ||
                  processedCred.blockchainStatus === "PENDING_BLOCKCHAIN"
                ) {
                  processedCred.status = "PENDING";
                } else {
                  // Default to PENDING if no recognizable status is found
                  processedCred.status = "PENDING";
                }
              }

              // Make sure wallet address is properly set by checking all possible fields
              if (!processedCred.walletAddress) {
                processedCred.walletAddress =
                  processedCred.userWalletAddress ||
                  processedCred.talentWalletAddress ||
                  processedCred.walletAddr ||
                  processedCred.owner ||
                  null;

                if (processedCred.walletAddress) {
                  console.log(
                    `Found wallet address in alternate field for credential ${processedCred._id}:`,
                    processedCred.walletAddress
                  );
                }
              }

              return processedCred;
            });

            console.log(
              "Processed credentials with normalized status and wallet addresses:",
              processedCredentials.map((c) => ({
                id: c._id,
                title: c.title,
                status: c.status,
                hasWalletAddr: !!c.walletAddress,
                hasNftTokenId: !!c.nftTokenId,
                hasTxHash: !!c.transactionHash,
              }))
            );
            setCredentials(processedCredentials);
          } else if (credentialsData && typeof credentialsData === "object") {
            // Handle case where API returns a single object instead of an array
            console.log(
              "Credentials data is a single object, not an array:",
              credentialsData
            );

            // Convert single object to array
            const processedCred = { ...credentialsData };
            if (!processedCred.status) {
              processedCred.status =
                processedCred.verificationStatus || "PENDING";
            }

            setCredentials([processedCred]);
          } else {
            console.log("No valid credentials data found in response");
            setCredentials([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching credentials:", error);
          setCredentials([]);
        });
    };

    getCredentials();
  }, []);

  const [newCredential, setNewCredential] = useState<
    Credential & {
      issuer?: string;
      issueDate?: string;
      expiryDate?: string;
      verifyingOrganization?: string;
      verifyingEmail?: string;
      message?: string;
      externalUrl?: string; // Add externalUrl to state
    }
  >({
    title: "",
    type: "",
    category: "",
    url: "",
    description: "",
    visibility: true,
    file: null as File | null,
    issuingOrganization: "",
    issueDate: "",
    expiryDate: "",
    verifyingOrganization: "",
    verifyingEmail: "",
    message: "",
    externalUrl: "", // Initialize externalUrl
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewCredential({ ...newCredential, file });
    }
  };

  const handleSubmit = async () => {
    if (
      !newCredential.title ||
      !newCredential.type ||
      !newCredential.category ||
      !newCredential.issuingOrganization ||
      !newCredential.issueDate ||
      !newCredential.file
    ) {
      toast.warning(
        "Missing Information. Please fill in all required fields and upload a document."
      );
      return;
    }

    setIsUploading(true);

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("title", newCredential.title);
    formData.append("type", newCredential.type);
    formData.append("category", newCredential.category);
    formData.append("description", newCredential.description);
    // Use externalUrl instead of url if you have it
    if (newCredential.externalUrl) {
      formData.append("externalUrl", newCredential.externalUrl);
    }
    formData.append("visibility", newCredential.visibility.toString());

    // Add new fields (match backend exactly)
    if (newCredential.issuingOrganization) {
      formData.append("issuingOrganization", newCredential.issuingOrganization);
    }
    if (newCredential.issueDate) {
      formData.append("issueDate", newCredential.issueDate);
    }
    if (newCredential.expiryDate) {
      formData.append("expiryDate", newCredential.expiryDate);
    }
    if (newCredential.verifyingOrganization) {
      formData.append(
        "verifyingOrganization",
        newCredential.verifyingOrganization
      );
    }
    if (newCredential.verifyingEmail) {
      formData.append("verifyingEmail", newCredential.verifyingEmail);
    }
    if (newCredential.message) {
      formData.append("message", newCredential.message);
    }
    if (newCredential.file) {
      formData.append("file", newCredential.file);
    }

    await toastPromise(
      axiosInstance.post("/credentials/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      {
        loadingMessage: "Uploading credential...",
        successMessage: (response) => {
          console.log(response?.data.data);
          // Make sure credentials is an array before spreading
          setCredentials((prevCredentials) =>
            Array.isArray(prevCredentials)
              ? [...prevCredentials, response?.data.data]
              : [response?.data.data]
          );
          // Clear form after successful upload
          setNewCredential({
            title: "",
            type: "",
            category: "",
            url: "",
            description: "",
            visibility: true,
            file: null,
            issuingOrganization: "",
            issueDate: "",
            expiryDate: "",
            verifyingOrganization: "",
            verifyingEmail: "",
            message: "",
            externalUrl: "",
          });
          setIsUploading(false);
          return response?.data.message || "Credential uploaded successfully!";
        },
        errorMessage: (error) => {
          setIsUploading(false);
          return extractErrorMessage(error, "Failed to upload credential");
        },
        context: 'upload'
      }
    );
  };

  const toggleVisibility = async (
    id: string,
    data: { visibility: boolean }
  ) => {
    if (isUpdating) return; // Prevent multiple updates

    setIsUpdating(true);

    try {
      // Always use MongoDB _id for backend operations
      const mongoDbId = id;
      console.log(
        `Updating visibility for credential with MongoDB _id: ${mongoDbId}`
      );

      const response = await axiosInstance.patch(
        `/credentials/${mongoDbId}/update`,
        data
      );

      setCredentials((prev) =>
        prev.map((cred) =>
          // Make sure we're comparing the same ID type that was passed in
          cred._id === mongoDbId
            ? { ...cred, visibility: data.visibility }
            : cred
        )
      );
      toast.success(response.data.message || "Visibility updated successfully");
    } catch (error) {
      console.error("Visibility toggle error:", error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 
                            (error as any).friendlyMessage || 
                            "Failed to update visibility";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred while updating visibility");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Enhanced function to normalize and check status values
  const normalizeStatus = (status: string | null | undefined): string => {
    if (!status) return "PENDING";

    const upperStatus = status.toUpperCase();

    if (
      upperStatus === "VERIFIED" ||
      upperStatus.includes("VERIFY") ||
      upperStatus === "MINTED" ||
      upperStatus === "ISSUED"
    ) {
      return "VERIFIED";
    } else if (upperStatus === "REJECTED" || upperStatus.includes("REJECT")) {
      return "REJECTED";
    } else {
      return "PENDING"; // Default for any other status
    }
  };

  const getStatusIcon = (status: string | null | undefined) => {
    const normalizedStatus = normalizeStatus(status);

    switch (normalizedStatus) {
      case "VERIFIED":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "PENDING":
        return <Clock className="w-4 h-4 text-amber-500" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-amber-500" />; // Default to pending icon
    }
  };

  const getStatusColor = (status: string | null | undefined) => {
    const normalizedStatus = normalizeStatus(status);

    switch (normalizedStatus) {
      case "VERIFIED":
        return "bg-emerald-500 text-white border-none hover:bg-emerald-600";
      case "PENDING":
        return "bg-amber-500/40 text-amber-200 border-amber-500/50 hover:bg-amber-500/50";
      case "REJECTED":
        return "bg-red-500/40 text-red-200 border-red-500/50 hover:bg-red-500/50";
      default:
        return "bg-amber-500/40 text-amber-200 border-amber-500/50 hover:bg-amber-500/50"; // Default to pending style
    }
  };

  // Enhanced function to display status with better fallbacks
  const getStatusDisplay = (credential: any) => {
    // Check if credential is valid
    if (!credential || typeof credential !== "object") {
      console.error("Invalid credential object:", credential);
      return <span className="text-amber-400">PENDING</span>;
    }

    // Enhanced ID debugging with special focus on wallet address
    const hasWalletAddress = !!credential.walletAddress;
    const walletAddress =
      credential.walletAddress ||
      credential.userWalletAddress ||
      credential.talentWalletAddress ||
      credential.walletAddr ||
      credential.owner; // Also check 'owner' field used in org view

    // Use a distinctive message to make it easy to find in logs
    console.log("🔑 TALENT VIEW - WALLET DEBUG:", {
      _id: credential._id,
      credentialId: credential.credentialId,
      title: credential.title,
      blockchain: {
        hasWalletAddress: hasWalletAddress,
        walletAddressFound: !!walletAddress,
        resolvedWalletAddress: walletAddress,
        possibleWalletAddresses: {
          walletAddress: credential.walletAddress,
          userWalletAddress: credential.userWalletAddress,
          talentWalletAddress: credential.talentWalletAddress,
          walletAddr: credential.walletAddr,
          owner: credential.owner,
        },
        transactionHash: credential.transactionHash,
        nftTokenId: credential.nftTokenId,
        nftContractAddress: import.meta.env.VITE_NFT_CONTRACT_ADDRESS,
      },
    });

    // Add wallet address to credential if found in another property
    if (!hasWalletAddress && walletAddress) {
      credential.walletAddress = walletAddress;
      console.log(`Found wallet address in alternate field: ${walletAddress}`);
    }

    // Get status from multiple possible fields in the API response
    let status = null;

    // Check various status fields that might be present in the API response
    if (credential.status) {
      status = credential.status;
      console.log("Using status field:", status);
    } else if (credential.verificationStatus) {
      status = credential.verificationStatus;
      console.log("Using verificationStatus field:", status);
    } else if (credential.blockchainStatus === "MINTED") {
      status = "VERIFIED";
      console.log("Using blockchainStatus (MINTED):", status);
    } else if (credential.verifiedAt) {
      status = "VERIFIED";
      console.log("Using verifiedAt presence for status:", status);
    } else if (credential.attestationStatus === "VERIFIED") {
      status = "VERIFIED";
      console.log("Using attestationStatus field:", status);
    } else if (
      credential.blockchainStatus === "PENDING_ISSUANCE" ||
      credential.blockchainStatus === "PENDING_BLOCKCHAIN"
    ) {
      status = "PENDING";
      console.log("Using blockchainStatus for PENDING:", status);
    } else {
      // Default to PENDING if no recognizable status is found
      status = "PENDING";
      console.log("No status field found, defaulting to:", status);
    }

    // Normalize status to uppercase for consistent comparison
    const normalizedStatus = status ? status.toUpperCase() : "PENDING";
    console.log("Normalized status:", normalizedStatus);

    if (
      normalizedStatus === "VERIFIED" ||
      normalizedStatus.includes("VERIFY") ||
      normalizedStatus === "ISSUED" || // Also check for ISSUED
      normalizedStatus === "MINTED" // Also check for MINTED
    ) {
      return (
        <div className="flex flex-col">
          <span className="font-medium text-slate-200">
            {credential.verifyingOrganization ||
              credential.verifyingEmail ||
              credential.verifier ||
              ""}
          </span>
          <span className="text-emerald-400 text-sm flex items-center gap-1">
            Verified
            {credential.transactionHash && (
              <span
                title="Verified on blockchain"
                className="text-xs bg-blue-500/30 text-blue-300 px-1 rounded"
              >
                Chain
              </span>
            )}
            {credential.nftTokenId && (
              <span
                title="NFT Token ID"
                className="text-xs bg-blue-500/30 text-blue-300 px-1 rounded ml-1"
              >
                NFT #{credential.nftTokenId}
              </span>
            )}
          </span>
        </div>
      );
    } else if (
      normalizedStatus === "PENDING" ||
      normalizedStatus.includes("PENDING")
    ) {
      return (
        <div className="flex flex-col">
          <span className="font-medium text-slate-200">
            {credential.verifyingOrganization ||
              credential.verifyingEmail ||
              credential.verifier ||
              ""}
          </span>
          <span className="text-amber-400 text-sm">Pending</span>
        </div>
      );
    } else if (
      normalizedStatus === "REJECTED" ||
      normalizedStatus.includes("REJECT")
    ) {
      return (
        <div className="flex flex-col">
          <span className="font-medium text-slate-200">
            {credential.verifyingOrganization ||
              credential.verifyingEmail ||
              credential.verifier ||
              ""}
          </span>
          <span className="text-red-400 text-sm">Rejected</span>
        </div>
      );
    } else {
      // Improved logging for unknown statuses
      console.log(
        "Unrecognized credential status:",
        status,
        "for credential:",
        credential._id
      );
      return (
        <div className="flex flex-col">
          <span className="font-medium text-slate-200">
            {credential.verifyingOrganization ||
              credential.verifyingEmail ||
              credential.verifier ||
              ""}
          </span>
          <span className="text-amber-400 text-sm">Pending</span>
        </div>
      ); // Default to PENDING instead of N/A
    }
  };

  // Helper functions to get display names from stored values
  const getTypeDisplayName = (typeValue: string | number) => {
    // Handle both string values and numeric credentialType
    const type = credentialTypes.find(
      (t) => t.value === typeValue || t.id === typeValue
    );
    return type ? type.name : `Type ${typeValue}` || "N/A";
  };

  const getCategoryDisplayName = (categoryValue: string | number) => {
    // Handle both string values and numeric category
    // If no category from backend, show N/A
    if (!categoryValue || categoryValue === "N/A") return "N/A";

    const category = credentialCategories.find(
      (c) => c.value === categoryValue || c.id === categoryValue
    );
    return category ? category.name : `Category ${categoryValue}` || "N/A";
  };

  // Calculate stats
  const verifiedCount =
    (Array.isArray(credentials)
      ? credentials.filter((c) => c.status === "VERIFIED").length
      : 0) || 0;
  const pendingCount =
    (Array.isArray(credentials)
      ? credentials.filter((c) => c.status === "PENDING").length
      : 0) || 0;

  return (
    <main className="flex-1 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-slate-400 hover:text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">Credentials</h1>
              <p className="text-slate-400">
                Upload and manage your certificates and credentials
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-slate-300">
              <Award className="w-3 h-3 mr-1" />
              {verifiedCount} Verified
            </Badge>
            <Badge variant="secondary" className="text-slate-300">
              <Clock className="w-3 h-3 mr-1" />
              {pendingCount} Pending
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Upload New Credential */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-400" />
              Submit New Credential
            </CardTitle>
            <CardDescription className="text-slate-400">
              Upload your certificates, courses, and credentials for
              verification.{" "}
              <span className="text-red-400 font-medium">
                Supporting document upload is required.
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-slate-300">
                  Credential Title *
                </Label>
                <Input
                  id="title"
                  value={newCredential.title}
                  onChange={(e) =>
                    setNewCredential({
                      ...newCredential,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g., React Developer Certificate"
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="issuer" className="text-slate-300">
                  Issuing Organization *
                </Label>
                <Input
                  id="issuer"
                  value={newCredential.issuingOrganization}
                  onChange={(e) =>
                    setNewCredential({
                      ...newCredential,
                      issuingOrganization: e.target.value,
                    })
                  }
                  placeholder="e.g., Tech Academy, Udemy, AWS"
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="type" className="text-slate-300">
                  Type *
                </Label>
                <Select
                  value={newCredential.type}
                  onValueChange={(value) =>
                    setNewCredential({ ...newCredential, type: value })
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Select credential type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {credentialTypes.map((type) => (
                      <SelectItem
                        key={type.id}
                        value={type.value}
                        className="text-white hover:bg-slate-700"
                      >
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category" className="text-slate-300">
                  Category *
                </Label>
                <Select
                  value={newCredential.category}
                  onValueChange={(value) =>
                    setNewCredential({
                      ...newCredential,
                      category: value,
                    })
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {credentialCategories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.value}
                        className="text-white hover:bg-slate-700"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="issueDate" className="text-slate-300">
                  Issue Date *
                </Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={newCredential.issueDate}
                  onChange={(e) =>
                    setNewCredential({
                      ...newCredential,
                      issueDate: e.target.value,
                    })
                  }
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="expiryDate" className="text-slate-300">
                  Expiry Date (Optional)
                </Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={newCredential.expiryDate}
                  onChange={(e) =>
                    setNewCredential({
                      ...newCredential,
                      expiryDate: e.target.value,
                    })
                  }
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="link" className="text-slate-300">
                  External Link (Optional)
                </Label>
                <Input
                  id="link"
                  value={newCredential.externalUrl}
                  onChange={(e) =>
                    setNewCredential({
                      ...newCredential,
                      externalUrl: e.target.value,
                    })
                  }
                  placeholder="https://..."
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-slate-300">
                Description
              </Label>
              <Textarea
                id="description"
                value={newCredential.description}
                onChange={(e) =>
                  setNewCredential({
                    ...newCredential,
                    description: e.target.value,
                  })
                }
                placeholder="Describe your credential..."
                className="bg-slate-800 border-slate-600 text-white"
                rows={3}
              />
            </div>

            {/* Organization Tagging Section */}
            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-400" />
                Verifying Organization Details
              </h3>

              {/* Warning Message */}
              <div className="bg-amber-900/30 border border-amber-600/50 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-amber-200 font-medium mb-2">
                      Important: Verify Your Information
                    </h4>
                    <p className="text-amber-100 text-sm leading-relaxed">
                      Please ensure all information, especially the{" "}
                      <strong>verifying organization email</strong> and
                      <strong> credential details</strong>, are accurate.
                      Incorrect information may lead to automatic rejection of
                      your credential verification request. Double-check the
                      organization's official verification email before
                      submitting.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="verifyingOrganization"
                    className="text-slate-300"
                  >
                    Organization Name *
                  </Label>
                  <Input
                    id="verifyingOrganization"
                    value={newCredential.verifyingOrganization}
                    onChange={(e) =>
                      setNewCredential({
                        ...newCredential,
                        verifyingOrganization: e.target.value,
                      })
                    }
                    placeholder="e.g., Tech Academy Inc."
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="verifyingEmail" className="text-slate-300">
                    Verification Email *
                  </Label>
                  <Input
                    id="verifyingEmail"
                    type="email"
                    value={newCredential.verifyingEmail}
                    onChange={(e) =>
                      setNewCredential({
                        ...newCredential,
                        verifyingEmail: e.target.value,
                      })
                    }
                    placeholder="verify@organization.com"
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="message" className="text-slate-300">
                  Additional Notes
                </Label>
                <Textarea
                  id="message"
                  value={newCredential.message}
                  onChange={(e) =>
                    setNewCredential({
                      ...newCredential,
                      message: e.target.value,
                    })
                  }
                  placeholder="Any additional information about this credential..."
                  className="bg-slate-800 border-slate-600 text-white"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="file"
                  className="text-slate-300 flex items-center gap-1"
                >
                  Upload File <span className="text-red-400">*</span>
                </Label>
                <div className="mt-2">
                  <input
                    id="file"
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                    required
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("file")?.click()}
                    className={`border-slate-600 text-slate-300 hover:bg-slate-800 ${
                      !newCredential.file
                        ? "border-red-500 hover:border-red-600"
                        : ""
                    }`}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {newCredential.file
                      ? newCredential.file.name
                      : "Choose File (Required)"}
                  </Button>
                  <p className="text-xs text-slate-500 mt-1">
                    Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                  </p>
                  {!newCredential.file && (
                    <p className="text-xs text-red-400 mt-1">
                      Document upload is required for credential verification
                    </p>
                  )}
                </div>
              </div>{" "}
              <div className="flex flex-col space-y-3">
                <Label htmlFor="visibility" className="text-slate-300">
                  Credential Visibility
                </Label>

                <Button
                  onClick={() => {
                    setNewCredential({
                      ...newCredential,
                      visibility: !newCredential.visibility,
                    });
                  }}
                  variant="ghost"
                  size="sm"
                  className={`${
                    newCredential.visibility
                      ? "bg-green-600 text-white"
                      : "bg-slate-800 text-slate-400"
                  } border-slate-600  hover:text-white`}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={handleSubmit}
                disabled={isUploading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Submitting..." : "Submit Credential"}
              </Button>
              <p className="text-sm text-slate-400">
                Document will be sent to the specified organization for
                verification
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Credentials Table */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">My Credentials</CardTitle>
            <CardDescription className="text-slate-400">
              Track the status of your submitted credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Credential</TableHead>
                  <TableHead className="text-slate-300">
                    Issuing Organization
                  </TableHead>
                  <TableHead className="text-slate-300">
                    Verifying Organization
                  </TableHead>
                  <TableHead className="text-slate-300">Date Issued</TableHead>
                  <TableHead className="text-slate-300">Expiry Date</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">
                    <div className="flex flex-col">
                      <span>Actions</span>
                      <span className="text-xs font-normal text-slate-400">
                        Visibility, links, blockchain
                      </span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(credentials) && credentials.length > 0 ? (
                  credentials.map((credential) => {
                    // Make sure we prioritize MongoDB _id for all operations
                    const mongoDbId = credential._id;
                    console.log(
                      `Rendering credential row with MongoDB _id: ${mongoDbId}`
                    );

                    return (
                      <TableRow key={mongoDbId} className="border-slate-700">
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">
                              {credential.title || credential.name}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                              <span>
                                Uploaded:{" "}
                                {credential.createdAt
                                  ? new Date(
                                      credential.createdAt
                                    ).toLocaleDateString()
                                  : "-"}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-xs text-slate-300"
                              >
                                {getTypeDisplayName(
                                  credential.type ||
                                    (credential as any).credentialType
                                )}
                              </Badge>
                              {/* Always show category badge with N/A if no category from backend */}
                              <Badge
                                variant="outline"
                                className="text-xs text-slate-300"
                              >
                                {getCategoryDisplayName(
                                  credential.category ||
                                    (credential as any).credentialCategory ||
                                    (credential as any).categoryId ||
                                    "N/A"
                                )}
                              </Badge>
                            </div>
                            {credential.description && (
                              <p className="text-sm text-slate-400 mt-1">
                                {credential.description.length > 100
                                  ? credential.description.slice(0, 100) + "..."
                                  : credential.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {/* Use issuingOrganization as issuer */}
                          {credential.issuingOrganization ||
                            (credential as any).issuer ||
                            "N/A"}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-slate-300">
                              {/* Display verifying organization with improved styling */}
                              {(credential as any).verifyingOrganization ||
                                (credential as any).verifier ||
                                "N/A"}
                            </p>
                            {credential.status === "VERIFIED" && (
                              <p className="text-sm text-emerald-400">
                                {credential.verifyingEmail || ""}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {/* Backend doesn't send issue date, show creation date or N/A */}
                          {(credential as any).issueDate
                            ? new Date(
                                (credential as any).issueDate
                              ).toLocaleDateString()
                            : (credential as any).issuedDate
                            ? new Date(
                                (credential as any).issuedDate
                              ).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {/* Backend doesn't send expiry date */}
                          {(credential as any).expiryDate
                            ? new Date(
                                (credential as any).expiryDate
                              ).toLocaleDateString()
                            : (credential as any).expirationDate
                            ? new Date(
                                (credential as any).expirationDate
                              ).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell>{getStatusDisplay(credential)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`${
                                credential.visibility
                                  ? "bg-green-600 text-white"
                                  : "bg-slate-800 text-slate-400"
                              } hover:text-white`}
                              onClick={() =>
                                toggleVisibility(mongoDbId, {
                                  visibility: !credential.visibility,
                                })
                              }
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {credential.url && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  window.open(credential.url, "_blank")
                                }
                                className="text-blue-400 hover:text-blue-300"
                              >
                                <Link2 className="w-4 h-4" />
                              </Button>
                            )}
                            {credential.imageUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={async () => {
                                  const imageUrl = credential.imageUrl;
                                  if (imageUrl) {
                                    const isPdf = await isPdfBySignature(
                                      imageUrl
                                    );
                                    if (isPdf) {
                                      window.open(imageUrl, "_blank");
                                      return;
                                    }
                                    setModalImage(imageUrl);
                                  } else {
                                    toast.warning(
                                      "No image available for this credential."
                                    );
                                  }
                                }}
                                className="text-slate-400 hover:text-white"
                              >
                                <FileText className="w-4 h-4" />
                              </Button>
                            )}
                            {/* Blockchain links for verified credentials */}
                            {normalizeStatus(credential.status) ===
                              "VERIFIED" && (
                              <div className="flex items-center gap-2">
                                {/* Wallet address link for viewing all NFTs - Made prominent and first priority */}
                                {(credential.walletAddress ||
                                  credential.userWalletAddress ||
                                  credential.talentWalletAddress ||
                                  credential.walletAddr ||
                                  credential.owner) && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      // Try to get wallet address from multiple possible fields
                                      const walletAddr =
                                        credential.walletAddress ||
                                        credential.userWalletAddress ||
                                        credential.talentWalletAddress ||
                                        credential.walletAddr ||
                                        credential.owner;
                                      console.log(
                                        "Opening wallet explorer for:",
                                        walletAddr
                                      );
                                      window.open(
                                        getExplorerAddressUrl(walletAddr),
                                        "_blank"
                                      );
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                                    title="View all your NFTs in the blockchain explorer"
                                  >
                                    <span className="text-xs">View Wallet</span>
                                  </Button>
                                )}

                                {/* NFT token link if token ID exists - Also prominent */}
                                {credential.nftTokenId && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      console.log(
                                        "Opening NFT explorer for token ID:",
                                        credential.nftTokenId,
                                        "Contract:",
                                        import.meta.env
                                          .VITE_NFT_CONTRACT_ADDRESS
                                      );
                                      window.open(
                                        getExplorerNftUrl(
                                          credential.nftTokenId,
                                          import.meta.env
                                            .VITE_NFT_CONTRACT_ADDRESS
                                        ),
                                        "_blank"
                                      );
                                    }}
                                    className="bg-purple-600 hover:bg-purple-700 text-white border-none"
                                    title="View this specific NFT token"
                                  >
                                    <span className="text-xs">
                                      View NFT #{credential.nftTokenId}
                                    </span>
                                  </Button>
                                )}

                                {/* Transaction link if hash exists - Less prominent */}
                                {credential.transactionHash && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      console.log(
                                        "Opening transaction explorer for:",
                                        credential.transactionHash
                                      );
                                      window.open(
                                        getExplorerTransactionUrl(
                                          credential.transactionHash
                                        ),
                                        "_blank"
                                      );
                                    }}
                                    className="text-slate-400 hover:text-slate-300"
                                    title="View transaction details on blockchain"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                    <span className="text-xs ml-1">Tx</span>
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="px-4 py-8 text-center text-slate-400"
                    >
                      {credentials === undefined ? (
                        <div className="flex justify-center">
                          <CubeSpinner />
                        </div>
                      ) : (
                        "No credentials found. Submit your first credential to get started."
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal for full image preview */}
        {modalImage && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <div style={{ position: "relative" }}>
              <img
                src={modalImage}
                alt="Full Preview"
                style={{
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                  borderRadius: 12,
                  boxShadow: "0 2px 16px rgba(0,0,0,0.5)",
                }}
              />
              <button
                onClick={() => setModalImage(null)}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  background: "rgba(0,0,0,0.6)",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
// Remove all code below this line (if any)
