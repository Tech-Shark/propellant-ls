
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizationSidebar } from "@/components/OrganizationSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, MapPin, Star, MessageSquare, Award, Calendar, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TalentPool = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const talents = [
    {
      id: "1",
      name: "Sarah Chen",
      title: "Senior React Developer",
      location: "San Francisco, CA",
      experience: "5+ years",
      rating: 4.9,
      skills: ["React", "TypeScript", "Node.js", "GraphQL"],
      badges: ["Blockchain Verified", "React Expert", "AWS Certified"],
      lastActive: "2 hours ago",
      verified: true
    },
    {
      id: "2",
      name: "Michael Rodriguez",
      title: "Data Scientist",
      location: "New York, NY",
      experience: "7+ years",
      rating: 4.8,
      skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
      badges: ["ML Expert", "Data Analytics", "Google Cloud"],
      lastActive: "1 day ago",
      verified: true
    },
    {
      id: "3",
      name: "Emily Johnson",
      title: "UI/UX Designer",
      location: "Remote",
      experience: "4+ years",
      rating: 4.7,
      skills: ["Figma", "Design Systems", "Prototyping", "User Research"],
      badges: ["Design Expert", "UX Research", "Adobe Certified"],
      lastActive: "3 hours ago",
      verified: true
    }
  ];

  const handleMessageTalent = (talent: any) => {
    // Store the talent info for the conversation
    localStorage.setItem('selectedTalent', JSON.stringify(talent));
    toast({
      title: "Opening conversation",
      description: `Starting conversation with ${talent.name}`,
    });
    navigate('/organization/messages');
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
                  <p className="text-slate-400">Discover verified professionals with blockchain credentials</p>
                </div>
              </div>
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
                      placeholder="Search by skills, name, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-white">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Experience Level" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="junior">Junior (1-3 years)</SelectItem>
                      <SelectItem value="mid">Mid (3-5 years)</SelectItem>
                      <SelectItem value="senior">Senior (5+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="eu">Europe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Talent Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {talents.map((talent) => (
                <Card key={talent.id} className="bg-slate-900 border-slate-700 hover:border-slate-600 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-orange-600 text-white">
                          {talent.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-white text-lg">{talent.name}</CardTitle>
                          {talent.verified && (
                            <Award className="w-4 h-4 text-emerald-400" />
                          )}
                        </div>
                        <CardDescription className="text-slate-400">{talent.title}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {talent.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        {talent.rating}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {talent.experience}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {talent.lastActive}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-slate-300 font-medium">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {talent.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="outline" className="border-orange-600/30 text-orange-400 text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {talent.skills.length > 3 && (
                          <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                            +{talent.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-slate-300 font-medium">NFT Badges</p>
                      <div className="flex flex-wrap gap-1">
                        {talent.badges.slice(0, 2).map((badge) => (
                          <Badge key={badge} className="bg-emerald-600/20 text-emerald-400 text-xs">
                            {badge}
                          </Badge>
                        ))}
                        {talent.badges.length > 2 && (
                          <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                            +{talent.badges.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                        onClick={() => handleMessageTalent(talent)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
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
