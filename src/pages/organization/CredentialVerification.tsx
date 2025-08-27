import {useEffect, useState} from "react";
import axiosInstance from "@/api/AxiosInstance";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Badge} from "@/components/ui/badge";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {
    CheckCircle,
    Clock,
    X,
    Award,
} from "lucide-react";
import {useToast} from "@/hooks/use-toast";
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
}

export default function CredentialVerification() {
    const [showRejectReason, setShowRejectReason] = useState(false);
    const [rejectReasonText, setRejectReasonText] = useState("");
    const {toast} = useToast();
    const [selectedRequest, setSelectedRequest] = useState<BackendCredential | null>(null);
    const [pendingRequests, setPendingRequests] = useState<BackendCredential[]>([]);
    const [verifiedRequests, setVerifiedRequests] = useState<BackendCredential[]>([]);
    const [rejectedRequests, setRejectedRequests] = useState<BackendCredential[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("pending");
    const [imageLoading, setImageLoading] = useState(false);

    // Fetch all credential statuses in parallel
    const fetchAllCredentials = async () => {
        setLoading(true);
        try {
            // const [pendingRes, verifiedRes, rejectedRes] = await Promise.all([
            //     axiosInstance.get(
            //         `/credentials`
            //     ),
            //     // axiosInstance.get(
            //     //     `/credentials?verificationStatus=PENDING&page=1&limit=20`
            //     // ),
            //     // axiosInstance.get(
            //     //     `/credentials?verificationStatus=VERIFIED&page=1&limit=20`
            //     // ),
            //     // axiosInstance.get(
            //     //     `/credentials?verificationStatus=REJECTED&page=1&limit=20`
            //     // ),
            // ]);
            // const pendingData = Array.isArray(pendingRes.data?.data?.data)
            //     ? pendingRes.data.data.data
            //     : [];
            // const verifiedData = Array.isArray(verifiedRes.data?.data?.data)
            //     ? verifiedRes.data.data.data
            //     : [];
            // const rejectedData = Array.isArray(rejectedRes.data?.data?.data)
            //     ? rejectedRes.data.data.data
            //     : [];
            // setPendingRequests(pendingData);
            // console.log(pendingData);
            // setVerifiedRequests(verifiedData);
            // setRejectedRequests(rejectedData);
            await axiosInstance.get(
                `/credentials`
            ).then(
                (response) => {
                    console.log(response);
                }
            )
        } catch (err) {
            console.log(err)
            // toast({
            //     title: "Error loading credentials",
            //     description: err.response?.data?.message || err.message,
            //     variant: "destructive",
            // });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllCredentials();
    }, [toast]);

    const handleApprove = async (credentialId: string) => {
        try {
            const response = await axiosInstance.patch(`/credentials/${credentialId}/verify`, {
                status: "VERIFIED",
            });

            console.log(response);

            fetchAllCredentials();
        } catch (err) {
            console.log(err)
        }
    };
    const handleReject = async (credentialId: string) => {
        try {
            const response = await axiosInstance.post(`/credentials/${credentialId}/verify`, {
                status: "REJECTED",
            });

            console.log(response);

            fetchAllCredentials();
        } catch (err) {
            console.log(err);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "VERIFIED":
                return <CheckCircle className="w-4 h-4 text-emerald-400"/>;
            case "PENDING":
                return <Clock className="w-4 h-4 text-orange-400"/>;
            case "REJECTED":
                return <X className="w-4 h-4 text-red-400"/>;
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
                        <SidebarTrigger className="text-slate-400 hover:text-white"/>
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
                            <Clock className="w-3 h-3 mr-1"/>
                            {pendingRequests.length} Pending
                        </Badge>
                        <Badge variant="secondary" className="text-slate-300">
                            <Award className="w-3 h-3 mr-1"/>
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
}
