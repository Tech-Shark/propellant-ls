import {useEffect, useState} from 'react';
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Download, Wand2, Plus, Trash2, Save} from "lucide-react";
import {Certification, CV, Project, SkillLevel} from "@/utils/global";
import {WorkExperience, Education, Skill} from "@/utils/global";
import {Switch} from "@/components/ui/switch.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {skillLevels} from "@/utils/constant.ts";
import axiosInstance from "@/api/AxiosInstance.ts";
import {toast} from "sonner";
import axios, {isAxiosError} from "axios";

export default function CVBuilder() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [personalInfo, setPersonalInfo] = useState<CV>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        professionalTitle: '',
        professionalSummary: '',
        jobDescription: '',
    });
    const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
    const [educations, setEducations] = useState<Education[]>([]);
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [newSkill, setNewSkill] = useState<Skill>({
        name: '',
        level: 'BEGINNER'
    });
    const [newTechnology, setNewTechnology] = useState<string>('');

    const addWorkExperience = () => {
        const newExp: WorkExperience = {
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            description: '',
            location: '',
            title: '',
            isCurrentRole: false
        };
        setWorkExperiences([...workExperiences, newExp]);
    };

    const updateWorkExperience = (index: number, field: keyof WorkExperience, value: string | boolean) => {
        setWorkExperiences(prev => prev.map((exp, i) =>
            i === index ? {...exp, [field]: value} : exp
        ));
    };

    const removeWorkExperience = (index: number) => {
        setWorkExperiences(prev => prev.filter((_, i) => i !== index));
    };

    const addEducation = () => {
        const newEdu: Education = {
            institution: '',
            degree: '',
            fieldOfStudy: '',
            startDate: '',
            endDate: '',
            grade: '',
            description: ''
        };
        setEducations([...educations, newEdu]);
    };

    const updateEducation = (index: number, field: keyof Education, value: string) => {
        setEducations(prev => prev.map((edu, i) =>
            i === index ? {...edu, [field]: value} : edu
        ));
    };

    const removeEducation = (index: number) => {
        setEducations(prev => prev.filter((_, i) => i !== index));
    };

    const addCertification = () => {
        const newCert: Certification = {
            name: '',
            issuer: '',
            dateIssued: '',
            credentialId: '',
            credentialUrl: ''
        };
        setCertifications([...certifications, newCert]);
    };

    const updateCertification = (index: number, field: keyof Certification, value: string) => {
        setCertifications(prev => prev.map((cert, i) =>
            i === index ? {...cert, [field]: value} : cert
        ));
    };

    const removeCertification = (index: number) => {
        setCertifications(prev => prev.filter((_, i) => i !== index));
    };

    const addProject = () => {
        const newProj: Project = {
            name: '',
            description: '',
            technologies: [],
            project: '',
            link: ''
        };
        setProjects([...projects, newProj]);
    };

    const updateProject = (index: number, field: keyof Project, value: string) => {
        setProjects(prev => prev.map((proj, i) =>
            i === index ? {...proj, [field]: value} : proj
        ));
    };

    const removeProject = (index: number) => {
        setProjects(prev => prev.filter((_, i) => i !== index));
    };

    const addTechnology = () => {
        if (!newTechnology) return;
        setProjects(prev => prev.map(proj => ({
            ...proj,
            technologies: [...proj.technologies, newTechnology]
        })));
        setNewTechnology('');
    };

    const removeTechnology = (index: number, projIndex: number) => {
        setProjects(prev => prev.map((proj, i) =>
            i === projIndex ? {...proj, technologies: proj.technologies.filter((_, j) => j !== index)} : proj
        ));
    };

    const addSkill = () => {
        if (!newSkill.name || !newSkill.level) return;
        setSkills([...skills, newSkill]);
        setNewSkill({
            name: '',
            level: 'BEGINNER'
        });
    };

    const removeSkill = (index: number) => {
        setSkills(prev => prev.filter((_, i) => i !== index));
    };

    // Function to handle AI CV generation
    const handleAIGenerate = async () => {
        setIsGenerating(true);

        const data: CV = {
            ...personalInfo,
            workExperience: workExperiences,
            education: educations,
            certifications,
            projects,
            skills
        }

        const d = removeIdFromCv(data);

        const generatedCv = axiosInstance.post('/cv/optimize', d);

        toast.promise(generatedCv, {
                loading: 'Loading...',
                success: (response) => {
                    console.log(response?.data.data);
                    const cv = removeIdFromCv(response?.data.data) as CV;
                    setPersonalInfo({...cv});
                    setWorkExperiences(cv.workExperience);
                    setEducations(cv.education);
                    setCertifications(cv.certifications);
                    setProjects(cv.projects);
                    setSkills(cv.skills);

                    return response?.data.message;
                },
                error: (error) => {
                    if (axios.isAxiosError(error)) {
                        console.log(error);
                        return error.response?.data.message;
                    } else {
                        return "Something went wrong. Please try again later.";
                    }
                },
                finally: () => {
                    setIsGenerating(false);
                }
            }
        );

        await generatedCv;
        setIsGenerating(false);
    };

    // Function to handle CV saving
    const handleSave = async () => {
        setIsSaving(true);

        const data: CV = {
            ...personalInfo,
            workExperience: workExperiences,
            education: educations,
            certifications,
            projects,
            skills
        }

        const d = removeIdFromCv(data);

        localStorage.setItem('cv', JSON.stringify(d));

        const savedCvPromise = axiosInstance.post('/cv/save-draft', d);

        toast.promise(savedCvPromise, {
                loading: 'Loading...',
                success: (response) => {
                    const cv = removeIdFromCv(response?.data.data.data) as CV;
                    setPersonalInfo({...cv});
                    setWorkExperiences(cv.workExperience);
                    setEducations(cv.education);
                    setCertifications(cv.certifications);
                    setProjects(cv.projects);
                    setSkills(cv.skills);

                    return response?.data.message;
                },
                error: (error) => {
                    if (axios.isAxiosError(error)) {
                        console.log(error);
                        return error.response?.data.message;
                    } else {
                        return "Something went wrong. Please try again later.";
                    }
                },
                finally: () => {
                    setIsSaving(false);
                }
            }
        );

        await savedCvPromise;
        setIsSaving(false);
    };

    // Function to handle CV download
    const handleDownload = async () => {
        setIsDownloading(true);

        const data: CV = {
            ...personalInfo,
            workExperience: workExperiences,
            education: educations,
            certifications,
            projects,
            skills
        }

        const downloadCvPromise = axiosInstance.post('/cv/download/classic', data);

        toast.promise(downloadCvPromise, {
                loading: 'Loading...',
                success: (response) => {
                    console.log(response?.data);
                    const blob = new Blob([response.data], { type: 'application/pdf' });
                    const url = URL.createObjectURL(blob);
                    window.open(url);
                    return response?.data.message;
                },
                error: (error) => {
                    if (axios.isAxiosError(error)) {
                        console.log(error);
                        return error.response?.data.message;
                    } else {
                        return "Something went wrong. Please try again later.";
                    }
                },
                finally: () => {
                    setIsDownloading(false);
                }
            },
        );

        await downloadCvPromise;
        setIsDownloading(false);
    };

    const handleFetchDraft = async () => {
        try {
            const response = await axiosInstance.get('/cv/draft');

            const cv = removeIdFromCv(response?.data?.data) as CV;

            console.log(cv)

            setPersonalInfo({...cv});
            setWorkExperiences(cv.workExperience);
            setEducations(cv.education);
            setCertifications(cv.certifications);
            setProjects(cv.projects);
            setSkills(cv.skills);

        } catch (error) {
            if (isAxiosError(error)) {
                console.log(error);
            } else {
                console.error("An unexpected error occurred:", error);
            }
        }
    }

    useEffect(() => {
        handleFetchDraft();
    }, []);

    return (
        <main className="flex-1 overflow-auto">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger className="text-slate-400 hover:text-white"/>
                        <div>
                            <h1 className="text-2xl font-bold text-white">CV Builder</h1>
                            <p className="text-slate-400">Create and optimize your professional CV</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" disabled={isSaving} onClick={handleSave}
                                className="border-slate-600 text-slate-300 hover:bg-slate-800">
                            <Save className="w-4 h-4 mr-2"/>
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button onClick={handleAIGenerate} disabled={isGenerating}
                                className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Wand2 className="w-4 h-4 mr-2"/>
                            {isGenerating ? 'Generating...' : 'AI Optimize'}
                        </Button>
                        <Button onClick={handleDownload} disabled={isDownloading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            <Download className="w-4 h-4 mr-2"/>
                            {isDownloading ? 'Downloading...' : 'Download CV'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-8">
                {/* Personal Information */}
                <Card className="bg-slate-900 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">Personal Information</CardTitle>
                        <CardDescription className="text-slate-400">
                            Basic details about yourself
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="firstName" className="text-slate-300">First Name</Label>
                                <Input
                                    id="firstName"
                                    value={personalInfo.firstName}
                                    onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                                    className="bg-slate-800 border-slate-600 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="lastName" className="text-slate-300">Last Name</Label>
                                <Input
                                    id="lastName"
                                    value={personalInfo.lastName}
                                    onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                                    className="bg-slate-800 border-slate-600 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="email" className="text-slate-300">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={personalInfo.email}
                                    onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                                    className="bg-slate-800 border-slate-600 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone" className="text-slate-300">Phone</Label>
                                <Input
                                    id="phone"
                                    value={personalInfo.phone}
                                    onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                                    className="bg-slate-800 border-slate-600 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="address" className="text-slate-300">Address</Label>
                                <Input
                                    id="address"
                                    value={personalInfo.address}
                                    onChange={(e) => setPersonalInfo({...personalInfo, address: e.target.value})}
                                    className="bg-slate-800 border-slate-600 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="professionalTitle" className="text-slate-300">Professional Title</Label>
                                <Input
                                    id="professionalTitle"
                                    value={personalInfo.professionalTitle}
                                    onChange={(e) => setPersonalInfo({...personalInfo, professionalTitle: e.target.value})}
                                    className="bg-slate-800 border-slate-600 text-white"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="professionalSummary" className="text-slate-300">Professional Summary</Label>
                            <Textarea
                                id="professionalSummary"
                                value={personalInfo.professionalSummary}
                                onChange={(e) => setPersonalInfo({...personalInfo, professionalSummary: e.target.value})}
                                className="bg-slate-800 border-slate-600 text-white"
                                required
                                rows={4}
                            />
                        </div>
                        <div>
                            <Label htmlFor="jobDescription" className="text-slate-300">Job Description</Label>
                            <Textarea
                                id="jobDescription"
                                value={personalInfo.jobDescription}
                                onChange={(e) => setPersonalInfo({...personalInfo, jobDescription: e.target.value})}
                                className="bg-slate-800 border-slate-600 text-white"
                                required
                                rows={4}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Work Experience */}
                <Card className="bg-slate-900 border-slate-700">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-white">Work Experience</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Your professional experience
                                </CardDescription>
                            </div>
                            <Button onClick={addWorkExperience} variant="outline"
                                    className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white">
                                <Plus className="w-4 h-4 mr-2"/>
                                Add Experience
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {workExperiences.map((exp, index) => (
                            <div key={index} className="p-4 border border-slate-700 rounded-lg space-y-4">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-lg font-medium text-white">Experience Entry</h4>
                                    <Button
                                        onClick={() => removeWorkExperience(index)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <Trash2 className="w-4 h-4"/>
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-slate-300">Company</Label>
                                        <Input
                                            required
                                            value={exp.company}
                                            onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                                            className="bg-slate-800 border-slate-600 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-slate-300">Position</Label>
                                        <Input
                                            required
                                            value={exp.position}
                                            onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                                            className="bg-slate-800 border-slate-600 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-slate-300">Title</Label>
                                        <Input
                                            required
                                            value={exp.title}
                                            onChange={(e) => updateWorkExperience(index, 'title', e.target.value)}
                                            className="bg-slate-800 border-slate-600 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-slate-300">Location</Label>
                                        <Input
                                            required
                                            value={exp.location}
                                            onChange={(e) => updateWorkExperience(index, 'location', e.target.value)}
                                            className="bg-slate-800 border-slate-600 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-slate-300">Start Date</Label>
                                        <Input
                                            required
                                            type="date"
                                            value={exp.startDate}
                                            onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                                            className="bg-slate-800 border-slate-600 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-slate-300">End Date</Label>
                                        <Input
                                            required
                                            disabled={exp.isCurrentRole}
                                            type="date"
                                            value={exp.endDate}
                                            onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                                            className="bg-slate-800 border-slate-600 text-white"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div>
                                        <Label className="text-white">Current Role</Label>
                                    </div>
                                    <Switch
                                        checked={exp.isCurrentRole}
                                        onCheckedChange={(checked) => updateWorkExperience(index, 'isCurrentRole', checked)}
                                    />
                                </div>
                                <div>
                                    <Label className="text-slate-300">Description</Label>
                                    <Textarea
                                        value={exp.description}
                                        onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                                        className="bg-slate-800 border-slate-600 text-white"
                                        rows={3}
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                        {workExperiences.length === 0 && (
                            <div className="text-center py-8 text-slate-400">
                                No work experience added yet. Click "Add Experience" to get started.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Education */}
                <Card className="bg-slate-900 border-slate-700">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-white">Education</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Your educational background
                                </CardDescription>
                            </div>
                            <Button onClick={addEducation} variant="outline"
                                    className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white">
                                <Plus className="w-4 h-4 mr-2"/>
                                Add Education
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {educations.map((edu, index) => (
                            <div key={index} className="p-4 border border-slate-700 rounded-lg space-y-4">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-lg font-medium text-white">Education Entry</h4>
                                    <Button
                                        onClick={() => removeEducation(index)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <Trash2 className="w-4 h-4"/>
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-slate-300">Institution</Label>
                                        <Input
                                            value={edu.institution}
                                            onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                            className="bg-slate-800 border-slate-600 text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-slate-300">Degree</Label>
                                        <Input
                                            value={edu.degree}
                                            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                            className="bg-slate-800 border-slate-600 text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-slate-300">Field of Study</Label>
                                        <Input
                                            value={edu.fieldOfStudy}
                                            onChange={(e) => updateEducation(index, 'fieldOfStudy', e.target.value)}
                                            className="bg-slate-800 border-slate-600 text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-slate-300">Grade</Label>
                                        <Input
                                            type="text"
                                            value={edu.grade}
                                            onChange={(e) => updateEducation(index, 'grade', e.target.value)}
                                            className="bg-slate-800 border-slate-600 text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-slate-300">Start Date</Label>
                                        <Input
                                            type="date"
                                            value={edu.startDate}
                                            onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                                            className="bg-slate-800 border-slate-600 text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-slate-300">End Date</Label>
                                        <Input
                                            type="date"
                                            value={edu.endDate}
                                            onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                                            className="bg-slate-800 border-slate-600 text-white"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-slate-300">Description</Label>
                                    <Textarea
                                        value={edu.description}
                                        onChange={(e) => updateEducation(index, 'description', e.target.value)}
                                        className="bg-slate-800 border-slate-600 text-white"
                                        required
                                        rows={3}
                                    />
                                </div>
                            </div>
                        ))}
                        {educations.length === 0 && (
                            <div className="text-center py-8 text-slate-400">
                                No education added yet. Click "Add Education" to get started.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/*Certifications*/}
                <Card className="bg-slate-900 border-slate-700">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-white">Certification</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Your certifications
                                </CardDescription>
                            </div>
                            <Button onClick={addCertification} variant="outline"
                                    className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white">
                                <Plus className="w-4 h-4 mr-2"/>
                                Add Certification
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {certifications.map((cert, index) => (
                            <div key={index} className="p-4 border border-slate-700 rounded-lg space-y-4">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-lg font-medium text-white">Certification Entry</h4>
                                    <Button
                                        onClick={() => removeCertification(index)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <Trash2 className="w-4 h-4"/>
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-slate-300">Name</Label>
                                        <Input
                                            value={cert.name}
                                            onChange={(e) => updateCertification(index, 'name', e.target.value)}
                                            className="bg-slate-800 border-slate-600 text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-slate-300">Credential ID</Label>
                                        <Input
                                            value={cert.credentialId}
                                            onChange={(e) => updateCertification(index, 'credentialId', e.target.value)}
                                            className="bg-slate-800 border-slate-600 text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-slate-300">Issuer</Label>
                                        <Input
                                            value={cert.issuer}
                                            onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                                            className="bg-slate-800 border-slate-600 text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-slate-300">Date Issued</Label>
                                        <Input
                                            type="date"
                                            value={cert.dateIssued}
                                            onChange={(e) => updateCertification(index, 'dateIssued', e.target.value)}
                                            className="bg-slate-800 border-slate-600 text-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-slate-300">Credential URL</Label>
                                    <Input
                                        type="text"
                                        value={cert.credentialUrl}
                                        onChange={(e) => updateCertification(index, 'credentialUrl', e.target.value)}
                                        className="bg-slate-800 border-slate-600 text-white"
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                        {certifications.length === 0 && (
                            <div className="text-center py-8 text-slate-400">
                                No certifications added yet. Click "Add Certification" to get started.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/*Projects*/}
                <Card className="bg-slate-900 border-slate-700">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-white">Project</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Your projects
                                </CardDescription>
                            </div>
                            <Button onClick={addProject} variant="outline"
                                    className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white">
                                <Plus className="w-4 h-4 mr-2"/>
                                Add Project
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {projects.map((proj, index) => (
                            <div key={index} className="p-4 border border-slate-700 rounded-lg space-y-4">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-lg font-medium text-white">Project Entry</h4>
                                    <Button
                                        onClick={() => removeProject(index)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <Trash2 className="w-4 h-4"/>
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-slate-300">Name</Label>
                                        <Input
                                            value={proj.name}
                                            onChange={(e) => updateProject(index, 'name', e.target.value)}
                                            className="bg-slate-800 border-slate-600 text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-slate-300">Project Link</Label>
                                        <Input
                                            value={proj.project}
                                            onChange={(e) => {
                                                updateProject(index, 'project', e.target.value)
                                                updateProject(index, 'link', e.target.value)
                                            }}
                                            className="bg-slate-800 border-slate-600 text-white"
                                            placeholder="https://yourproject.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {/*<div>*/}
                                {/*    <Label className="text-slate-300">Link</Label>*/}
                                {/*    <Input*/}
                                {/*        value={proj.link}*/}
                                {/*        onChange={(e) => updateProject(index, 'link', e.target.value)}*/}
                                {/*        className="bg-slate-800 border-slate-600 text-white"*/}
                                {/*        required*/}
                                {/*    />*/}
                                {/*</div>*/}

                                <div className="flex items-end gap-2">
                                    <div className="flex-1">
                                        <Label htmlFor="firstName" className="text-slate-300">Technologies</Label>
                                        <Input
                                            value={newTechnology}
                                            onChange={(e) => setNewTechnology(e.target.value)}
                                            placeholder="Enter a technology"
                                            className="bg-slate-800 border-slate-600 text-white"
                                        />
                                    </div>

                                    <Button onClick={addTechnology} className="bg-blue-600 hover:bg-blue-700">
                                        <Plus className="w-4 h-4"/>
                                    </Button>
                                </div>

                                <div className="w-full flex flex-wrap gap-2">
                                    {proj.technologies.map((tech, i) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="bg-blue-600/20 text-blue-400 border-blue-600/30 cursor-pointer hover:bg-red-600/20 hover:text-red-400"
                                            onClick={() => removeTechnology(i, index)}
                                        >
                                            {tech} ×
                                        </Badge>
                                    ))}
                                </div>

                                <div>
                                    <Label className="text-slate-300">Project Description</Label>
                                    <Textarea
                                        value={proj.description}
                                        onChange={(e) => updateProject(index, 'description', e.target.value)}
                                        className="bg-slate-800 border-slate-600 text-white"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        ))}
                        {projects.length === 0 && (
                            <div className="text-center py-8 text-slate-400">
                                No projects added yet. Click "Add Project" to get started.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Skills */}
                <Card className="bg-slate-900 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">Skills</CardTitle>
                        <CardDescription className="text-slate-400">
                            Add your technical and soft skills
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-end gap-2">
                            <div className="flex-1">
                                <Label htmlFor="firstName" className="text-slate-300">Name</Label>
                                <Input
                                    value={newSkill?.name}
                                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                    placeholder="Enter a skill name"
                                    className="bg-slate-800 border-slate-600 text-white"
                                />
                            </div>

                            <div className="flex-1">
                                <Label htmlFor="category" className="text-slate-300">Level</Label>
                                <Select value={newSkill?.level} onValueChange={(value: SkillLevel) => setNewSkill({ ...newSkill, level: value })}>
                                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                                        <SelectValue placeholder="Select category"/>
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-600">
                                        {skillLevels.map((skillLevel) => (
                                            <SelectItem key={skillLevel.id} value={skillLevel.value}
                                                        className="text-white hover:bg-slate-700">
                                                {skillLevel.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button onClick={addSkill} className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="w-4 h-4"/>
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-blue-600/20 text-blue-400 border-blue-600/30 cursor-pointer hover:bg-red-600/20 hover:text-red-400"
                                    onClick={() => removeSkill(index)}
                                >
                                    {skill.name} ×
                                </Badge>
                            ))}
                        </div>

                        {skills.length === 0 && (
                            <div className="text-center py-4 text-slate-400">
                                No skills added yet. Add your skills above.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

const removeIdFromCv = (data: CV): CV => {
    return (

        // workExperiences: data.workExperience.forEach((exp, index) => {
        //     return {
        //         company: exp.company,
        //         position: exp.position,
        //         startDate: exp.startDate,
        //         endDate: exp.endDate,
        //         description: exp.description,
        //         location: exp.location,
        //         title: exp.title,
        //         isCurrentRole: exp.isCurrentRole
        //     }
        // }),
        // educations: data.education.forEach((edu, index) => {
        //     return {
        //         institution: edu.institution,
        //         degree: edu.degree,
        //         fieldOfStudy: edu.fieldOfStudy,
        //         startDate: edu.startDate,
        //         endDate: edu.endDate,
        //         grade: edu.grade,
        //         description: edu.description
        //     }
        // }),
        // certifications: data.certifications.forEach((cert, index) => {
        //     return {
        //         name: cert.name,
        //         issuer: cert.issuer,
        //         dateIssued: cert.dateIssued,
        //         credentialId: cert.credentialId,
        //         credentialUrl: cert.credentialUrl
        //     }
        // }),
        // projects: data.projects.forEach((proj, index) => {
        //     return {
        //         name: proj.name,
        //         description: proj.description,
        //         technologies: proj.technologies,
        //         project: proj.project,
        //         link: proj.link
        //     }
        // }),
        // skills: data.skills.map(skill => ({
        //     name: skill.name,
        //     level: skill.level as SkillLevel
        // }))
        {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            address: data.address,
            professionalTitle: data.professionalTitle,
            professionalSummary: data.professionalSummary,
            workExperience: data.workExperience.map(exp => ({
                company: exp.company,
                position: exp.position,
                startDate: exp.startDate,
                endDate: exp.endDate,
                description: exp.description,
                location: exp.location,
                title: exp.title,
                isCurrentRole: exp.isCurrentRole
            })),
            education: data.education.map(edu => ({
                institution: edu.institution,
                degree: edu.degree,
                fieldOfStudy: edu.fieldOfStudy,
                startDate: edu.startDate,
                endDate: edu.endDate,
                grade: edu.grade,
                description: edu.description
            })),
            certifications: data.certifications.map(cert => ({
                name: cert.name,
                issuer: cert.issuer,
                dateIssued: cert.dateIssued,
                credentialId: cert.credentialId,
                credentialUrl: cert.credentialUrl
            })),
            projects: data.projects.map(proj => ({
                name: proj.name,
                description: proj.description,
                technologies: proj.technologies,
                project: proj.project,
                link: proj.link
            })),
            skills: data.skills.map(skill => ({
                name: skill.name,
                level: skill.level as SkillLevel
            }))
        }
    )
}
