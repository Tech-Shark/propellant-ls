import { CV, WorkExperience, Education, Certification, Project, Skill } from "@/utils/global";

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  styles: string;
  getHTML: (data: CV) => string;
}

// Transform main app CV data to match template expectations
const transformCVData = (data: CV, workExperiences: WorkExperience[], educations: Education[], certifications: Certification[], projects: Project[], skills: Skill[]) => {
  return {
    personalInfo: {
      name: `${data.firstName} ${data.lastName}`.trim(),
      title: data.professionalTitle,
      email: data.email,
      phone: data.phone,
      location: data.address,
      website: '',
      linkedin: '',
      github: '',
      photo: ''
    },
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    address: data.address,
    professionalTitle: data.professionalTitle,
    professionalSummary: data.professionalSummary,
    summary: data.professionalSummary,
    workExperience: workExperiences.map(exp => ({
      ...exp,
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
      link: proj.repositoryUrl || proj.liveUrl || proj.link
    })),
    skills: skills.map(skill => ({
      name: skill.name,
      level: skill.level
    })),
    coreCompetencies: skills.map(skill => skill.name),
    languages: [],
    hobbies: [],
    achievements: []
  };
};

export const cvTemplates: CVTemplate[] = [
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'Traditional design with serif fonts and clean layout',
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
    getHTML: (data) => {
      const transformed = transformCVData(data, [], [], [], [], []);
      return `
        <h1>${transformed.personalInfo.name || ''}</h1>
        <div class="contact-info">
          <div>
            ${transformed.phone ? `Phone: ${transformed.phone}` : ''}
            ${transformed.address ? ` | Location: ${transformed.address}` : ''}
            ${transformed.email ? ` | Email: ${transformed.email}` : ''}
          </div>
        </div>
        ${transformed.professionalTitle ? `<div class="section"><h2>Title</h2><p>${transformed.professionalTitle}</p></div>` : ''}
        ${transformed.professionalSummary ? `<div class="section"><h2>Summary</h2><p>${transformed.professionalSummary}</p></div>` : ''}
      `;
    }
  },
  {
    id: 'modern',
    name: 'Modern Minimal',
    description: 'Clean sans-serif design with subtle colors',
    styles: `
      @page { size: A4; margin: 0.3in; }
      body { font-family: Verdana, Geneva, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0.3in; font-size: 10pt; background: white; }
      h1 { font-size: 28pt; margin: 0 0 12px 0; font-weight: 300; color: #2c3e50; letter-spacing: 1px; }
      h2 { font-size: 12pt; margin: 20px 0 10px 0; font-weight: 600; color: #34495e; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #ecf0f1; padding-bottom: 4px; page-break-after: auto; }
      .contact-info { margin-bottom: 20px; font-size: 9pt; color: #7f8c8d; }
      .contact-info span { margin: 0 10px; }
      .section { margin-bottom: 20px; page-break-inside: avoid; }
      .competency-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin: 10px 0; }
      .competency-item { background: #f8f9fa; padding: 4px 8px; border-radius: 4px; font-size: 9pt; }
      .employment-entry { margin-bottom: 16px; page-break-inside: avoid; }
      .job-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
      .job-title { font-weight: 600; color: #2c3e50; }
      .responsibilities { margin: 6px 0 6px 16px; color: #555; }
      .responsibilities li { margin: 3px 0; }
      .education-entry { margin-bottom: 10px; page-break-inside: avoid; }
      p { margin: 10px 0; line-height: 1.6; }
      @media print {
        body { margin: 0; padding: 0; }
        .section { page-break-inside: avoid; }
        h2 { page-break-after: avoid; }
      }
    `,
    getHTML: (data) => {
      const transformed = transformCVData(data, [], [], [], [], []);
      return `
        <h1>${transformed.firstName || ''} ${transformed.lastName || ''}</h1>
        <div class="contact-info">
          <span>📱 ${transformed.phone || ''}</span>
          <span>📍 ${transformed.address || ''}</span>
          <span>✉️ ${transformed.email || ''}</span>
        </div>
        ${transformed.professionalTitle ? `<div class="section"><h2>Title</h2><p>${transformed.professionalTitle}</p></div>` : ''}
        ${transformed.professionalSummary ? `<div class="section"><h2>Professional Summary</h2><p>${transformed.professionalSummary}</p></div>` : ''}
      `;
    }
  },
  {
    id: 'executive',
    name: 'Executive Bold',
    description: 'Bold design with strong typography for senior positions',
    styles: `
      @page { size: A4; margin: 0.7in; }
      .cv-container { width: 100%; margin-top: [0, 0, 0.3, 0]; }
      body { font-family: Verdana, Geneva, sans-serif; line-height: 1.5; color: #1a1a1a; margin: 0; padding: 0 0 0.15in 0;; font-size: 10.5pt; background: white; }
      h1 { font-size: 32pt; margin: 0 0 4px 0; font-weight: bold; color: #000; letter-spacing: -1px; }
      .subtitle { font-size: 14pt; color: #666; margin-bottom: 16px; font-style: italic; }
      h2 { font-size: 13pt; margin: 24px 0 12px 0; font-weight: bold; color: #000; text-transform: uppercase; letter-spacing: 1px; border-top: 3px solid #000; padding-top: 8px; page-break-after: avoid; }
      .contact-info { display: flex; justify-content: space-between; margin-bottom: 20px; padding: 10px; background: #f5f5f5; font-size: 9pt; }
      .section { margin-bottom: 20px}
      .highlight-box { background: #fafafa; padding: 12px; border-left: 4px solid #333; margin: 12px 0; }
      .competency-list { display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0; }
      .competency-badge { background: #333; color: white; padding: 4px 10px; font-size: 9pt; }
      .employment-entry { margin-bottom: 10px}
      .job-title { font-size: 11pt; font-weight: bold; color: #000; }
      .company { font-size: 10pt; color: #444; }
      .responsibilities { margin: 8px 0px 8px 20px; }
      .responsibilities li { margin: 4px 0; }
      .education-entry { margin-bottom: 12px}
      p { margin: 10px 0; text-align: justify; }
      @media print {
        body { margin: [0, 0, 0.3, 0]; padding: 0; }
        .section { page-break-inside: auto; }
        h2 { page-break-after: auto; }
      }
    `,
    getHTML: (data) => {
      const transformed = transformCVData(data, [], [], [], [], []);
      return `
      <div class="cv-container">
          <h1>${transformed.firstName || ''} ${transformed.lastName || ''}</h1>
          ${transformed.professionalTitle ? `<div class="subtitle">${transformed.professionalTitle}</div>` : ''}
          <div class="contact-info">
            ${transformed.phone ? `<span>${transformed.phone}</span>` : ''}
            ${transformed.email ? `<span>${transformed.email}</span>` : ''}
            ${transformed.address ? `<span>${transformed.address}</span>` : ''}
          </div>
          ${transformed.professionalSummary && transformed.professionalSummary.trim() !== '' ? `
            <div class="highlight-box">
              <strong>EXECUTIVE SUMMARY</strong>
              <p style="margin-top: 6px;">${transformed.professionalSummary}</p>
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
    styles: `
      @page { size: A4; margin: 0.3in; }
      body { font-family: Verdana, Geneva, sans-serif; line-height: 1.6; color: #2d2d2d; margin: 0; padding: 0.3in; font-size: 10pt; background: white; }
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
      .responsibilities { margin: 6px 0; }
      .responsibilities li { margin: 3px 0; font-size: 9.5pt; }
      .education-entry { margin-bottom: 10px; page-break-inside: avoid; }
      p { margin: 10px 0; }
      @media print {
        body { margin: 0; padding: 0; }
        .section { page-break-inside: avoid; }
        h2 { page-break-after: avoid; }
      }
    `,
    getHTML: (data) => {
      const transformed = transformCVData(data, [], [], [], [], []);
      return `
        <h1>${transformed.personalInfo.name || ''}</h1>
        <div class="tagline">Creative Professional • Innovation Driven • Results Focused</div>
        <div class="contact-info">
          <span>☎ ${transformed.phone || ''}</span>
          <span>📍 ${transformed.address || ''}</span>
          <span>✉ ${transformed.email || ''}</span>
        </div>
        ${transformed.professionalSummary ? `
        <div class="section">
          <h2>About Me</h2>
          <p>${transformed.professionalSummary}</p>
        </div>` : ''}
      `;
    }
  }
];

// Updated getHTML methods to use complete CV data
const getCompleteHTML = (
  template: CVTemplate,
  personalInfo: CV,
  workExperiences: WorkExperience[],
  educations: Education[],
  certifications: Certification[],
  projects: Project[],
  skills: Skill[]
) => {
  const transformedData = transformCVData(personalInfo, workExperiences, educations, certifications, projects, skills);
  
  if (template.id === 'classic') {
    return `
      <h1>${transformedData.personalInfo.name || ''}</h1>
      <div class="contact-info">
        <div>
          ${transformedData.phone ? `Phone: ${transformedData.phone}` : ''}
          ${transformedData.address ? ` | Location: ${transformedData.address}` : ''}
          ${transformedData.email ? ` | Email: ${transformedData.email}` : ''}
        </div>
      </div>
      ${transformedData.professionalTitle ? `<div class="section"><h2>Title</h2><p>${transformedData.professionalTitle}</p></div>` : ''}
      ${transformedData.professionalSummary ? `<div class="section"><h2>Summary</h2><p>${transformedData.professionalSummary}</p></div>` : ''}
      ${skills.length > 0 ? `<div class="section"><h2>Skills</h2><ol class="competency-list">
        ${skills.map((skill) => `<li>${skill.name}${skill.level ? ` (${skill.level})` : ''}</li>`).join('')}
      </ol></div>` : ''}
      ${workExperiences.length > 0 ? `<div class="section"><h2>Experience</h2>${workExperiences.map((job) => `<div class="employment-entry"><div><strong>${job.position}</strong>, ${job.company}.</div><div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><em>${job.startDate} - ${job.isCurrentRole ? 'Present' : job.endDate}</em><span>${job.location}</span></div><div>${job.description || ''}</div></div>`).join('')}</div>` : ''}
      ${educations.length > 0 ? `<div class="section"><h2>Education</h2>${educations.map((edu) => `<div class="education-entry"><div>${edu.startDate} - ${edu.endDate}</div><div>${edu.degree} in ${edu.fieldOfStudy}</div><div><strong>${edu.institution}</strong></div>${edu.grade ? `<div>Grade: ${edu.grade}</div>` : ''}</div>`).join('')}</div>` : ''}
      ${projects.length > 0 ? `<div class="section"><h2>Projects</h2>${projects.map((proj) => `<div class="education-entry"><strong>${proj.name}</strong><br>${proj.description}<br>Technologies: ${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : ''}${proj.link ? `<br>Link: <a href='${proj.link}'>${proj.link}</a>` : ''}</div>`).join('')}</div>` : ''}
    `;
  } else if (template.id === 'modern') {
    return `
      <h1>${transformedData.firstName || ''} ${transformedData.lastName || ''}</h1>
      <div class="contact-info">
        <span>📱 ${transformedData.phone || ''}</span>
        <span>📍 ${transformedData.address || ''}</span>
        <span>✉️ ${transformedData.email || ''}</span>
      </div>
      ${transformedData.professionalTitle ? `<div class="section"><h2>Title</h2><p>${transformedData.professionalTitle}</p></div>` : ''}
      ${transformedData.professionalSummary ? `<div class="section"><h2>Professional Summary</h2><p>${transformedData.professionalSummary}</p></div>` : ''}
      ${skills.length > 0 ? `<div class="section"><h2>Skills</h2><div class="competency-grid">${skills.map((skill) => `<div class="competency-item">• ${skill.name}${skill.level ? ` (${skill.level})` : ''}</div>`).join('')}</div></div>` : ''}
      ${workExperiences.length > 0 ? `<div class="section"><h2>Work Experience</h2>${workExperiences.map((job) => `<div class="employment-entry"><div class="job-header"><span class="job-title">${job.position} at ${job.company}</span><span style="font-size: 9pt; color: #7f8c8d;">${job.startDate} - ${job.isCurrentRole ? 'Present' : job.endDate}</span></div><div style="font-size: 9pt; color: #95a5a6; margin-bottom: 6px;">${job.location}</div><div>${job.description || ''}</div></div>`).join('')}</div>` : ''}
      ${educations.length > 0 ? `<div class="section"><h2>Education</h2>${educations.map((edu) => `<div class="education-entry"><div style="font-weight: 600; color: #2c3e50;">${edu.degree} in ${edu.fieldOfStudy}</div><div style="font-size: 9pt; color: #7f8c8d;">${edu.institution} | ${edu.startDate} - ${edu.endDate}${edu.grade ? ` | Grade: ${edu.grade}` : ''}</div>${edu.description ? `<div>${edu.description}</div>` : ''}</div>`).join('')}</div>` : ''}
      ${certifications.length > 0 ? `<div class="section"><h2>Certifications</h2>${certifications.map((cert) => `<div class="education-entry"><strong>${cert.name}</strong> - ${cert.issuer}<br>Issued: ${cert.dateIssued}${cert.credentialId ? ` | ID: ${cert.credentialId}` : ''}${cert.credentialUrl ? `<br>URL: <a href='${cert.credentialUrl}'>${cert.credentialUrl}</a>` : ''}</div>`).join('')}</div>` : ''}
      ${projects.length > 0 ? `<div class="section"><h2>Projects</h2>${projects.map((proj) => `<div class="education-entry"><strong>${proj.name}</strong><br>${proj.description}<br>Technologies: ${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : ''}${proj.link ? `<br>Link: <a href='${proj.link}'>${proj.link}</a>` : ''}</div>`).join('')}</div>` : ''}
    `;
  } else if (template.id === 'executive') {
    return `
    <div class="cv-container">
        <h1>${transformedData.firstName || ''} ${transformedData.lastName || ''}</h1>
        ${transformedData.professionalTitle ? `<div class="subtitle">${transformedData.professionalTitle}</div>` : ''}
        <div class="contact-info">
          ${transformedData.phone ? `<span>${transformedData.phone}</span>` : ''}
          ${transformedData.email ? `<span>${transformedData.email}</span>` : ''}
          ${transformedData.address ? `<span>${transformedData.address}</span>` : ''}
        </div>
        ${transformedData.professionalSummary && transformedData.professionalSummary.trim() !== '' ? `
          <div class="highlight-box">
            <strong>EXECUTIVE SUMMARY</strong>
            <p style="margin-top: 6px;">${transformedData.professionalSummary}</p>
          </div>
        ` : ''}
        ${skills.length > 0 ? `
          <div class="section">
            <h2>Skills</h2>
            <div class="competency-list">
              ${skills.map((skill) => `<span class="competency-badge">${skill.name}${skill.level ? ` (${skill.level})` : ''}</span>`).join('')}
            </div>
          </div>
        ` : ''}
        ${workExperiences.length > 0 ? `
          <div class="section">
            <h2>Professional Experience</h2>
            ${workExperiences.map((job) => `
              <div class="employment-entry">
                <div class="job-title">${job.position}</div>
                <div class="company">${job.company} | ${job.location || ''} | ${job.startDate} - ${job.isCurrentRole ? 'Present' : job.endDate}</div>
                <div class="description">${job.description || ''}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
        ${educations.length > 0 ? `
          <div class="section">
            <h2>Education</h2>
            ${educations.map((edu) => `
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
            ${certifications.map((cert) => `
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
            ${projects.map((proj) => `
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
  } else if (template.id === 'creative') {
    return `
      <h1>${transformedData.personalInfo.name || ''}</h1>
      <div class="tagline">Creative Professional • Innovation Driven • Results Focused</div>
      <div class="contact-info">
        <span>☎ ${transformedData.phone || ''}</span>
        <span>📍 ${transformedData.address || ''}</span>
        <span>✉ ${transformedData.email || ''}</span>
      </div>
      ${transformedData.professionalSummary ? `
      <div class="section">
        <h2>About Me</h2>
        <p>${transformedData.professionalSummary}</p>
      </div>` : ''}
      ${skills.length > 0 ? `
      <div class="section">
        <h2>Skills & Expertise</h2>
        <div class="skills-cloud">
          ${skills.map((skill) => `<span class="skill-tag">${skill.name}</span>`).join('')}
        </div>
      </div>` : ''}
      ${workExperiences.length > 0 ? `
      <div class="section">
        <h2>Work Experience</h2>
        ${workExperiences.map((job) => `
          <div class="employment-entry">
            <div class="job-header">
              <div class="job-title">${job.position}</div>
              <div class="job-meta">${job.company} • ${job.startDate} - ${job.isCurrentRole ? 'Present' : job.endDate}</div>
            </div>
            <div class="job-meta">${job.location}</div>
            <div>${job.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}
      ${educations.length > 0 ? `
      <div class="section">
        <h2>Education</h2>
        ${educations.map((edu) => `
          <div class="education-entry">
            <strong>${edu.degree}</strong> in ${edu.fieldOfStudy}<br>
            ${edu.institution} • ${edu.startDate} - ${edu.endDate}
            ${edu.grade ? `<br>Grade: ${edu.grade}` : ''}
          </div>
        `).join('')}
      </div>` : ''}
    `;
  }
  
  return template.getHTML(personalInfo);
};

export const generateCV = (
  personalInfo: CV,
  workExperiences: WorkExperience[],
  educations: Education[],
  certifications: Certification[],
  projects: Project[],
  skills: Skill[],
  templateId: string = 'classic'
) => {
  const template = cvTemplates.find(t => t.id === templateId) || cvTemplates[0];
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.firstName} ${personalInfo.lastName} - CV</title>
    <style>${template.styles}</style>
</head>
<body>
    ${getCompleteHTML(template, personalInfo, workExperiences, educations, certifications, projects, skills)}
</body>
</html>`;
  
  return html;
};