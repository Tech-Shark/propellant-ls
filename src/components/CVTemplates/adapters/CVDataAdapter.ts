/**
 * Unified Adapter System to convert between different CV data formats
 * This adapter system centralizes all CV data conversion logic
 */
import { CV, SkillLevel, Skill, WorkExperience, Education, Certification, Project } from "../../../utils/global.d";
import { UnifiedCVData } from "../interfaces/CVData";

/**
 * Converts CV data from the global CV format to the unified CV format
 * @param cvData Data from CV Builder or global CV format
 */
export function convertToUnifiedCVData(cvData: CV): UnifiedCVData {
  if (!cvData) return createEmptyCVData();
  
  return {
    personalInfo: {
      name: `${cvData.firstName || ''} ${cvData.lastName || ''}`.trim(),
      firstName: cvData.firstName,
      lastName: cvData.lastName,
      title: cvData.professionalTitle || '',
      email: cvData.email || '',
      phone: cvData.phone || '',
      location: cvData.address || '',
      address: cvData.address || '',
      website: cvData.website || '',
      linkedin: '',
      github: cvData.github || '',
      portfolio: cvData.portfolio || '',
    },
    summary: cvData.professionalSummary || '',
    experience: cvData.workExperience?.map(exp => ({
      position: exp.position || '',
      company: exp.company || '',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.isCurrentRole ? 'Present' : (exp.endDate || ''),
      description: exp.description || '',
      isCurrentRole: exp.isCurrentRole || false,
      title: exp.title || exp.position || '',
    })) || [],
    education: cvData.education?.map(edu => ({
      degree: edu.degree || '',
      institution: edu.institution || '',
      location: edu.fieldOfStudy || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      year: edu.startDate ? edu.startDate.split('-')[0] : '',
      description: edu.description || '',
      grade: edu.grade || '',
      fieldOfStudy: edu.fieldOfStudy || '',
    })) || [],
    skills: {
      technical: cvData.skills
        ?.filter(s => s.level === 'ADVANCED' || s.level === 'INTERMEDIATE')
        .map(s => s.name) || [],
      languages: cvData.languages || [],
      other: cvData.skills
        ?.filter(s => s.level === 'BEGINNER')
        .map(s => s.name) || [],
    },
    certifications: cvData.certifications?.map(cert => ({
      name: cert.name || '',
      issuer: cert.issuer || '',
      dateIssued: cert.dateIssued || '',
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
    })) || [],
    projects: cvData.projects?.map(proj => ({
      name: proj.name || '',
      description: proj.description || '',
      technologies: proj.technologies || [],
      link: proj.link || '',
      project: proj.project || '',
    })) || [],
    achievements: cvData.achievements || [],
    languages: cvData.languages || [],
    hobbies: cvData.hobbies || [],
  };
}

/**
 * Convert UnifiedCVData back to the global CV format
 * @param unifiedData Unified CV data
 */
export function convertToGlobalCV(unifiedData: UnifiedCVData): CV {
  const nameParts = unifiedData.personalInfo.name.split(' ');
  const firstName = unifiedData.personalInfo.firstName || nameParts[0] || '';
  const lastName = unifiedData.personalInfo.lastName || 
    (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');
  
  // Map skill levels based on which array they're in
  const technicalSkills: Skill[] = unifiedData.skills.technical.map(name => ({
    name,
    level: 'ADVANCED' as SkillLevel
  }));
  
  const otherSkills: Skill[] = unifiedData.skills.other.map(name => ({
    name, 
    level: 'BEGINNER' as SkillLevel
  }));
  
  const languageSkills: Skill[] = unifiedData.languages.map(name => ({
    name,
    level: 'INTERMEDIATE' as SkillLevel
  }));
  
  return {
    firstName,
    lastName,
    email: unifiedData.personalInfo.email || '',
    phone: unifiedData.personalInfo.phone || '',
    professionalTitle: unifiedData.personalInfo.title || '',
    professionalSummary: unifiedData.summary || '',
    address: unifiedData.personalInfo.address || unifiedData.personalInfo.location || '',
    github: unifiedData.personalInfo.github || '',
    portfolio: unifiedData.personalInfo.portfolio || '',
    website: unifiedData.personalInfo.website || '',
    
    workExperience: unifiedData.experience.map(exp => ({
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate,
      endDate: exp.endDate === 'Present' ? '' : exp.endDate,
      description: typeof exp.description === 'string' ? exp.description : exp.description.join('\n'),
      location: exp.location || '',
      title: exp.title || exp.position,
      isCurrentRole: exp.isCurrentRole || exp.endDate === 'Present'
    })),
    
    education: unifiedData.education.map(edu => ({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      grade: edu.grade || edu.gpa || '',
      description: edu.description || ''
    })),
    
    skills: [...technicalSkills, ...otherSkills, ...languageSkills],
    
    certifications: unifiedData.certifications.map(cert => ({
      name: cert.name,
      issuer: cert.issuer,
      dateIssued: cert.dateIssued,
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || ''
    })),
    
    projects: unifiedData.projects.map(proj => ({
      name: proj.name,
      description: proj.description,
      technologies: proj.technologies,
      project: proj.project || proj.name,
      link: proj.link || ''
    })),
    
    achievements: unifiedData.achievements,
    languages: unifiedData.languages,
    hobbies: unifiedData.hobbies
  };
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
    experience: [],
    education: [],
    skills: {
      technical: [],
      languages: [],
      other: []
    },
    certifications: [],
    projects: [],
    achievements: [],
    languages: [],
    hobbies: []
  };
}
