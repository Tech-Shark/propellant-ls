/**
 * Zod validation schemas for all form inputs
 * 
 * SECURITY: Input validation is the first line of defense against
 * injection attacks, XSS, and data corruption.
 */

import { z } from 'zod';

// ============= Authentication Schemas =============

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters'),
});

export const registerSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format (E.164 format required)')
    .max(16, 'Phone number too long'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  termsAndConditionsAccepted: z
    .boolean()
    .refine((val) => val === true, 'You must accept the terms and conditions'),
  role: z.enum(['TALENT', 'ORGANIZATION'], {
    errorMap: () => ({ message: 'Invalid role selected' }),
  }),
  referralCode: z
    .string()
    .trim()
    .max(50, 'Referral code too long')
    .optional()
    .or(z.literal('')),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// ============= CV Builder Schemas =============

export const urlSchema = z
  .string()
  .trim()
  .max(500, 'URL too long')
  .refine(
    (url) => {
      if (!url) return true; // Optional field
      const urlRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;
      return urlRegex.test(url);
    },
    { message: 'Invalid URL format' }
  )
  .optional()
  .or(z.literal(''));

export const cvPersonalInfoSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(100, 'First name too long'),
  lastName: z.string().trim().min(1, 'Last name is required').max(100, 'Last name too long'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email too long'),
  phone: z.string().trim().max(20, 'Phone number too long').optional().or(z.literal('')),
  location: z.string().trim().max(200, 'Location too long').optional().or(z.literal('')),
  summary: z.string().trim().max(1000, 'Summary too long (max 1000 characters)').optional().or(z.literal('')),
  linkedin: urlSchema,
  github: urlSchema,
  portfolio: urlSchema,
});

export const workExperienceSchema = z.object({
  company: z.string().trim().min(1, 'Company name is required').max(200, 'Company name too long'),
  position: z.string().trim().min(1, 'Position is required').max(200, 'Position too long'),
  startDate: z.string().trim().min(1, 'Start date is required').max(50, 'Date too long'),
  endDate: z.string().trim().max(50, 'Date too long').optional().or(z.literal('')),
  current: z.boolean().optional(),
  description: z.string().trim().max(2000, 'Description too long (max 2000 characters)').optional().or(z.literal('')),
});

export const educationSchema = z.object({
  institution: z.string().trim().min(1, 'Institution is required').max(200, 'Institution name too long'),
  degree: z.string().trim().min(1, 'Degree is required').max(200, 'Degree too long'),
  field: z.string().trim().max(200, 'Field of study too long').optional().or(z.literal('')),
  startDate: z.string().trim().min(1, 'Start date is required').max(50, 'Date too long'),
  endDate: z.string().trim().max(50, 'Date too long').optional().or(z.literal('')),
  current: z.boolean().optional(),
});

export const certificationSchema = z.object({
  name: z.string().trim().min(1, 'Certification name is required').max(200, 'Name too long'),
  issuer: z.string().trim().min(1, 'Issuer is required').max(200, 'Issuer name too long'),
  date: z.string().trim().max(50, 'Date too long').optional().or(z.literal('')),
  url: urlSchema,
});

export const projectSchema = z.object({
  name: z.string().trim().min(1, 'Project name is required').max(200, 'Name too long'),
  description: z.string().trim().max(2000, 'Description too long (max 2000 characters)').optional().or(z.literal('')),
  technologies: z.array(z.string().trim().max(100)).max(50, 'Too many technologies').optional(),
  url: urlSchema,
});

export const skillSchema = z.object({
  name: z.string().trim().min(1, 'Skill name is required').max(100, 'Skill name too long'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'], {
    errorMap: () => ({ message: 'Invalid skill level' }),
  }),
});

export const cvDataSchema = z.object({
  personalInfo: cvPersonalInfoSchema,
  workExperience: z.array(workExperienceSchema).max(50, 'Too many work experiences'),
  education: z.array(educationSchema).max(20, 'Too many education entries'),
  certifications: z.array(certificationSchema).max(50, 'Too many certifications'),
  projects: z.array(projectSchema).max(50, 'Too many projects'),
  skills: z.array(skillSchema).max(100, 'Too many skills'),
});

// ============= Credential Upload Schema =============

export const credentialUploadSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title too long'),
  issuer: z.string().trim().min(1, 'Issuer is required').max(200, 'Issuer name too long'),
  issueDate: z.string().trim().min(1, 'Issue date is required').max(50, 'Date too long'),
  description: z.string().trim().max(1000, 'Description too long (max 1000 characters)').optional().or(z.literal('')),
  credentialUrl: urlSchema,
});

// ============= Type exports =============

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type CVPersonalInfo = z.infer<typeof cvPersonalInfoSchema>;
export type WorkExperience = z.infer<typeof workExperienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type CVData = z.infer<typeof cvDataSchema>;
export type CredentialUpload = z.infer<typeof credentialUploadSchema>;
