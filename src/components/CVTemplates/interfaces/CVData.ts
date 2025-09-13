/**
 * Interface definitions for CV data structures
 * This interface extends the global CV interface with additional structured fields
 * to support the React components while maintaining compatibility with the global CV type
 */
import { CV as GlobalCV, Skill, WorkExperience, Education, Certification, Project } from "../../../utils/global.d";

/**
 * Unified CV data format used by all CV templates
 * This is a structured version of the global CV interface to make rendering easier
 */
export interface UnifiedCVData {
  // Core personal information fields structured for easier rendering
  personalInfo: {
    name: string;
    firstName?: string;
    lastName?: string;
    title?: string;
    email?: string;
    phone?: string;
    location?: string;
    address?: string;
    website?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    photo?: string;
  };
  
  // Professional summary - maps to professionalSummary in global CV
  summary: string;
  
  // Structured work experience - maps to workExperience in global CV
  experience: Array<{
    position: string;
    company: string;
    location?: string;
    startDate: string;
    endDate: string;
    description: string | string[];
    isCurrentRole?: boolean;
    title?: string;
  }>;
  
  // Structured education - maps to education in global CV
  education: Array<{
    degree: string;
    institution: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    year?: string;
    description?: string;
    grade?: string;
    gpa?: string;
    fieldOfStudy?: string;
  }>;
  
  // Categorized skills - maps to skills in global CV
  skills: {
    technical: string[];
    languages: string[];
    other: string[];
  };
  
  // Certifications - maps to certifications in global CV
  certifications: Array<{
    name: string;
    issuer: string;
    dateIssued: string;
    credentialId?: string;
    credentialUrl?: string;
  }>;
  
  // Projects - maps to projects in global CV
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
    project?: string;
  }>;
  
  // Additional fields
  achievements: string[];
  languages: string[];
  hobbies: string[];
}

// Export global CV type for convenience
export type CV = GlobalCV;

export interface CVTemplateProps {
  data: UnifiedCVData;
}
