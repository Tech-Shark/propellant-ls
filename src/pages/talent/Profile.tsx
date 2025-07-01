import {useEffect, useState} from 'react';
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Progress} from "@/components/ui/progress";
import {User, Mail, Phone, Save} from "lucide-react";
import {useAuth} from "@/context/AuthContext.tsx";
import {toast} from "sonner";
import axios from "axios";
import axiosInstance from "@/api/AxiosInstance.ts";

interface NFTBadge {
    id: string;
    name: string;
    description: string;
    image: string;
    issuer: string;
    earnedDate: string;
    verified: boolean;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export default function Profile() {
    const {user, fetchUser} = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        fullName: `${user?.firstName || ''} ${user?.lastName || ''}`,
        // professionalTitle: user?.professionalTitle,
        bio: user?.bio,
        email: user?.email,
        phone: user?.phone,
        skills: user?.skills,
    });

    useEffect(() => {
        console.log(user);
        setProfileData({
            fullName: `${user?.firstName || ''} ${user?.lastName || ''}`,
            // professionalTitle: user?.professionalTitle,
            bio: user?.bio,
            email: user?.email,
            phone: user?.phone,
            skills: user?.skills,
        });
    }, [user]);

    const [profileCompleteness, setProfileCompleteness] = useState(0);

    useEffect(() => {
        setProfileCompleteness(() => {
            const fields = ['fullName', 'bio', 'email', 'phone', 'skills'];

            let count = 0;

            fields.forEach((field) => {
                if (!profileData[field]) {
                    count++;
                }
            });

            return count / fields.length * 100;
        });
    }, [profileData, user]);

    const [nftBadges] = useState<NFTBadge[]>([
        {
            id: '1',
            name: 'React Master',
            description: 'Demonstrated exceptional React development skills',
            image: '/placeholder.svg',
            issuer: 'Meta',
            earnedDate: '2024-01-15',
            verified: true,
            rarity: 'epic'
        },
        {
            id: '2',
            name: 'TypeScript Expert',
            description: 'Advanced TypeScript programming capabilities',
            image: '/placeholder.svg',
            issuer: 'Microsoft',
            earnedDate: '2024-01-10',
            verified: true,
            rarity: 'rare'
        },
        {
            id: '3',
            name: 'AWS Solutions Architect',
            description: 'Certified AWS Solutions Architect Professional',
            image: '/placeholder.svg',
            issuer: 'Amazon Web Services',
            earnedDate: '2023-12-20',
            verified: true,
            rarity: 'legendary'
        },
        {
            id: '4',
            name: 'Team Leader',
            description: 'Exceptional leadership and team management skills',
            image: '/placeholder.svg',
            issuer: 'Propellant',
            earnedDate: '2024-01-05',
            verified: true,
            rarity: 'common'
        }
    ]);

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'legendary':
                return 'from-yellow-400 to-orange-500';
            case 'epic':
                return 'from-purple-400 to-pink-500';
            case 'rare':
                return 'from-blue-400 to-cyan-500';
            default:
                return 'from-gray-400 to-gray-500';
        }
    };

    const handleSave = async () => {
        console.log('Profile data:', profileData);
        setIsEditing(false);

        const fn = profileData?.fullName.trim().split(' ')[0];
        const ln = profileData?.fullName.trim().split(' ')[1];

        const updatedUser = {
            firstName: fn,
            lastName: ln,
            bio: profileData?.bio,
            phone: profileData?.phone,
        };

        const updateProfilePromise = axiosInstance.patch('users/profile', updatedUser);

        toast.promise(updateProfilePromise, {
                loading: 'Loading...',
                success: (response) => {
                    console.log(response?.data);
                    fetchUser();
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
            }
        );
    };

    return (
        <main className="flex-1 overflow-auto">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger className="text-slate-400 hover:text-white"/>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Profile</h1>
                            <p className="text-slate-400">Manage your professional profile and NFT badges</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/*<Button variant="outline" onClick={handleShare} className="border-slate-600 text-slate-300 hover:bg-slate-800">*/}
                        {/*  <Share className="w-4 h-4 mr-2" />*/}
                        {/*  Share Profile*/}
                        {/*</Button>*/}
                        {isEditing ? (
                            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                <Save className="w-4 h-4 mr-2"/>
                                Save Changes
                            </Button>
                        ) : (
                            <Button onClick={() => setIsEditing(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white">
                                <User className="w-4 h-4 mr-2"/>
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-8">
                {/* Profile Completeness */}
                <Card className="bg-gradient-to-r from-blue-600/20 to-emerald-600/20 border-blue-600/30">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Profile Completeness</h3>
                                <p className="text-slate-300">Complete your profile to attract more opportunities</p>
                            </div>
                            <div className="text-2xl font-bold text-blue-400">{profileCompleteness}%</div>
                        </div>
                        <Progress value={profileCompleteness} className="h-3"/>
                    </CardContent>
                </Card>

                {/* Basic Information */}
                <Card className="bg-slate-900 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">Basic Information</CardTitle>
                        <CardDescription className="text-slate-400">
                            Your core profile information
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <Avatar className="w-24 h-24">
                                    <AvatarImage src={null} alt={profileData.fullName}/>
                                    <AvatarFallback className="bg-slate-700 text-white text-lg">
                                        {profileData.fullName.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                {/*{isEditing && (*/}
                                {/*  <Button*/}
                                {/*    size="sm"*/}
                                {/*    variant="secondary"*/}
                                {/*    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"*/}
                                {/*  >*/}
                                {/*    <Camera className="w-4 h-4" />*/}
                                {/*  </Button>*/}
                                {/*)}*/}
                            </div>
                            <div className="flex-1">
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <div>
                                            <Label className="text-slate-300">Full Name</Label>
                                            <Input
                                                value={profileData.fullName}
                                                onChange={(e) => setProfileData({
                                                    ...profileData,
                                                    fullName: e.target.value
                                                })}
                                                className="bg-slate-800 border-slate-600 text-white"
                                            />
                                        </div>
                                        {/*<div>*/}
                                        {/*  <Label className="text-slate-300">Professional Title</Label>*/}
                                        {/*  <Input*/}
                                        {/*    value={profileData.title}*/}
                                        {/*    onChange={(e) => setProfileData({...profileData, title: e.target.value})}*/}
                                        {/*    className="bg-slate-800 border-slate-600 text-white"*/}
                                        {/*  />*/}
                                        {/*</div>*/}
                                    </div>
                                ) : (
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{profileData.fullName}</h2>
                                        {/*<p className="text-lg text-blue-400">{profileData.title}</p>*/}
                                        <div className="flex items-center gap-4 mt-2 text-slate-400">
                                            {/*<div className="flex items-center gap-1">*/}
                                            {/*  <MapPin className="w-4 h-4" />*/}
                                            {/*  <span>{profileData.location}</span>*/}
                                            {/*</div>*/}
                                            {/*<div className="flex items-center gap-1">*/}
                                            {/*  <Star className="w-4 h-4 text-yellow-400" />*/}
                                            {/*  <span>4.9 Rating</span>*/}
                                            {/*</div>*/}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label className="text-slate-300">Bio</Label>
                            {isEditing ? (
                                <Textarea
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                                    className="bg-slate-800 border-slate-600 text-white mt-2"
                                    rows={4}
                                />
                            ) : (
                                <p className="text-slate-300 mt-2">{profileData.bio}</p>
                            )}
                        </div>

                        {isEditing && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/*<div>*/}
                                {/*  <Label className="text-slate-300">Location</Label>*/}
                                {/*  <Input*/}
                                {/*    value={profileData.location}*/}
                                {/*    onChange={(e) => setProfileData({...profileData, location: e.target.value})}*/}
                                {/*    className="bg-slate-800 border-slate-600 text-white"*/}
                                {/*  />*/}
                                {/*</div>*/}
                                <div>
                                    <Label className="text-slate-300">Email</Label>
                                    <Input
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                        className="bg-slate-800 border-slate-600 text-white"
                                    />
                                </div>
                                <div>
                                    <Label className="text-slate-300">Phone</Label>
                                    <Input
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                        className="bg-slate-800 border-slate-600 text-white"
                                    />
                                </div>
                                {/*<div>*/}
                                {/*  <Label className="text-slate-300">Website</Label>*/}
                                {/*  <Input*/}
                                {/*    value={profileData.website}*/}
                                {/*    onChange={(e) => setProfileData({...profileData, website: e.target.value})}*/}
                                {/*    className="bg-slate-800 border-slate-600 text-white"*/}
                                {/*  />*/}
                                {/*</div>*/}
                            </div>
                        )}

                        {!isEditing && (
                            <div className="flex flex-wrap gap-4 text-slate-400">
                                <div className="flex items-center gap-1">
                                    <Mail className="w-4 h-4"/>
                                    <span>{profileData.email}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Phone className="w-4 h-4"/>
                                    <span>{profileData.phone}</span>
                                </div>
                                {/*<div className="flex items-center gap-1">*/}
                                {/*  <Globe className="w-4 h-4" />*/}
                                {/*  <span>{profileData.website}</span>*/}
                                {/*</div>*/}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* NFT Badges */}
                {/*<Card className="bg-slate-900 border-slate-700">*/}
                {/*  <CardHeader>*/}
                {/*    <CardTitle className="text-white flex items-center gap-2">*/}
                {/*      <Award className="w-5 h-5 text-yellow-400" />*/}
                {/*      NFT Skill Badges*/}
                {/*    </CardTitle>*/}
                {/*    <CardDescription className="text-slate-400">*/}
                {/*      Your verified achievements and certifications on the blockchain*/}
                {/*    </CardDescription>*/}
                {/*  </CardHeader>*/}
                {/*  <CardContent>*/}
                {/*    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">*/}
                {/*      {nftBadges.map((badge) => (*/}
                {/*        <div key={badge.id} className="group relative">*/}
                {/*          <div className={`p-4 rounded-lg border border-slate-700 bg-gradient-to-br ${getRarityColor(badge.rarity)} bg-opacity-10 hover:bg-opacity-20 transition-all duration-300 cursor-pointer`}>*/}
                {/*            <div className="flex flex-col items-center text-center space-y-3">*/}
                {/*              <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center">*/}
                {/*                <Award className="w-8 h-8 text-yellow-400" />*/}
                {/*              </div>*/}
                {/*              <div>*/}
                {/*                <h3 className="font-semibold text-white">{badge.name}</h3>*/}
                {/*                <p className="text-xs text-slate-400 mt-1">{badge.description}</p>*/}
                {/*              </div>*/}
                {/*              <div className="flex items-center gap-2">*/}
                {/*                <Badge variant="secondary" className={`text-xs bg-gradient-to-r ${getRarityColor(badge.rarity)} text-white`}>*/}
                {/*                  {badge.rarity}*/}
                {/*                </Badge>*/}
                {/*                {badge.verified && (*/}
                {/*                  <Badge variant="secondary" className="text-xs status-success">*/}
                {/*                    Verified*/}
                {/*                  </Badge>*/}
                {/*                )}*/}
                {/*              </div>*/}
                {/*              <div className="text-xs text-slate-500">*/}
                {/*                <p>Issued by {badge.issuer}</p>*/}
                {/*                <p>{badge.earnedDate}</p>*/}
                {/*              </div>*/}
                {/*            </div>*/}
                {/*          </div>*/}
                {/*        </div>*/}
                {/*      ))}*/}
                {/*    </div>*/}
                {/*    */}
                {/*    {nftBadges.length === 0 && (*/}
                {/*      <div className="text-center py-12">*/}
                {/*        <Award className="w-12 h-12 text-slate-600 mx-auto mb-4" />*/}
                {/*        <h3 className="text-lg font-medium text-slate-400 mb-2">No NFT Badges Yet</h3>*/}
                {/*        <p className="text-slate-500">Complete credential verifications to earn your first NFT badge</p>*/}
                {/*      </div>*/}
                {/*    )}*/}
                {/*  </CardContent>*/}
                {/*</Card>*/}

                {/* Skills */}
                <Card className="bg-slate-900 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">Skills</CardTitle>
                        <CardDescription className="text-slate-400">
                            Your technical and professional skills
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {profileData?.skills?.map((skill) => (
                                <Badge
                                    key={skill}
                                    variant="secondary"
                                    className="bg-blue-600/20 text-blue-400 border-blue-600/30"
                                >
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
