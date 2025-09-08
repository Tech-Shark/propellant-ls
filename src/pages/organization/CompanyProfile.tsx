import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizationSidebar } from "@/components/OrganizationSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building2, Users, Camera, Save, Plus, X, Edit } from "lucide-react";
import axiosInstance from "@/api/AxiosInstance.ts";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext.tsx";
import { safeParse } from "@/utils/helperfunctions.ts";

type SocialLink = { platform: string; url: string };

const CompanyProfile = () => {
    const { user, fetchUser } = useAuth();

    const [isEditing, setIsEditing] = useState(false);

    // Always produce an array, even if user?.socials is "", null, or invalid JSON
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
        safeParse<SocialLink[]>(user?.socials, [])
    );

    const [companyInfo, setCompanyInfo] = useState<{
        companyName: string;
        tagline: string;
        description: string;
        industry: string;
        companySize: string;
        offers: string[];
        image: File | string | null;
    }>({
        companyName: user?.companyName ?? "",
        tagline: user?.tagline ?? "",
        description: user?.description ?? "",
        industry: (user?.industry as string) ?? "Technology",
        companySize: user?.companySize ?? "201-500",
        offers: safeParse<string[]>(user?.offers, []),
        image: (user?.image as string | null) ?? null,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCompanyInfo((prev) => ({ ...prev, [name]: value }));
    };

    const addSocialLink = () => {
        setSocialLinks((prev) => [...prev, { platform: "", url: "" }]);
    };

    const removeSocialLink = (index: number) => {
        setSocialLinks((prev) => prev.filter((_, i) => i !== index));
    };

    const removeBenefit = (benefit: string) => {
        setCompanyInfo((prev) => ({
            ...prev,
            offers: (prev.offers ?? []).filter((b) => b !== benefit),
        }));
    };

    const addBenefit = () => {
        const newBenefit = prompt("Enter new benefit:");
        if (newBenefit?.trim()) {
            setCompanyInfo((prev) => ({
                ...prev,
                offers: [...(prev.offers ?? []), newBenefit.trim()],
            }));
        }
    };

    const handleSaveChanges = () => {
        setIsEditing(true);

        const formData = new FormData();

        // Only append image if it's a File; avoid clobbering with a string URL
        if (companyInfo.image instanceof File) {
            formData.append("image", companyInfo.image);
        }

        formData.append("companyName", companyInfo.companyName);
        formData.append("tagline", companyInfo.tagline);
        formData.append("description", companyInfo.description);
        formData.append("industry", companyInfo.industry);
        formData.append("companySize", companyInfo.companySize);
        formData.append("offers", JSON.stringify(companyInfo.offers ?? []));
        formData.append("socials", JSON.stringify(socialLinks ?? []));

        const savingProfilePromise = axiosInstance.patch("/users/profile", formData);

        toast.promise(savingProfilePromise, {
            loading: "Saving changes...",
            success: () => {
                setIsEditing(false);
                fetchUser();
                return "Profile updated successfully";
            },
            error: (error) => {
                console.log(error);
                setIsEditing(false);
                return "Error updating profile";
            },
        });
    };

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-slate-950">
                {/* If you actually want the sidebar visible, render it here */}
                {/* <OrganizationSidebar /> */}

                <main className="flex-1 overflow-auto">
                    {/* Header */}
                    <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
                        <div className="flex items-center justify-between p-6">
                            <div className="flex items-center gap-4">
                                <SidebarTrigger className="text-slate-400 hover:text-white" />
                                <div>
                                    <h1 className="text-2xl font-bold text-white">Company Profile</h1>
                                    <p className="text-slate-400">Manage your organization's public profile</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {isEditing && (
                                    <Button
                                        onClick={() => setIsEditing(false)}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel Changes
                                    </Button>
                                )}

                                <Button
                                    onClick={() => (isEditing ? handleSaveChanges() : setIsEditing(true))}
                                    className="bg-orange-600 hover:bg-orange-700 text-white"
                                >
                                    {isEditing ? (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    ) : (
                                        <>
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Profile
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Company Header */}
                        <Card className="bg-slate-900 border-slate-700">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-6">
                                    <div className="relative">
                                        <Avatar className="w-24 h-24">
                                            <AvatarFallback className="bg-orange-600 text-white text-2xl">
                                                AC
                                            </AvatarFallback>
                                        </Avatar>
                                        {isEditing && (
                                            <Button
                                                size="sm"
                                                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-slate-700 hover:bg-slate-600"
                                            >
                                                <Camera className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        {isEditing ? (
                                            <div className="space-y-3">
                                                <div>
                                                    <Label htmlFor="name" className="text-white">
                                                        Company Name
                                                    </Label>
                                                    <Input
                                                        onChange={handleInputChange}
                                                        id="name"
                                                        name="companyName"
                                                        defaultValue={companyInfo.companyName}
                                                        className="bg-slate-800 border-slate-600 text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="tagline" className="text-white">
                                                        Tagline
                                                    </Label>
                                                    <Input
                                                        onChange={handleInputChange}
                                                        id="tagline"
                                                        name="tagline"
                                                        defaultValue={companyInfo.tagline}
                                                        className="bg-slate-800 border-slate-600 text-white"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <h2 className="text-2xl font-bold text-white">
                                                    {companyInfo.companyName || "Your Company"}
                                                </h2>
                                                <p className="text-lg text-orange-400">{companyInfo.tagline || ""}</p>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                          {companyInfo.industry}
                      </span>
                                            <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                                                {companyInfo.companySize}
                      </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Company Details */}
                            <Card className="bg-slate-900 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white">Company Information</CardTitle>
                                    <CardDescription className="text-slate-400">
                                        Basic information about your organization
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {isEditing ? (
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="description" className="text-white">
                                                    Description
                                                </Label>
                                                <Textarea
                                                    id="description"
                                                    name="description"
                                                    onChange={handleInputChange}
                                                    placeholder="Write a brief description of your company"
                                                    defaultValue={companyInfo.description}
                                                    className="bg-slate-800 border-slate-600 text-white min-h-32"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <Label htmlFor="industry" className="text-white">
                                                        Industry
                                                    </Label>
                                                    <Select
                                                        onValueChange={(value) =>
                                                            setCompanyInfo((prev) => ({ ...prev, industry: value }))
                                                        }
                                                        defaultValue={(companyInfo.industry ?? "Technology").toLowerCase()}
                                                    >
                                                        <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-slate-800 border-slate-600">
                                                            <SelectItem value="technology">Technology</SelectItem>
                                                            <SelectItem value="finance">Finance</SelectItem>
                                                            <SelectItem value="healthcare">Healthcare</SelectItem>
                                                            <SelectItem value="education">Education</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label htmlFor="size" className="text-white">
                                                        Company Size
                                                    </Label>
                                                    <Select
                                                        onValueChange={(value) =>
                                                            setCompanyInfo((prev) => ({ ...prev, companySize: value }))
                                                        }
                                                        name="companySize"
                                                        defaultValue={companyInfo.companySize || "201-500"}
                                                    >
                                                        <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-slate-800 border-slate-600">
                                                            <SelectItem value="1-10">1-10 employees</SelectItem>
                                                            <SelectItem value="11-50">11-50 employees</SelectItem>
                                                            <SelectItem value="51-200">51-200 employees</SelectItem>
                                                            <SelectItem value="201-500">201-500 employees</SelectItem>
                                                            <SelectItem value="500+">500+ employees</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-slate-300 leading-relaxed">
                                                {companyInfo.description || "—"}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Benefits & Perks */}
                            <Card className="bg-slate-900 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white">Benefits & Perks</CardTitle>
                                    <CardDescription className="text-slate-400">
                                        What you offer to your employees
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {(companyInfo.offers ?? []).map((benefit) => (
                                            <Badge
                                                key={benefit}
                                                variant="outline"
                                                className="border-emerald-600/30 text-emerald-400"
                                            >
                                                {benefit}
                                                {isEditing && (
                                                    <X
                                                        onClick={() => removeBenefit(benefit)}
                                                        className="w-3 h-3 ml-1 cursor-pointer hover:text-red-400"
                                                    />
                                                )}
                                            </Badge>
                                        ))}
                                        {isEditing && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={addBenefit}
                                                className="border-slate-600 text-slate-300 hover:bg-slate-800"
                                            >
                                                <Plus className="w-4 h-4 mr-1" />
                                                Add Benefit
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Social Links */}
                        <Card className="bg-slate-900 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white">Social Media & Links</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Connect your social media presence
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {(socialLinks ?? []).map((link, index) => (
                                    <div key={index} className="flex gap-3">
                                        {isEditing ? (
                                            <>
                                                <Select
                                                    defaultValue={(link?.platform ?? "").toLowerCase()}
                                                    onValueChange={(value) => {
                                                        const updated = [...socialLinks];
                                                        updated[index] = { ...updated[index], platform: value };
                                                        setSocialLinks(updated);
                                                    }}
                                                >
                                                    <SelectTrigger className="w-32 bg-slate-800 border-slate-600 text-white">
                                                        <SelectValue placeholder="Platform" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-800 border-slate-600">
                                                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                                                        <SelectItem value="twitter">Twitter</SelectItem>
                                                        <SelectItem value="facebook">Facebook</SelectItem>
                                                        <SelectItem value="instagram">Instagram</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Input
                                                    defaultValue={link?.url ?? ""}
                                                    onChange={(e) => {
                                                        const updated = [...socialLinks];
                                                        updated[index] = { ...updated[index], url: e.target.value };
                                                        setSocialLinks(updated);
                                                    }}
                                                    name="url"
                                                    type="url"
                                                    placeholder="URL"
                                                    className="flex-1 bg-slate-800 border-slate-600 text-white"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeSocialLink(index)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <Badge
                                                    variant="outline"
                                                    className="border-orange-600/30 text-orange-400"
                                                >
                                                    {link?.platform || "—"}
                                                </Badge>
                                                <span className="text-slate-300">{link?.url || "—"}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {isEditing && (
                                    <Button
                                        variant="outline"
                                        onClick={addSocialLink}
                                        className="border-slate-600 text-slate-300 hover:bg-slate-800"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Social Link
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
};

export default CompanyProfile;