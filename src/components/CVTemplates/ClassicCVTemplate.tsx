import React from "react";
import { UnifiedCVData } from "./interfaces/CVData";

interface ClassicCVTemplateProps {
  data: UnifiedCVData;
}

export const ClassicCVTemplate: React.FC<ClassicCVTemplateProps> = ({
  data,
}) => {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    certifications,
    projects,
  } = data;

  return (
    <div className="classic-cv">
      <div className="header">
        <h1>{personalInfo.name}</h1>
        <div className="contact-info">
          {personalInfo.email && <span>Email: {personalInfo.email}</span>}
          {personalInfo.phone && <span>Phone: {personalInfo.phone}</span>}
          {personalInfo.address && (
            <span>Location: {personalInfo.address}</span>
          )}
          {personalInfo.github && <span>GitHub: {personalInfo.github}</span>}
          {personalInfo.website && <span>Website: {personalInfo.website}</span>}
        </div>
      </div>

      {personalInfo.title && (
        <section>
          <h2>Professional Title</h2>
          <p>{personalInfo.title}</p>
        </section>
      )}

      {summary && (
        <section>
          <h2>Summary</h2>
          <p>{summary}</p>
        </section>
      )}

      {skills.technical.length > 0 && (
        <section>
          <h2>Skills</h2>
          <ul className="skills-list">
            {skills.technical.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
            {skills.languages.map((skill, index) => (
              <li key={`lang-${index}`}>{skill}</li>
            ))}
            {skills.other.map((skill, index) => (
              <li key={`other-${index}`}>{skill}</li>
            ))}
          </ul>
        </section>
      )}

      {experience.length > 0 && (
        <section>
          <h2>Experience</h2>
          {experience.map((job, index) => (
            <div key={index} className="experience-entry">
              <div className="job-header">
                <strong>{job.position}</strong>, {job.company}
              </div>
              <div className="job-meta">
                <span>
                  {job.startDate} -{" "}
                  {job.isCurrentRole ? "Present" : job.endDate}
                </span>
                {job.location && <span>{job.location}</span>}
              </div>
              <div className="job-description">
                {typeof job.description === "string" ? (
                  <p>{job.description}</p>
                ) : (
                  <ul>
                    {job.description.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section>
          <h2>Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="education-entry">
              <div>
                {edu.startDate} - {edu.endDate}
              </div>
              <div>
                {edu.degree} in {edu.fieldOfStudy}
              </div>
              <div>
                <strong>{edu.institution}</strong>
              </div>
              {edu.grade && <div>Grade: {edu.grade}</div>}
              {edu.description && <div>{edu.description}</div>}
            </div>
          ))}
        </section>
      )}

      {certifications.length > 0 && (
        <section>
          <h2>Certifications</h2>
          {certifications.map((cert, index) => (
            <div key={index} className="cert-entry">
              <strong>{cert.name}</strong> - {cert.issuer}
              <div>Issued: {cert.dateIssued}</div>
              {cert.credentialId && <div>ID: {cert.credentialId}</div>}
              {cert.credentialUrl && (
                <div>
                  URL: <a href={cert.credentialUrl}>{cert.credentialUrl}</a>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section>
          <h2>Projects</h2>
          {projects.map((proj, index) => (
            <div key={index} className="project-entry">
              <strong>{proj.name}</strong>
              <div>{proj.description}</div>
              {proj.technologies.length > 0 && (
                <div>Technologies: {proj.technologies.join(", ")}</div>
              )}
              {proj.link && (
                <div>
                  Link: <a href={proj.link}>{proj.link}</a>
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default ClassicCVTemplate;
