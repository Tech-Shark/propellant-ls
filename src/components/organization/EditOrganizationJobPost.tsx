"use client";

import React, {useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Edit} from "lucide-react";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {JobListing} from "@/utils/global";
import axiosInstance from "@/api/AxiosInstance.ts";
import {toast} from "sonner";

interface EditJobPostType {
    jobPost: JobListing;
    fetchJobPosts: () => Promise<void>;
}

const EditOrganizationJobPost = ({jobPost, fetchJobPosts}: EditJobPostType) => {
    const [formData, setFormData] = useState({
        ...jobPost,
        requiredSkills: jobPost.requiredSkills.join(",")
    });

    const [isEditing, setIsEditing] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    }

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, jobType: value }));
    };

    const handleEditJob = async () => {
        setIsEditing(true);

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

        const editJobPostPromise = axiosInstance.patch(`/job-post/${formData._id}/update`, payload);

        toast.promise(editJobPostPromise, {
            success: (response) => {
                fetchJobPosts();
                console.log(response);
                return "Job post updated successfully";
            },
            error: (error) => {
                console.log(error);
                return "Error updating job post";
            },
            finally: () => {
                setIsEditing(false);
            }
        })
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <Edit className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
                <DialogHeader>
                    <DialogTitle className="text-white">Edit Job Post</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Edit the details for your job posting
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-white">Job Title</Label>
                        <Input
                            id="title"
                            value={formData?.title}
                            onChange={handleChange}
                            placeholder="e.g. Senior React Developer"
                            className="bg-slate-800 border-slate-600 text-white"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-white">Location</Label>
                            <Input
                                id="location"
                                value={formData?.location}
                                onChange={handleChange}
                                placeholder="e.g. Remote, New York"
                                className="bg-slate-800 border-slate-600 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="salaryRange" className="text-white">Salary Range</Label>
                            <Input
                                id="salaryRange"
                                value={formData?.salaryRange}
                                onChange={handleChange}
                                placeholder="e.g. $80,000 - $120,000"
                                className="bg-slate-800 border-slate-600 text-white"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="jobType" className="text-white">Job Type</Label>
                        <Select value={formData?.jobType} onValueChange={handleSelectChange}>
                            <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                                <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                                <SelectItem value="FULL_TIME">Full-time</SelectItem>
                                <SelectItem value="PART_TIME">Part-time</SelectItem>
                                <SelectItem value="CONTRACT">Contract</SelectItem>
                                <SelectItem value="FREELANCE">Freelance</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-white">Job Description</Label>
                        <Textarea
                            id="description"
                            value={formData?.description}
                            onChange={handleChange}
                            placeholder="Describe the role, responsibilities, and requirements..."
                            className="bg-slate-800 border-slate-600 text-white min-h-32"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="requiredSkills" className="text-white">Required Skills</Label>
                        <Input
                            id="requiredSkills"
                            value={formData?.requiredSkills}
                            onChange={handleChange}
                            placeholder="e.g. React, TypeScript, Node.js (comma separated)"
                            className="bg-slate-800 border-slate-600 text-white"
                        />
                    </div>
                    <Button
                        onClick={handleEditJob}
                        disabled={isEditing}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    >
                        {isEditing ? "Editing Job Post..." : "Edit Job Post"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditOrganizationJobPost;
