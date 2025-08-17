export type UserRole = 'TALENT' | 'ORGANIZATION' | 'ADMIN';
export type AuthSource = 'EMAIL' | 'GOOGLE' | 'FACEBOOK' | 'TWITTER'; // Extend as needed

export interface User {
  _id: string;
  email: string;
  emailVerified: boolean;
  profilePhoto: string | null;
  fullname: string;
  linkedin: string;
  github: string;
  firstName: string;
  professionalTitle: string;
  professionalSummary: string;
  lastName: string;
  username: string;
  bio: string;
  phone: string;
  role: UserRole;
  authSource: AuthSource;
  location: string;
  twitter: string;
  instagram: string;
  deactivated: boolean,
  companyName?: string;
  companySize?: string;
  description?: string;
  tagline?: string;
  industry?: string;
  offers?: string;
  image?: string;
  socials?: string;
  languages: string[];
  hobbies: string[];
  achievements: string[];
  references: string[];
  skills: string[];
  experience: unknown[];        // Replace `any` with a detailed interface if available
  education: unknown[];         // Replace `any` with a detailed interface if available
  certifications: unknown[];    // Replace `any` with a detailed interface if available
  projects: unknown[];          // Replace `any` with a detailed interface if available
  lastLoginAt: string | null;
  isNewUser: boolean;
  termsAndConditionsAccepted: boolean;
  isDeleted: boolean;
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  totalReferrals?: number;
  referralCode?: string;
}

// export interface TalentProfile extends User {
//   role: 'talent';
//   skills: string[];
//   experience: WorkExperience[];
//   education: Education[];
//   profileCompleteness: number;
//   verificationStatus: 'pending' | 'verified' | 'rejected';
//   cvGenerated: boolean;
// }

// export interface OrganizationProfile extends User {
//   role: 'organization';
//   companyName: string;
//   industry: string;
//   companySize: string;
//   subscriptionLevel: 'basic' | 'premium' | 'enterprise';
//   jobPosts: number;
//   talentContacted: number;
//   successRate: number;
// }

// export interface AdminProfile extends User {
//   role: 'admin';
//   permissions: string[];
//   canAddAdmins: boolean;
// }

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
