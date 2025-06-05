
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CheckCircle, XCircle, Clock, Search, Eye } from "lucide-react";

const mockVerifications = [
  {
    id: "1",
    talent: "John Doe",
    skill: "React Development",
    verifier: "jane@techcorp.com",
    type: "employer",
    status: "pending",
    submittedDate: "2024-06-01",
    evidence: "Portfolio link and references"
  },
  {
    id: "2",
    talent: "Alice Johnson",
    skill: "Project Management",
    verifier: "bob@colleague.com",
    type: "colleague",
    status: "approved",
    submittedDate: "2024-05-28",
    evidence: "Work collaboration evidence"
  },
  {
    id: "3",
    talent: "Mike Wilson",
    skill: "Data Science",
    verifier: "hr@datatech.com",
    type: "employer",
    status: "rejected",
    submittedDate: "2024-05-25",
    evidence: "Insufficient documentation"
  },
];

export function VerificationManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredVerifications = mockVerifications.filter(verification => {
    const matchesSearch = verification.talent.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         verification.skill.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || verification.status === statusFilter;
    const matchesType = typeFilter === "all" || verification.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleApprove = (id: string) => {
    console.log("Approving verification:", id);
  };

  const handleReject = (id: string) => {
    console.log("Rejecting verification:", id);
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'employer': return 'bg-yellow-500';
      case 'colleague': return 'bg-orange-500';
      case 'client': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Verification Management</CardTitle>
          <CardDescription>Review and manage skill verification requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by talent or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="employer">Employer</SelectItem>
                <SelectItem value="colleague">Colleague</SelectItem>
                <SelectItem value="client">Client</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Talent</TableHead>
                  <TableHead>Skill/Experience</TableHead>
                  <TableHead>Verifier</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVerifications.map((verification) => (
                  <TableRow key={verification.id}>
                    <TableCell className="font-medium">{verification.talent}</TableCell>
                    <TableCell>{verification.skill}</TableCell>
                    <TableCell>{verification.verifier}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getBadgeColor(verification.type)}`}></div>
                        <span className="capitalize">{verification.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          verification.status === 'approved' ? 'default' : 
                          verification.status === 'rejected' ? 'destructive' : 
                          'secondary'
                        }
                      >
                        {verification.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {verification.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {verification.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                        {verification.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{verification.submittedDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {verification.status === 'pending' && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleApprove(verification.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleReject(verification.id)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredVerifications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No verification requests found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
