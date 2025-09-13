import React from 'react';
import { CVData } from './CVData';

interface CVPreviewProps {
  data: CVData;
}

export default function CVPreview({ data }: CVPreviewProps) {
  const generateHTML = () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} - CV</title>
    <style>
        @page {
            size: A4;
            margin: 0.5in;
        }
        
        body {
            font-family: 'Times New Roman', Times, serif;
            line-height: 1.5;
            color: #000;
            margin: 0;
            padding: 0;
            font-size: 11pt;
        }
        
        .cv-container {
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0;
            background: white;
        }
        
        h1 {
            font-size: 24pt;
            margin: 0 0 8px 0;
            font-weight: bold;
            text-align: center;
        }
        
        h2 {
            font-size: 14pt;
            margin: 16px 0 8px 0;
            font-weight: bold;
            border-bottom: 2px solid #000;
            padding-bottom: 2px;
        }
        
        h3 {
            font-size: 11pt;
            margin: 8px 0 4px 0;
            font-weight: bold;
        }
        
        .contact-info {
            text-align: center;
            margin-bottom: 16px;
            font-size: 10pt;
        }
        
        .contact-info div {
            margin: 2px 0;
        }
        
        .section {
            margin-bottom: 16px;
        }
        
        .competency-list {
            margin: 8px 0;
            padding-left: 20px;
        }
        
        .competency-list li {
            margin: 4px 0;
        }
        
        .employment-entry {
            margin-bottom: 12px;
            page-break-inside: avoid;
        }
        
        .employment-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
        }
        
        .employment-header-left {
            flex: 1;
        }
        
        .employment-header-right {
            text-align: right;
            font-style: italic;
        }
        
        .responsibilities {
            margin: 4px 0 4px 20px;
        }
        
        .responsibilities li {
            margin: 2px 0;
        }
        
        .education-entry {
            margin-bottom: 8px;
            page-break-inside: avoid;
        }
        
        .education-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
        }
        
        p {
            margin: 8px 0;
            text-align: justify;
        }
        
        @media print {
            body {
                margin: 0;
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="cv-container">
        <h1>${data.name}</h1>
        <div class="contact-info">
            <div>Phone: ${data.phone}</div>
            <div>Location: ${data.location}</div>
            <div>Email: ${data.email}</div>
        </div>
        
        <div class="section">
            <h2>PROFESSIONAL SUMMARY</h2>
            <p>${data.professionalSummary}</p>
        </div>
        
        <div class="section">
            <h2>Core Competencies</h2>
            <ol class="competency-list">
                ${data.coreCompetencies.map((comp, index) => `<li>${comp}</li>`).join('')}
            </ol>
        </div>
        
        <div class="section">
            <h2>EMPLOYMENT HISTORY</h2>
            ${data.employmentHistory.map(job => `
                <div class="employment-entry">
                    <div class="employment-header">
                        <div class="employment-header-left">
                            <strong>${job.title}</strong>, ${job.company}.
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <em>${job.duration}</em>
                        <span>${job.location}</span>
                    </div>
                    <ul class="responsibilities">
                        ${job.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>
        
        <div class="section">
            <h2>EDUCATION</h2>
            ${data.education.map(edu => `
                <div class="education-entry">
                    <div class="education-header">
                        <div>${edu.year} - ${edu.location}</div>
                    </div>
                    <div>${edu.degree}</div>
                    <div><strong>${edu.school}</strong></div>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;
  };

  return (
    <div className="cv-preview-content bg-white shadow-lg" style={{ 
      width: '8.5in',
      minHeight: '11in',
      padding: '0.5in',
      margin: '0 auto',
      fontFamily: "'Times New Roman', Times, serif",
      fontSize: '11pt',
      lineHeight: '1.5',
      color: '#000'
    }}>
      <h1 style={{ 
        fontSize: '24pt', 
        fontWeight: 'bold', 
        textAlign: 'center',
        margin: '0 0 8px 0'
      }}>
        {data.name}
      </h1>
      
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '16px',
        fontSize: '10pt'
      }}>
        <div>Phone: {data.phone}</div>
        <div>Location: {data.location}</div>
        <div>Email: {data.email}</div>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ 
          fontSize: '14pt', 
          fontWeight: 'bold',
          borderBottom: '2px solid #000',
          paddingBottom: '2px',
          margin: '16px 0 8px 0'
        }}>
          PROFESSIONAL SUMMARY
        </h2>
        <p style={{ textAlign: 'justify', margin: '8px 0' }}>{data.professionalSummary}</p>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ 
          fontSize: '14pt', 
          fontWeight: 'bold',
          borderBottom: '2px solid #000',
          paddingBottom: '2px',
          margin: '16px 0 8px 0'
        }}>
          Core Competencies
        </h2>
        <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>
          {data.coreCompetencies.map((comp, index) => (
            <li key={index} style={{ margin: '4px 0' }}>{comp}</li>
          ))}
        </ol>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ 
          fontSize: '14pt', 
          fontWeight: 'bold',
          borderBottom: '2px solid #000',
          paddingBottom: '2px',
          margin: '16px 0 8px 0'
        }}>
          EMPLOYMENT HISTORY
        </h2>
        {data.employmentHistory.map((job, index) => (
          <div key={index} className="employment-entry" style={{ marginBottom: '12px' }}>
            <div style={{ marginBottom: '4px' }}>
              <strong>{job.title}</strong>, {job.company}.
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <em>{job.duration}</em>
              <span>{job.location}</span>
            </div>
            <ul style={{ margin: '4px 0 4px 20px' }}>
              {job.responsibilities.map((resp, rIndex) => (
                <li key={rIndex} style={{ margin: '2px 0' }}>{resp}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ 
          fontSize: '14pt', 
          fontWeight: 'bold',
          borderBottom: '2px solid #000',
          paddingBottom: '2px',
          margin: '16px 0 8px 0'
        }}>
          EDUCATION
        </h2>
        {data.education.map((edu, index) => (
          <div key={index} className="education-entry" style={{ marginBottom: '8px' }}>
            <div>{edu.year} - {edu.location}</div>
            <div>{edu.degree}</div>
            <div><strong>{edu.school}</strong></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { CVPreview };