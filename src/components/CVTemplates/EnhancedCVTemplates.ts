// Interface for propellant CV data
interface PropellantCV {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  professionalTitle?: string;
  professionalSummary?: string;
  github?: string;
  website?: string;
}

interface PropellantWorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
  title: string;
  isCurrentRole: boolean;
}

interface PropellantEducation {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade: string;
  description: string;
}

interface PropellantCertification {
  name: string;
  issuer: string;
  dateIssued: string;
  credentialId: string;
  credentialUrl: string;
}

interface PropellantProject {
  name: string;
  description: string;
  technologies: string[];
  link: string;
  repositoryUrl?: string;
  liveUrl?: string;
}

interface PropellantSkill {
  name: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}

export interface EnhancedCVTemplate {
  id: string;
  name: string;
  description: string;
  tags: string[];
  styles: string;
  generateHTML: (
    personalInfo: PropellantCV,
    workExperiences: PropellantWorkExperience[],
    educations: PropellantEducation[],
    certifications: PropellantCertification[],
    projects: PropellantProject[],
    skills: PropellantSkill[]
  ) => string;
}

// Transform propellant data to template format
const transformToTemplateFormat = (
  personalInfo: PropellantCV,
  workExperiences: PropellantWorkExperience[],
  educations: PropellantEducation[],
  certifications: PropellantCertification[],
  projects: PropellantProject[],
  skills: PropellantSkill[]
) => {
  return {
    personalInfo: {
      name: `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim(),
      title: personalInfo.professionalTitle || '',
      email: personalInfo.email || '',
      phone: personalInfo.phone || '',
      location: personalInfo.address || '',
      website: personalInfo.website || '',
      linkedin: '',
      github: personalInfo.github || '',
      photo: ''
    },
    firstName: personalInfo.firstName || '',
    lastName: personalInfo.lastName || '',
    email: personalInfo.email || '',
    phone: personalInfo.phone || '',
    address: personalInfo.address || '',
    professionalTitle: personalInfo.professionalTitle || '',
    professionalSummary: personalInfo.professionalSummary || '',
    summary: personalInfo.professionalSummary || '',
    workExperience: workExperiences.map(exp => ({
      ...exp,
      title: exp.position,
      responsibilities: exp.description ? [exp.description] : []
    })),
    experience: workExperiences.map(exp => ({
      position: exp.position,
      company: exp.company,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.isCurrentRole ? 'Present' : exp.endDate,
      description: exp.description ? [exp.description] : []
    })),
    education: educations.map(edu => ({
      degree: edu.degree,
      institution: edu.institution,
      location: '',
      year: `${edu.startDate} - ${edu.endDate}`,
      gpa: edu.grade,
      fieldOfStudy: edu.fieldOfStudy
    })),
    certifications: certifications,
    projects: projects.map(proj => ({
      name: proj.name,
      description: proj.description,
      technologies: proj.technologies || [],
      link: proj.link || proj.repositoryUrl || proj.liveUrl
    })),
    skills: {
      technical: skills.map(skill => skill.name),
      languages: [],
      other: []
    },
    coreCompetencies: skills.map(skill => skill.name),
    languages: [],
    hobbies: [],
    achievements: []
  };
};

export const enhancedCVTemplates: EnhancedCVTemplate[] = [
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'Traditional design with serif fonts and clean layout',
    tags: ['Traditional', 'Professional', 'ATS-Friendly'],
    styles: `
      @page { size: A4; margin: 0.3in; }
      body { font-family: 'Times New Roman', Times, serif; line-height: 1.5; color: #000; margin: 0; padding: 0.3in; font-size: 11pt; background: white; }
      h1 { font-size: 24pt; margin: 0 0 8px 0; font-weight: bold; text-align: center; }
      h2 { font-size: 14pt; margin: 16px 0 8px 0; font-weight: bold; border-bottom: 2px solid #000; padding-bottom: 2px; page-break-after: avoid; }
      .contact-info { text-align: center; margin-bottom: 16px; font-size: 10pt; }
      .contact-info div { margin: 2px 0; }
      .section { margin-bottom: 16px; page-break-inside: avoid; }
      .competency-list { margin: 8px 0; padding-left: 20px; }
      .competency-list li { margin: 4px 0; }
      .employment-entry { margin-bottom: 12px; page-break-inside: auto; }
      .responsibilities { margin: 4px 0 4px 20px; }
      .responsibilities li { margin: 2px 0; }
      .education-entry { margin-bottom: 8px; page-break-inside: avoid; }
      p { margin: 8px 0; text-align: justify; }
      @media print {
        body { margin: 0; padding: 0; }
        .section { page-break-inside: avoid; }
        h2 { page-break-after: avoid; }
      }
    `,
    generateHTML: (personalInfo, workExperiences, educations, certifications, projects, skills) => {
      const data = transformToTemplateFormat(personalInfo, workExperiences, educations, certifications, projects, skills);
      return `
        <h1>${data.personalInfo.name || ''}</h1>
        <div class="contact-info">
          <div>
            ${data.personalInfo.phone ? `Phone: ${data.personalInfo.phone}` : ''}
            ${data.personalInfo.location ? ` | Location: ${data.personalInfo.location}` : ''}
            ${data.personalInfo.email ? ` | Email: ${data.personalInfo.email}` : ''}
            ${data.personalInfo.github ? ` | GitHub: ${data.personalInfo.github}` : ''}
            ${data.personalInfo.website ? ` | Website: ${data.personalInfo.website}` : ''}
          </div>
        </div>
        ${data.personalInfo.title ? `<div class="section"><h2>Professional Title</h2><p>${data.personalInfo.title}</p></div>` : ''}
        ${data.summary ? `<div class="section"><h2>Summary</h2><p>${data.summary}</p></div>` : ''}
        ${skills.length > 0 ? `<div class="section"><h2>Skills</h2><ol class="competency-list">
          ${skills.map(skill => `<li>${skill.name}${skill.level ? ` (${skill.level})` : ''}</li>`).join('')}
        </ol></div>` : ''}
        ${workExperiences.length > 0 ? `<div class="section"><h2>Experience</h2>${workExperiences.map(job => `<div class="employment-entry"><div><strong>${job.position}</strong>, ${job.company}</div><div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><em>${job.startDate} - ${job.isCurrentRole ? 'Present' : job.endDate}</em><span>${job.location}</span></div><div>${job.description || ''}</div></div>`).join('')}</div>` : ''}
        ${educations.length > 0 ? `<div class="section"><h2>Education</h2>${educations.map(edu => `<div class="education-entry"><div>${edu.startDate} - ${edu.endDate}</div><div>${edu.degree} in ${edu.fieldOfStudy}</div><div><strong>${edu.institution}</strong></div>${edu.grade ? `<div>Grade: ${edu.grade}</div>` : ''}</div>`).join('')}</div>` : ''}
        ${certifications.length > 0 ? `<div class="section"><h2>Certifications</h2>${certifications.map(cert => `<div class="education-entry"><strong>${cert.name}</strong> - ${cert.issuer}<br>Issued: ${cert.dateIssued}${cert.credentialId ? ` | ID: ${cert.credentialId}` : ''}${cert.credentialUrl ? `<br>URL: <a href='${cert.credentialUrl}'>${cert.credentialUrl}</a>` : ''}</div>`).join('')}</div>` : ''}
        ${projects.length > 0 ? `<div class="section"><h2>Projects</h2>${projects.map(proj => `<div class="education-entry"><strong>${proj.name}</strong><br>${proj.description}<br>Technologies: ${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : ''}${proj.link ? `<br>Link: <a href='${proj.link}'>${proj.link}</a>` : ''}</div>`).join('')}</div>` : ''}
      `;
    }
  },
  {
    id: 'modern',
    name: 'Modern Minimal',
    description: 'Clean sans-serif design with subtle colors and contemporary layout',
    tags: ['Modern', 'Minimal', 'Creative'],
    styles: `
      @page { size: A4; margin: 0.3in; }
      body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0.3in; font-size: 10pt; background: white; }
      h1 { font-size: 28pt; margin: 0 0 12px 0; font-weight: 300; color: #2c3e50; letter-spacing: 1px; }
      h2 { font-size: 12pt; margin: 20px 0 10px 0; font-weight: 600; color: #34495e; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #ecf0f1; padding-bottom: 4px; page-break-after: auto; }
      .contact-info { margin-bottom: 20px; font-size: 9pt; color: #7f8c8d; display: flex; flex-wrap: wrap; gap: 15px; }
      .contact-info span { display: flex; align-items: center; }
      .section { margin-bottom: 20px; page-break-inside: avoid; }
      .competency-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin: 10px 0; }
      .competency-item { background: #f8f9fa; padding: 4px 8px; border-radius: 4px; font-size: 9pt; }
      .employment-entry { margin-bottom: 16px; page-break-inside: avoid; }
      .job-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
      .job-title { font-weight: 600; color: #2c3e50; }
      .job-meta { font-size: 9pt; color: #7f8c8d; }
      .education-entry { margin-bottom: 10px; page-break-inside: avoid; }
      p { margin: 10px 0; line-height: 1.6; }
      @media print {
        body { margin: 0; padding: 0; }
        .section { page-break-inside: avoid; }
        h2 { page-break-after: avoid; }
      }
    `,
    generateHTML: (personalInfo, workExperiences, educations, certifications, projects, skills) => {
      const data = transformToTemplateFormat(personalInfo, workExperiences, educations, certifications, projects, skills);
      return `
        <h1>${data.firstName || ''} ${data.lastName || ''}</h1>
        <div class="contact-info">
          ${data.phone ? `<span>📱 ${data.phone}</span>` : ''}
          ${data.address ? `<span>📍 ${data.address}</span>` : ''}
          ${data.email ? `<span>✉️ ${data.email}</span>` : ''}
          ${data.personalInfo.github ? `<span>💻 ${data.personalInfo.github}</span>` : ''}
          ${data.personalInfo.website ? `<span>🌐 ${data.personalInfo.website}</span>` : ''}
        </div>
        ${data.professionalTitle ? `<div class="section"><h2>Professional Title</h2><p>${data.professionalTitle}</p></div>` : ''}
        ${data.professionalSummary ? `<div class="section"><h2>Professional Summary</h2><p>${data.professionalSummary}</p></div>` : ''}
        ${skills.length > 0 ? `<div class="section"><h2>Skills</h2><div class="competency-grid">${skills.map(skill => `<div class="competency-item">• ${skill.name}${skill.level ? ` (${skill.level})` : ''}</div>`).join('')}</div></div>` : ''}
        ${workExperiences.length > 0 ? `<div class="section"><h2>Work Experience</h2>${workExperiences.map(job => `<div class="employment-entry"><div class="job-header"><span class="job-title">${job.position} at ${job.company}</span><span class="job-meta">${job.startDate} - ${job.isCurrentRole ? 'Present' : job.endDate}</span></div><div class="job-meta" style="margin-bottom: 6px;">${job.location}</div><div>${job.description || ''}</div></div>`).join('')}</div>` : ''}
        ${educations.length > 0 ? `<div class="section"><h2>Education</h2>${educations.map(edu => `<div class="education-entry"><div style="font-weight: 600; color: #2c3e50;">${edu.degree} in ${edu.fieldOfStudy}</div><div style="font-size: 9pt; color: #7f8c8d;">${edu.institution} | ${edu.startDate} - ${edu.endDate}${edu.grade ? ` | Grade: ${edu.grade}` : ''}</div>${edu.description ? `<div>${edu.description}</div>` : ''}</div>`).join('')}</div>` : ''}
        ${certifications.length > 0 ? `<div class="section"><h2>Certifications</h2>${certifications.map(cert => `<div class="education-entry"><strong>${cert.name}</strong> - ${cert.issuer}<br>Issued: ${cert.dateIssued}${cert.credentialId ? ` | ID: ${cert.credentialId}` : ''}${cert.credentialUrl ? `<br>URL: <a href='${cert.credentialUrl}'>${cert.credentialUrl}</a>` : ''}</div>`).join('')}</div>` : ''}
        ${projects.length > 0 ? `<div class="section"><h2>Projects</h2>${projects.map(proj => `<div class="education-entry"><strong>${proj.name}</strong><br>${proj.description}<br>Technologies: ${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : ''}${proj.link ? `<br>Link: <a href='${proj.link}'>${proj.link}</a>` : ''}</div>`).join('')}</div>` : ''}
      `;
    }
  },
  {
    id: 'executive',
    name: 'Executive Bold',
    description: 'Bold design with strong typography for senior positions',
    tags: ['Executive', 'Bold', 'Leadership'],
    styles: `
      @page { size: A4; margin: 0.7in; }
      .cv-container { width: 100%; }
      body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.5; color: #1a1a1a; margin: 0; padding: 0.3in; font-size: 10.5pt; background: white; }
      h1 { font-size: 32pt; margin: 0 0 4px 0; font-weight: bold; color: #000; letter-spacing: -1px; }
      .subtitle { font-size: 14pt; color: #666; margin-bottom: 16px; font-style: italic; }
      h2 { font-size: 13pt; margin: 24px 0 12px 0; font-weight: bold; color: #000; text-transform: uppercase; letter-spacing: 1px; border-top: 3px solid #000; padding-top: 8px; page-break-after: avoid; }
      .contact-info { display: flex; justify-content: space-between; margin-bottom: 20px; padding: 10px; background: #f5f5f5; font-size: 9pt; flex-wrap: wrap; gap: 10px; }
      .section { margin-bottom: 20px; }
      .highlight-box { background: #fafafa; padding: 12px; border-left: 4px solid #333; margin: 12px 0; }
      .competency-list { display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0; }
      .competency-badge { background: #333; color: white; padding: 4px 10px; font-size: 9pt; border-radius: 2px; }
      .employment-entry { margin-bottom: 18px; }
      .job-title { font-size: 11pt; font-weight: bold; color: #000; }
      .company { font-size: 10pt; color: #444; margin-bottom: 6px; }
      .education-entry { margin-bottom: 12px; }
      p { margin: 10px 0; text-align: justify; }
      @media print {
        body { margin: 0; padding: 0; }
        .section { page-break-inside: auto; }
        h2 { page-break-after: auto; }
      }
    `,
    generateHTML: (personalInfo, workExperiences, educations, certifications, projects, skills) => {
      const data = transformToTemplateFormat(personalInfo, workExperiences, educations, certifications, projects, skills);
      return `
      <div class="cv-container">
          <h1>${data.firstName || ''} ${data.lastName || ''}</h1>
          ${data.professionalTitle ? `<div class="subtitle">${data.professionalTitle}</div>` : ''}
          <div class="contact-info">
            ${data.phone ? `<span>${data.phone}</span>` : ''}
            ${data.email ? `<span>${data.email}</span>` : ''}
            ${data.address ? `<span>${data.address}</span>` : ''}
            ${data.personalInfo.github ? `<span>GitHub: ${data.personalInfo.github}</span>` : ''}
            ${data.personalInfo.website ? `<span>Website: ${data.personalInfo.website}</span>` : ''}
          </div>
          ${data.professionalSummary && data.professionalSummary.trim() !== '' ? `
            <div class="highlight-box">
              <strong>EXECUTIVE SUMMARY</strong>
              <p style="margin-top: 6px;">${data.professionalSummary}</p>
            </div>
          ` : ''}
          ${skills.length > 0 ? `
            <div class="section">
              <h2>Core Competencies</h2>
              <div class="competency-list">
                ${skills.map(skill => `<span class="competency-badge">${skill.name}${skill.level ? ` (${skill.level})` : ''}</span>`).join('')}
              </div>
            </div>
          ` : ''}
          ${workExperiences.length > 0 ? `
            <div class="section">
              <h2>Professional Experience</h2>
              ${workExperiences.map(job => `
                <div class="employment-entry">
                  <div class="job-title">${job.position}</div>
                  <div class="company">${job.company} | ${job.location || ''} | ${job.startDate} - ${job.isCurrentRole ? 'Present' : job.endDate}</div>
                  <div>${job.description || ''}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${educations.length > 0 ? `
            <div class="section">
              <h2>Education</h2>
              ${educations.map(edu => `
                <div class="education-entry">
                  <strong>${edu.degree}</strong> in ${edu.fieldOfStudy}<br>
                  ${edu.institution}, ${edu.startDate} - ${edu.endDate}${edu.grade ? ` | Grade: ${edu.grade}` : ''}
                  ${edu.description ? `<div>${edu.description}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${certifications.length > 0 ? `
            <div class="section">
              <h2>Certifications</h2>
              ${certifications.map(cert => `
                <div class="education-entry">
                  <strong>${cert.name}</strong> - ${cert.issuer}<br>
                  Issued: ${cert.dateIssued}${cert.credentialId ? ` | ID: ${cert.credentialId}` : ''}
                  ${cert.credentialUrl ? `<br>URL: <a href='${cert.credentialUrl}'>${cert.credentialUrl}</a>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${projects.length > 0 ? `
            <div class="section">
              <h2>Projects</h2>
              ${projects.map(proj => `
                <div class="education-entry">
                  <strong>${proj.name}</strong><br>
                  ${proj.description}<br>
                  Technologies: ${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : ''}
                  ${proj.link ? `<br>Link: <a href='${proj.link}'>${proj.link}</a>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
      </div>
      `;
    }
  },
  {
    id: 'creative',
    name: 'Creative Designer',
    description: 'Stylish layout with color accents for creative professionals',
    tags: ['Creative', 'Colorful', 'Designer'],
    styles: `
      @page { size: A4; margin: 0.3in; }
      body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #2d2d2d; margin: 0; padding: 0.3in; font-size: 10pt; background: white; }
      h1 { font-size: 36pt; margin: 0 0 8px 0; font-weight: 200; color: #e74c3c; }
      .tagline { font-size: 11pt; color: #7f8c8d; margin-bottom: 20px; font-style: italic; }
      h2 { font-size: 11pt; margin: 20px 0 10px 0; font-weight: bold; color: #e74c3c; letter-spacing: 1px; position: relative; padding-left: 20px; page-break-after: avoid; }
      h2:before { content: "▸"; position: absolute; left: 0; color: #e74c3c; }
      .contact-info { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 15px; margin-bottom: 20px; border-radius: 8px; font-size: 9pt; }
      .contact-info span { margin-right: 15px; }
      .section { margin-bottom: 20px; page-break-inside: auto; }
      .skills-cloud { display: flex; flex-wrap: wrap; gap: 6px; margin: 10px 0; }
      .skill-tag { background: #f0f0f0; color: #333; padding: 4px 12px; border-radius: 20px; font-size: 9pt; border: 1px solid #e0e0e0; }
      .employment-entry { margin-bottom: 16px; page-break-inside: auto; border-left: 3px solid #e74c3c; padding-left: 15px; }
      .job-header { margin-bottom: 6px; }
      .job-title { font-weight: bold; color: #2d2d2d; font-size: 10.5pt; }
      .job-meta { font-size: 9pt; color: #7f8c8d; }
      .education-entry { margin-bottom: 10px; page-break-inside: avoid; }
      p { margin: 10px 0; }
      @media print {
        body { margin: 0; padding: 0; }
        .section { page-break-inside: avoid; }
        h2 { page-break-after: avoid; }
      }
    `,
    generateHTML: (personalInfo, workExperiences, educations, certifications, projects, skills) => {
      const data = transformToTemplateFormat(personalInfo, workExperiences, educations, certifications, projects, skills);
      return `
        <h1>${data.personalInfo.name}</h1>
        <div class="tagline">Creative Professional • Innovation Driven • Results Focused</div>
        <div class="contact-info">
          ${data.phone ? `<span>☎ ${data.phone}</span>` : ''}
          ${data.address ? `<span>📍 ${data.address}</span>` : ''}
          ${data.email ? `<span>✉ ${data.email}</span>` : ''}
        </div>
        ${data.professionalSummary ? `
        <div class="section">
          <h2>About Me</h2>
          <p>${data.professionalSummary}</p>
        </div>` : ''}
        ${skills.length > 0 ? `
        <div class="section">
          <h2>Skills & Expertise</h2>
          <div class="skills-cloud">
            ${skills.map(skill => `<span class="skill-tag">${skill.name}</span>`).join('')}
          </div>
        </div>` : ''}
        ${workExperiences.length > 0 ? `
        <div class="section">
          <h2>Work Experience</h2>
          ${workExperiences.map(job => `
            <div class="employment-entry">
              <div class="job-header">
                <div class="job-title">${job.position}</div>
                <div class="job-meta">${job.company} | ${job.startDate} - ${job.isCurrentRole ? 'Present' : job.endDate}</div>
              </div>
              <div>${job.description || ''}</div>
            </div>
          `).join('')}
        </div>` : ''}
        ${educations.length > 0 ? `
        <div class="section">
          <h2>Education</h2>
          ${educations.map(edu => `
            <div class="education-entry">
              <strong>${edu.degree}</strong> in ${edu.fieldOfStudy}<br>
              ${edu.institution}, ${edu.startDate} - ${edu.endDate}${edu.grade ? ` | Grade: ${edu.grade}` : ''}
            </div>
          `).join('')}
        </div>` : ''}
        ${certifications.length > 0 ? `
        <div class="section">
          <h2>Certifications</h2>
          ${certifications.map(cert => `
            <div class="education-entry">
              <strong>${cert.name}</strong> - ${cert.issuer}<br>
              Issued: ${cert.dateIssued}${cert.credentialId ? ` | ID: ${cert.credentialId}` : ''}
            </div>
          `).join('')}
        </div>` : ''}
        ${projects.length > 0 ? `
        <div class="section">
          <h2>Projects</h2>
          ${projects.map(proj => `
            <div class="education-entry">
              <strong>${proj.name}</strong><br>
              ${proj.description}<br>
              Technologies: ${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : ''}
              ${proj.link ? `<br>Link: <a href='${proj.link}'>${proj.link}</a>` : ''}
            </div>
          `).join('')}
        </div>` : ''}
      `;
    }
  },
  {
    id: 'technical',
    name: 'Tech Professional',
    description: 'Optimized layout for developers and technical roles',
    tags: ['Technical', 'Developer', 'ATS-Friendly'],
    styles: `
      @page { size: A4; margin: 0.3in; }
      body { font-family: 'Consolas', 'Monaco', 'Courier New', monospace; line-height: 1.5; color: #2d3748; margin: 0; padding: 0.3in; font-size: 10pt; background: white; }
      h1 { font-size: 24pt; margin: 0 0 8px 0; font-weight: bold; color: #1a202c; font-family: 'Helvetica Neue', Arial, sans-serif; }
      h2 { font-size: 11pt; margin: 16px 0 8px 0; font-weight: bold; color: #2b6cb0; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #cbd5e0; padding-bottom: 2px; font-family: 'Helvetica Neue', Arial, sans-serif; }
      .contact-info { margin-bottom: 16px; font-size: 9pt; color: #4a5568; display: flex; flex-wrap: wrap; gap: 12px; }
      .contact-info span { background: #f7fafc; padding: 2px 6px; border-radius: 3px; }
      .section { margin-bottom: 16px; page-break-inside: avoid; }
      .tech-skills { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin: 8px 0; }
      .tech-skill { background: #e2e8f0; color: #2d3748; padding: 2px 8px; border-radius: 3px; font-size: 9pt; text-align: center; }
      .employment-entry { margin-bottom: 14px; border-left: 2px solid #4299e1; padding-left: 12px; }
      .job-title { font-weight: bold; color: #2b6cb0; font-size: 10.5pt; }
      .job-meta { font-size: 9pt; color: #718096; margin-bottom: 4px; }
      .tech-list { font-family: 'Consolas', monospace; background: #f7fafc; padding: 4px 8px; border-radius: 3px; font-size: 9pt; margin: 4px 0; }
      .education-entry { margin-bottom: 8px; }
      p { margin: 8px 0; }
      code { background: #f7fafc; padding: 1px 4px; border-radius: 2px; font-size: 9pt; }
    `,
    generateHTML: (personalInfo, workExperiences, educations, certifications, projects, skills) => {
      const data = transformToTemplateFormat(personalInfo, workExperiences, educations, certifications, projects, skills);
      return `
        <h1>${data.personalInfo.name}</h1>
        <div class="contact-info">
          ${data.email ? `<span>📧 ${data.email}</span>` : ''}
          ${data.phone ? `<span>📱 ${data.phone}</span>` : ''}
          ${data.address ? `<span>📍 ${data.address}</span>` : ''}
          ${data.personalInfo.github ? `<span>💻 ${data.personalInfo.github}</span>` : ''}
          ${data.personalInfo.website ? `<span>🌐 ${data.personalInfo.website}</span>` : ''}
        </div>
        ${data.professionalTitle ? `<div class="section"><h2>Role</h2><p><code>${data.professionalTitle}</code></p></div>` : ''}
        ${data.professionalSummary ? `<div class="section"><h2>Summary</h2><p>${data.professionalSummary}</p></div>` : ''}
        ${skills.length > 0 ? `<div class="section"><h2>Technical Skills</h2><div class="tech-skills">${skills.map(skill => `<div class="tech-skill">${skill.name}${skill.level ? ` (${skill.level})` : ''}</div>`).join('')}</div></div>` : ''}
        ${workExperiences.length > 0 ? `<div class="section"><h2>Experience</h2>${workExperiences.map(job => `<div class="employment-entry"><div class="job-title">${job.position}</div><div class="job-meta">${job.company} | ${job.location || ''} | ${job.startDate} - ${job.isCurrentRole ? 'Present' : job.endDate}</div><div>${job.description || ''}</div></div>`).join('')}</div>` : ''}
        ${projects.length > 0 ? `<div class="section"><h2>Projects</h2>${projects.map(proj => `<div class="employment-entry"><div class="job-title">${proj.name}</div><div>${proj.description}</div><div class="tech-list">Tech Stack: ${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : ''}</div>${proj.link ? `<div>🔗 <a href='${proj.link}'>${proj.link}</a></div>` : ''}</div>`).join('')}</div>` : ''}
        ${educations.length > 0 ? `<div class="section"><h2>Education</h2>${educations.map(edu => `<div class="education-entry"><strong>${edu.degree}</strong> in ${edu.fieldOfStudy}<br>${edu.institution}, ${edu.startDate} - ${edu.endDate}${edu.grade ? ` | Grade: ${edu.grade}` : ''}</div>`).join('')}</div>` : ''}
        ${certifications.length > 0 ? `<div class="section"><h2>Certifications</h2>${certifications.map(cert => `<div class="education-entry"><strong>${cert.name}</strong> - ${cert.issuer}<br>Issued: ${cert.dateIssued}${cert.credentialId ? ` | ID: <code>${cert.credentialId}</code>` : ''}</div>`).join('')}</div>` : ''}
      `;
    }
  }
];
