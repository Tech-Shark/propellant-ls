import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Image as ImageIcon,
  X,
  ExternalLink,
} from "lucide-react";

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

interface CredentialImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export function CredentialImageModal({
  isOpen,
  onClose,
  imageUrl,
  title,
}: CredentialImageModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDownload = () => {
    const formattedUrl = formatIPFSUrl(imageUrl);
    const link = document.createElement("a");
    link.href = formattedUrl;
    link.download = `${title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(formatIPFSUrl(imageUrl), "_blank");
  };

  const isIPFS =
    imageUrl?.startsWith("ipfs://") ||
    imageUrl?.startsWith("Qm") ||
    imageUrl?.includes("/ipfs/");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] max-h-[90vh] p-1 sm:p-2 overflow-hidden">
        <DialogHeader className="px-4 py-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-blue-500" />
              <span className="text-lg truncate max-w-[400px]">{title}</span>
              {isIPFS && (
                <Badge
                  variant="outline"
                  className="ml-2 text-xs bg-blue-50 text-blue-600 border-blue-200"
                >
                  IPFS Storage
                </Badge>
              )}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="relative bg-black/5 flex items-center justify-center h-[calc(90vh-120px)] overflow-hidden">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}
          <img
            src={formatIPFSUrl(imageUrl)}
            alt={title}
            className="max-h-full transition-all duration-300 ease-in-out"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              maxWidth: "100%",
              objectFit: "contain",
            }}
            onLoad={() => setLoading(false)}
            onError={(e) => {
              setLoading(false);
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium w-16 text-center">
              {Math.round(zoom * 100)}%
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleRotate}>
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
              onClick={handleOpenInNewTab}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Open in New Tab
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
