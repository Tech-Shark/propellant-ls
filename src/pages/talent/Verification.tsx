import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TalentSidebar } from "@/components/TalentSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Clock, Award, Mail, Send, Plus, Star, Trophy, Medal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import OTPVerification from "@/components/OTPVerification";

interface VerificationRequest {
  id: string;
  verifierEmail: string;
  verifierName?: string;
  type: 'skill' | 'experience' | 'responsibility';
  category: string;
  description: string;
  status: 'pending' | 'verified' | 'declined';
  verifierType: 'employer' | 'colleague' | 'client';
  requestedAt: string;
  completedAt?: string;
  badgeEarned?: 'gold' | 'silver' | 'bronze';
}

const verificationType = [
  { value: 'skill', label: 'Technical Skill' },
  { value: 'experience', label: 'Work Experience' },
  { value: 'responsibility', label: 'Job Responsibility' }
];

const verifierTypes = [
  { value: 'employer', label: 'Current/Former Employer', badge: 'gold' },
  { value: 'colleague', label: 'Colleague/Peer', badge: 'bronze' },
  { value: 'client', label: 'Client/Customer', badge: 'silver' }
];

export default function Verification() {
  const { toast } = useToast();
  const [isRequesting, setIsRequesting] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([
    {
      id: '1',
      verifierEmail: 'john.manager@techcorp.com',
      verifierName: 'John Manager',
      type: 'skill',
      category: 'React Development',
      description: 'Advanced React development skills including hooks, context, and performance optimization',
      status: 'verified',
      verifierType: 'employer',
      requestedAt: '2024-01-10',
      completedAt: '2024-01-15',
      badgeEarned: 'gold'
    },
    {
      id: '2',
      verifierEmail: 'sarah.peer@company.com',
      type: 'experience',
      category: 'Project Leadership',
      description: 'Led a team of 5 developers on the mobile app project',
      status: 'pending',
      verifierType: 'colleague',
      requestedAt: '2024-01-12'
    },
    {
      id: '3',
      verifierEmail: 'client@startup.com',
      type: 'responsibility',
      category: 'Full-Stack Development',
      description: 'Responsible for building the entire web application from scratch',
      status: 'declined',
      verifierType: 'client',
      requestedAt: '2024-01-08'
    }
  ]);

  const [newRequest, setNewRequest] = useState({
    verifierEmail: '',
    type: '',
    category: '',
    description: '',
    verifierType: ''
  });

  const handleSubmitRequest = async () => {
    if (!newRequest.verifierEmail || !newRequest.type || !newRequest.category || !newRequest.verifierType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsRequesting(true);

    // Simulate API call
    setTimeout(() => {
      const request: VerificationRequest = {
        id: Date.now().toString(),
        verifierEmail: newRequest.verifierEmail,
        type: newRequest.type as any,
        category: newRequest.category,
        description: newRequest.description,
        status: 'pending',
        verifierType: newRequest.verifierType as any,
        requestedAt: new Date().toISOString().split('T')[0]
      };
      
      setVerificationRequests(prev => [request, ...prev]);
      setNewRequest({
        verifierEmail: '',
        type: '',
        category: '',
        description: '',
        verifierType: ''
      });
      
      setIsRequesting(false);
      
      // Show OTP modal after successful request
      setShowOTPModal(true);
      
      toast({
        title: "Verification Request Sent!",
        description: `Verification request sent to ${newRequest.verifierEmail}. Please verify with OTP.`,
      });
    }, 1000);
  };

  const handleOTPVerify = async (otp: string): Promise<boolean> => {
    // Simulate OTP verification
    console.log('Verifying OTP:', otp);
    
    // For demo purposes, accept any 5-digit code
    if (otp.length === 5) {
      return true;
    }
    return false;
  };

  const handleOTPResend = async (): Promise<void> => {
    // Simulate resending OTP
    console.log('Resending OTP...');
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const getBadgeIcon = (badgeType?: string) => {
    switch (badgeType) {
      case 'gold':
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 'silver':
        return <Award className="w-4 h-4 text-gray-400" />;
      case 'bronze':
        return <Medal className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-orange-400" />;
    }
  };

  const getBadgeColor = (badgeType?: string) => {
    switch (badgeType) {
      case 'gold':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'silver':
        return 'bg-gray-400/20 text-gray-300 border-gray-400/30';
      case 'bronze':
        return 'bg-orange-600/20 text-orange-400 border-orange-600/30';
      default:
        return 'bg-orange-400/20 text-orange-300 border-orange-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-400" />;
      case 'declined':
        return <Star className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const verifiedCount = verificationRequests.filter(r => r.status === 'verified').length;
  const pendingCount = verificationRequests.filter(r => r.status === 'pending').length;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-950">
        <TalentSidebar />
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-slate-400 hover:text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Skill Verification</h1>
                  <p className="text-slate-400">Request verification from employers and colleagues</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-slate-300">
                  {verifiedCount} Verified
                </Badge>
                <Badge variant="secondary" className="text-slate-300">
                  {pendingCount} Pending
                </Badge>
                <Button 
                  onClick={() => setShowOTPModal(true)}
                  variant="outline"
                  size="sm"
                  className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                >
                  Test OTP
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Request New Verification */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-400" />
                  Request New Verification
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Ask employers, colleagues, or clients to verify your skills and experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="verifierEmail" className="text-slate-300">Verifier Email *</Label>
                    <Input
                      id="verifierEmail"
                      type="email"
                      value={newRequest.verifierEmail}
                      onChange={(e) => setNewRequest({...newRequest, verifierEmail: e.target.value})}
                      placeholder="verifier@company.com"
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="verifierType" className="text-slate-300">Verifier Type *</Label>
                    <Select value={newRequest.verifierType} onValueChange={(value) => setNewRequest({...newRequest, verifierType: value})}>
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="Select verifier type" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {verifierTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="text-white hover:bg-slate-700">
                            <div className="flex items-center gap-2">
                              {getBadgeIcon(type.badge)}
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="type" className="text-slate-300">Verification Type *</Label>
                    <Select value={newRequest.type} onValueChange={(value) => setNewRequest({...newRequest, type: value})}>
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="Select verification type" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {verificationType.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="text-white hover:bg-slate-700">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-slate-300">Skill/Category *</Label>
                    <Input
                      id="category"
                      value={newRequest.category}
                      onChange={(e) => setNewRequest({...newRequest, category: e.target.value})}
                      placeholder="e.g., React Development, Project Management"
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-slate-300">Description</Label>
                  <Textarea
                    id="description"
                    value={newRequest.description}
                    onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                    placeholder="Provide details about what you want verified..."
                    className="bg-slate-800 border-slate-600 text-white"
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleSubmitRequest} 
                  disabled={isRequesting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isRequesting ? 'Sending...' : 'Send Verification Request'}
                </Button>
              </CardContent>
            </Card>

            {/* Badge System Info */}
            <Card className="bg-gradient-to-r from-blue-600/20 to-emerald-600/20 border-blue-600/30">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Verification Badge System</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-yellow-500" />
                    <div>
                      <p className="text-white font-medium">Gold Badge</p>
                      <p className="text-sm text-slate-300">Verified by employers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="text-white font-medium">Silver Badge</p>
                      <p className="text-sm text-slate-300">Verified by clients</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Medal className="w-8 h-8 text-orange-600" />
                    <div>
                      <p className="text-white font-medium">Bronze Badge</p>
                      <p className="text-sm text-slate-300">Verified by colleagues</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification Requests */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Verification Requests</CardTitle>
                <CardDescription className="text-slate-400">
                  Track your verification requests and earned badges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {verificationRequests.map((request) => (
                    <div key={request.id} className="p-4 border border-slate-700 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-medium text-white">{request.category}</h3>
                            {getStatusIcon(request.status)}
                            <Badge variant="secondary" className={
                              request.status === 'verified' ? 'status-success' :
                              request.status === 'pending' ? 'status-warning' :
                              'status-error'
                            }>
                              {request.status}
                            </Badge>
                            {request.badgeEarned && (
                              <Badge variant="outline" className={getBadgeColor(request.badgeEarned)}>
                                {getBadgeIcon(request.badgeEarned)}
                                <span className="ml-1">{request.badgeEarned}</span>
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
                            <span>{verificationType.find(t => t.value === request.type)?.label}</span>
                            <span>•</span>
                            <span>{verifierTypes.find(t => t.value === request.verifierType)?.label}</span>
                            <span>•</span>
                            <span>Requested: {request.requestedAt}</span>
                            {request.completedAt && (
                              <>
                                <span>•</span>
                                <span>Completed: {request.completedAt}</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                            <Mail className="w-4 h-4" />
                            <span>{request.verifierEmail}</span>
                            {request.verifierName && (
                              <>
                                <span>•</span>
                                <span>{request.verifierName}</span>
                              </>
                            )}
                          </div>
                          {request.description && (
                            <p className="text-slate-300 text-sm">{request.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        {/* OTP Verification Modal */}
        <OTPVerification 
          isVisible={showOTPModal}
          onVerify={handleOTPVerify}
          onResend={handleOTPResend}
          onClose={() => setShowOTPModal(false)}
        />
      </div>
    </SidebarProvider>
  );
}
