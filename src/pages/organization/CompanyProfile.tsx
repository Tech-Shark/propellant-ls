
import { useState } from 'react';
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
import { Building2, Globe, MapPin, Users, Calendar, Camera, Save, Plus, X } from "lucide-react";

const CompanyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [socialLinks, setSocialLinks] = useState([
    { platform: "LinkedIn", url: "https://linkedin.com/company/acme-corp" },
    { platform: "Twitter", url: "https://twitter.com/acmecorp" }
  ]);

  const companyInfo = {
    name: "Acme Corporation",
    tagline: "Building the future of technology",
    description: "We are a leading technology company focused on innovation and creating solutions that make a difference. Our team of experts works on cutting-edge projects that shape the future of various industries.",
    industry: "Technology",
    size: "201-500 employees",
    founded: "2015",
    location: "San Francisco, CA",
    website: "https://acme.com"
  };

  const benefits = [
    "Remote Work", "Health Insurance", "Flexible Hours", "401k Matching",
    "Professional Development", "Unlimited PTO", "Stock Options", "Gym Membership"
  ];

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
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
                  <h1 className="text-2xl font-bold text-white">Company Profile</h1>
                  <p className="text-slate-400">Manage your organization's public profile</p>
                </div>
              </div>
              
              <Button 
                onClick={() => setIsEditing(!isEditing)}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  "Edit Profile"
                )}
              </Button>
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
                      <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-slate-700 hover:bg-slate-600">
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="name" className="text-white">Company Name</Label>
                          <Input id="name" defaultValue={companyInfo.name} className="bg-slate-800 border-slate-600 text-white" />
                        </div>
                        <div>
                          <Label htmlFor="tagline" className="text-white">Tagline</Label>
                          <Input id="tagline" defaultValue={companyInfo.tagline} className="bg-slate-800 border-slate-600 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-2xl font-bold text-white">{companyInfo.name}</h2>
                        <p className="text-lg text-orange-400">{companyInfo.tagline}</p>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {companyInfo.industry}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {companyInfo.size}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Founded {companyInfo.founded}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {companyInfo.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        {companyInfo.website}
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
                        <Label htmlFor="description" className="text-white">Description</Label>
                        <Textarea 
                          id="description" 
                          defaultValue={companyInfo.description}
                          className="bg-slate-800 border-slate-600 text-white min-h-32"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="industry" className="text-white">Industry</Label>
                          <Select defaultValue={companyInfo.industry.toLowerCase()}>
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
                          <Label htmlFor="size" className="text-white">Company Size</Label>
                          <Select defaultValue="201-500">
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
                      <p className="text-slate-300 leading-relaxed">{companyInfo.description}</p>
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
                    {benefits.map((benefit) => (
                      <Badge key={benefit} variant="outline" className="border-emerald-600/30 text-emerald-400">
                        {benefit}
                        {isEditing && (
                          <X className="w-3 h-3 ml-1 cursor-pointer hover:text-red-400" />
                        )}
                      </Badge>
                    ))}
                    {isEditing && (
                      <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800">
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
                {socialLinks.map((link, index) => (
                  <div key={index} className="flex gap-3">
                    {isEditing ? (
                      <>
                        <Select defaultValue={link.platform.toLowerCase()}>
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
                          defaultValue={link.url} 
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
                        <Badge variant="outline" className="border-orange-600/30 text-orange-400">
                          {link.platform}
                        </Badge>
                        <span className="text-slate-300">{link.url}</span>
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
