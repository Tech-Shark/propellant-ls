import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  FileText,
  Link2,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
} from "lucide-react";
import { Credential, CredentialsData } from "@/utils/global";
import { credentialTypes, credentialCategories } from "@/utils/constant";
import { toast } from "sonner";
import axiosInstance from "@/api/AxiosInstance.ts";
import axios from "axios";
import { CubeSpinner } from "react-spinners-kit";

export default function Credentials() {
  const [isUploading, setIsUploading] = useState(false);
  const [credentials, setCredentials] = useState<CredentialsData[]>();
  // [
  //     {
  //         user: {
  //             _id: "685baadbaf4ad967b6f88299",
  //             email: "test1@gmail.com",
  //             username: "lordibe"
  //         },
  //         title: 'React Developer Certificate',
  //         type: 'Certificate',
  //         category: 'Technical Skills',
  //         description: 'Advanced React development certification from Meta',
  //         verificationStatus: 'VERIFIED',
  //         createdAt: '2024-01-15',
  //         verifiedAt: '2024-01-20'
  //     },
  //     {
  //         user: {
  //             _id: "685baadyeu4ad967b6f88299",
  //             email: "test2@gmail.com",
  //             username: "sleek"
  //         },
  //         title: 'Bachelor of Computer Science',
  //         type: 'Degree',
  //         category: 'Education',
  //         description: 'Bachelor\'s degree in Computer Science from MIT',
  //         verificationStatus: 'PENDING',
  //         createdAt: '2024-01-10',
  //         verifiedAt: null
  //     },
  //     {
  //         user: {
  //             _id: "685baadbafakdjs893jd8299",
  //             email: "test3@gmail.com",
  //             username: "nwankwo"
  //         },
  //         title: 'AWS Solutions Architect',
  //         type: 'License',
  //         category: 'Professional',
  //         description: 'AWS Certified Solutions Architect - Professional',
  //         verificationStatus: 'REJECTED',
  //         createdAt: '2024-01-05',
  //         verifiedAt: null
  //     }
  // ]

  useEffect(() => {
    const getCredentials = async () => {
      axiosInstance
        .get("/credentials")
        .then((response) => {
          console.log(response?.data.data.data);
          setCredentials(response?.data.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getCredentials();
  }, []);

  const [newCredential, setNewCredential] = useState<Credential>({
    title: "",
    type: "",
    category: "",
    url: "",
    description: "",
    visibility: true,
    file: null as File | null,
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewCredential({ ...newCredential, file });
    }
  };

  const handleSubmit = async () => {
    if (
      !newCredential.title ||
      !newCredential.type ||
      !newCredential.category
    ) {
      toast.warning("Missing Information, Please fill in all required fields.");
      return;
    }

    setIsUploading(true);

        toast.promise(axiosInstance.post("/credentials/upload", newCredential, {headers: {'Content-Type': 'multipart/form-data'}}), {
            loading: 'Uploading...',
            success: (response) => {
                console.log(response?.data.data);
                setCredentials([...credentials, response?.data.data]);
                setNewCredential({
                    title: '',
                    type: '',
                    category: '',
                    url: '',
                    description: '',
                    visibility: true,
                    file: null as File | null
                });
                return response?.data.message;
            },
            error: (error) => {
                if (axios.isAxiosError(error)) {
                    console.log(error)
                    return error.response?.data.message;
                } else {
                    return "Something went wrong. Please try again later.";
                }
            },
            finally: () => {
                setIsUploading(false);
            }
        });
    };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "PENDING":
        return <Clock className="w-4 h-4 text-orange-400" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4 text-red-400" />;
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
        return "";
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
              <h1 className="text-2xl font-bold text-white">Credentials</h1>
              <p className="text-slate-400">
                Upload and manage your professional credentials
              </p>
            </div>
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
                <Label htmlFor="title" className="text-slate-300">
                  Credential Title *
                </Label>
                <Input
                  id="title"
                  value={newCredential.title}
                  onChange={(e) =>
                    setNewCredential({
                      ...newCredential,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g., React Developer Certificate"
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="type" className="text-slate-300">
                  Type *
                </Label>
                <Select
                  value={newCredential.type}
                  onValueChange={(value) =>
                    setNewCredential({ ...newCredential, type: value })
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Select credential type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {credentialTypes.map((type) => (
                      <SelectItem
                        key={type.id}
                        value={type.value}
                        className="text-white hover:bg-slate-700"
                      >
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category" className="text-slate-300">
                  Category *
                </Label>
                <Select
                  value={newCredential.category}
                  onValueChange={(value) =>
                    setNewCredential({
                      ...newCredential,
                      category: value,
                    })
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {credentialCategories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.value}
                        className="text-white hover:bg-slate-700"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="link" className="text-slate-300">
                  External Link (Optional)
                </Label>
                <Input
                  id="link"
                  value={newCredential.url}
                  onChange={(e) =>
                    setNewCredential({ ...newCredential, url: e.target.value })
                  }
                  placeholder="https://..."
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-slate-300">
                Description
              </Label>
              <Textarea
                id="description"
                value={newCredential.description}
                onChange={(e) =>
                  setNewCredential({
                    ...newCredential,
                    description: e.target.value,
                  })
                }
                placeholder="Describe your credential..."
                className="bg-slate-800 border-slate-600 text-white"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="file" className="text-slate-300">
                  Upload File
                </Label>
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
                    onClick={() => document.getElementById("file")?.click()}
                    className="border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {newCredential.file
                      ? newCredential.file.name
                      : "Choose File"}
                  </Button>
                  <p className="text-xs text-slate-500 mt-1">
                    Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                  </p>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <Label htmlFor="visibility" className="text-slate-300">
                  Credential Visibility
                </Label>

                <Button
                  onClick={() => {
                    setNewCredential({
                      ...newCredential,
                      visibility: !newCredential.visibility,
                    });
                  }}
                  variant="ghost"
                  size="sm"
                  className={`${
                    newCredential.visibility
                      ? "bg-green-600 text-white"
                      : "bg-slate-800 text-slate-400"
                  } border-slate-600  hover:text-white`}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isUploading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload Credential"}
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
              {credentials ? (
                credentials.map((credential) => (
                  <div
                    key={credential.user._id}
                    className="p-4 border border-slate-700 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-medium text-white">
                            {credential.title}
                          </h3>
                          {getStatusIcon(credential.verificationStatus)}
                          <Badge
                            variant="secondary"
                            className={getStatusColor(
                              credential.verificationStatus
                            )}
                          >
                            {credential.verificationStatus}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
                          <span>{credential.type}</span>
                          <span>•</span>
                          <span>{credential.category}</span>
                          <span>•</span>
                          <span>Uploaded: {credential.createdAt}</span>
                          {credential.verifiedAt && (
                            <>
                              <span>•</span>
                              <span>Verified: {credential.verifiedAt}</span>
                            </>
                          )}
                        </div>
                        {credential.description && (
                          <p className="text-slate-300 text-sm">
                            {credential.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`${
                            newCredential.visibility
                              ? "bg-green-600 text-white"
                              : "bg-slate-800 text-slate-400"
                          } border-slate-600  hover:text-white`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {credential.url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-white"
                          >
                            <Link2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full flex items-center justify-center p-10">
                  <CubeSpinner />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
