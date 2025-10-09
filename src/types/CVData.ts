/**
 * Unified CV Data Model
 * This combines types from global.d.ts and UnifiedCVData to create a single source of truth
 */

// Basic types
export enum SkillLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  EXPERT = "EXPERT"
}

// Single comprehensive interface
export interface UnifiedCVData {
  // Personal Information
  personalInfo: {
    name: string;
    firstName?: string;
    lastName?: string;
    title?: string;
    email?: string;
    phone?: string;
    address?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    photo?: string;
  };
  
  // Professional Summary
  summary: string;
  professionalSummary?: string;
  
  // Experience
  experience: Array<{
    position: string;
    title?: string;
    company: string;
    location?: string;
    startDate: string;
    endDate: string;
    isCurrentRole?: boolean;
    description: string | string[];
  }>;
  
  // Education
  education: Array<{
    degree: string;
    institution: string;
    fieldOfStudy?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    year?: string;
    grade?: string;
    gpa?: string;
    description?: string;
  }>;
  
  // Skills categorized
  skills: {
    technical: string[];
    languages: string[];
    other: string[];
    // Optional array for backward compatibility with ModernCVTemplate
    list?: Array<{
      name: string;
      level: SkillLevel | string;
    }>;
  };
  
  // Certifications
  certifications: Array<{
    name: string;
    issuer: string;
    dateIssued: string;
    credentialId?: string;
    credentialUrl?: string;
  }>;
  
  // Projects
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
    project?: string;
    repositoryUrl?: string;
    liveUrl?: string;
  }>;
  
  // Additional sections
  achievements: string[];
  languages: string[];
  hobbies: string[];
  
  // For any additional fields or future expansion
  [key: string]: any;
}

// Interface for template components
export interface CVTemplateProps {
  data: UnifiedCVData;
}

// CV Template definition
export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  component?: React.ComponentType<CVTemplateProps>;
  previewImageUrl?: string;
}

/**
 * Creates an empty CV data object
 */
export function createEmptyCVData(): UnifiedCVData {
  return {
    personalInfo: {
      name: '',
      firstName: '',
      lastName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      address: '',
      website: '',
      linkedin: '',
      github: '',
      portfolio: '',
      photo: ''
    },
    summary: '',
    professionalSummary: '',
    experience: [],
    education: [],
    skills: {
      technical: [],
      languages: [],
      other: [],
      list: []
    },
    certifications: [],
    projects: [],
    achievements: [],
    languages: [],
    hobbies: []
  };
}
