export interface CVData {
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

export const defaultCVData: CVData = {
  personalInfo: {
    name: "Udechukwu Ikenna Kingsley",
    title: "Managing Director",
    email: "udechukwulkenna1@gmail.com",
    phone: "+234 810 076-0505 / +1 437 551-8404",
    location: "Owerri, Imo State, Nigeria (relocating as required)",
    website: undefined,
    linkedin: undefined,
    github: undefined,
    photo: undefined,
  },
  summary: "A truck driver and ops leader, I've spent over 20 years in construction, moving materials, and keeping vehicles running. Experienced with construction tools and forklift operations, focused on doing things right, and serious about safety. Ready to help in infrastructure projects and sustainable construction with my work ethic and attention to detail.",
  experience: [
    {
      position: "Managing Director",
      company: "KingKennas Global Services",
      location: "Owerri, Nigeria",
      startDate: "2000",
      endDate: "Present",
      description: [
        "Supervised the acquisition of construction supplies with a success rate of more than 75% in quality testing.",
        "Carried out minor repairs, loading, unloading, cleanup, and setup on construction sites.",
        "Managed the transportation of equipment, drove commercial vehicles, and kept an eye on deliveries and inventory.",
        "Improved customer retention and sales by 25% a year by implementing procedural changes."
      ]
    },
    {
      position: "Sales Representative",
      company: "Ikenna Enterprises Nig Ltd.",
      location: "Owerri, Nigeria",
      startDate: "2000",
      endDate: "2012",
      description: [
        "Sourced new customers, initiated cold calls, and networked to produce leads.",
        "Presented services, cultivated connections with clients, and closed transactions.",
        "Negotiated conditions, promoted client satisfaction after the sale, and met the target."
      ]
    },
    {
      position: "Apprenticeship",
      company: "Fideson Enterprise Nigeria Limited",
      location: "Adamawa, Nigeria",
      startDate: "1993",
      endDate: "2000",
      description: [
        "Carried out quality checks, kept track of sales invoices, and helped with shipment coordination.",
        "Performed preventative maintenance, loaded and unloaded equipment, and drove 18-wheel heavy-duty trucks.",
        "Demonstrated independence, self-motivation, and teamwork under mentorship."
      ]
    }
  ],
  education: [
    {
      degree: "First School Leaving Certificate",
      institution: "Danfodon Road Primary School",
      location: "Abia, Nigeria",
      year: "1993",
      gpa: undefined
    }
  ],
  skills: {
    technical: [],
    languages: [],
    other: []
  },
  projects: []
};