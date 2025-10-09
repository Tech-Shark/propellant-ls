import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizationSidebar } from "@/components/OrganizationSidebar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  MapPin,
  Star,
  MessageSquare,
  Award,
  Calendar,
  Building2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { JobListing } from "@/utils/global";
import axiosInstance from "@/api/AxiosInstance.ts";
import axios from "axios";

const TalentPool = () => {
  const [isFetchingJobPosts, setIsFetchingJobPosts] = useState(true);
  const [jobPosts, setJobPosts] = useState<JobListing[]>([]);
  const [selectedJobPosts, setSelectedJobPosts] = useState<string | null>(null);
  const [talents, setTalents] = useState([]);

  const fetchJobPosts = async () => {
    setIsFetchingJobPosts(true);

    try {
      const response = await axiosInstance.get("/job-post/organization");
      console.log("Job posts fetched:", response.data);
      setJobPosts(response.data.data.data as JobListing[]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        return error.response?.data.message;
      } else {
        return "Something went wrong. Please try again later.";
      }
    } finally {
      setIsFetchingJobPosts(false);
    }
  };

  const fetchMatchingJobPosts = async () => {
    setIsFetchingJobPosts(true);
    if (!selectedJobPosts) return;
    try {
      const response = await axiosInstance.get(
        `/job-post/${selectedJobPosts}/talents`
      );
      console.log("Fetched talents:", response.data);
      const fetchedTalents = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data.data?.data)
        ? response.data.data.data
        : [];
      setTalents(fetchedTalents);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        return error.response?.data.message;
      } else {
        return "Something went wrong. Please try again later.";
      }
    } finally {
      setIsFetchingJobPosts(false);
    }
  };

  useEffect(() => {
    fetchJobPosts();
  }, []);

  useEffect(() => {
    fetchMatchingJobPosts();
  }, [selectedJobPosts]);

  useEffect(() => {
    if (selectedJobPosts) console.log(selectedJobPosts);
  }, [selectedJobPosts]);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleMessageTalent = (talent: any) => {
    // Store the talent info for the conversation
    localStorage.setItem("selectedTalent", JSON.stringify(talent));
    toast({
      title: "Opening conversation",
      description: `Starting conversation with ${talent.name}`,
    });
    navigate("/organization/messages");
  };

  const handleViewProfile = (talent: any) => {
    toast({
      title: "Profile View",
      description: `Viewing ${talent.name}'s full profile`,
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-950">
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-slate-400 hover:text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Talent Pool</h1>
                  <p className="text-slate-400">
                    Discover verified professionals with blockchain credentials
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Job selection dropdown */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Select Job Post</CardTitle>
                <CardDescription className="text-slate-400">
                  Choose a job post to view matching talents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <Select
                    value={selectedJobPosts || ""}
                    onValueChange={(value) => setSelectedJobPosts(value)}
                  >
                    <SelectTrigger className="w-full bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Select a job post" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {jobPosts?.map((post) => (
                        <SelectItem key={post._id} value={post._id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{post.title}</span>
                            <span
                              className={`ml-2 px-2 py-0.5 rounded text-xs ${
                                post.isActive
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-700 text-slate-400"
                              }`}
                            >
                              {post.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedJobPosts && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="whitespace-nowrap"
                        onClick={() => setSelectedJobPosts(null)}
                      >
                        Clear Selection
                      </Button>
                      <Button
                        variant="default"
                        className="whitespace-nowrap"
                        onClick={fetchMatchingJobPosts}
                      >
                        View Talents
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Talent Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {talents.length === 0 && (
                <div className="text-slate-400 text-center col-span-3 py-12">
                  No matching talents found for this job post.
                </div>
              )}
              {talents.map((talent) => (
                <Card
                  key={talent._id}
                  className="bg-slate-900 border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-orange-600 text-white">
                          {talent.fullname
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-white text-lg">
                            {talent.fullname}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-slate-400">
                          {talent.bio || "No title provided"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {talent.location || "N/A"}
                      </span>
                      {talent.email && (
                        <span className="flex items-center gap-1">
                          <svg
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="w-4 h-4"
                          >
                            <rect x="2" y="4" width="12" height="8" rx="2" />
                            <path d="M2 4l6 4 6-4" />
                          </svg>
                          <span>{talent.email}</span>
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-300 font-medium">
                        Skills
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {talent.skills?.map((skill) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="border-orange-600/30 text-orange-400 text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {(!talent.skills || talent.skills.length === 0) && (
                          <Badge
                            variant="outline"
                            className="border-slate-600 text-slate-400 text-xs"
                          >
                            No skills listed
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      {talent.email && (
                        <Button
                          size="sm"
                          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                          onClick={() => {
                            const job = jobPosts.find(
                              (j) => j._id === selectedJobPosts
                            );
                            const subject = job?.title
                              ? `Job Opportunity at ${job.title}`
                              : "Job Opportunity";
                            const orgName =
                              job?.organization?.fullname || "Our Team";
                            const body = `Hello ${
                              talent.fullname
                            },\n\nWe found your profile on Propellant and would like to discuss a potential opportunity for the position: ${
                              job?.title || ""
                            }.\n\nYou can reply to this email for more details.\n\nRegards,\n${orgName}`;
                            const mailtoLink = `mailto:${
                              talent.email
                            }?subject=${encodeURIComponent(
                              subject
                            )}&body=${encodeURIComponent(body)}`;
                            window.location.href = mailtoLink;
                          }}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Email
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-800"
                        onClick={() => handleViewProfile(talent)}
                      >
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default TalentPool;
