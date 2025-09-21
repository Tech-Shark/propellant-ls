import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Calendar,
  User,
  Building,
  Award,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  ExternalLink,
  Image as ImageIcon,
  Maximize2,
} from "lucide-react";
import { convertDate } from "@/utils/helperfunctions";
import { CredentialImageModal } from "./CredentialImageModal";

// Helper function to format IPFS URLs correctly
const formatIPFSUrl = (url: string): string => {
  if (!url) return "";

  // If it's already a full URL (https://), use it directly
  if (url.startsWith("http")) {
    return url;
  }

  // If it's an IPFS hash or path
  if (url.startsWith("ipfs://")) {
    // Convert ipfs:// protocol to https gateway URL
    const hash = url.replace("ipfs://", "");
    return `https://gateway.pinata.cloud/ipfs/${hash}`;
  }

  // If it's just a CID or hash without protocol
  if (url.startsWith("Qm") || url.startsWith("bafy")) {
    return `https://gateway.pinata.cloud/ipfs/${url}`;
  }

  // Otherwise return as is
  return url;
};

interface CredentialDetailModalProps {
  credential: any;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  isPending: boolean;
}

export function CredentialDetailModal({
  credential,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isPending,
}: CredentialDetailModalProps) {
  const [imageError, setImageError] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");

  if (!credential) return null;

  // Get multiple attachments if available
  let attachments = Array.isArray(credential.attachments)
    ? credential.attachments
    : credential.imageUrl
    ? [credential.imageUrl]
    : [];

  // Add IPFS hash if available but not already in attachments
  if (
    credential.ipfsHash &&
    !attachments.some(
      (url) => url.includes(credential.ipfsHash) || url === credential.ipfsHash
    )
  ) {
    attachments.push(credential.ipfsHash);
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "VERIFIED":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" /> Verified
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" /> Rejected
          </Badge>
        );
      case "PENDING":
      default:
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-500" />
              {credential.title || "Credential Details"}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              {getStatusBadge(credential.verificationStatus || "PENDING")}
              {attachments.length > 0 && (
                <span className="text-xs text-gray-500">
                  ({attachments.length}{" "}
                  {attachments.length === 1 ? "attachment" : "attachments"})
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Credential Images/Attachments */}
            {attachments.length > 0 ? (
              <div className="flex flex-col gap-4" data-document-section>
                {attachments.map((attachment, index) => {
                  const isIPFS =
                    attachment.startsWith("ipfs://") ||
                    attachment.startsWith("Qm") ||
                    attachment.includes("/ipfs/");
                  const isPDF = attachment.toLowerCase().endsWith(".pdf");
                  const isImage = /\.(jpe?g|png|gif|webp|svg)$/i.test(
                    attachment
                  );

                  return (
                    <div
                      key={index}
                      className="border rounded-md overflow-hidden bg-gray-50 shadow-sm"
                    >
                      {/* Header with type indicator */}
                      <div className="bg-gray-100 px-3 py-2 border-b flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {isPDF ? (
                            <FileText className="h-4 w-4 text-blue-500" />
                          ) : isImage ? (
                            <ImageIcon className="h-4 w-4 text-green-500" />
                          ) : (
                            <FileText className="h-4 w-4 text-gray-500" />
                          )}
                          <span className="text-sm font-medium">
                            {isPDF
                              ? "PDF Document"
                              : isImage
                              ? "Image"
                              : "Attachment"}{" "}
                            {attachments.length > 1 ? `${index + 1}` : ""}
                          </span>
                        </div>

                        {/* IPFS badge */}
                        {isIPFS && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-blue-50 text-blue-600 border-blue-200"
                          >
                            IPFS Storage
                          </Badge>
                        )}
                      </div>

                      {/* Content preview */}
                      <div className="relative h-72 w-full overflow-hidden">
                        {isPDF ? (
                          <div className="flex flex-col items-center justify-center h-full w-full p-4 bg-blue-50/50">
                            <FileText className="h-16 w-16 text-blue-400 mb-3" />
                            <div className="text-sm text-center text-blue-700 font-medium mb-2">
                              PDF Document
                            </div>
                            <div className="text-xs text-center text-gray-500 max-w-xs">
                              PDF files can be viewed in a new tab
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full w-full">
                            <img
                              src={formatIPFSUrl(attachment)}
                              alt={`${credential.title || "Credential"} ${
                                index + 1
                              }`}
                              className="object-contain w-full h-full"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/placeholder.svg";
                                console.error(
                                  "Error loading image:",
                                  attachment
                                );
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="bg-gray-50 px-3 py-2 border-t flex justify-between">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs hover:bg-blue-50 text-blue-700"
                          onClick={() => {
                            if (isImage) {
                              setSelectedImageUrl(attachment);
                              setImageViewerOpen(true);
                            } else {
                              window.open(formatIPFSUrl(attachment), "_blank");
                            }
                          }}
                        >
                          <Maximize2 className="h-3 w-3 mr-1" />
                          {isImage
                            ? "View Full Image"
                            : isPDF
                            ? "Open Document"
                            : "View Attachment"}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
                          onClick={() =>
                            window.open(formatIPFSUrl(attachment), "_blank")
                          }
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Open in New Tab
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 border rounded-md bg-gray-50">
                <ImageIcon className="h-12 w-12 text-gray-300 mb-2" />
                <p className="text-gray-500 text-sm">
                  No attachments available
                </p>
              </div>
            )}

            {/* Main Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Title</div>
                <div className="font-medium">{credential.title || "N/A"}</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-500">Type</div>
                <div className="font-medium capitalize">
                  {credential.type || credential.category || "N/A"}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-500">Issue Date</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {credential.issueDate
                    ? convertDate(credential.issueDate)
                    : "N/A"}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-500">Expiry Date</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {credential.expiryDate
                    ? convertDate(credential.expiryDate)
                    : "No expiry"}
                </div>
              </div>
            </div>

            {/* Organization Info */}
            <div className="space-y-3 border-t border-b py-3">
              <div className="space-y-1">
                <div className="text-sm text-gray-500">
                  Issuing Organization
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  {credential.issuingOrganization || "N/A"}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-gray-500">
                  Verifying Organization
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  {credential.verifyingOrganization || "N/A"}
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Credential Owner</div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                {credential.user?.email || "N/A"}
              </div>
            </div>

            {/* Description */}
            {credential.description && (
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Description</div>
                <div className="p-3 bg-gray-50 rounded-md text-sm">
                  {credential.description}
                </div>
              </div>
            )}

            {/* External Links */}
            {credential.externalUrl && (
              <div className="space-y-2">
                <div className="text-sm text-gray-500">External Reference</div>
                <div>
                  <a
                    href={credential.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" /> View Resource
                  </a>
                </div>
              </div>
            )}

            {/* Blockchain Info */}
            {credential.blockchainStatus && (
              <div className="space-y-2 border-t pt-3">
                <div className="text-sm text-gray-500 font-medium">
                  Blockchain Status
                </div>
                <Badge
                  variant={
                    credential.blockchainStatus === "MINTED"
                      ? "default"
                      : "secondary"
                  }
                  className="capitalize"
                >
                  {credential.blockchainStatus.replace("_", " ").toLowerCase()}
                </Badge>

                {credential.transactionHash && (
                  <div className="text-xs text-gray-500 truncate">
                    Transaction: {credential.transactionHash.substring(0, 16)}
                    ...
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-end gap-2">
            {credential.verificationStatus === "PENDING" &&
              onApprove &&
              onReject && (
                <>
                  <Button
                    onClick={onReject}
                    variant="destructive"
                    disabled={isPending}
                  >
                    <XCircle className="w-4 h-4 mr-1" /> Reject
                  </Button>
                  <Button onClick={onApprove} disabled={isPending}>
                    <CheckCircle className="w-4 h-4 mr-1" /> Approve
                  </Button>
                </>
              )}
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Viewer Modal */}
      <CredentialImageModal
        isOpen={imageViewerOpen}
        onClose={() => setImageViewerOpen(false)}
        imageUrl={selectedImageUrl}
        title={credential.title || "Credential Image"}
      />
    </>
  );
}
