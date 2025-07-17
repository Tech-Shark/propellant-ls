import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

interface CVData {
    personalInfo: {
        name: string;
        title: string;
        email: string;
        phone: string;
        location: string;
        website?: string;
        linkedin?: string;
        github?: string;
        photo?: string;
    };
    summary: string;
    experience: Array<{
        position: string;
        company: string;
        location: string;
        startDate: string;
        endDate: string;
        description: string[];
    }>;
    education: Array<{
        degree: string;
        institution: string;
        location: string;
        year: string;
        gpa?: string;
    }>;
    skills: {
        technical: string[];
        languages: Array<{ name: string; level: string }>;
        other: string[];
    };
    projects?: Array<{
        name: string;
        description: string;
        technologies: string[];
        link?: string;
    }>;
}

const defaultData: CVData = {
    personalInfo: {
        name: "John Anderson",
        title: "Senior Software Developer",
        email: "john.anderson@email.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        website: "www.johnanderson.dev",
        linkedin: "linkedin.com/in/johnanderson",
        github: "github.com/johnanderson",
    },
    summary:
        "Experienced software developer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable solutions and leading development teams in fast-paced environments.",
    experience: [
        {
            position: "Senior Software Developer",
            company: "TechCorp Inc.",
            location: "San Francisco, CA",
            startDate: "Jan 2021",
            endDate: "Present",
            description: [
                "Led development of microservices architecture serving 100K+ daily active users",
                "Implemented CI/CD pipelines reducing deployment time by 60%",
                "Mentored 3 junior developers and conducted code reviews",
                "Collaborated with product team to define technical requirements",
            ],
        },
        {
            position: "Software Developer",
            company: "StartupXYZ",
            location: "Palo Alto, CA",
            startDate: "Jun 2019",
            endDate: "Dec 2020",
            description: [
                "Built responsive web applications using React and TypeScript",
                "Developed RESTful APIs with Node.js and Express",
                "Integrated third-party services and payment gateways",
                "Optimized application performance improving load times by 40%",
            ],
        },
        {
            position: "Junior Developer",
            company: "Digital Solutions LLC",
            location: "San Jose, CA",
            startDate: "Aug 2018",
            endDate: "May 2019",
            description: [
                "Maintained and updated legacy codebases",
                "Assisted in database design and optimization",
                "Participated in agile development processes",
            ],
        },
    ],
    education: [
        {
            degree: "Bachelor of Science in Computer Science",
            institution: "University of California, Berkeley",
            location: "Berkeley, CA",
            year: "2018",
            gpa: "3.8/4.0",
        },
    ],
    skills: {
        technical: [
            "JavaScript/TypeScript",
            "React/Next.js",
            "Node.js/Express",
            "Python",
            "PostgreSQL/MongoDB",
            "AWS/Docker",
            "Git/GitHub",
        ],
        languages: [
            { name: "English", level: "Native" },
            { name: "Spanish", level: "Conversational" },
            { name: "French", level: "Basic" },
        ],
        other: [
            "Agile/Scrum",
            "Team Leadership",
            "Code Review",
            "System Design",
            "API Design",
        ],
    },
    projects: [
        {
            name: "E-commerce Platform",
            description:
                "Full-stack e-commerce solution with real-time inventory management",
            technologies: ["React", "Node.js", "PostgreSQL", "Redis"],
            link: "github.com/johnanderson/ecommerce",
        },
        {
            name: "Task Management App",
            description: "Collaborative task management tool with real-time updates",
            technologies: ["Next.js", "TypeScript", "Prisma", "Socket.io"],
            link: "taskmanager.johnanderson.dev",
        },
    ],
};

interface CVTemplateProps {
    data?: Partial<CVData>;
    className?: string;
}

export default function CVTemplate({ data, className = "" }: CVTemplateProps) {
    const cvData = { ...defaultData, ...data };

    return (
        <div className={`max-w-4xl mx-auto bg-white shadow-2xl ${className}`}>
            {/* Header Section */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-bold mb-2">
                            {cvData.personalInfo.name}
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-300 mb-4">
                            {cvData.personalInfo.title}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span>{cvData.personalInfo.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>{cvData.personalInfo.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{cvData.personalInfo.location}</span>
                            </div>
                            {cvData.personalInfo.website && (
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    <span>{cvData.personalInfo.website}</span>
                                </div>
                            )}
                            {cvData.personalInfo.linkedin && (
                                <div className="flex items-center gap-2">
                                    <Linkedin className="w-4 h-4" />
                                    <span>{cvData.personalInfo.linkedin}</span>
                                </div>
                            )}
                            {cvData.personalInfo.github && (
                                <div className="flex items-center gap-2">
                                    <Github className="w-4 h-4" />
                                    <span>{cvData.personalInfo.github}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8">
                {/* Professional Summary */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b-2 border-slate-200 pb-2">
                        Professional Summary
                    </h2>
                    <p className="text-slate-700 leading-relaxed">{cvData.summary}</p>
                </section>

                {/* Professional Experience */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b-2 border-slate-200 pb-2">
                        Professional Experience
                    </h2>
                    <div className="space-y-6">
                        {cvData.experience.map((exp, index) => (
                            <div key={index} className="border-l-4 border-slate-300 pl-6">
                                <div className="mb-2">
                                    <h3 className="text-xl font-semibold text-slate-800">
                                        {exp.position}
                                    </h3>
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4">
                                        <p className="text-lg text-slate-600 font-medium">
                                            {exp.company} • {exp.location}
                                        </p>
                                        <p className="text-sm text-slate-500 font-medium">
                                            {exp.startDate} - {exp.endDate}
                                        </p>
                                    </div>
                                </div>
                                <ul className="space-y-2 text-slate-700">
                                    {exp.description.map((desc, i) => (
                                        <li key={i} className="flex items-center">
                                            <span className="text-slate-400 mr-2">•</span>
                                            <span>{desc}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Education */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b-2 border-slate-200 pb-2">
                        Education
                    </h2>
                    <div className="space-y-4">
                        {cvData.education.map((edu, index) => (
                            <div key={index} className="border-l-4 border-slate-300 pl-6">
                                <h3 className="text-lg font-semibold text-slate-800">
                                    {edu.degree}
                                </h3>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <p className="text-slate-600">
                                        {edu.institution} • {edu.location}
                                    </p>
                                    <p className="text-sm text-slate-500 font-medium">
                                        {edu.year}
                                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Skills */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b-2 border-slate-200 pb-2">
                        Skills
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-3">
                                Technical Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {cvData.skills.technical.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-3">
                                Languages
                            </h3>
                            <div className="space-y-2">
                                {cvData.skills.languages.map((lang, index) => (
                                    <div key={index} className="flex justify-between">
                                        <span className="text-slate-700">{lang.name}</span>
                                        <span className="text-slate-500 text-sm">{lang.level}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-3">
                                Other Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {cvData.skills.other.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Projects */}
                {cvData.projects && cvData.projects.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b-2 border-slate-200 pb-2">
                            Notable Projects
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {cvData.projects.map((project, index) => (
                                <div
                                    key={index}
                                    className="border border-slate-200 rounded-lg p-4"
                                >
                                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                        {project.name}
                                    </h3>
                                    <p className="text-slate-700 mb-3 text-sm">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {project.technologies.map((tech, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-1 bg-slate-50 text-slate-600 rounded text-xs"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                    {project.link && (
                                        <a
                                            href={`https://${project.link}`}
                                            className="text-slate-600 hover:text-slate-800 text-sm underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View Project
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
