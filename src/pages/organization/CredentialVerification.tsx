import { useState } from "react";
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

interface CredentialRequest {
  id: string;
  talentId: string;
  talentName: string;
  talentEmail: string;
  credentialTitle: string;
  credentialType: "certificate" | "course" | "degree" | "license";
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  documentUrl?: string;
  status: "pending" | "verified" | "rejected";
  submittedAt: string;
  description?: string;
}

export default function CredentialVerification() {
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] =
    useState<CredentialRequest | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [requests, setRequests] = useState<CredentialRequest[]>([
    {
      id: "1",
      talentId: "talent1",
      talentName: "John Smith",
      talentEmail: "john@example.com",
      credentialTitle: "React Developer Certification",
      credentialType: "certificate",
      issuer: "Tech Academy",
      issueDate: "2024-01-15",
      status: "pending",
      submittedAt: "2024-01-10",
      documentUrl: "https://example.com/credentials/react-cert.pdf",
      description:
        "Advanced React development certification including hooks, context, and performance optimization.",
    },
    {
      id: "2",
      talentId: "talent2",
      talentName: "Sarah Johnson",
      talentEmail: "sarah@example.com",
      credentialTitle: "Full Stack Web Development",
      credentialType: "course",
      issuer: "Tech Academy",
      issueDate: "2023-12-20",
      credentialUrl: "https://techacademy.com/certificate/456",
      documentUrl: "https://example.com/credentials/fullstack-cert.pdf",
      status: "verified",
      submittedAt: "2024-01-08",
    },
    {
      id: "3",
      talentId: "talent3",
      talentName: "Mike Davis",
      talentEmail: "mike@example.com",
      credentialTitle: "JavaScript Fundamentals",
      credentialType: "certificate",
      issuer: "Tech Academy",
      issueDate: "2023-11-30",
      documentUrl: "https://example.com/credentials/js-cert.pdf",
      status: "rejected",
      submittedAt: "2024-01-05",
    },
  ]);

  const handleApprove = (requestId: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "verified" as const } : req
      )
    );

    toast({
      title: "Credential Approved",
      description: "The credential has been successfully verified.",
    });
  };

  const handleReject = (requestId: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "rejected" as const } : req
      )
    );

    toast({
      title: "Credential Rejected",
      description: "The credential verification has been rejected.",
      variant: "destructive",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "pending":
        return <Clock className="w-4 h-4 text-orange-400" />;
      case "rejected":
        return <X className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "status-success";
      case "pending":
        return "status-warning";
      case "rejected":
        return "status-error";
      default:
        return "status-default";
    }
  };

  const pendingRequests = requests.filter((req) => req.status === "pending");
  const verifiedRequests = requests.filter((req) => req.status === "verified");
  const rejectedRequests = requests.filter((req) => req.status === "rejected");

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
        <Tabs defaultValue="pending" className="space-y-6">
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
                      <TableRow key={request.id} className="border-slate-700">
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">
                              {request.talentName}
                            </p>
                            <p className="text-sm text-slate-400">
                              {request.talentEmail}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">
                              {request.credentialTitle}
                            </p>
                            <p className="text-sm text-slate-400">
                              Issued: {request.issueDate}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-slate-300">
                            {request.credentialType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {request.submittedAt}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedRequest(request)}
                                  className="text-blue-400 hover:text-blue-300"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Review
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
                                            {selectedRequest.talentName}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-slate-400">
                                            Email
                                          </p>
                                          <p className="text-white">
                                            {selectedRequest.talentEmail}
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
                                            {selectedRequest.credentialTitle}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-slate-400">
                                            Type
                                          </p>
                                          <p className="text-white capitalize">
                                            {selectedRequest.credentialType}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-slate-400">
                                            Issuer
                                          </p>
                                          <p className="text-white">
                                            {selectedRequest.issuer}
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
                                        {selectedRequest.credentialUrl && (
                                          <div className="col-span-2">
                                            <p className="text-sm text-slate-400">
                                              Credential URL
                                            </p>
                                            <a
                                              href={
                                                selectedRequest.credentialUrl
                                              }
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-blue-400 hover:text-blue-300 break-all"
                                            >
                                              {selectedRequest.credentialUrl}
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
                                    {selectedRequest.documentUrl && (
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
                                                  {
                                                    selectedRequest.credentialTitle
                                                  }
                                                </DialogDescription>
                                              </DialogHeader>
                                              <div className="mt-4 bg-slate-800 rounded-lg p-2 h-[70vh] overflow-hidden">
                                                <iframe
                                                  src={
                                                    selectedRequest.documentUrl
                                                  }
                                                  className="w-full h-full rounded border-0"
                                                  title={`${selectedRequest.credentialTitle} Document`}
                                                />
                                              </div>
                                              <div className="flex justify-end mt-4">
                                                <Button
                                                  variant="outline"
                                                  className="bg-blue-600/20 text-blue-400 border-blue-600/50 hover:bg-blue-600/30"
                                                  onClick={() =>
                                                    window.open(
                                                      selectedRequest.documentUrl,
                                                      "_blank"
                                                    )
                                                  }
                                                >
                                                  Open in New Tab
                                                </Button>
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
                                          handleReject(selectedRequest.id)
                                        }
                                        className="border-red-600 text-red-400 hover:bg-red-600/10"
                                      >
                                        <X className="w-4 h-4 mr-2" />
                                        Reject
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          handleApprove(selectedRequest.id)
                                        }
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                      >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve
                                      </Button>
                                    </div>
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
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Talent</TableHead>
                      <TableHead className="text-slate-300">
                        Credential
                      </TableHead>
                      <TableHead className="text-slate-300">Type</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {verifiedRequests.map((request) => (
                      <TableRow key={request.id} className="border-slate-700">
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">
                              {request.talentName}
                            </p>
                            <p className="text-sm text-slate-400">
                              {request.talentEmail}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">
                              {request.credentialTitle}
                            </p>
                            <p className="text-sm text-slate-400">
                              Issued: {request.issueDate}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-slate-300">
                            {request.credentialType}
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
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Talent</TableHead>
                      <TableHead className="text-slate-300">
                        Credential
                      </TableHead>
                      <TableHead className="text-slate-300">Type</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rejectedRequests.map((request) => (
                      <TableRow key={request.id} className="border-slate-700">
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">
                              {request.talentName}
                            </p>
                            <p className="text-sm text-slate-400">
                              {request.talentEmail}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">
                              {request.credentialTitle}
                            </p>
                            <p className="text-sm text-slate-400">
                              Issued: {request.issueDate}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-slate-300">
                            {request.credentialType}
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
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
