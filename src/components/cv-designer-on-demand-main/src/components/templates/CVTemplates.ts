export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  styles: string;
  getHTML: (data: any) => string;
}

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
    getHTML: (data) => `
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
      ${data.personalInfo.title ? `<div class="section"><h2>Title</h2><p>${data.personalInfo.title}</p></div>` : ''}
      ${data.summary ? `<div class="section"><h2>Summary</h2><p>${data.summary}</p></div>` : ''}
      ${(data.skills.technical.length > 0 || data.skills.languages.length > 0 || data.skills.other.length > 0) ? `<div class="section"><h2>Skills</h2><ol class="competency-list">
        ${data.skills.technical.map((skill: string) => `<li>${skill}</li>`).join('')}
        ${data.skills.languages.map((lang: any) => `<li>${lang.name}${lang.level ? ` (${lang.level})` : ''}</li>`).join('')}
        ${data.skills.other.map((skill: string) => `<li>${skill}</li>`).join('')}
      </ol></div>` : ''}
      ${Array.isArray(data.experience) && data.experience.length > 0 ? `<div class="section"><h2>Experience</h2>${data.experience.map((job: any) => `<div class="employment-entry"><div><strong>${job.position}</strong>, ${job.company}.</div><div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><em>${job.startDate} - ${job.endDate}</em><span>${job.location}</span></div><ul class="responsibilities">${job.description.map((desc: string) => `<li>${desc}</li>`).join('')}</ul></div>`).join('')}</div>` : ''}
      ${Array.isArray(data.education) && data.education.length > 0 ? `<div class="section"><h2>Education</h2>${data.education.map((edu: any) => `<div class="education-entry"><div>${edu.year}</div><div>${edu.degree}</div><div><strong>${edu.institution}</strong></div>${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}</div>`).join('')}</div>` : ''}
      ${Array.isArray(data.projects) && data.projects.length > 0 ? `<div class="section"><h2>Projects</h2>${data.projects.map((proj: any) => `<div class="education-entry"><strong>${proj.name}</strong><br>${proj.description}<br>Technologies: ${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : ''}${proj.link ? `<br>Link: <a href='${proj.link}'>${proj.link}</a>` : ''}</div>`).join('')}</div>` : ''}
    `
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
    getHTML: (data) => `
      <h1>${data.firstName || ''} ${data.lastName || ''}</h1>
      <div class="contact-info">
        <span>📱 ${data.phone || ''}</span>
        <span>📍 ${data.address || ''}</span>
        <span>✉️ ${data.email || ''}</span>
        ${data.github ? `<span>GitHub: ${data.github}</span>` : ''}
        ${data.portfolio ? `<span>Portfolio: ${data.portfolio}</span>` : ''}
        ${data.website ? `<span>Website: ${data.website}</span>` : ''}
      </div>
      ${data.professionalTitle ? `<div class="section"><h2>Title</h2><p>${data.professionalTitle}</p></div>` : ''}
      ${data.professionalSummary ? `<div class="section"><h2>Professional Summary</h2><p>${data.professionalSummary}</p></div>` : ''}
      ${Array.isArray(data.skills) && data.skills.length > 0 ? `<div class="section"><h2>Skills</h2><div class="competency-grid">${data.skills.map((skill: any) => `<div class="competency-item">• ${skill.name}${skill.level ? ` (${skill.level})` : ''}</div>`).join('')}</div></div>` : ''}
      ${Array.isArray(data.languages) && data.languages.length > 0 ? `<div class="section"><h2>Languages</h2><div>${data.languages.join(', ')}</div></div>` : ''}
      ${Array.isArray(data.hobbies) && data.hobbies.length > 0 ? `<div class="section"><h2>Hobbies</h2><div>${data.hobbies.join(', ')}</div></div>` : ''}
      ${Array.isArray(data.achievements) && data.achievements.length > 0 ? `<div class="section"><h2>Achievements</h2><ul>${data.achievements.map((ach: string) => `<li>${ach}</li>`).join('')}</ul></div>` : ''}
      ${Array.isArray(data.workExperience) && data.workExperience.length > 0 ? `<div class="section"><h2>Work Experience</h2>${data.workExperience.map((job: any) => `<div class="employment-entry"><div class="job-header"><span class="job-title">${job.position || job.title} at ${job.company}</span><span style="font-size: 9pt; color: #7f8c8d;">${job.startDate} - ${job.isCurrentRole ? 'Present' : job.endDate}</span></div><div style="font-size: 9pt; color: #95a5a6; margin-bottom: 6px;">${job.location}</div><div>${job.description || ''}</div></div>`).join('')}</div>` : ''}
      ${Array.isArray(data.education) && data.education.length > 0 ? `<div class="section"><h2>Education</h2>${data.education.map((edu: any) => `<div class="education-entry"><div style="font-weight: 600; color: #2c3e50;">${edu.degree} in ${edu.fieldOfStudy}</div><div style="font-size: 9pt; color: #7f8c8d;">${edu.institution} | ${edu.startDate} - ${edu.endDate}${edu.grade ? ` | Grade: ${edu.grade}` : ''}</div>${edu.description ? `<div>${edu.description}</div>` : ''}</div>`).join('')}</div>` : ''}
      ${Array.isArray(data.certifications) && data.certifications.length > 0 ? `<div class="section"><h2>Certifications</h2>${data.certifications.map((cert: any) => `<div class="education-entry"><strong>${cert.name}</strong> - ${cert.issuer}<br>Issued: ${cert.dateIssued}${cert.credentialId ? ` | ID: ${cert.credentialId}` : ''}${cert.credentialUrl ? `<br>URL: <a href='${cert.credentialUrl}'>${cert.credentialUrl}</a>` : ''}</div>`).join('')}</div>` : ''}
      ${Array.isArray(data.projects) && data.projects.length > 0 ? `<div class="section"><h2>Projects</h2>${data.projects.map((proj: any) => `<div class="education-entry"><strong>${proj.name}</strong><br>${proj.description}<br>Technologies: ${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : ''}${proj.link ? `<br>Link: <a href='${proj.link}'>${proj.link}</a>` : ''}</div>`).join('')}</div>` : ''}
    `
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
      // .section { margin-bottom: 20px; page-break-inside: auto; }
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
    getHTML: (data) => `
    <div class="cv-container">
        <h1>${data.firstName || ''} ${data.lastName || ''}</h1>
        ${data.professionalTitle ? `<div class="subtitle">${data.professionalTitle}</div>` : ''}
        <div class="contact-info">
          ${data.phone ? `<span>${data.phone}</span>` : ''}
          ${data.email ? `<span>${data.email}</span>` : ''}
          ${data.address ? `<span>${data.address}</span>` : ''}
          ${data.github ? `<span>GitHub: ${data.github}</span>` : ''}
          ${data.portfolio ? `<span>Portfolio: ${data.portfolio}</span>` : ''}
          ${data.website ? `<span>Website: ${data.website}</span>` : ''}
        </div>
        ${data.professionalSummary && data.professionalSummary.trim() !== '' ? `
          <div class="highlight-box">
            <strong>EXECUTIVE SUMMARY</strong>
            <p style="margin-top: 6px;">${data.professionalSummary}</p>
          </div>
        ` : ''}
        ${Array.isArray(data.skills) && data.skills.length > 0 ? `
          <div class="section">
            <h2>Skills</h2>
            <div class="competency-list">
              ${data.skills.map((skill: any) => `<span class="competency-badge">${skill.name}${skill.level ? ` (${skill.level})` : ''}</span>`).join('')}
            </div>
          </div>
        ` : ''}
        ${Array.isArray(data.languages) && data.languages.length > 0 ? `
          <div class="section">
            <h2>Languages</h2>
            <div>${data.languages.map((lang: string) => `<span>${lang}</span>`).join(', ')}</div>
          </div>
        ` : ''}
        ${Array.isArray(data.hobbies) && data.hobbies.length > 0 ? `
          <div class="section">
            <h2>Hobbies</h2>
            <div>${data.hobbies.map((hobby: string) => `<span>${hobby}</span>`).join(', ')}</div>
          </div>
        ` : ''}
        ${Array.isArray(data.achievements) && data.achievements.length > 0 ? `
          <div class="section">
            <h2>Achievements</h2>
            <ul>${data.achievements.map((ach: string) => `<li>${ach}</li>`).join('')}</ul>
          </div>
        ` : ''}
        ${Array.isArray(data.workExperience) && data.workExperience.length > 0 ? `
          <div class="section">
            <h2>Professional Experience</h2>
            ${data.workExperience.map((job: any) => `
              <div class="employment-entry">
                <div class="job-title">${job.position || job.title}</div>
                <div class="company">${job.company} | ${job.location || ''} | ${job.startDate} - ${job.isCurrentRole ? 'Present' : job.endDate}</div>
                <div class="description">${job.description || ''}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
        ${Array.isArray(data.education) && data.education.length > 0 ? `
          <div class="section">
            <h2>Education</h2>
            ${data.education.map((edu: any) => `
              <div class="education-entry">
                <strong>${edu.degree}</strong> in ${edu.fieldOfStudy}<br>
                ${edu.institution}, ${edu.startDate} - ${edu.endDate}${edu.grade ? ` | Grade: ${edu.grade}` : ''}
                ${edu.description ? `<div>${edu.description}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
        ${Array.isArray(data.certifications) && data.certifications.length > 0 ? `
          <div class="section">
            <h2>Certifications</h2>
            ${data.certifications.map((cert: any) => `
              <div class="education-entry">
                <strong>${cert.name}</strong> - ${cert.issuer}<br>
                Issued: ${cert.dateIssued}${cert.credentialId ? ` | ID: ${cert.credentialId}` : ''}
                ${cert.credentialUrl ? `<br>URL: <a href='${cert.credentialUrl}'>${cert.credentialUrl}</a>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
        ${Array.isArray(data.projects) && data.projects.length > 0 ? `
          <div class="section">
            <h2>Projects</h2>
            ${data.projects.map((proj: any) => `
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
    `
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
    getHTML: (data) => `
      <h1>${data.name}</h1>
      <div class="tagline">Creative Professional • Innovation Driven • Results Focused</div>
      <div class="contact-info">
        <span>☎ ${data.phone}</span>
        <span>📍 ${data.location}</span>
        <span>✉ ${data.email}</span>
      </div>
      <div class="section">
        <h2>About Me</h2>
        <p>${data.professionalSummary}</p>
      </div>
      <div class="section">
        <h2>Skills & Expertise</h2>
        <div class="skills-cloud">
          ${data.coreCompetencies.map((comp: string) => `<span class="skill-tag">${comp}</span>`).join('')}
        </div>
      </div>
      <div class="section">
        <h2>Work Experience</h2>
        ${data.employmentHistory.map((job: any) => `
          <div class="employment-entry">
            <div class="job-header">
              <div class="job-title">${job.title}</div>
              <div class="job-meta">${job.company} • ${job.location} • ${job.duration}</div>
            </div>
            <ul class="responsibilities">
              ${job.responsibilities.map((resp: string) => `<li>${resp}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
      <div class="section">
        <h2>Education</h2>
        ${data.education.map((edu: any) => `
          <div class="education-entry">
            <strong>${edu.degree}</strong><br>
            <span style="color: #7f8c8d; font-size: 9pt;">${edu.school} • ${edu.location} • ${edu.year}</span>
          </div>
        `).join('')}
      </div>
    `
  },
  {
    id: 'academic',
    name: 'Academic Scholar',
    description: 'Formal design for academic and research positions',
    styles: `
      @page { size: A4; margin: 0.3in; }
      body { font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: #000; margin: 0; padding: 0.3in; font-size: 11pt; background: white; }
      h1 { font-size: 22pt; margin: 0 0 4px 0; font-weight: normal; text-align: center; }
      .academic-title { text-align: center; font-style: italic; margin-bottom: 16px; font-size: 10pt; }
      h2 { font-size: 12pt; margin: 24px 0 10px 0; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 2px; page-break-after: avoid; }
      .contact-info { text-align: center; margin-bottom: 20px; font-size: 10pt; }
      .contact-info div { display: inline; margin: 0 8px; }
      .section { margin-bottom: 20px; page-break-inside: auto; }
      .competency-list { margin: 10px 0 10px 30px; }
      .competency-list li { margin: 4px 0; }
      .employment-entry { margin-bottom: 14px; page-break-inside: auto; }
      .position-title { font-weight: bold; }
      .institution { font-style: italic; }
      .date-location { font-size: 10pt; color: #444; margin: 2px 0 6px 0; }
      .responsibilities { margin: 6px 0 6px 25px; }
      .responsibilities li { margin: 3px 0; }
      .education-entry { margin-bottom: 10px; page-break-inside: avoid; }
      .degree { font-weight: bold; }
      p { margin: 10px 0; text-align: justify; text-indent: 20px; }
      @media print {
        body { margin: 0; padding: 0; }
        .section { page-break-inside: avoid; }
        h2 { page-break-after: avoid; }
      }
    `,
    getHTML: (data) => `
      <h1>${data.personalInfo.name || ''}</h1>
      ${data.personalInfo.title ? `<div style="font-size: 18pt; font-weight: 500; margin-bottom: 8px; text-align: center;">${data.personalInfo.title}</div>` : ''}
      <div class="academic-title">Curriculum Vitae</div>
      <div class="contact-info">
        <div>Tel: ${data.personalInfo.phone}</div> • 
        <div>${data.personalInfo.location}</div> • 
        <div>Email: ${data.personalInfo.email}</div>
      </div>
      <div class="section">
        <h2>PROFILE</h2>
        <p>${data.summary}</p>
      </div>
      <div class="section">
        <h2>SKILLS</h2>
        <ul class="competency-list">
          ${data.skills.technical.map((comp: string) => `<li>${comp}</li>`).join('')}
          ${data.skills.languages.map((lang: any) => `<li>${lang.name}${lang.level ? ` (${lang.level})` : ''}</li>`).join('')}
          ${data.skills.other.map((comp: string) => `<li>${comp}</li>`).join('')}
        </ul>
      </div>
      <div class="section">
        <h2>EXPERIENCE</h2>
        ${data.experience.map((job: any) => `
          <div class="employment-entry">
            <div class="position-title">${job.position}</div>
            <div class="institution">${job.company}</div>
            <div class="date-location">${job.startDate} - ${job.endDate} • ${job.location}</div>
            <ul class="responsibilities">
              ${job.description.map((resp: string) => `<li>${resp}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
      <div class="section">
        <h2>EDUCATION</h2>
        ${data.education.map((edu: any) => `
          <div class="education-entry">
            <div class="degree">${edu.degree}</div>
            <div class="institution">${edu.institution}</div>
            <div class="date-location">${edu.year} • ${edu.location}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</div>
          </div>
        `).join('')}
      </div>
      ${Array.isArray(data.projects) && data.projects.length > 0 ? `<div class="section"><h2>PROJECTS</h2>${data.projects.map((proj: any) => `<div class="education-entry"><strong>${proj.name}</strong><br>${proj.description}<br>Technologies: ${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : ''}${proj.link ? `<br>Link: <a href='${proj.link}'>${proj.link}</a>` : ''}</div>`).join('')}</div>` : ''}
    `
  },
  {
    id: 'minimalist-pro',
    name: 'Minimalist Professional',
    description: 'Ultra-clean design with maximum readability',
    styles: `
      @page { size: A4; margin: 0.3in; }
      body { font-family: Verdana, Geneva, sans-serif; line-height: 1.5; color: #222; margin: 0; padding: 0.3in; font-size: 10pt; background: white; }
      h1 { font-size: 26pt; margin: 0 0 10px 0; font-weight: 300; letter-spacing: 2px; }
      h2 { font-size: 11pt; margin: 25px 0 12px 0; font-weight: normal; text-transform: uppercase; letter-spacing: 3px; color: #555; page-break-after: avoid; }
      .contact-info { margin-bottom: 25px; font-size: 9pt; }
      .contact-info span { margin-right: 20px; }
      .section { margin-bottom: 25px; page-break-inside: auto; }
      .competency-list { margin: 12px 0; }
      .competency-list li { margin: 5px 0; padding-left: 15px; position: relative; }
      .competency-list li:before { content: "—"; position: absolute; left: 0; }
      .employment-entry { margin-bottom: 20px; page-break-inside: auto; }
      .job-header { margin-bottom: 8px; }
      .job-title { font-weight: 600; }
      .job-meta { font-size: 9pt; color: #666; margin-top: 2px; }
      .responsibilities { margin: 8px 0 8px 15px; }
      .responsibilities li { margin: 4px 0; }
      .education-entry { margin-bottom: 12px; page-break-inside: avoid; }
      p { margin: 12px 0; line-height: 1.7; }
      @media print {
        body { margin: 0; padding: 0; }
        .section { page-break-inside: avoid; }
        h2 { page-break-after: avoid; }
      }
    `,
    getHTML: (data) => `
      <h1>${data.personalInfo.name || ''}</h1>
      ${data.personalInfo.title ? `<div style="font-size: 18pt; font-weight: 500; margin-bottom: 8px; text-align: center;">${data.personalInfo.title}</div>` : ''}
      <div class="contact-info">
        <span>${data.personalInfo.phone}</span>
        <span>${data.personalInfo.location}</span>
        <span>${data.personalInfo.email}</span>
      </div>
      <div class="section">
        <h2>Summary</h2>
        <p>${data.summary}</p>
      </div>
      <div class="section">
        <h2>Skills</h2>
        <ul class="competency-list" style="list-style: none; padding: 0;">
          ${data.skills.technical.map((comp: string) => `<li>${comp}</li>`).join('')}
          ${data.skills.languages.map((lang: any) => `<li>${lang.name}${lang.level ? ` (${lang.level})` : ''}</li>`).join('')}
          ${data.skills.other.map((comp: string) => `<li>${comp}</li>`).join('')}
        </ul>
      </div>
      <div class="section">
        <h2>Experience</h2>
        ${data.experience.map((job: any) => `
          <div class="employment-entry">
            <div class="job-header">
              <div class="job-title">${job.position}</div>
              <div class="job-meta">${job.company} — ${job.location} — ${job.startDate} - ${job.endDate}</div>
            </div>
            <ul class="responsibilities">
              ${job.description.map((resp: string) => `<li>${resp}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
      <div class="section">
        <h2>Education</h2>
        ${data.education.map((edu: any) => `
          <div class="education-entry">
            <div style="font-weight: 600;">${edu.degree}</div>
            <div style="font-size: 9pt; color: #666;">${edu.institution} — ${edu.location} — ${edu.year}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</div>
          </div>
        `).join('')}
      </div>
      ${Array.isArray(data.projects) && data.projects.length > 0 ? `<div class="section"><h2>Projects</h2>${data.projects.map((proj: any) => `<div class="education-entry"><strong>${proj.name}</strong><br>${proj.description}<br>Technologies: ${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : ''}${proj.link ? `<br>Link: <a href='${proj.link}'>${proj.link}</a>` : ''}</div>`).join('')}</div>` : ''}
    `
  },
  {
    id: 'elegant-serif',
    name: 'Elegant Serif',
    description: 'Sophisticated design with refined typography',
    styles: `
      @page { size: A4; margin: 0.3in; }
      body { font-family: 'Georgia', Times, serif; line-height: 1.6; color: #2a2a2a; margin: 0; padding: 0.3in; font-size: 11pt; background: white; }
      h1 { font-size: 30pt; margin: 0 0 12px 0; font-weight: normal; color: #1a1a1a; text-align: center; letter-spacing: 1px; }
      .subtitle { text-align: center; font-style: italic; color: #666; margin-bottom: 20px; font-size: 10pt; }
      h2 { font-size: 13pt; margin: 22px 0 12px 0; font-weight: normal; color: #1a1a1a; border-bottom: 1px solid #ddd; padding-bottom: 5px; font-variant: small-caps; page-break-after: avoid; }
      .contact-info { text-align: center; margin-bottom: 25px; font-size: 10pt; }
      .contact-info span { margin: 0 12px; }
      .section { margin-bottom: 22px; page-break-inside: auto; }
      .competency-grid { columns: 2; column-gap: 30px; margin: 12px 0; }
      .competency-item { break-inside: avoid; margin-bottom: 6px; font-size: 10pt; }
      .employment-entry { margin-bottom: 18px; page-break-inside: auto; }
      .job-title { font-weight: 600; font-size: 11pt; }
      .job-details { font-style: italic; font-size: 10pt; color: #666; margin: 3px 0 8px 0; }
      .responsibilities { margin: 8px 0 8px 20px; }
      .responsibilities li { margin: 4px 0; font-size: 10pt; page-break-inside: avoid; }
      .education-entry { margin-bottom: 12px; page-break-inside: avoid; }
      p { margin: 12px 0; text-align: justify; }
      @media print {
        body { margin: 0; padding: 0; }
        .section { page-break-inside: avoid; }
        h2 { page-break-after: avoid; }
      }
    `,
    getHTML: (data) => `
      <h1>${data.personalInfo.name || ''}</h1>
      ${data.personalInfo.title ? `<div style="font-size: 18pt; font-weight: 500; margin-bottom: 8px; text-align: center;">${data.personalInfo.title}</div>` : ''}
      <div class="subtitle">Professional Profile</div>
      <div class="contact-info">
        <span>${data.personalInfo.phone}</span>
        <span>•</span>
        <span>${data.personalInfo.location}</span>
        <span>•</span>
        <span>${data.personalInfo.email}</span>
      </div>
      <div class="section">
        <h2>Executive Summary</h2>
        <p>${data.summary}</p>
      </div>
      <div class="section">
        <h2>Skills</h2>
        <div class="competency-grid">
          ${data.skills.technical.map((comp: string) => `<div class="competency-item">• ${comp}</div>`).join('')}
          ${data.skills.languages.map((lang: any) => `<div class="competency-item">${lang.name}${lang.level ? ` (${lang.level})` : ''}</div>`).join('')}
          ${data.skills.other.map((comp: string) => `<div class="competency-item">${comp}</div>`).join('')}
        </div>
      </div>
      <div class="section">
        <h2>Professional Experience</h2>
        ${data.experience.map((job: any) => `
          <div class="employment-entry">
            <div class="job-title">${job.position}</div>
            <div class="job-details">${job.company}, ${job.location} — ${job.startDate} - ${job.endDate}</div>
            <ul class="responsibilities">
              ${job.description.map((resp: string) => `<li>${resp}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
      <div class="section">
        <h2>Education</h2>
        ${data.education.map((edu: any) => `
          <div class="education-entry">
            <div style="font-weight: 600;">${edu.degree}</div>
            <div style="font-style: italic; font-size: 10pt; color: #666;">${edu.institution}, ${edu.location} — ${edu.year}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</div>
          </div>
        `).join('')}
      </div>
      ${Array.isArray(data.projects) && data.projects.length > 0 ? `<div class="section"><h2>Projects</h2>${data.projects.map((proj: any) => `<div class="education-entry"><strong>${proj.name}</strong><br>${proj.description}<br>Technologies: ${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : ''}${proj.link ? `<br>Link: <a href='${proj.link}'>${proj.link}</a>` : ''}</div>`).join('')}</div>` : ''}
    `
  },
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    description: 'Professional corporate design with blue accents',
    styles: `
      @page { size: A4; margin: 0.3in; }
      body { font-family: Verdana, Geneva, sans-serif; line-height: 1.5; color: #333; margin: 0; padding: 0.3in; font-size: 10pt; background: white; }
      h1 { font-size: 28pt; margin: 0 0 10px 0; font-weight: bold; color: #003366; }
      .title-bar { background: #003366; color: white; padding: 8px 12px; margin-bottom: 20px; font-size: 9pt; }
      h2 { font-size: 12pt; margin: 20px 0 10px 0; font-weight: bold; color: #003366; border-left: 4px solid #003366; padding-left: 10px; page-break-after: avoid; }
      .contact-info { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 9pt; }
      .section { margin-bottom: 20px; page-break-inside: avoid; }
      .summary-box { background: #f0f4f8; padding: 12px; border-radius: 4px; margin: 12px 0; }
      .competency-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin: 10px 0; }
      .competency-item { padding: 4px 0; font-size: 9pt; }
      .competency-item:before { content: "▪ "; color: #003366; }
      .employment-entry { margin-bottom: 16px; page-break-inside: avoid; }
      .job-title { font-weight: bold; color: #003366; font-size: 10.5pt; }
      .company-details { font-size: 9pt; color: #666; margin: 2px 0 6px 0; }
      .responsibilities { margin: 6px 0 6px 20px; }
      .responsibilities li { margin: 3px 0; }
      .education-entry { margin-bottom: 10px; page-break-inside: avoid; }
      p { margin: 10px 0; }
      @media print {
        body { margin: 0; padding: 0; }
        .section { page-break-inside: avoid; }
        h2 { page-break-after: avoid; }
      }
    `,
    getHTML: (data) => `
      <h1>${data.personalInfo.name || ''}</h1>
      ${data.personalInfo.title ? `<div style="font-size: 18pt; font-weight: 500; margin-bottom: 8px; text-align: center;">${data.personalInfo.title}</div>` : ''}
      <div class="title-bar">
        ${data.personalInfo.phone} | ${data.personalInfo.location} | ${data.personalInfo.email}
      </div>
      <div class="summary-box">
        <strong>PROFILE</strong>
        <p style="margin-top: 8px;">${data.summary}</p>
      </div>
      <div class="section">
        <h2>SKILLS</h2>
        <div class="competency-list">
          ${data.skills.technical.map((comp: string) => `<div class="competency-item">${comp}</div>`).join('')}
          ${data.skills.languages.map((lang: any) => `<div class="competency-item">${lang.name}${lang.level ? ` (${lang.level})` : ''}</div>`).join('')}
          ${data.skills.other.map((comp: string) => `<div class="competency-item">${comp}</div>`).join('')}
        </div>
      </div>
      <div class="section">
        <h2>EXPERIENCE</h2>
        ${data.experience.map((job: any) => `
          <div class="employment-entry">
            <div class="job-title">${job.position}</div>
            <div class="company-details">${job.company} | ${job.location} | ${job.startDate} - ${job.endDate}</div>
            <ul class="responsibilities">
              ${job.description.map((resp: string) => `<li>${resp}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
      <div class="section">
        <h2>EDUCATION</h2>
        ${data.education.map((edu: any) => `
          <div class="education-entry">
            <strong>${edu.degree}</strong><br>
            <span style="font-size: 9pt; color: #666;">${edu.institution}, ${edu.location} (${edu.year}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''})</span>
          </div>
        `).join('')}
      </div>
      ${Array.isArray(data.projects) && data.projects.length > 0 ? `<div class="section"><h2>PROJECTS</h2>${data.projects.map((proj: any) => `<div class="education-entry"><strong>${proj.name}</strong><br>${proj.description}<br>Technologies: ${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : ''}${proj.link ? `<br>Link: <a href='${proj.link}'>${proj.link}</a>` : ''}</div>`).join('')}</div>` : ''}
    `
  },
  {
    id: 'tech-modern',
    name: 'Tech Modern',
    description: 'Modern tech-focused design for IT professionals',
    styles: `
      @page { size: A4; margin: 0.3in; }
      body { font-family: Verdana, Geneva, sans-serif; line-height: 1.5; color: #2c3e50; margin: 0; padding: 0.3in; font-size: 10pt; background: white; }
      h1 { font-size: 32pt; margin: 0 0 8px 0; font-weight: 300; color: #16a085; letter-spacing: -1px; }
      .tech-tag { display: inline-block; background: #16a085; color: white; padding: 4px 10px; font-size: 9pt; margin-bottom: 20px; }
      h2 { font-size: 11pt; margin: 20px 0 10px 0; font-weight: bold; color: #16a085; text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px solid #16a085; padding-bottom: 4px; page-break-after: avoid; }
      .contact-bar { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; padding: 10px; background: #e8f8f5; font-size: 9pt; }
      .section { margin-bottom: 20px; page-break-inside: avoid; }
      .tech-skills { display: flex; flex-wrap: wrap; gap: 6px; margin: 10px 0; }
      .skill-badge { background: #2c3e50; color: #1abc9c; padding: 4px 10px; font-size: 9pt; border-radius: 3px; }
      .employment-entry { margin-bottom: 16px; page-break-inside: avoid; border-left: 3px solid #16a085; padding-left: 12px; }
      .job-title { font-weight: bold; color: #2c3e50; font-size: 10.5pt; }
      .job-info { font-size: 9pt; color: #7f8c8d; margin: 2px 0 6px 0; }
      .responsibilities { margin: 6px 0; }
      .responsibilities li { margin: 3px 0; }
      .responsibilities li:before { content: "→ "; color: #16a085; }
      .education-entry { margin-bottom: 10px; page-break-inside: avoid; }
      ul { list-style: none; padding-left: 0; }
      p { margin: 10px 0; }
      @media print {
        body { margin: 0; padding: 0; }
        .section { page-break-inside: avoid; }
        h2 { page-break-after: avoid; }
      }
    `,
    getHTML: (data) => `
      <h1>${data.personalInfo.name || ''}</h1>
      ${data.personalInfo.title ? `<div class="tech-tag" style="font-size: 18pt; font-weight: 500; margin-bottom: 8px; text-align: center;">${data.personalInfo.title}</div>` : ''}
      <div class="contact-bar">
        <div>📱 ${data.personalInfo.phone}</div>
        <div>📍 ${data.personalInfo.location}</div>
        <div>📧 ${data.personalInfo.email}</div>
      </div>
      <div class="section">
        <h2>Profile</h2>
        <p>${data.summary}</p>
      </div>
      <div class="section">
        <h2>Technical Skills</h2>
        <div class="tech-skills">
          ${data.skills.technical.map((comp: string) => `<span class="skill-badge">${comp}</span>`).join('')}
          ${data.skills.languages.map((lang: any) => `<span class="skill-badge">${lang.name}${lang.level ? ` (${lang.level})` : ''}</span>`).join('')}
          ${data.skills.other.map((comp: string) => `<span class="skill-badge">${comp}</span>`).join('')}
        </div>
      </div>
      <div class="section">
        <h2>Experience</h2>
        ${data.experience.map((job: any) => `
          <div class="employment-entry">
            <div class="job-title">${job.position}</div>
            <div class="job-info">${job.company} | ${job.location} | ${job.startDate} - ${job.endDate}</div>
            <ul class="responsibilities">
              ${job.description.map((resp: string) => `<li>${resp}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
      <div class="section">
        <h2>Education</h2>
        ${data.education.map((edu: any) => `
          <div class="education-entry">
            <strong>${edu.degree}</strong><br>
            <span style="color: #7f8c8d; font-size: 9pt;">${edu.institution} | ${edu.location} | ${edu.year}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</span>
          </div>
        `).join('')}
      </div>
      ${Array.isArray(data.projects) && data.projects.length > 0 ? `<div class="section"><h2>Projects</h2>${data.projects.map((proj: any) => `<div class="education-entry"><strong>${proj.name}</strong><br>${proj.description}<br>Technologies: ${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : ''}${proj.link ? `<br>Link: <a href='${proj.link}'>${proj.link}</a>` : ''}</div>`).join('')}</div>` : ''}
    `
  },
  {
    id: 'gradient-modern',
    name: 'Gradient Modern',
    description: 'Contemporary design with gradient accents',
    styles: `
      @page { size: A4; margin: 0.3in; }
      body { font-family: Verdana, Geneva, sans-serif; line-height: 1.6; color: #2d3436; margin: 0; padding: 0.3in; font-size: 10pt; background: white; }
      h1 { font-size: 34pt; margin: 0 0 12px 0; font-weight: bold; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
      .contact-gradient { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 15px; margin-bottom: 20px; border-radius: 8px; font-size: 9pt; }
      .contact-gradient span { margin-right: 20px; }
      h2 { font-size: 12pt; margin: 22px 0 12px 0; font-weight: bold; color: #667eea; text-transform: uppercase; letter-spacing: 1px; page-break-after: avoid; }
      .section { margin-bottom: 22px; page-break-inside: avoid; }
      .highlight-summary { background: linear-gradient(135deg, #f5f3ff 0%, #faf5ff 100%); padding: 12px; border-radius: 6px; margin: 12px 0; }
      .skills-flex { display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0; }
      .skill-pill { background: white; border: 2px solid #667eea; color: #667eea; padding: 4px 12px; border-radius: 20px; font-size: 9pt; font-weight: 600; }
      .employment-entry { margin-bottom: 18px; page-break-inside: avoid; position: relative; padding-left: 20px; }
      .employment-entry:before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: linear-gradient(180deg, #667eea 0%, #764ba2 100%); }
      .job-title { font-weight: bold; color: #2d3436; font-size: 11pt; }
      .job-meta { font-size: 9pt; color: #636e72; margin: 3px 0 8px 0; }
      .responsibilities { margin: 8px 0; }
      .responsibilities li { margin: 4px 0; }
      .education-entry { margin-bottom: 12px; page-break-inside: avoid; }
      p { margin: 12px 0; }
      @media print {
        body { margin: 0; padding: 0; }
        .section { page-break-inside: avoid; }
        h2 { page-break-after: avoid; }
      }
    `,
    getHTML: (data) => `
      <h1>${data.personalInfo.name || ''}</h1>
      ${data.personalInfo.title ? `<div style="font-size: 18pt; font-weight: 500; margin-bottom: 8px; text-align: center;">${data.personalInfo.title}</div>` : ''}
      <div class="contact-gradient">
        <span>📞 ${data.personalInfo.phone}</span>
        <span>📍 ${data.personalInfo.location}</span>
        <span>✉️ ${data.personalInfo.email}</span>
      </div>
      <div class="highlight-summary">
        <strong style="color: #667eea;">SUMMARY</strong>
        <p style="margin-top: 8px;">${data.summary}</p>
      </div>
      <div class="section">
        <h2>Skills & Expertise</h2>
        <div class="skills-flex">
          ${data.skills.technical.map((comp: string) => `<span class="skill-pill">${comp}</span>`).join('')}
          ${data.skills.languages.map((lang: any) => `<span class="skill-pill">${lang.name}${lang.level ? ` (${lang.level})` : ''}</span>`).join('')}
          ${data.skills.other.map((comp: string) => `<span class="skill-pill">${comp}</span>`).join('')}
        </div>
      </div>
      <div class="section">
        <h2>Experience</h2>
        ${data.experience.map((job: any) => `
          <div class="employment-entry">
            <div class="job-title">${job.position}</div>
            <div class="job-meta">${job.company} • ${job.location} • ${job.startDate} - ${job.endDate}</div>
            <ul class="responsibilities">
              ${job.description.map((resp: string) => `<li>${resp}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
      <div class="section">
        <h2>Education</h2>
        ${data.education.map((edu: any) => `
          <div class="education-entry">
            <strong style="color: #667eea;">${edu.degree}</strong><br>
            <span style="color: #636e72; font-size: 9pt;">${edu.institution} • ${edu.location} • ${edu.year}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</span>
          </div>
        `).join('')}
      </div>
      ${Array.isArray(data.projects) && data.projects.length > 0 ? `<div class="section"><h2>Projects</h2>${data.projects.map((proj: any) => `<div class="education-entry"><strong>${proj.name}</strong><br>${proj.description}<br>Technologies: ${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : ''}${proj.link ? `<br>Link: <a href='${proj.link}'>${proj.link}</a>` : ''}</div>`).join('')}</div>` : ''}
    `
  },
  {
    id: 'swiss-design',
    name: 'Swiss Design',
    description: 'Clean Swiss-inspired typography and layout',
    styles: `
      @page { size: A4; margin: 0.3in; }
      body { font-family: Verdana, Geneva, sans-serif; line-height: 1.4; color: #000; margin: 0; padding: 0.3in; font-size: 10pt; background: white; }
      h1 { font-size: 36pt; margin: 0 0 4px 0; font-weight: bold; letter-spacing: -2px; }
      .red-accent { color: #e74c3c; }
      h2 { font-size: 10pt; margin: 30px 0 15px 0; font-weight: bold; text-transform: uppercase; letter-spacing: 4px; color: #e74c3c; page-break-after: avoid; }
      .contact-grid { display: grid; grid-template-columns: repeat(3, 1fr); margin-bottom: 30px; font-size: 9pt; }
      .section { margin-bottom: 30px; page-break-inside: avoid; }
      .summary { font-size: 11pt; line-height: 1.6; margin: 15px 0; }
      .skills-minimal { margin: 15px 0; }
      .skill-line { display: flex; padding: 3px 0; font-size: 9pt; }
      .skill-bullet { color: #e74c3c; margin-right: 10px; }
      .employment-entry { margin-bottom: 20px; page-break-inside: avoid; }
      .job-header { display: grid; grid-template-columns: 1fr auto; gap: 20px; margin-bottom: 8px; }
      .job-title { font-weight: bold; font-size: 10pt; }
      .job-date { font-size: 9pt; color: #666; text-align: right; }
      .job-company { font-size: 9pt; margin-bottom: 8px; }
      .responsibilities { margin: 8px 0 8px 0; }
      .responsibilities li { margin: 3px 0; font-size: 9.5pt; }
      .education-entry { margin-bottom: 12px; page-break-inside: avoid; }
      p { margin: 12px 0; }
      @media print {
        body { margin: 0; padding: 0; }
        .section { page-break-inside: avoid; }
        h2 { page-break-after: avoid; }
      }
    `,
    getHTML: (data) => `
      <h1>${data.name.split(' ')[0]} <span class="red-accent">${data.name.split(' ').slice(1).join(' ')}</span></h1>
      <div class="contact-grid">
        <div>${data.phone}</div>
        <div>${data.location}</div>
        <div>${data.email}</div>
      </div>
      <div class="section">
        <h2>Profile</h2>
        <div class="summary">${data.professionalSummary}</div>
      </div>
      <div class="section">
        <h2>Skills</h2>
        <div class="skills-minimal">
          ${data.coreCompetencies.map((comp: string) => `<div class="skill-line"><span class="skill-bullet">+</span><span>${comp}</span></div>`).join('')}
        </div>
      </div>
      <div class="section">
        <h2>Experience</h2>
        ${data.employmentHistory.map((job: any) => `
          <div class="employment-entry">
            <div class="job-header">
              <div class="job-title">${job.title}</div>
              <div class="job-date">${job.duration}</div>
            </div>
            <div class="job-company">${job.company}, ${job.location}</div>
            <ul class="responsibilities">
              ${job.responsibilities.map((resp: string) => `<li>${resp}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
      <div class="section">
        <h2>Education</h2>
        ${data.education.map((edu: any) => `
          <div class="education-entry">
            <strong>${edu.degree}</strong><br>
            <span style="font-size: 9pt;">${edu.school}, ${edu.location} (${edu.year})</span>
          </div>
        `).join('')}
      </div>
    `
  },
  {
    id: 'newspaper-style',
    name: 'Newspaper Style',
    description: 'Classic newspaper-inspired layout',
    styles: `
      @page { size: A4; margin: 0.3in; }
      body { font-family: 'Times New Roman', Times, serif; line-height: 1.4; color: #000; margin: 0; padding: 0.3in; font-size: 10pt; background: white; }
      .masthead { border-top: 3px solid #000; border-bottom: 1px solid #000; padding: 10px 0; margin-bottom: 20px; }
      h1 { font-size: 42pt; margin: 0; font-weight: bold; text-align: center; letter-spacing: -1px; }
      .edition-info { text-align: center; font-size: 8pt; margin-top: 5px; text-transform: uppercase; letter-spacing: 2px; }
      h2 { font-size: 14pt; margin: 20px 0 10px 0; font-weight: bold; border-bottom: 2px solid #000; padding-bottom: 2px; page-break-after: avoid; }
      .contact-banner { background: #000; color: white; padding: 8px; margin-bottom: 20px; font-size: 9pt; text-align: center; }
      .contact-banner span { margin: 0 15px; }
      .section { margin-bottom: 20px; page-break-inside: avoid; }
      .lead-paragraph { font-size: 11pt; line-height: 1.5; margin: 10px 0; font-weight: 600; }
      .column-layout { columns: 2; column-gap: 20px; margin: 10px 0; }
      .competency-item { break-inside: avoid; margin-bottom: 4px; font-size: 9pt; }
      .employment-entry { margin-bottom: 16px; page-break-inside: avoid; }
      .headline { font-size: 12pt; font-weight: bold; margin-bottom: 4px; }
      .byline { font-size: 9pt; font-style: italic; margin-bottom: 6px; }
      .article-body { text-align: justify; }
      .article-body li { margin: 3px 0; }
      .education-entry { margin-bottom: 10px; page-break-inside: avoid; }
      p { margin: 10px 0; text-align: justify; }
      @media print {
        body { margin: 0; padding: 0; }
        .section { page-break-inside: avoid; }
        h2 { page-break-after: avoid; }
      }
    `,
    getHTML: (data) => `
      <div class="masthead">
        <h1>${data.name}</h1>
        <div class="edition-info">Curriculum Vitae • Professional Edition</div>
      </div>
      <div class="contact-banner">
        <span>☎ ${data.phone}</span>
        <span>📍 ${data.location}</span>
        <span>✉ ${data.email}</span>
      </div>
      <div class="section">
        <h2>PROFILE</h2>
        <p class="lead-paragraph">${data.professionalSummary}</p>
      </div>
      <div class="section">
        <h2>COMPETENCIES</h2>
        <div class="column-layout">
          ${data.coreCompetencies.map((comp: string) => `<div class="competency-item">• ${comp}</div>`).join('')}
        </div>
      </div>
      <div class="section">
        <h2>CAREER CHRONICLE</h2>
        ${data.employmentHistory.map((job: any) => `
          <div class="employment-entry">
            <div class="headline">${job.title}</div>
            <div class="byline">${job.company} • ${job.location} • ${job.duration}</div>
            <ul class="article-body">
              ${job.responsibilities.map((resp: string) => `<li>${resp}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
      <div class="section">
        <h2>EDUCATION</h2>
        ${data.education.map((edu: any) => `
          <div class="education-entry">
            <strong>${edu.degree}</strong><br>
            ${edu.school}, ${edu.location} (${edu.year})
          </div>
        `).join('')}
      </div>
    `
  },
  {
    id: 'material-design',
    name: 'Material Design',
    description: 'Google Material Design inspired CV',
    styles: `
      @page { size: A4; margin: 0.3in; }
      body { font-family: Verdana, Geneva, sans-serif; line-height: 1.5; color: #212121; margin: 0; padding: 0.3in; font-size: 10pt; background: white; }
      h1 { font-size: 34pt; margin: 0 0 8px 0; font-weight: 300; color: #3f51b5; }
      .material-card { background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 16px; margin-bottom: 16px; border-radius: 4px; }
      h2 { font-size: 12pt; margin: 0 0 12px 0; font-weight: 500; color: #3f51b5; text-transform: uppercase; letter-spacing: 1px; page-break-after: avoid; }
      .contact-chips { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
      .chip { background: #e8eaf6; color: #3f51b5; padding: 6px 12px; border-radius: 16px; font-size: 9pt; }
      .section { margin-bottom: 20px; page-break-inside: avoid; }
      .fab-accent { background: #ff4081; color: white; padding: 12px; border-radius: 4px; margin: 12px 0; }
      .skill-tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 12px 0; }
      .skill-tag { background: #f5f5f5; padding: 6px 12px; border-radius: 4px; font-size: 9pt; border: 1px solid #e0e0e0; }
      .employment-entry { margin-bottom: 16px; page-break-inside: avoid; }
      .job-title { font-weight: 500; color: #212121; font-size: 11pt; }
      .job-subtitle { font-size: 9pt; color: #757575; margin: 2px 0 8px 0; }
      .responsibilities { margin: 8px 0 8px 16px; }
      .responsibilities li { margin: 4px 0; }
      .education-entry { margin-bottom: 12px; page-break-inside: avoid; }
      p { margin: 12px 0; }
      @media print {
        body { margin: 0; padding: 0; }
        .material-card { box-shadow: none; border: 1px solid #e0e0e0; }
        .section { page-break-inside: avoid; }
        h2 { page-break-after: avoid; }
      }
    `,
    getHTML: (data) => `
      <h1>${data.name}</h1>
      <div class="contact-chips">
        <span class="chip">${data.phone}</span>
        <span class="chip">${data.location}</span>
        <span class="chip">${data.email}</span>
      </div>
      <div class="material-card">
        <h2>About</h2>
        <p>${data.professionalSummary}</p>
      </div>
      <div class="material-card">
        <h2>Skills</h2>
        <div class="skill-tags">
          ${data.coreCompetencies.map((comp: string) => `<span class="skill-tag">${comp}</span>`).join('')}
        </div>
      </div>
      <div class="material-card">
        <h2>Experience</h2>
        ${data.employmentHistory.map((job: any) => `
          <div class="employment-entry">
            <div class="job-title">${job.title}</div>
            <div class="job-subtitle">${job.company} • ${job.location} • ${job.duration}</div>
            <ul class="responsibilities">
              ${job.responsibilities.map((resp: string) => `<li>${resp}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
      <div class="material-card">
        <h2>Education</h2>
        ${data.education.map((edu: any) => `
          <div class="education-entry">
            <div style="font-weight: 500;">${edu.degree}</div>
            <div style="font-size: 9pt; color: #757575;">${edu.school} • ${edu.location} • ${edu.year}</div>
          </div>
        `).join('')}
      </div>
    `
  },
  {
    id: 'canadian-federal-ca',
    name: 'Canadian Federal CA',
    description: 'Canadian government style CV format',
    styles: `
      @page { size: A4; margin: 0.3in; }
      body { font-family: Verdana, Geneva, sans-serif; line-height: 1.5; color: #000; margin: 0; padding: 0.3in; font-size: 11pt; background: white; }
      h1 { font-size: 24pt; margin: 0 0 12px 0; font-weight: bold; text-align: center; }
      .personal-info { border: 1px solid #000; padding: 10px; margin-bottom: 20px; }
      .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 10pt; }
      h2 { font-size: 13pt; margin: 24px 0 12px 0; font-weight: bold; background: #f0f0f0; padding: 6px; page-break-after: avoid; }
      .section { margin-bottom: 20px; page-break-inside: avoid; }
      .objective { font-style: italic; margin: 12px 0; padding: 10px; background: #fafafa; }
      .qualification-list { margin: 10px 0 10px 20px; }
      .qualification-list li { margin: 6px 0; }
      .employment-entry { margin-bottom: 18px; page-break-inside: avoid; border-bottom: 1px solid #ddd; padding-bottom: 12px; }
      .position-block { margin-bottom: 8px; }
      .position-title { font-weight: bold; font-size: 11pt; }
      .classification { font-size: 10pt; color: #666; margin-left: 10px; }
      .employer-info { font-size: 10pt; margin: 4px 0; }
      .date-range { font-size: 10pt; font-weight: bold; margin: 4px 0; }
      .responsibilities { margin: 8px 0 8px 25px; }
      .responsibilities li { margin: 4px 0; }
      .education-entry { margin-bottom: 14px; page-break-inside: avoid; }
      .certification-section { margin-top: 10px; padding: 10px; background: #f9f9f9; }
      .language-proficiency { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 10px 0; }
      .references { margin-top: 20px; padding: 10px; border: 1px solid #000; text-align: center; font-style: italic; }
      p { margin: 10px 0; text-align: justify; }
      @media print {
        body { margin: 0; padding: 0; }
        .section { page-break-inside: avoid; }
        h2 { page-break-after: avoid; }
      }
    `,
    getHTML: (data) => `
      <h1>${data.name}</h1>
      <div class="personal-info">
        <div class="info-grid">
          <div><strong>Telephone:</strong> ${data.phone}</div>
          <div><strong>Email:</strong> ${data.email}</div>
          <div><strong>Address:</strong> ${data.location}</div>
          <div><strong>Citizenship:</strong> Canadian</div>
        </div>
      </div>
      <div class="section">
        <h2>CAREER OBJECTIVE</h2>
        <div class="objective">${data.professionalSummary}</div>
      </div>
      <div class="section">
        <h2>QUALIFICATIONS SUMMARY</h2>
        <ul class="qualification-list">
          ${data.coreCompetencies.map((comp: string) => `<li>${comp}</li>`).join('')}
        </ul>
      </div>
      <div class="section">
        <h2>EMPLOYMENT HISTORY</h2>
        ${data.employmentHistory.map((job: any) => `
          <div class="employment-entry">
            <div class="position-block">
              <span class="position-title">${job.title}</span>
            </div>
            <div class="employer-info"><strong>Employer:</strong> ${job.company}, ${job.location}</div>
            <div class="date-range"><strong>Duration:</strong> ${job.duration}</div>
            <div style="margin-top: 8px;"><strong>Key Responsibilities and Achievements:</strong></div>
            <ul class="responsibilities">
              ${job.responsibilities.map((resp: string) => `<li>${resp}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
      <div class="section">
        <h2>EDUCATION</h2>
        ${data.education.map((edu: any) => `
          <div class="education-entry">
            <div><strong>${edu.degree}</strong></div>
            <div>${edu.school}, ${edu.location}</div>
            <div>Year Completed: ${edu.year}</div>
          </div>
        `).join('')}
      </div>
      <div class="certification-section">
        <strong>Security Clearance:</strong> Available upon request<br>
        <strong>Language Proficiency:</strong> English (Fluent), French (Functional)
      </div>
      <div class="references">
        <strong>REFERENCES AVAILABLE UPON REQUEST</strong>
      </div>
    `
  },
  {
    id: 'toronto-professional-ca',
    name: 'Toronto Professional CA',
    description: 'Toronto business district style Canadian CV',
    styles: `
      @page { size: A4; margin: 0.3in; }
      body { font-family: Verdana, Geneva, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0.3in; font-size: 10.5pt; background: white; }
      .header-maple { background: linear-gradient(90deg, #ff0000 0%, #ff6b6b 100%); color: white; padding: 20px; margin: -0.3in -0.3in 20px -0.3in; }
      h1 { font-size: 30pt; margin: 0 0 8px 0; font-weight: bold; color: white; }
      .contact-header { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; font-size: 9pt; margin-top: 10px; }
      h2 { font-size: 12pt; margin: 24px 0 12px 0; font-weight: bold; color: #cc0000; border-bottom: 2px solid #cc0000; padding-bottom: 4px; page-break-after: avoid; }
      .section { margin-bottom: 22px; page-break-inside: avoid; }
      .profile-box { background: #fff5f5; padding: 12px; border-left: 4px solid #cc0000; margin: 15px 0; }
      .skills-ontario { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 12px 0; }
      .skill-item { padding: 6px; background: white; border: 1px solid #cc0000; font-size: 9.5pt; }
      .employment-entry { margin-bottom: 18px; page-break-inside: avoid; }
      .job-title-ca { font-weight: bold; color: #1a1a1a; font-size: 11pt; }
      .company-ca { font-size: 10pt; color: #666; margin: 2px 0; }
      .location-date { font-size: 9.5pt; color: #888; margin: 2px 0 8px 0; }
      .achievements { margin: 8px 0 8px 20px; }
      .achievements li { margin: 4px 0; }
      .education-entry { margin-bottom: 14px; page-break-inside: avoid; }
      .volunteer-section { background: #f9f9f9; padding: 12px; margin: 15px 0; border-radius: 4px; }
      .canadian-note { text-align: center; font-style: italic; margin-top: 20px; padding: 10px; background: #fff5f5; font-size: 9pt; }
      p { margin: 12px 0; }
      @media print {
        body { margin: 0; padding: 0; }
        .header-maple { background: #cc0000; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        .section { page-break-inside: avoid; }
        h2 { page-break-after: avoid; }
      }
    `,
    getHTML: (data) => `
      <div class="header-maple">
        <h1>${data.name}</h1>
        <div class="contact-header">
          <div>📞 ${data.phone}</div>
          <div>📍 ${data.location}, ON, Canada</div>
          <div>✉️ ${data.email}</div>
        </div>
      </div>
      <div class="profile-box">
        <strong>PROFESSIONAL PROFILE</strong>
        <p style="margin-top: 8px;">${data.professionalSummary}</p>
      </div>
      <div class="section">
        <h2>CORE COMPETENCIES</h2>
        <div class="skills-ontario">
          ${data.coreCompetencies.map((comp: string) => `<div class="skill-item">• ${comp}</div>`).join('')}
        </div>
      </div>
      <div class="section">
        <h2>PROFESSIONAL EXPERIENCE</h2>
        ${data.employmentHistory.map((job: any) => `
          <div class="employment-entry">
            <div class="job-title-ca">${job.title}</div>
            <div class="company-ca">${job.company}</div>
            <div class="location-date">${job.location} | ${job.duration}</div>
            <ul class="achievements">
              ${job.responsibilities.map((resp: string) => `<li>${resp}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
      <div class="section">
        <h2>EDUCATION & TRAINING</h2>
        ${data.education.map((edu: any) => `
          <div class="education-entry">
            <strong>${edu.degree}</strong><br>
            ${edu.school}, ${edu.location}<br>
            <span style="font-size: 9pt; color: #666;">Graduated: ${edu.year}</span>
          </div>
        `).join('')}
      </div>
      <div class="volunteer-section">
        <strong>VOLUNTEER EXPERIENCE & COMMUNITY INVOLVEMENT</strong>
        <p style="margin-top: 8px; font-size: 9.5pt;">Active participant in professional development and community initiatives</p>
      </div>
      <div class="canadian-note">
        Authorized to work in Canada • References available upon request
      </div>
    `
  },
  {
    id: 'vancouver-tech-ca',
    name: 'Vancouver Tech CA',
    description: 'West Coast Canadian tech industry CV',
    styles: `
      @page { size: A4; margin: 0.3in; }
      body { font-family: Verdana, Geneva, sans-serif; line-height: 1.6; color: #2c3e50; margin: 0; padding: 0.3in; font-size: 10pt; background: white; }
      .pacific-header { background: linear-gradient(135deg, #0081a7 0%, #00afb9 100%); color: white; padding: 15px; margin-bottom: 20px; border-radius: 8px; }
      h1 { font-size: 32pt; margin: 0 0 8px 0; font-weight: 300; color: white; letter-spacing: 1px; }
      .tech-title { font-size: 11pt; opacity: 0.95; margin-bottom: 12px; }
      .contact-vancouver { display: flex; gap: 20px; font-size: 9pt; }
      h2 { font-size: 12pt; margin: 22px 0 12px 0; font-weight: 600; color: #0081a7; text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px solid #00afb9; padding-bottom: 4px; page-break-after: avoid; }
      .section { margin-bottom: 22px; page-break-inside: avoid; }
      .tech-summary { background: #f0fdf4; padding: 12px; border-radius: 6px; margin: 15px 0; }
      .tech-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 12px 0; }
      .tech-badge { background: #2c3e50; color: #00afb9; padding: 5px 10px; font-size: 9pt; border-radius: 4px; text-align: center; }
      .employment-entry { margin-bottom: 18px; page-break-inside: avoid; border-left: 3px solid #00afb9; padding-left: 15px; }
      .startup-title { font-weight: bold; color: #2c3e50; font-size: 11pt; }
      .company-tech { font-size: 9.5pt; color: #0081a7; margin: 2px 0; }
      .period-location { font-size: 9pt; color: #7f8c8d; margin: 2px 0 8px 0; }
      .achievements-tech { margin: 8px 0; }
      .achievements-tech li { margin: 4px 0; }
      .achievements-tech li:before { content: "▶ "; color: #00afb9; }
      .education-entry { margin-bottom: 14px; page-break-inside: avoid; }
      .bc-note { background: linear-gradient(135deg, #f0fdf4 0%, #e6f7ff 100%); padding: 12px; margin-top: 20px; border-radius: 6px; text-align: center; font-size: 9pt; }
      ul { list-style: none; padding-left: 0; }
      p { margin: 12px 0; }
      @media print {
        body { margin: 0; padding: 0; }
        .pacific-header { background: #0081a7; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        .section { page-break-inside: avoid; }
        h2 { page-break-after: avoid; }
      }
    `,
    getHTML: (data) => `
      <div class="pacific-header">
        <h1>${data.name}</h1>
        <div class="tech-title">Technology Professional • Innovation Leader • Vancouver, BC</div>
        <div class="contact-vancouver">
          <span>📱 ${data.phone}</span>
          <span>📍 ${data.location}, BC, Canada</span>
          <span>💼 ${data.email}</span>
        </div>
      </div>
      <div class="tech-summary">
        <strong style="color: #0081a7;">PROFESSIONAL SUMMARY</strong>
        <p style="margin-top: 8px;">${data.professionalSummary}</p>
      </div>
      <div class="section">
        <h2>Technical Stack</h2>
        <div class="tech-grid">
          ${data.coreCompetencies.map((comp: string) => `<div class="tech-badge">${comp}</div>`).join('')}
        </div>
      </div>
      <div class="section">
        <h2>Professional Experience</h2>
        ${data.employmentHistory.map((job: any) => `
          <div class="employment-entry">
            <div class="startup-title">${job.title}</div>
            <div class="company-tech">${job.company}</div>
            <div class="period-location">${job.duration} • ${job.location}</div>
            <ul class="achievements-tech">
              ${job.responsibilities.map((resp: string) => `<li>${resp}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
      <div class="section">
        <h2>Education</h2>
        ${data.education.map((edu: any) => `
          <div class="education-entry">
            <strong style="color: #0081a7;">${edu.degree}</strong><br>
            ${edu.school}, ${edu.location}<br>
            <span style="font-size: 9pt; color: #7f8c8d;">Completed: ${edu.year}</span>
          </div>
        `).join('')}
      </div>
      <div class="bc-note">
        <strong>Work Authorization:</strong> Canadian Citizen / Permanent Resident<br>
        <strong>Location Preference:</strong> Vancouver Metro Area / Remote<br>
        <strong>References:</strong> Available upon request
      </div>
    `
  },
  {
    id: 'montreal-bilingual-ca',
    name: 'Montreal Bilingual CA',
    description: 'Bilingual Quebec-style Canadian CV',
    styles: `
      @page { size: A4; margin: 0.3in; }
      body { font-family: Verdana, Geneva, sans-serif; line-height: 1.5; color: #1a1a1a; margin: 0; padding: 0.3in; font-size: 10.5pt; background: white; }
      .quebec-header { background: linear-gradient(90deg, #003f88 0%, #0066cc 100%); color: white; padding: 20px; margin: -0.3in -0.3in 20px -0.3in; position: relative; }
      .fleur-de-lis { position: absolute; right: 20px; top: 20px; font-size: 30pt; opacity: 0.3; }
      h1 { font-size: 28pt; margin: 0 0 8px 0; font-weight: bold; color: white; }
      .bilingual-subtitle { font-size: 10pt; margin-bottom: 12px; opacity: 0.95; }
      .contact-montreal { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; font-size: 9pt; }
      h2 { font-size: 12pt; margin: 24px 0 12px 0; font-weight: bold; color: #003f88; text-transform: uppercase; padding: 6px; background: #f0f4f8; page-break-after: avoid; }
      .section { margin-bottom: 22px; page-break-inside: avoid; }
      .profile-bilingual { background: white; border: 2px solid #003f88; padding: 12px; margin: 15px 0; }
      .language-proficiency { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 15px 0; padding: 12px; background: #f8f9fa; }
      .language-skill { font-size: 10pt; }
      .competencies-qc { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 12px 0; }
      .competency-qc { padding: 6px 10px; background: white; border-left: 3px solid #003f88; font-size: 9.5pt; }
      .employment-entry { margin-bottom: 18px; page-break-inside: avoid; }
      .position-qc { font-weight: bold; color: #003f88; font-size: 11pt; }
      .entreprise { font-size: 10pt; color: #555; margin: 2px 0; }
      .periode { font-size: 9.5pt; color: #777; margin: 2px 0 8px 0; }
      .realisations { margin: 8px 0 8px 20px; }
      .realisations li { margin: 4px 0; }
      .education-entry { margin-bottom: 14px; page-break-inside: avoid; }
      .quebec-footer { text-align: center; margin-top: 20px; padding: 12px; background: #f0f4f8; font-size: 9pt; }
      p { margin: 12px 0; text-align: justify; }
      @media print {
        body { margin: 0; padding: 0; }
        .quebec-header { background: #003f88; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        .section { page-break-inside: avoid; }
        h2 { page-break-after: avoid; }
      }
    `,
    getHTML: (data) => `
      <div class="quebec-header">
        <span class="fleur-de-lis">⚜</span>
        <h1>${data.name}</h1>
        <div class="bilingual-subtitle">Professionnel Bilingue • Bilingual Professional</div>
        <div class="contact-montreal">
          <div>☎ ${data.phone}</div>
          <div>📍 ${data.location}, QC, Canada</div>
          <div>✉ ${data.email}</div>
        </div>
      </div>
      <div class="profile-bilingual">
        <strong>PROFIL PROFESSIONNEL / PROFESSIONAL PROFILE</strong>
        <p style="margin-top: 8px;">${data.professionalSummary}</p>
      </div>
      <div class="language-proficiency">
        <div class="language-skill">
          <strong>Langues / Languages:</strong><br>
          Français: Avancé<br>
          English: Advanced
        </div>
        <div class="language-skill">
          <strong>Compétences linguistiques:</strong><br>
          Communication écrite et orale<br>
          Written and verbal communication
        </div>
      </div>
      <div class="section">
        <h2>Compétences Clés / Key Skills</h2>
        <div class="competencies-qc">
          ${data.coreCompetencies.map((comp: string) => `<div class="competency-qc">• ${comp}</div>`).join('')}
        </div>
      </div>
      <div class="section">
        <h2>Expérience Professionnelle / Work Experience</h2>
        ${data.employmentHistory.map((job: any) => `
          <div class="employment-entry">
            <div class="position-qc">${job.title}</div>
            <div class="entreprise">${job.company}, ${job.location}</div>
            <div class="periode">${job.duration}</div>
            <ul class="realisations">
              ${job.responsibilities.map((resp: string) => `<li>${resp}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
      <div class="section">
        <h2>Formation / Education</h2>
        ${data.education.map((edu: any) => `
          <div class="education-entry">
            <strong>${edu.degree}</strong><br>
            ${edu.school}, ${edu.location}<br>
            <span style="font-size: 9pt; color: #777;">Année: ${edu.year}</span>
          </div>
        `).join('')}
      </div>
      <div class="quebec-footer">
        <strong>Autorisation de travail:</strong> Citoyen canadien / Canadian Citizen<br>
        <strong>Références disponibles sur demande / References available upon request</strong>
      </div>
    `
  },
  {
    id: 'calgary-energy-ca',
    name: 'Calgary Energy CA',
    description: 'Alberta energy sector Canadian CV',
    styles: `
      @page { size: A4; margin: 0.3in; }
      body { font-family: Verdana, Geneva, sans-serif; line-height: 1.5; color: #1a1a1a; margin: 0; padding: 0.3in; font-size: 10.5pt; background: white; }
      .alberta-header { background: linear-gradient(135deg, #d4a574 0%, #8b4513 100%); color: white; padding: 20px; margin-bottom: 20px; }
      h1 { font-size: 30pt; margin: 0 0 10px 0; font-weight: bold; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
      .energy-subtitle { font-size: 11pt; margin-bottom: 15px; }
      .contact-calgary { display: flex; justify-content: space-between; font-size: 9pt; background: rgba(0,0,0,0.2); padding: 8px; }
      h2 { font-size: 13pt; margin: 24px 0 12px 0; font-weight: bold; color: #8b4513; border-bottom: 3px solid #d4a574; padding-bottom: 4px; page-break-after: avoid; }
      .section { margin-bottom: 22px; page-break-inside: avoid; }
      .executive-summary { background: #faf0e6; padding: 15px; border-left: 5px solid #8b4513; margin: 15px 0; }
      .competency-oil { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 12px 0; }
      .competency-badge { background: white; border: 2px solid #d4a574; padding: 8px; font-size: 9.5pt; text-align: center; }
      .employment-entry { margin-bottom: 20px; page-break-inside: avoid; background: #fafafa; padding: 12px; border-radius: 4px; }
      .position-energy { font-weight: bold; color: #8b4513; font-size: 11pt; }
      .company-oil { font-size: 10pt; color: #666; margin: 3px 0; }
      .period-alberta { font-size: 9.5pt; color: #888; margin: 2px 0 10px 0; }
      .achievements-energy { margin: 8px 0 8px 20px; }
      .achievements-energy li { margin: 5px 0; }
      .achievements-energy li:before { content: "◆ "; color: #d4a574; }
      .education-entry { margin-bottom: 14px; page-break-inside: avoid; }
      .certifications { background: #f5f5f5; padding: 12px; margin: 15px 0; }
      .alberta-footer { text-align: center; margin-top: 20px; padding: 12px; background: #faf0e6; font-size: 9pt; border: 1px solid #d4a574; }
      ul { list-style: none; padding-left: 0; }
      p { margin: 12px 0; }
      @media print {
        body { margin: 0; padding: 0; }
        .alberta-header { background: #8b4513; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        .section { page-break-inside: avoid; }
        h2 { page-break-after: avoid; }
      }
    `,
    getHTML: (data) => `
      <div class="alberta-header">
        <h1>${data.name}</h1>
        <div class="energy-subtitle">Energy Sector Professional • Calgary, Alberta</div>
        <div class="contact-calgary">
          <span>📞 ${data.phone}</span>
          <span>📍 ${data.location}, AB, Canada</span>
          <span>✉️ ${data.email}</span>
        </div>
      </div>
      <div class="executive-summary">
        <strong>EXECUTIVE SUMMARY</strong>
        <p style="margin-top: 10px;">${data.professionalSummary}</p>
      </div>
      <div class="section">
        <h2>CORE COMPETENCIES</h2>
        <div class="competency-oil">
          ${data.coreCompetencies.map((comp: string) => `<div class="competency-badge">${comp}</div>`).join('')}
        </div>
      </div>
      <div class="section">
        <h2>PROFESSIONAL EXPERIENCE</h2>
        ${data.employmentHistory.map((job: any) => `
          <div class="employment-entry">
            <div class="position-energy">${job.title}</div>
            <div class="company-oil">${job.company}</div>
            <div class="period-alberta">${job.location} • ${job.duration}</div>
            <strong style="font-size: 10pt;">Key Achievements & Responsibilities:</strong>
            <ul class="achievements-energy">
              ${job.responsibilities.map((resp: string) => `<li>${resp}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
      <div class="section">
        <h2>EDUCATION & PROFESSIONAL DEVELOPMENT</h2>
        ${data.education.map((edu: any) => `
          <div class="education-entry">
            <strong>${edu.degree}</strong><br>
            ${edu.school}, ${edu.location}<br>
            <span style="font-size: 9pt; color: #888;">Graduation: ${edu.year}</span>
          </div>
        `).join('')}
      </div>
      <div class="certifications">
        <strong>PROFESSIONAL CERTIFICATIONS & MEMBERSHIPS</strong>
        <p style="margin-top: 8px; font-size: 9.5pt;">
          • Professional Engineer (P.Eng.) - APEGA<br>
          • Project Management Professional (PMP)<br>
          • Safety Training Certifications
        </p>
      </div>
      <div class="alberta-footer">
        <strong>Work Authorization:</strong> Canadian Citizen<br>
        <strong>Availability:</strong> Immediate<br>
        <strong>References:</strong> Available upon request
      </div>
    `
  }
];