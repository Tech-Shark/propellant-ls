import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Calendar,
  ExternalLink,
  Award,
  GraduationCap,
  User,
  Briefcase,
} from "lucide-react";
import CVTemplate from "@/components/CVTemplates/CVTemplate.tsx";
import CVTemplate1 from "@/components/CVTemplates/CVTemplate1.tsx";
import CVTemplate2 from "@/components/CVTemplates/CVTemplate2.tsx";
import CVTemplate3 from "@/components/CVTemplates/CVTemplate3.tsx";
import ProCVTemplate1 from "@/components/CVTemplates/ProCVTemplate1.tsx";
import ProCVTemplate2 from "@/components/CVTemplates/ProCVTemplate2.tsx";
import ProCVTemplate3 from "@/components/CVTemplates/ProCVTemplate3.tsx";

export enum SkillLevel {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
  EXPERT = "Expert",
}

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
  title: string;
  isCurrentRole: boolean;
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade: string;
  description: string;
}

export interface Certification {
  name: string;
  issuer: string;
  dateIssued: string;
  credentialId: string;
  credentialUrl: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  project: string;
  link: string;
}

export interface CV {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  professionalTitle?: string;
  professionalSummary?: string;
  address?: string;
  github?: string;
  portfolio?: string;
  website?: string;
  languages?: string[];
  hobbies?: string[];
  achievements?: string[];
  skills?: Skill[];
  workExperience?: WorkExperience[];
  education?: Education[];
  certifications?: Certification[];
  projects?: Project[];
}

const defaultCV: CV = {
  firstName: "Sarah",
  lastName: "Johnson",
  phone: "+1 (555) 987-6543",
  email: "sarah.johnson@email.com",
  professionalTitle: "Full Stack Developer",
  professionalSummary:
    "Passionate full-stack developer with 4+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies with a strong focus on user experience and performance optimization.",
  address: "New York, NY",
  github: "github.com/sarahjohnson",
  portfolio: "sarahjohnson.dev",
  website: "www.sarahjohnson.dev",
  languages: [
    "English (Native)",
    "Spanish (Fluent)",
    "French (Conversational)",
  ],
  hobbies: [
    "Photography",
    "Rock Climbing",
    "Open Source Contributing",
    "Tech Blogging",
  ],
  achievements: [
    "Led team of 5 developers to deliver project 2 weeks ahead of schedule",
    "Reduced application load time by 65% through optimization",
    "Contributed to 3 major open-source projects with 10K+ stars",
    "Speaker at ReactConf 2023",
  ],
  skills: [
    { name: "JavaScript/TypeScript", level: SkillLevel.EXPERT },
    { name: "React/Next.js", level: SkillLevel.EXPERT },
    { name: "Node.js", level: SkillLevel.ADVANCED },
    { name: "Python", level: SkillLevel.INTERMEDIATE },
    { name: "PostgreSQL", level: SkillLevel.ADVANCED },
    { name: "AWS", level: SkillLevel.INTERMEDIATE },
    { name: "Docker", level: SkillLevel.ADVANCED },
    { name: "GraphQL", level: SkillLevel.INTERMEDIATE },
  ],
  workExperience: [
    {
      company: "TechFlow Inc.",
      position: "Senior Full Stack Developer",
      title: "Senior Full Stack Developer",
      startDate: "2022-03",
      endDate: "",
      isCurrentRole: true,
      location: "New York, NY",
      description:
        "Lead development of customer-facing web applications serving 50K+ users daily. Architect and implement microservices using Node.js and React. Collaborate with product team to define technical roadmap and mentor junior developers.",
    },
    {
      company: "StartupHub",
      position: "Full Stack Developer",
      title: "Full Stack Developer",
      startDate: "2020-06",
      endDate: "2022-02",
      isCurrentRole: false,
      location: "San Francisco, CA",
      description:
        "Built responsive web applications using React and Express.js. Implemented real-time features using WebSocket connections. Integrated third-party APIs and payment processing systems.",
    },
    {
      company: "CodeCraft Solutions",
      position: "Frontend Developer",
      title: "Frontend Developer",
      startDate: "2019-01",
      endDate: "2020-05",
      isCurrentRole: false,
      location: "Remote",
      description:
        "Developed modern, responsive user interfaces using React and Vue.js. Collaborated with UX/UI designers to implement pixel-perfect designs. Optimized application performance and accessibility.",
    },
  ],
  education: [
    {
      institution: "New York University",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2015-09",
      endDate: "2019-05",
      grade: "3.7 GPA",
      description:
        "Relevant coursework: Data Structures, Algorithms, Database Systems, Software Engineering, Computer Networks",
    },
  ],
  certifications: [
    {
      name: "AWS Certified Developer - Associate",
      issuer: "Amazon Web Services",
      dateIssued: "2023-08",
      credentialId: "AWS-DA-2023-001",
      credentialUrl: "https://aws.amazon.com/verification",
    },
    {
      name: "React Developer Certification",
      issuer: "Meta",
      dateIssued: "2022-11",
      credentialId: "META-REACT-2022-456",
      credentialUrl: "https://developers.facebook.com/certification",
    },
  ],
  projects: [
    {
      name: "EcoTracker",
      description:
        "Full-stack application for tracking personal carbon footprint with data visualization and goal setting features",
      technologies: ["React", "Node.js", "PostgreSQL", "Chart.js"],
      project: "Personal environmental tracking app",
      link: "https://ecotracker.sarahjohnson.dev",
    },
    {
      name: "TaskFlow",
      description:
        "Real-time collaborative task management platform with live updates and team communication",
      technologies: ["Next.js", "Socket.io", "MongoDB", "Tailwind CSS"],
      project: "Team collaboration tool",
      link: "https://taskflow.sarahjohnson.dev",
    },
    {
      name: "CryptoPortfolio",
      description:
        "Cryptocurrency portfolio tracker with real-time price updates and performance analytics",
      technologies: ["Vue.js", "Express.js", "Redis", "CoinGecko API"],
      project: "Investment tracking application",
      link: "https://crypto.sarahjohnson.dev",
    },
  ],
};

const getSkillLevelColor = (level: SkillLevel): string => {
  switch (level) {
    case SkillLevel.EXPERT:
      return "bg-emerald-500";
    case SkillLevel.ADVANCED:
      return "bg-blue-500";
    case SkillLevel.INTERMEDIATE:
      return "bg-amber-500";
    case SkillLevel.BEGINNER:
      return "bg-gray-400";
    default:
      return "bg-gray-400";
  }
};

const getSkillLevelWidth = (level: SkillLevel): string => {
  switch (level) {
    case SkillLevel.EXPERT:
      return "w-full";
    case SkillLevel.ADVANCED:
      return "w-3/4";
    case SkillLevel.INTERMEDIATE:
      return "w-1/2";
    case SkillLevel.BEGINNER:
      return "w-1/4";
    default:
      return "w-1/4";
  }
};

interface ModernCVTemplateProps {
  data?: Partial<CV>;
  className?: string;
}

export default function ModernCVTemplate({
  data,
  className = "",
}: ModernCVTemplateProps) {
  const cvData = { ...defaultCV, ...data };

  return (
      <>
        <ProCVTemplate1 />
      </>
    // <div
    //   className={`max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden ${className} p-2 sm:p-4`}
    //   style={{ zoom: "0.85" }}
    // >
    //   <div className="grid grid-cols-1 lg:grid-cols-3 min-h-screen">
    //     {/* Sidebar */}
    //     <div className="lg:col-span-1 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white p-8">
    //       <div className="space-y-8">
    //         {/* Profile Section */}
    //         <div className="text-center">
    //           <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
    //             <User className="w-16 h-16 text-white/80" />
    //           </div>
    //           <h1 className="text-3xl font-bold mb-2">
    //             {cvData.firstName} {cvData.lastName}
    //           </h1>
    //           <p className="text-lg text-white/90 font-medium">
    //             {cvData.professionalTitle}
    //           </p>
    //         </div>
    //
    //         {/* Contact Info */}
    //         <div className="space-y-4">
    //           <h2 className="text-xl font-semibold border-b border-white/30 pb-2">
    //             Contact
    //           </h2>
    //           <div className="space-y-3 text-sm">
    //             {cvData.email && (
    //               <div className="flex items-center gap-3">
    //                 <Mail className="w-4 h-4 text-white/70" />
    //                 <span className="break-all">{cvData.email}</span>
    //               </div>
    //             )}
    //             {cvData.phone && (
    //               <div className="flex items-center gap-3">
    //                 <Phone className="w-4 h-4 text-white/70" />
    //                 <span>{cvData.phone}</span>
    //               </div>
    //             )}
    //             {cvData.address && (
    //               <div className="flex items-center gap-3">
    //                 <MapPin className="w-4 h-4 text-white/70" />
    //                 <span>{cvData.address}</span>
    //               </div>
    //             )}
    //             {cvData.website && (
    //               <div className="flex items-center gap-3">
    //                 <Globe className="w-4 h-4 text-white/70" />
    //                 <span className="break-all">{cvData.website}</span>
    //               </div>
    //             )}
    //             {cvData.github && (
    //               <div className="flex items-center gap-3">
    //                 <Github className="w-4 h-4 text-white/70" />
    //                 <span className="break-all">{cvData.github}</span>
    //               </div>
    //             )}
    //           </div>
    //         </div>
    //
    //         {/* Skills */}
    //         {cvData.skills && cvData.skills.length > 0 && (
    //           <div className="space-y-4">
    //             <h2 className="text-xl font-semibold border-b border-white/30 pb-2">
    //               Skills
    //             </h2>
    //             <div className="space-y-4">
    //               {cvData.skills.map((skill, index) => (
    //                 <div key={index}>
    //                   <div className="flex justify-between items-center mb-1">
    //                     <span className="text-sm font-medium">
    //                       {skill.name}
    //                     </span>
    //                     <span className="text-xs text-white/70">
    //                       {skill.level}
    //                     </span>
    //                   </div>
    //                   <div className="w-full bg-white/20 rounded-full h-2">
    //                     <div
    //                       className={`h-2 rounded-full ${getSkillLevelColor(
    //                         skill.level
    //                       )} ${getSkillLevelWidth(skill.level)}`}
    //                     ></div>
    //                   </div>
    //                 </div>
    //               ))}
    //             </div>
    //           </div>
    //         )}
    //
    //         {/* Languages */}
    //         {cvData.languages && cvData.languages.length > 0 && (
    //           <div className="space-y-4">
    //             <h2 className="text-xl font-semibold border-b border-white/30 pb-2">
    //               Languages
    //             </h2>
    //             <div className="space-y-2">
    //               {cvData.languages.map((language, index) => (
    //                 <div key={index} className="text-sm">
    //                   {language}
    //                 </div>
    //               ))}
    //             </div>
    //           </div>
    //         )}
    //
    //         {/* Hobbies */}
    //         {cvData.hobbies && cvData.hobbies.length > 0 && (
    //           <div className="space-y-4">
    //             <h2 className="text-xl font-semibold border-b border-white/30 pb-2">
    //               Interests
    //             </h2>
    //             <div className="flex flex-wrap gap-2">
    //               {cvData.hobbies.map((hobby, index) => (
    //                 <span
    //                   key={index}
    //                   className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium"
    //                 >
    //                   {hobby}
    //                 </span>
    //               ))}
    //             </div>
    //           </div>
    //         )}
    //       </div>
    //     </div>
    //
    //     {/* Main Content */}
    //     <div className="lg:col-span-2 p-8 space-y-8">
    //       {/* Professional Summary */}
    //       {cvData.professionalSummary && (
    //         <section>
    //           <div className="flex items-center gap-3 mb-4">
    //             <User className="w-6 h-6 text-indigo-600" />
    //             <h2 className="text-2xl font-bold text-gray-800">
    //               Professional Summary
    //             </h2>
    //           </div>
    //           <p className="text-gray-700 leading-relaxed text-lg">
    //             {cvData.professionalSummary}
    //           </p>
    //         </section>
    //       )}
    //
    //       {/* Work Experience */}
    //       {cvData.workExperience && cvData.workExperience.length > 0 && (
    //         <section>
    //           <div className="flex items-center gap-3 mb-6">
    //             <Briefcase className="w-6 h-6 text-indigo-600" />
    //             <h2 className="text-2xl font-bold text-gray-800">
    //               Work Experience
    //             </h2>
    //           </div>
    //           <div className="space-y-6">
    //             {cvData.workExperience.map((exp, index) => (
    //               <div key={index} className="relative pl-8 pb-6">
    //                 <div className="absolute left-0 top-0 w-4 h-4 bg-indigo-600 rounded-full"></div>
    //                 {index !== cvData.workExperience!.length - 1 && (
    //                   <div className="absolute left-2 top-4 w-0.5 bg-indigo-200 h-full"></div>
    //                 )}
    //                 <div className="bg-gray-50 rounded-lg p-6">
    //                   <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
    //                     <div>
    //                       <h3 className="text-xl font-semibold text-gray-800">
    //                         {exp.position}
    //                       </h3>
    //                       <p className="text-lg font-medium text-indigo-600">
    //                         {exp.company}
    //                       </p>
    //                       <p className="text-sm text-gray-600">
    //                         {exp.location}
    //                       </p>
    //                     </div>
    //                     <div className="flex items-center gap-2 text-sm text-gray-500 mt-2 md:mt-0">
    //                       <Calendar className="w-4 h-4" />
    //                       <span>
    //                         {exp.startDate} -{" "}
    //                         {exp.isCurrentRole ? "Present" : exp.endDate}
    //                       </span>
    //                       {exp.isCurrentRole && (
    //                         <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
    //                           Current
    //                         </span>
    //                       )}
    //                     </div>
    //                   </div>
    //                   <p className="text-gray-700 leading-relaxed">
    //                     {exp.description}
    //                   </p>
    //                 </div>
    //               </div>
    //             ))}
    //           </div>
    //         </section>
    //       )}
    //
    //       {/* Education */}
    //       {cvData.education && cvData.education.length > 0 && (
    //         <section>
    //           <div className="flex items-center gap-3 mb-6">
    //             <GraduationCap className="w-6 h-6 text-indigo-600" />
    //             <h2 className="text-2xl font-bold text-gray-800">Education</h2>
    //           </div>
    //           <div className="space-y-4">
    //             {cvData.education.map((edu, index) => (
    //               <div key={index} className="bg-gray-50 rounded-lg p-6">
    //                 <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
    //                   <div>
    //                     <h3 className="text-lg font-semibold text-gray-800">
    //                       {edu.degree} in {edu.fieldOfStudy}
    //                     </h3>
    //                     <p className="text-indigo-600 font-medium">
    //                       {edu.institution}
    //                     </p>
    //                   </div>
    //                   <div className="text-sm text-gray-500 mt-2 md:mt-0">
    //                     <div className="flex items-center gap-2">
    //                       <Calendar className="w-4 h-4" />
    //                       <span>
    //                         {edu.startDate} - {edu.endDate}
    //                       </span>
    //                     </div>
    //                     {edu.grade && (
    //                       <p className="text-right mt-1">{edu.grade}</p>
    //                     )}
    //                   </div>
    //                 </div>
    //                 {edu.description && (
    //                   <p className="text-gray-700 text-sm">{edu.description}</p>
    //                 )}
    //               </div>
    //             ))}
    //           </div>
    //         </section>
    //       )}
    //
    //       {/* Certifications */}
    //       {cvData.certifications && cvData.certifications.length > 0 && (
    //         <section>
    //           <div className="flex items-center gap-3 mb-6">
    //             <Award className="w-6 h-6 text-indigo-600" />
    //             <h2 className="text-2xl font-bold text-gray-800">
    //               Certifications
    //             </h2>
    //           </div>
    //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //             {cvData.certifications.map((cert, index) => (
    //               <div key={index} className="bg-gray-50 rounded-lg p-4">
    //                 <h3 className="font-semibold text-gray-800 mb-1">
    //                   {cert.name}
    //                 </h3>
    //                 <p className="text-indigo-600 text-sm font-medium">
    //                   {cert.issuer}
    //                 </p>
    //                 <p className="text-gray-500 text-xs mt-1">
    //                   {cert.dateIssued}
    //                 </p>
    //                 {cert.credentialUrl && (
    //                   <a
    //                     href={cert.credentialUrl}
    //                     className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 mt-2"
    //                     target="_blank"
    //                     rel="noopener noreferrer"
    //                   >
    //                     <ExternalLink className="w-3 h-3" />
    //                     View Credential
    //                   </a>
    //                 )}
    //               </div>
    //             ))}
    //           </div>
    //         </section>
    //       )}
    //
    //       {/* Projects */}
    //       {cvData.projects && cvData.projects.length > 0 && (
    //         <section>
    //           <div className="flex items-center gap-3 mb-6">
    //             <ExternalLink className="w-6 h-6 text-indigo-600" />
    //             <h2 className="text-2xl font-bold text-gray-800">
    //               Featured Projects
    //             </h2>
    //           </div>
    //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //             {cvData.projects.map((project, index) => (
    //               <div
    //                 key={index}
    //                 className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
    //               >
    //                 <h3 className="text-lg font-semibold text-gray-800 mb-2">
    //                   {project.name}
    //                 </h3>
    //                 <p className="text-gray-700 text-sm mb-3">
    //                   {project.description}
    //                 </p>
    //                 <div className="flex flex-wrap gap-2 mb-3">
    //                   {project.technologies.map((tech, i) => (
    //                     <span
    //                       key={i}
    //                       className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-medium"
    //                     >
    //                       {tech}
    //                     </span>
    //                   ))}
    //                 </div>
    //                 {project.link && (
    //                   <a
    //                     href={project.link}
    //                     className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
    //                     target="_blank"
    //                     rel="noopener noreferrer"
    //                   >
    //                     <ExternalLink className="w-4 h-4" />
    //                     View Project
    //                   </a>
    //                 )}
    //               </div>
    //             ))}
    //           </div>
    //         </section>
    //       )}
    //
    //       {/* Achievements */}
    //       {cvData.achievements && cvData.achievements.length > 0 && (
    //         <section>
    //           <div className="flex items-center gap-3 mb-6">
    //             <Award className="w-6 h-6 text-indigo-600" />
    //             <h2 className="text-2xl font-bold text-gray-800">
    //               Key Achievements
    //             </h2>
    //           </div>
    //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //             {cvData.achievements.map((achievement, index) => (
    //               <div key={index} className="flex items-start gap-3">
    //                 <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
    //                 <p className="text-gray-700">{achievement}</p>
    //               </div>
    //             ))}
    //           </div>
    //         </section>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
}
