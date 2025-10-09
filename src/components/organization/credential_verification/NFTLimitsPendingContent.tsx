import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  AlertTriangle,
  CheckCircle,
  Eye,
  FileText,
  X,
  Clock,
  User,
} from "lucide-react";
import { CubeSpinner } from "react-spinners-kit";
import { BackendCredential } from "@/pages/organization/CredentialVerification";
import { useNFTLimits } from "@/context/NFTLimitsContext";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface NFTLimitsPendingContentProps {
  pendingRequests: BackendCredential[];
  rejectReasonText: string;
  selectedRequest: BackendCredential | null;
  imageLoading: boolean;
  showRejectReason: boolean;
  handleApprove: (credentialId: string) => void;
  handleReject: (credentialId: string) => void;
  setSelectedRequest: (request: BackendCredential | null) => void;
  setShowRejectReason: (show: boolean) => void;
  setRejectReasonText: (text: string) => void;
  setImageLoading: (loading: boolean) => void;
}

const NFTLimitsPendingContent = ({
  pendingRequests = [],
  setSelectedRequest,
  selectedRequest,
  handleApprove,
  handleReject,
  setShowRejectReason,
  showRejectReason,
  rejectReasonText,
  setRejectReasonText,
  setImageLoading,
  imageLoading,
}: NFTLimitsPendingContentProps) => {
  // Ensure pendingRequests is always an array
  const safeRequests = Array.isArray(pendingRequests) ? pendingRequests : [];
  const { canCreateNFT, incrementNFTCount } = useNFTLimits();
  const { toast } = useToast();
  const [showNFTLimitWarning, setShowNFTLimitWarning] = useState(false);

  // Function to render status with enhanced styling and verification info
  const getStatusDisplay = (request: BackendCredential) => {
    switch (request.status) {
      case "VERIFIED":
        return (
          <div className="flex flex-col">
            <Badge className="bg-emerald-500 text-white border-none hover:bg-emerald-600 shadow-lg">
              <CheckCircle className="w-3 h-3 mr-1" />
              VERIFIED
            </Badge>
            {request.reviewedAt && (
              <div className="text-xs text-emerald-400 mt-1">
                {request.verifyingOrganization
                  ? `By: ${request.verifyingOrganization}`
                  : ""}
                {request.reviewedAt && (
                  <div>
                    {new Date(request.reviewedAt).toLocaleString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-500/40 text-amber-200 border-amber-500/50 hover:bg-amber-500/50">
            <Clock className="w-3 h-3 mr-1" />
            PENDING
          </Badge>
        );
      case "REJECTED":
        return (
          <div className="flex flex-col">
            <Badge className="bg-red-500/40 text-red-200 border-red-500/50 hover:bg-red-500/50">
              <X className="w-3 h-3 mr-1" />
              REJECTED
            </Badge>
            {request.reviewedAt && (
              <div className="text-xs text-red-400 mt-1">
                {request.verifyingOrganization
                  ? `By: ${request.verifyingOrganization}`
                  : ""}
                {request.reviewedAt && (
                  <div>
                    {new Date(request.reviewedAt).toLocaleString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // Wrap the handleApprove function to check limits before approving
  const handleApproveWithLimits = (credentialId: string) => {
    if (!canCreateNFT) {
      setShowNFTLimitWarning(true);
      toast({
        title: "NFT Limit Reached",
        description:
          "You've reached your plan's NFT limit. Upgrade to verify more credentials.",
        variant: "destructive",
      });
      return;
    }

    // If within limits, proceed with approval and increment NFT count
    handleApprove(credentialId);
    incrementNFTCount();
    toast({
      title: "Credential Approved",
      description: "The credential has been verified successfully.",
    });
  };

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Pending Verifications</CardTitle>
        <CardDescription className="text-slate-400">
          Credentials awaiting your review and approval
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700">
              <TableHead className="text-slate-300">Talent</TableHead>
              <TableHead className="text-slate-300">Credential</TableHead>
              <TableHead className="text-slate-300">Type</TableHead>
              <TableHead className="text-slate-300">Submitted</TableHead>
              <TableHead className="text-slate-300">Status</TableHead>
              <TableHead className="text-slate-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {safeRequests.length > 0 ? (
              safeRequests.map((request) => (
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
                      <p className="text-white font-bold">{request.title}</p>
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
                  {/* Status column: enhanced styling with verification info */}
                  <TableCell>{getStatusDisplay(request)}</TableCell>
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
                              {/* NFT Limit Warning */}
                              {!canCreateNFT && (
                                <Alert className="bg-red-900/20 border-red-900/30 text-red-400 flex items-center p-4">
                                  <AlertTriangle className="w-4 h-4 mr-2" />
                                  <AlertDescription>
                                    You've reached your plan's NFT limit. You
                                    won't be able to approve this credential.
                                  </AlertDescription>
                                </Alert>
                              )}

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
                                      {selectedRequest.issuingOrganization}
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
                                      View the credential document uploaded by
                                      the talent
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
                                  onClick={() => setShowRejectReason(true)}
                                  className="border-red-600 text-red-400 hover:bg-red-600/10"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Reject
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleApproveWithLimits(selectedRequest._id)
                                  }
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                  disabled={!canCreateNFT}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve
                                </Button>
                              </div>

                              {/* NFT Limit Warning Modal */}
                              <Dialog
                                open={showNFTLimitWarning}
                                onOpenChange={setShowNFTLimitWarning}
                              >
                                <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
                                  <DialogHeader>
                                    <DialogTitle className="text-white flex items-center">
                                      <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                                      NFT Limit Reached
                                    </DialogTitle>
                                    <DialogDescription className="text-slate-400">
                                      You can't approve more credentials due to
                                      plan restrictions.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="p-4 bg-red-900/20 border border-red-900/30 rounded-md text-red-400 mt-4">
                                    <p>
                                      You've reached the maximum number of NFT
                                      credentials allowed on your current plan.
                                      To continue verifying credentials, please
                                      upgrade your plan.
                                    </p>
                                  </div>
                                  <div className="flex justify-between mt-4">
                                    <Button
                                      variant="outline"
                                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                      onClick={() =>
                                        setShowNFTLimitWarning(false)
                                      }
                                    >
                                      Close
                                    </Button>
                                    <Button
                                      className="bg-orange-600 hover:bg-orange-700 text-white"
                                      onClick={() => {
                                        // Navigate to upgrade page
                                        window.location.href =
                                          "/organization/payment";
                                      }}
                                    >
                                      Upgrade Plan
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>

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
                                      Please provide a reason for rejecting this
                                      credential.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="mt-4">
                                    <textarea
                                      className="w-full p-2 rounded bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      rows={4}
                                      placeholder="Enter rejection reason..."
                                      value={rejectReasonText}
                                      onChange={(e) =>
                                        setRejectReasonText(e.target.value)
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
                                        setRejectReasonText("");
                                        console.log(selectedRequest);
                                        handleReject(selectedRequest._id);
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-slate-400"
                >
                  No pending credentials found to verify.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default NFTLimitsPendingContent;
