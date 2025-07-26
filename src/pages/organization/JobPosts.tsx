
import {useEffect, useState} from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizationSidebar } from "@/components/OrganizationSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Filter, MapPin, DollarSign, Clock, Users, Eye, Edit, Trash2 } from "lucide-react";
import axiosInstance from "@/api/AxiosInstance.ts";
import axios from "axios";

const JobPosts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [jobPostsData, setJobPostsData] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    salaryRange: '',
    jobType: '',
    description: '',
    requiredSkills: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, jobType: value }));
  };

  const jobPosts = [
    {
      id: "1",
      title: "Senior React Developer",
      location: "Remote",
      salary: "$80,000 - $120,000",
      type: "Full-time",
      status: "active",
      applicants: 12,
      posted: "2 days ago",
      skills: ["React", "TypeScript", "Node.js", "GraphQL"]
    },
    {
      id: "2",
      title: "Data Scientist",
      location: "New York, NY",
      salary: "$90,000 - $130,000",
      type: "Full-time",
      status: "processing",
      applicants: 0,
      posted: "1 hour ago",
      skills: ["Python", "Machine Learning", "SQL", "TensorFlow"]
    },
    {
      id: "3",
      title: "UI/UX Designer",
      location: "San Francisco, CA",
      salary: "$70,000 - $100,000",
      type: "Contract",
      status: "active",
      applicants: 8,
      posted: "1 week ago",
      skills: ["Figma", "Design Systems", "Prototyping", "User Research"]
    }
  ];

  const fetchJobPosts = async () => {
    try {
      const response = await axiosInstance.get('/job-post/organization');

      console.log('Job posts fetched:', response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        return error.response?.data.message;
      } else {
        return "Something went wrong. Please try again later.";
      }
    }
  }

  useEffect(() => {
    fetchJobPosts();
  }, []);

  const handleCreateJob = async () => {
    try {
      setIsCreating(true);

      // Convert skills string to array
      const skillsArray = formData.requiredSkills
          .split(',')
          .map(skill => skill.trim())
          .filter(skill => skill.length > 0);

      const payload = {
        title: formData.title,
        location: formData.location,
        salaryRange: formData.salaryRange,
        jobType: formData.jobType.toUpperCase().replace('-', '_'),
        description: formData.description,
        requiredSkills: skillsArray,
      };

      const response = await axiosInstance.post(`/job-post`, payload);

      console.log('Job post created:', response.data);

      // Reset form
      setFormData({
        title: '',
        location: '',
        salaryRange: '',
        jobType: '',
        description: '',
        requiredSkills: '',
      });

    } catch (error) {
      console.error('Error creating job post:', error);
    } finally {
      setIsCreating(false);
    }
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
                  <h1 className="text-2xl font-bold text-white">Job Posts</h1>
                  <p className="text-slate-400">Manage your job postings and find talent</p>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Job Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Create New Job Post</DialogTitle>
                    <DialogDescription className="text-slate-400">
                      Fill in the details for your job posting
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-white">Job Title</Label>
                      <Input
                          id="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="e.g. Senior React Developer"
                          className="bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location" className="text-white">Location</Label>
                        <Input
                            id="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. Remote, New York"
                            className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="salaryRange" className="text-white">Salary Range</Label>
                        <Input
                            id="salaryRange"
                            value={formData.salaryRange}
                            onChange={handleChange}
                            placeholder="e.g. $80,000 - $120,000"
                            className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="jobType" className="text-white">Job Type</Label>
                      <Select value={formData.jobType} onValueChange={handleSelectChange}>
                        <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="freelance">Freelance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-white">Job Description</Label>
                      <Textarea
                          id="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Describe the role, responsibilities, and requirements..."
                          className="bg-slate-800 border-slate-600 text-white min-h-32"
                      />
                    </div>
                    <div>
                      <Label htmlFor="requiredSkills" className="text-white">Required Skills</Label>
                      <Input
                          id="requiredSkills"
                          value={formData.requiredSkills}
                          onChange={handleChange}
                          placeholder="e.g. React, TypeScript, Node.js (comma separated)"
                          className="bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                    <Button
                        onClick={handleCreateJob}
                        disabled={isCreating}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      {isCreating ? "Creating Job Post..." : "Create Job Post"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Search and Filters */}
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Search job posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-white">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="all">All Posts</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Job Posts Grid */}
            <div className="grid gap-6">
              {jobPosts.map((job) => (
                <Card key={job.id} className="bg-slate-900 border-slate-700 hover:border-slate-600 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-xl">{job.title}</CardTitle>
                        <CardDescription className="text-slate-400 mt-2">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {job.salary}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {job.posted}
                            </span>
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={job.status === 'active' ? 'default' : job.status === 'processing' ? 'secondary' : 'outline'}>
                          {job.status}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="border-orange-600/30 text-orange-400">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {job.applicants} applicants
                        </span>
                        <Badge variant="outline" className="border-emerald-600/30 text-emerald-400">
                          {job.type}
                        </Badge>
                      </div>
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

export default JobPosts;
