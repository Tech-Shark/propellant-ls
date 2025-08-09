import React, {ReactNode} from 'react';
import {BackendCredential} from "@/pages/organization/CredentialVerification.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {CubeSpinner} from "react-spinners-kit";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Eye, FileText, User, X} from "lucide-react";

interface RejectedContentProps {
    rejectedRequests: BackendCredential[],
    selectedRequest: BackendCredential | null,
    loading: boolean,
    getStatusIcon: (status: string) => ReactNode,
    getStatusColor: (status: string) => string,
    setSelectedRequest: (request: BackendCredential | null) => void,
}

const RejectedContent = ({
    rejectedRequests,
    setSelectedRequest,
    selectedRequest,
    loading,
    getStatusIcon,
    getStatusColor,
}: RejectedContentProps) => {
    return (
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
                        <CubeSpinner/>
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
                                                    <Eye className="w-4 h-4"/>
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent
                                                className="bg-slate-900 border-slate-700 max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle className="text-white">
                                                        Rejected Credential
                                                    </DialogTitle>
                                                    <DialogDescription className="text-slate-400">
                                                        This credential was rejected. See the
                                                        details and rejection reason below.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                {selectedRequest && (
                                                    <div className="space-y-6">
                                                        {/* Talent Info */}
                                                        <div className="p-4 bg-slate-800 rounded-lg">
                                                            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                                                                <User className="w-4 h-4"/>
                                                                Talent Information
                                                            </h3>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <p className="text-sm text-slate-400">
                                                                        Name
                                                                    </p>
                                                                    <p className="text-white">
                                                                        {selectedRequest.user?.fullname ||
                                                                            selectedRequest.talentName ||
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
                                                                            selectedRequest.talentEmail ||
                                                                            selectedRequest.verifyingEmail ||
                                                                            "-"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* Credential Info */}
                                                        <div className="p-4 bg-slate-800 rounded-lg">
                                                            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                                                                <FileText className="w-4 h-4"/>
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
                                                        {/* Rejection Reason */}
                                                        <div className="p-4 bg-slate-800 rounded-lg">
                                                            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                                                                <X className="w-4 h-4"/>
                                                                Rejection Reason
                                                            </h3>
                                                            <p className="text-white whitespace-pre-line">
                                                                {selectedRequest.message ||
                                                                    "No reason provided."}
                                                            </p>
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
    );
};

export default RejectedContent;
