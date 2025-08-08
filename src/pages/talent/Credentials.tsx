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
} from "lucide-react";
import { Credential, CredentialsData } from "@/utils/global";
import { credentialTypes, credentialCategories } from "@/utils/constant";
import { toast } from "sonner";
import axiosInstance from "@/api/AxiosInstance.ts";
import axios from "axios";
import { CircleSpinner, CubeSpinner } from "react-spinners-kit";
import { isPdfBySignature } from "@/utils/helperfunctions.ts";

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
          setCredentials(response?.data.data.data);
        })
        .catch((error) => {
          console.log("Error fetching credentials:", error);
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
      !newCredential.category
    ) {
      toast.warning("Missing Information, Please fill in all required fields.");
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

    toast.promise(
      axiosInstance.post("/credentials/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      {
        loading: "Uploading...",
        success: (response) => {
          console.log(response?.data.data);
          setCredentials([...credentials, response?.data.data]);
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
          return response?.data.message;
        },
        error: (error) => {
          if (axios.isAxiosError(error)) {
            console.log(error);
            return error.response?.data.message;
          } else {
            return "Something went wrong. Please try again later.";
          }
        },
        finally: () => {
          setIsUploading(false);
        },
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
      const response = await axiosInstance.patch(
        `/credentials/${id}/update`,
        data
      );
      setCredentials((prev) =>
        prev.map((cred) =>
          cred._id === id ? { ...cred, visibility: data.visibility } : cred
        )
      );
      toast.success(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error);
        toast.error(
          error.response?.data.message || "Failed to update visibility"
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "PENDING":
        return <Clock className="w-4 h-4 text-orange-400" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4 text-red-400" />;
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
        return "";
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
    credentials?.filter((c) => c.status === "VERIFIED").length || 0;
  const pendingCount =
    credentials?.filter((c) => c.status === "PENDING").length || 0;

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
              verification
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
                  Issuing Organization
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
                  Issue Date
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
                <Label htmlFor="file" className="text-slate-300">
                  Upload File
                </Label>
                <div className="mt-2">
                  <input
                    id="file"
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("file")?.click()}
                    className="border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {newCredential.file
                      ? newCredential.file.name
                      : "Choose File"}
                  </Button>
                  <p className="text-xs text-slate-500 mt-1">
                    Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                  </p>
                </div>
              </div>

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
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {credentials && credentials.length > 0 ? (
                  credentials.map((credential) => (
                    <TableRow key={credential._id} className="border-slate-700">
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
                        {/* Backend doesn't send issuer data, so show N/A */}
                        {credential.issuingOrganization ||
                          (credential as any).issuer ||
                          (credential as any).issuingOrganization ||
                          "N/A"}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-slate-300">
                            {/* Backend doesn't send verifying organization data */}
                            {(credential as any).verifyingOrganization ||
                              (credential as any).verifier ||
                              "N/A"}
                          </p>
                          {credential.verifiedAt &&
                            credential.status === "VERIFIED" &&
                            typeof credential.verifiedAt === "string" &&
                            credential.verifiedAt !== "" && (
                              <p className="text-sm text-emerald-400">
                                Verified on{" "}
                                {new Date(
                                  credential.verifiedAt
                                ).toLocaleDateString()}
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
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(credential.status)}
                          <Badge
                            variant="secondary"
                            className={`${
                              credential.status === "VERIFIED"
                                ? "bg-green-600 text-white border-green-500 shadow-lg"
                                : getStatusColor(credential.status)
                            }`}
                          >
                            {credential.status}
                          </Badge>
                        </div>
                      </TableCell>
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
                              toggleVisibility(credential._id, {
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
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
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
