
export type UserRole = 'talent' | 'organization' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface TalentProfile extends User {
  role: 'talent';
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  profileCompleteness: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  cvGenerated: boolean;
}

export interface OrganizationProfile extends User {
  role: 'organization';
  companyName: string;
  industry: string;
  companySize: string;
  subscriptionLevel: 'basic' | 'premium' | 'enterprise';
  jobPosts: number;
  talentContacted: number;
  successRate: number;
}

export interface AdminProfile extends User {
  role: 'admin';
  permissions: string[];
  canAddAdmins: boolean;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  verified: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  verified: boolean;
}

export interface JobPost {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  experienceLevel: string;
  location: string;
  salary?: string;
  createdAt: string;
  status: 'active' | 'processing' | 'closed';
  matchedTalents?: string[];
}
