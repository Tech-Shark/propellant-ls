
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
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Link2, CheckCircle, Clock, XCircle, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Credential {
  id: string;
  title: string;
  type: string;
  category: string;
  file?: File;
  link?: string;
  description: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: string;
  verifiedAt?: string;
}

const credentialTypes = [
  'Certificate',
  'Degree',
  'License',
  'Award',
  'Training',
  'Work Experience',
  'Project Portfolio',
  'Recommendation Letter'
];

const credentialCategories = [
  'Education',
  'Professional',
  'Technical Skills',
  'Language',
  'Industry Specific',
  'Leadership',
  'Project Management',
  'Other'
];

export default function Credentials() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [credentials, setCredentials] = useState<Credential[]>([
    {
      id: '1',
      title: 'React Developer Certificate',
      type: 'Certificate',
      category: 'Technical Skills',
      description: 'Advanced React development certification from Meta',
      status: 'verified',
      uploadedAt: '2024-01-15',
      verifiedAt: '2024-01-20'
    },
    {
      id: '2',
      title: 'Bachelor of Computer Science',
      type: 'Degree',
      category: 'Education',
      description: 'Bachelor\'s degree in Computer Science from MIT',
      status: 'pending',
      uploadedAt: '2024-01-10'
    },
    {
      id: '3',
      title: 'AWS Solutions Architect',
      type: 'License',
      category: 'Professional',
      description: 'AWS Certified Solutions Architect - Professional',
      status: 'rejected',
      uploadedAt: '2024-01-05'
    }
  ]);

  const [newCredential, setNewCredential] = useState({
    title: '',
    type: '',
    category: '',
    description: '',
    file: null as File | null,
    link: ''
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewCredential({ ...newCredential, file });
    }
  };

  const handleSubmit = async () => {
    if (!newCredential.title || !newCredential.type || !newCredential.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          const credential: Credential = {
            id: Date.now().toString(),
            ...newCredential,
            status: 'pending',
            uploadedAt: new Date().toISOString().split('T')[0]
          };
          
          setCredentials(prev => [credential, ...prev]);
          setNewCredential({
            title: '',
            type: '',
            category: '',
            description: '',
            file: null,
            link: ''
          });
          
          toast({
            title: "Upload Successful!",
            description: "Your credential has been uploaded and is pending verification.",
          });
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-400" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'status-success';
      case 'pending':
        return 'status-warning';
      case 'rejected':
        return 'status-error';
      default:
        return '';
    }
  };

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
                  <h1 className="text-2xl font-bold text-white">Credentials</h1>
                  <p className="text-slate-400">Upload and manage your professional credentials</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-slate-300">
                  {credentials.filter(c => c.status === 'verified').length} Verified
                </Badge>
                <Badge variant="secondary" className="text-slate-300">
                  {credentials.filter(c => c.status === 'pending').length} Pending
                </Badge>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Upload New Credential */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-400" />
                  Upload New Credential
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Add a new credential for verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-slate-300">Credential Title *</Label>
                    <Input
                      id="title"
                      value={newCredential.title}
                      onChange={(e) => setNewCredential({...newCredential, title: e.target.value})}
                      placeholder="e.g., React Developer Certificate"
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type" className="text-slate-300">Type *</Label>
                    <Select value={newCredential.type} onValueChange={(value) => setNewCredential({...newCredential, type: value})}>
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="Select credential type" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {credentialTypes.map((type) => (
                          <SelectItem key={type} value={type} className="text-white hover:bg-slate-700">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-slate-300">Category *</Label>
                    <Select value={newCredential.category} onValueChange={(value) => setNewCredential({...newCredential, category: value})}>
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {credentialCategories.map((category) => (
                          <SelectItem key={category} value={category} className="text-white hover:bg-slate-700">
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="link" className="text-slate-300">External Link (Optional)</Label>
                    <Input
                      id="link"
                      value={newCredential.link}
                      onChange={(e) => setNewCredential({...newCredential, link: e.target.value})}
                      placeholder="https://..."
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-slate-300">Description</Label>
                  <Textarea
                    id="description"
                    value={newCredential.description}
                    onChange={(e) => setNewCredential({...newCredential, description: e.target.value})}
                    placeholder="Describe your credential..."
                    className="bg-slate-800 border-slate-600 text-white"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="file" className="text-slate-300">Upload File</Label>
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
                      onClick={() => document.getElementById('file')?.click()}
                      className="border-slate-600 text-slate-300 hover:bg-slate-800"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      {newCredential.file ? newCredential.file.name : 'Choose File'}
                    </Button>
                    <p className="text-xs text-slate-500 mt-1">
                      Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                    </p>
                  </div>
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Uploading...</span>
                      <span className="text-slate-300">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                <Button 
                  onClick={handleSubmit} 
                  disabled={isUploading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Upload Credential'}
                </Button>
              </CardContent>
            </Card>

            {/* Credentials List */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Your Credentials</CardTitle>
                <CardDescription className="text-slate-400">
                  View and manage your uploaded credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {credentials.map((credential) => (
                    <div key={credential.id} className="p-4 border border-slate-700 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-medium text-white">{credential.title}</h3>
                            {getStatusIcon(credential.status)}
                            <Badge variant="secondary" className={getStatusColor(credential.status)}>
                              {credential.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
                            <span>{credential.type}</span>
                            <span>•</span>
                            <span>{credential.category}</span>
                            <span>•</span>
                            <span>Uploaded: {credential.uploadedAt}</span>
                            {credential.verifiedAt && (
                              <>
                                <span>•</span>
                                <span>Verified: {credential.verifiedAt}</span>
                              </>
                            )}
                          </div>
                          {credential.description && (
                            <p className="text-slate-300 text-sm">{credential.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {credential.link && (
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                              <Link2 className="w-4 h-4" />
                            </Button>
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
      </div>
    </SidebarProvider>
  );
}
