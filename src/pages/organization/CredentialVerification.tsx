import { useEffect, useState } from "react";
import axiosInstance from "@/api/AxiosInstance";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { CubeSpinner } from "react-spinners-kit";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  Clock,
  X,
  Eye,
  User,
  Award,
  FileText,
  Building,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BackendCredential {
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
}

export default function CredentialVerification() {
  // State for rejection reason modal from review
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
      const [pendingRes, verifiedRes, rejectedRes] = await Promise.all([
        axiosInstance.get(
          `/credentials/organization/retrieve?verificationStatus=PENDING&page=1&limit=20`
        ),
        axiosInstance.get(
          `/credentials/organization/retrieve?verificationStatus=VERIFIED&page=1&limit=20`
        ),
        axiosInstance.get(
          `/credentials/organization/retrieve?verificationStatus=REJECTED&page=1&limit=20`
        ),
      ]);
      const pendingData = Array.isArray(pendingRes.data?.data?.data)
        ? pendingRes.data.data.data
        : [];
      const verifiedData = Array.isArray(verifiedRes.data?.data?.data)
        ? verifiedRes.data.data.data
        : [];
      const rejectedData = Array.isArray(rejectedRes.data?.data?.data)
        ? rejectedRes.data.data.data
        : [];
      setPendingRequests(pendingData);
      setVerifiedRequests(verifiedData);
      setRejectedRequests(rejectedData);
    } catch (err: any) {
      toast({
        title: "Error loading credentials",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCredentials();
    // eslint-disable-next-line
  }, [toast]);

  const handleApprove = async (credentialId: string) => {
    try {
      await axiosInstance.patch(`/credentials/${credentialId}/verify`, {
        status: "VERIFIED",
      });
      toast({
        title: "Credential Approved",
        description: "The credential has been successfully verified.",
      });
      fetchAllCredentials();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    }
  };
  const handleReject = async (credentialId: string) => {
    try {
      await axiosInstance.patch(`/credentials/${credentialId}/verify`, {
        status: "REJECTED",
      });
      toast({
        title: "Credential Rejected",
        description: "The credential verification has been rejected.",
        variant: "destructive",
      });
      fetchAllCredentials();
    } catch (err: any) {
      toast({
        title: "Error",
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
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Pending Verifications
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Credentials awaiting your review and approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Talent</TableHead>
                      <TableHead className="text-slate-300">
                        Credential
                      </TableHead>
                      <TableHead className="text-slate-300">Type</TableHead>
                      <TableHead className="text-slate-300">
                        Submitted
                      </TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRequests.map((request) => (
                      <TableRow key={request._id} className="border-slate-700">
                        {/* Talent column: user.fullname (bold), user.email (not bold, optional), fallback to verifyingEmail or user._id */}
                        <TableCell>
                          <div>
                            <p className="text-white font-bold">
                              {request.user?.fullname ||
                                request.verifyingEmail ||
                                request.user?._id ||
                                "-"}
                            </p>
                            {request.user?.email && (
                              <p className="text-sm text-slate-400">
                                {request.user.email}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        {/* Credential column: title (bold), issue date */}
                        <TableCell>
                          <div>
                            <p className="text-white font-bold">
                              {request.title}
                            </p>
                            <p className="text-sm text-slate-400">
                              Issued: {request.issueDate}
                            </p>
                          </div>
                        </TableCell>
                        {/* Type column */}
                        <TableCell>
                          <Badge variant="outline" className="text-slate-300">
                            {request.type}
                          </Badge>
                        </TableCell>
                        {/* Submitted column: formatted createdAt */}
                        <TableCell className="text-slate-300">
                          {request.createdAt
                            ? new Date(request.createdAt)
                                .toLocaleString("en-GB", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                })
                                .replace(",", "")
                            : ""}
                        </TableCell>
                        {/* Actions column: eye icon for modal */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedRequest(request)}
                                  className="text-blue-400 hover:text-blue-300 flex items-center"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  <span className="font-medium">Review</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="text-white">
                                    Review Credential
                                  </DialogTitle>
                                  <DialogDescription className="text-slate-400">
                                    Verify the credential details and talent
                                    information
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedRequest && (
                                  <div className="space-y-6">
                                    {/* Talent Info */}
                                    <div className="p-4 bg-slate-800 rounded-lg">
                                      <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Talent Information
                                      </h3>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm text-slate-400">
                                            Name
                                          </p>
                                          <p className="text-white">
                                            {selectedRequest.user?.fullname ||
                                              selectedRequest.verifyingEmail ||
                                              selectedRequest.user?._id ||
                                              "-"}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-slate-400">
                                            Email
                                          </p>
                                          <p className="text-white">
                                            {selectedRequest.user?.email ||
                                              selectedRequest.verifyingEmail ||
                                              "-"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Credential Info */}
                                    <div className="p-4 bg-slate-800 rounded-lg">
                                      <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Credential Details
                                      </h3>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm text-slate-400">
                                            Title
                                          </p>
                                          <p className="text-white">
                                            {selectedRequest.title}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-slate-400">
                                            Type
                                          </p>
                                          <p className="text-white capitalize">
                                            {selectedRequest.type}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-slate-400">
                                            Issuer
                                          </p>
                                          <p className="text-white">
                                            {
                                              selectedRequest.issuingOrganization
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-slate-400">
                                            Issue Date
                                          </p>
                                          <p className="text-white">
                                            {selectedRequest.issueDate}
                                          </p>
                                        </div>
                                        {selectedRequest.expiryDate && (
                                          <div>
                                            <p className="text-sm text-slate-400">
                                              Expiry Date
                                            </p>
                                            <p className="text-white">
                                              {selectedRequest.expiryDate}
                                            </p>
                                          </div>
                                        )}
                                        {selectedRequest.externalUrl && (
                                          <div className="col-span-2">
                                            <p className="text-sm text-slate-400">
                                              Credential URL
                                            </p>
                                            <a
                                              href={selectedRequest.externalUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-blue-400 hover:text-blue-300 break-all"
                                            >
                                              {selectedRequest.externalUrl}
                                            </a>
                                          </div>
                                        )}
                                      </div>
                                      {selectedRequest.description && (
                                        <div className="mt-4">
                                          <p className="text-sm text-slate-400">
                                            Description
                                          </p>
                                          <p className="text-white">
                                            {selectedRequest.description}
                                          </p>
                                        </div>
                                      )}
                                    </div>

                                    {/* Document Preview */}
                                    {(selectedRequest.imageUrl ||
                                      selectedRequest.evidenceHash ||
                                      selectedRequest.ipfsHash) && (
                                      <div className="p-4 bg-slate-800 rounded-lg">
                                        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                                          <FileText className="w-4 h-4" />
                                          Uploaded Document
                                        </h3>
                                        <div>
                                          <p className="text-sm text-slate-400 mb-2">
                                            View the credential document
                                            uploaded by the talent
                                          </p>
                                          <Dialog>
                                            <DialogTrigger asChild>
                                              <Button
                                                variant="outline"
                                                className="bg-blue-600/20 text-blue-400 border-blue-600/50 hover:bg-blue-600/30"
                                              >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Document
                                              </Button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-slate-900 border-slate-700 max-w-4xl max-h-[90vh]">
                                              <DialogHeader>
                                                <DialogTitle className="text-white">
                                                  Credential Document
                                                </DialogTitle>
                                                <DialogDescription className="text-slate-400">
                                                  Document submitted for{" "}
                                                  {selectedRequest.title}
                                                </DialogDescription>
                                              </DialogHeader>
                                              <div className="mt-4 bg-slate-800 rounded-lg p-2 h-[70vh] overflow-hidden flex items-center justify-center">
                                                {imageLoading && (
                                                  <div className="flex justify-center items-center w-full h-full">
                                                    <CubeSpinner />
                                                  </div>
                                                )}
                                                <iframe
                                                  src={
                                                    selectedRequest.imageUrl ||
                                                    (selectedRequest.evidenceHash
                                                      ? `https://gateway.pinata.cloud/ipfs/${selectedRequest.evidenceHash}`
                                                      : selectedRequest.ipfsHash
                                                      ? `https://gateway.pinata.cloud/ipfs/${selectedRequest.ipfsHash}`
                                                      : "")
                                                  }
                                                  className="w-full h-full rounded border-0"
                                                  title={`${selectedRequest.title} Document`}
                                                  style={{
                                                    display: imageLoading
                                                      ? "none"
                                                      : "block",
                                                  }}
                                                  onLoad={() =>
                                                    setImageLoading(false)
                                                  }
                                                  onLoadStart={() =>
                                                    setImageLoading(true)
                                                  }
                                                />
                                              </div>
                                              <div className="flex justify-end gap-3 mt-4">
                                                <Button
                                                  variant="outline"
                                                  className="bg-blue-600/20 text-blue-400 border-blue-600/50 hover:bg-blue-600/30"
                                                  onClick={() =>
                                                    window.open(
                                                      selectedRequest.imageUrl ||
                                                        (selectedRequest.evidenceHash
                                                          ? `https://gateway.pinata.cloud/ipfs/${selectedRequest.evidenceHash}`
                                                          : selectedRequest.ipfsHash
                                                          ? `https://gateway.pinata.cloud/ipfs/${selectedRequest.ipfsHash}`
                                                          : ""),
                                                      "_blank"
                                                    )
                                                  }
                                                >
                                                  Open in New Tab
                                                </Button>
                                                <DialogTrigger asChild>
                                                  <Button
                                                    variant="outline"
                                                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                                  >
                                                    Close
                                                  </Button>
                                                </DialogTrigger>
                                              </div>
                                            </DialogContent>
                                          </Dialog>
                                        </div>
                                      </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex justify-end gap-3">
                                      <Button
                                        variant="outline"
                                        onClick={() =>
                                          setShowRejectReason(true)
                                        }
                                        className="border-red-600 text-red-400 hover:bg-red-600/10"
                                      >
                                        <X className="w-4 h-4 mr-2" />
                                        Reject
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          handleApprove(
                                            selectedRequest.credentialId
                                          )
                                        }
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                      >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve
                                      </Button>
                                    </div>
                                    {/* Rejection Reason Modal */}
                                    <Dialog
                                      open={showRejectReason}
                                      onOpenChange={(open) => {
                                        if (!open) {
                                          setShowRejectReason(false);
                                          setRejectReasonText("");
                                        }
                                      }}
                                    >
                                      <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
                                        <DialogHeader>
                                          <DialogTitle className="text-white">
                                            Rejection Reason
                                          </DialogTitle>
                                          <DialogDescription className="text-slate-400">
                                            Please provide a reason for
                                            rejecting this credential.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="mt-4">
                                          <textarea
                                            className="w-full p-2 rounded bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows={4}
                                            placeholder="Enter rejection reason..."
                                            value={rejectReasonText}
                                            onChange={(e) =>
                                              setRejectReasonText(
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                        <div className="flex justify-end mt-4 gap-2">
                                          <Button
                                            variant="outline"
                                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                            onClick={() => {
                                              setShowRejectReason(false);
                                              setRejectReasonText("");
                                            }}
                                          >
                                            Cancel
                                          </Button>
                                          <Button
                                            variant="outline"
                                            className="bg-red-600/20 text-red-400 border-red-600/50 hover:bg-red-600/30"
                                            disabled={!rejectReasonText.trim()}
                                            onClick={() => {
                                              setShowRejectReason(false);
                                              setRejectReasonText(
                                                ""
                                              ); /* Dead link for now */
                                            }}
                                          >
                                            Send
                                          </Button>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verified">
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Verified Credentials
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Credentials that have been successfully verified
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <CubeSpinner />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-300">Talent</TableHead>
                        <TableHead className="text-slate-300">
                          Credential
                        </TableHead>
                        <TableHead className="text-slate-300">Type</TableHead>
                        <TableHead className="text-slate-300">Status</TableHead>
                        <TableHead className="text-slate-300">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {verifiedRequests.map((request) => (
                        <TableRow
                          key={request._id}
                          className="border-slate-700"
                        >
                          {/* Talent column: user.fullname (bold), user.email (not bold, optional), fallback to verifyingEmail or user._id */}
                          <TableCell>
                            <div>
                              <p className="text-white font-bold">
                                {request.user?.fullname ||
                                  request.verifyingEmail ||
                                  request.user?._id ||
                                  "-"}
                              </p>
                              {request.user?.email && (
                                <p className="text-sm text-slate-400">
                                  {request.user.email}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          {/* Credential column: title (bold), issue date */}
                          <TableCell>
                            <div>
                              <p className="text-white font-bold">
                                {request.title}
                              </p>
                              <p className="text-sm text-slate-400">
                                Issued: {request.issueDate}
                              </p>
                            </div>
                          </TableCell>
                          {/* Type column */}
                          <TableCell>
                            <Badge variant="outline" className="text-slate-300">
                              {request.type}
                            </Badge>
                          </TableCell>
                          {/* Status column */}
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(request.status)}
                              <Badge
                                variant="secondary"
                                className={getStatusColor(request.status)}
                              >
                                {request.status}
                              </Badge>
                            </div>
                          </TableCell>
                          {/* Actions column: eye icon for modal */}
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedRequest(request)}
                                    className="text-blue-400 hover:text-blue-300 flex items-center"
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    <span className="font-medium">View</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle className="text-white">
                                      Credential NFT
                                    </DialogTitle>
                                    <DialogDescription className="text-slate-400">
                                      View the verified credential and talent
                                      information
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedRequest && (
                                    <div className="space-y-6">
                                      {/* Talent Info */}
                                      <div className="p-4 bg-slate-800 rounded-lg">
                                        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                                          <User className="w-4 h-4" />
                                          Talent Information
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <p className="text-sm text-slate-400">
                                              Name
                                            </p>
                                            <p className="text-white">
                                              {selectedRequest.user?.fullname ||
                                                selectedRequest.verifyingEmail ||
                                                selectedRequest.user?._id ||
                                                "-"}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-slate-400">
                                              Email
                                            </p>
                                            <p className="text-white">
                                              {selectedRequest.user?.email ||
                                                selectedRequest.verifyingEmail ||
                                                "-"}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      {/* Credential Info */}
                                      <div className="p-4 bg-slate-800 rounded-lg">
                                        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                                          <FileText className="w-4 h-4" />
                                          Credential Details
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <p className="text-sm text-slate-400">
                                              Title
                                            </p>
                                            <p className="text-white">
                                              {selectedRequest.title}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-slate-400">
                                              Type
                                            </p>
                                            <p className="text-white capitalize">
                                              {selectedRequest.type}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-slate-400">
                                              Issuer
                                            </p>
                                            <p className="text-white">
                                              {
                                                selectedRequest.issuingOrganization
                                              }
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-slate-400">
                                              Issue Date
                                            </p>
                                            <p className="text-white">
                                              {selectedRequest.issueDate}
                                            </p>
                                          </div>
                                          {selectedRequest.expiryDate && (
                                            <div>
                                              <p className="text-sm text-slate-400">
                                                Expiry Date
                                              </p>
                                              <p className="text-white">
                                                {selectedRequest.expiryDate}
                                              </p>
                                            </div>
                                          )}
                                          {selectedRequest.externalUrl && (
                                            <div className="col-span-2">
                                              <p className="text-sm text-slate-400">
                                                Credential URL
                                              </p>
                                              <a
                                                href={
                                                  selectedRequest.externalUrl
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300 break-all"
                                              >
                                                {selectedRequest.externalUrl}
                                              </a>
                                            </div>
                                          )}
                                        </div>
                                        {selectedRequest.description && (
                                          <div className="mt-4">
                                            <p className="text-sm text-slate-400">
                                              Description
                                            </p>
                                            <p className="text-white">
                                              {selectedRequest.description}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                      {/* NFT Preview */}
                                      {(selectedRequest.imageUrl ||
                                        selectedRequest.evidenceHash ||
                                        selectedRequest.ipfsHash) && (
                                        <div className="p-4 bg-slate-800 rounded-lg">
                                          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            Credential NFT
                                          </h3>
                                          <div>
                                            <p className="text-sm text-slate-400 mb-2">
                                              View the NFT representing this
                                              credential
                                            </p>
                                            <Dialog>
                                              <DialogTrigger asChild>
                                                <Button
                                                  variant="outline"
                                                  className="bg-blue-600/20 text-blue-400 border-blue-600/50 hover:bg-blue-600/30"
                                                >
                                                  <Eye className="w-4 h-4 mr-2" />
                                                  View NFT
                                                </Button>
                                              </DialogTrigger>
                                              <DialogContent className="bg-slate-900 border-slate-700 max-w-4xl max-h-[90vh]">
                                                <DialogHeader>
                                                  <DialogTitle className="text-white">
                                                    Credential NFT
                                                  </DialogTitle>
                                                  <DialogDescription className="text-slate-400">
                                                    NFT for{" "}
                                                    {selectedRequest.title}
                                                  </DialogDescription>
                                                </DialogHeader>
                                                <div className="mt-4 bg-slate-800 rounded-lg p-2 h-[70vh] overflow-hidden flex items-center justify-center">
                                                  {imageLoading && (
                                                    <div className="flex justify-center items-center w-full h-full">
                                                      <CubeSpinner />
                                                    </div>
                                                  )}
                                                  <iframe
                                                    src={
                                                      selectedRequest.imageUrl ||
                                                      (selectedRequest.evidenceHash
                                                        ? `https://gateway.pinata.cloud/ipfs/${selectedRequest.evidenceHash}`
                                                        : selectedRequest.ipfsHash
                                                        ? `https://gateway.pinata.cloud/ipfs/${selectedRequest.ipfsHash}`
                                                        : "")
                                                    }
                                                    className="w-full h-full rounded border-0"
                                                    title={`${selectedRequest.title} NFT`}
                                                    style={{
                                                      display: imageLoading
                                                        ? "none"
                                                        : "block",
                                                    }}
                                                    onLoad={() =>
                                                      setImageLoading(false)
                                                    }
                                                    onLoadStart={() =>
                                                      setImageLoading(true)
                                                    }
                                                  />
                                                </div>
                                                <div className="flex justify-end gap-3 mt-4">
                                                  <Button
                                                    variant="outline"
                                                    className="bg-blue-600/20 text-blue-400 border-blue-600/50 hover:bg-blue-600/30"
                                                    onClick={() =>
                                                      window.open(
                                                        selectedRequest.imageUrl ||
                                                          (selectedRequest.evidenceHash
                                                            ? `https://gateway.pinata.cloud/ipfs/${selectedRequest.evidenceHash}`
                                                            : selectedRequest.ipfsHash
                                                            ? `https://gateway.pinata.cloud/ipfs/${selectedRequest.ipfsHash}`
                                                            : ""),
                                                        "_blank"
                                                      )
                                                    }
                                                  >
                                                    Open in New Tab
                                                  </Button>
                                                  <DialogTrigger asChild>
                                                    <Button
                                                      variant="outline"
                                                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                                    >
                                                      Close
                                                    </Button>
                                                  </DialogTrigger>
                                                </div>
                                              </DialogContent>
                                            </Dialog>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected">
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Rejected Credentials
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Credentials that have been rejected
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <CubeSpinner />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-300">Talent</TableHead>
                        <TableHead className="text-slate-300">
                          Credential
                        </TableHead>
                        <TableHead className="text-slate-300">Type</TableHead>
                        <TableHead className="text-slate-300">Status</TableHead>
                        <TableHead className="text-slate-300">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rejectedRequests.map((request) => (
                        <TableRow
                          key={request._id}
                          className="border-slate-700"
                        >
                          <TableCell>
                            <div>
                              <p className="text-white font-bold">
                                {request.user?.fullname ||
                                  request.talentName ||
                                  request.verifyingEmail ||
                                  request.user?._id ||
                                  "-"}
                              </p>
                              {request.user?.email ? (
                                <p className="text-sm text-slate-400">
                                  {request.user.email}
                                </p>
                              ) : request.talentEmail ? (
                                <p className="text-sm text-slate-400">
                                  {request.talentEmail}
                                </p>
                              ) : request.verifyingEmail ? (
                                <p className="text-sm text-slate-400">
                                  {request.verifyingEmail}
                                </p>
                              ) : null}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-white font-medium">
                                {request.title}
                              </p>
                              <p className="text-sm text-slate-400">
                                Issued: {request.issueDate}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-slate-300">
                              {request.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(request.status)}
                              <Badge
                                variant="secondary"
                                className={getStatusColor(request.status)}
                              >
                                {request.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-400 hover:text-blue-300"
                                  onClick={() => setSelectedRequest(request)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="text-white">
                                    Rejected Credential
                                  </DialogTitle>
                                  <DialogDescription className="text-slate-400">
                                    This credential was rejected. See the details and rejection reason below.
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedRequest && (
                                  <div className="space-y-6">
                                    {/* Talent Info */}
                                    <div className="p-4 bg-slate-800 rounded-lg">
                                      <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Talent Information
                                      </h3>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm text-slate-400">Name</p>
                                          <p className="text-white">{selectedRequest.user?.fullname || selectedRequest.talentName || selectedRequest.verifyingEmail || selectedRequest.user?._id || "-"}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-slate-400">Email</p>
                                          <p className="text-white">{selectedRequest.user?.email || selectedRequest.talentEmail || selectedRequest.verifyingEmail || "-"}</p>
                                        </div>
                                      </div>
                                    </div>
                                    {/* Credential Info */}
                                    <div className="p-4 bg-slate-800 rounded-lg">
                                      <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Credential Details
                                      </h3>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm text-slate-400">Title</p>
                                          <p className="text-white">{selectedRequest.title}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-slate-400">Type</p>
                                          <p className="text-white capitalize">{selectedRequest.type}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-slate-400">Issuer</p>
                                          <p className="text-white">{selectedRequest.issuingOrganization}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-slate-400">Issue Date</p>
                                          <p className="text-white">{selectedRequest.issueDate}</p>
                                        </div>
                                        {selectedRequest.expiryDate && (
                                          <div>
                                            <p className="text-sm text-slate-400">Expiry Date</p>
                                            <p className="text-white">{selectedRequest.expiryDate}</p>
                                          </div>
                                        )}
                                        {selectedRequest.externalUrl && (
                                          <div className="col-span-2">
                                            <p className="text-sm text-slate-400">Credential URL</p>
                                            <a href={selectedRequest.externalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 break-all">{selectedRequest.externalUrl}</a>
                                          </div>
                                        )}
                                      </div>
                                      {selectedRequest.description && (
                                        <div className="mt-4">
                                          <p className="text-sm text-slate-400">Description</p>
                                          <p className="text-white">{selectedRequest.description}</p>
                                        </div>
                                      )}
                                    </div>
                                    {/* Rejection Reason */}
                                    <div className="p-4 bg-slate-800 rounded-lg">
                                      <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                                        <X className="w-4 h-4" />
                                        Rejection Reason
                                      </h3>
                                      <p className="text-white whitespace-pre-line">{selectedRequest.message || "No reason provided."}</p>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
