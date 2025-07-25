declare type OTP = "RESET_PASSWORD" | "VERIFY_EMAIL" | "VERIFY_PHONE";

declare type UserType = "SUPER_ADMIN" | "ADMIN" | "TALENT" | "ORGANIZATION";

declare type WaitlistType = "TALENT" | "ORGANIZATION" | "INVESTOR" | "VOLUNTEER" | "BETA_TESTER" | "AMBASSADOR";

export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

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

// Credentials
export interface Credential {
    user?: string;
    userObject?: {
        "_id": "685baadbaf4ad967b6f88299",
        "email": "test2@gmail.com",
        "username": "mercyyoo"
    }
    _id?: string;
    title?: string;
    type?: string;
    category?: string;
    file?: File;
    url?: string;
    description?: string;
    verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
    createdAt?: string;
    updatedAt?: string;
    verifiedAt?: string | null;
    isDeleted?: boolean;
    rejectionReason?: string;
    ipfsHash?: string;
    visibility?: boolean;
}

export interface CredentialsData {
    _id?: string;
    credentialId?: string;
    subject?: string;
    issuer?: string | { _id: string; email?: string };
    name?: string;
    title?: string;
    type?: string;
    category?: string;
    file?: File;
    url?: string;
    imageUrl?: string;
    description?: string;
    credentialType?: number | string;
    status?: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'MINTED' | string;
    verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
    createdAt?: string;
    updatedAt?: string;
    verifiedAt?: string | null;
    mintedAt?: string | null;
    isDeleted?: boolean;
    rejectionReason?: string;
    ipfsHash?: string;
    evidenceHash?: string;
    revocable?: boolean;
    visibility?: boolean;
}

export interface PaymentMethod {
    _id: string;
    name: string;
    fee: number;
    active: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    description: string;
}