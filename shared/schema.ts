import { z } from "zod";

// ─── Multi-tenant: Companies (one row per onboarded staffing agency) ─────────
export const companiesSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  domain: z.string().optional(),
  plan: z.string().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.date().optional(),
});
export type Companie = z.infer<typeof companiesSchema>;

export const jobsSchema = z.object({
  id: z.string().optional(),
  companyId: z.string(),
  title: z.string(),
  company: z.string(),
  location: z.string(),
  jobType: z.string(),
  industry: z.string(),
  description: z.string(),
  salary: z.string().optional(),
  postedDate: z.date().optional(),
});
export type Job = z.infer<typeof jobsSchema>;

export const applicationsSchema = z.object({
  id: z.string().optional(),
  companyId: z.string(),
  jobId: z.string(),
  jobTitle: z.string(),
  applicantName: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  resumeUrl: z.string().optional(),
  coverLetter: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
  jobSeekerId: z.number().optional(),
  source: z.string().optional(),
  appliedDate: z.date().optional(),
});
export type Application = z.infer<typeof applicationsSchema>;

export const contactsSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  inquiryType: z.string(),
  message: z.string(),
  submittedDate: z.date().optional(),
});
export type Contact = z.infer<typeof contactsSchema>;

export const resumesSchema = z.object({
  id: z.string().optional(),
  companyId: z.string(),
  fullName: z.string(),
  email: z.string(),
  phone: z.string(),
  desiredPosition: z.string(),
  yearsExperience: z.number(),
  skills: z.string(),
  linkedIn: z.string().optional(),
  additionalInfo: z.string().optional(),
  resumeUrl: z.string().optional(),
  jobSeekerId: z.number().optional(),
  submittedDate: z.date().optional(),
});
export type Resume = z.infer<typeof resumesSchema>;

export const usersSchema = z.object({
  id: z.number().optional(),
  username: z.string(),
  password: z.string(),
  role: z.string().optional(),
  companyId: z.string().optional(),
  email: z.string().optional(),
  fullName: z.string().optional(),
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  verificationToken: z.string().optional(),
  createdAt: z.date().optional(),
});
export type User = z.infer<typeof usersSchema>;

export type UserRole = "super_admin" | "company_admin" | "recruiter";
export const USER_ROLES: UserRole[] = ["super_admin", "company_admin", "recruiter"];

export const jobSeekersSchema = z.object({
  id: z.number().optional(),
  fullName: z.string(),
  email: z.string(),
  password: z.string(),
  phone: z.string().optional(),
  currentPosition: z.string().optional(),
  experienceLevel: z.string().optional(),
  currentSalary: z.string().optional(),
  expectedSalary: z.string().optional(),
  noticePeriod: z.string().optional(),
  skills: z.string().optional(),
  education: z.string().optional(),
  portfolioLinks: z.any().optional(),
  resetToken: z.string().optional(),
  resetTokenExpires: z.date().optional(),
  isHotlisted: z.boolean().optional(),
  hotlistNotes: z.string().optional(),
  createdAt: z.date().optional(),
});
export type JobSeeker = z.infer<typeof jobSeekersSchema>;

export const interviewsSchema = z.object({
  id: z.string().optional(),
  companyId: z.string(),
  applicationId: z.string(),
  scheduledAt: z.date(),
  mode: z.string().optional(),
  interviewerName: z.string(),
  interviewerEmail: z.string().optional(),
  status: z.string().optional(),
  feedback: z.string().optional(),
  createdAt: z.date().optional(),
});
export type Interview = z.infer<typeof interviewsSchema>;

export const submissionsSchema = z.object({
  id: z.string().optional(),
  companyId: z.string(),
  applicationId: z.string(),
  clientId: z.string(),
  ownerUserId: z.string(),
  submittedAt: z.date().optional(),
  status: z.string().optional(),
  rateOfferedInr: z.number().optional(),
  notes: z.string().optional(),
});
export type Submission = z.infer<typeof submissionsSchema>;

export const activitiesSchema = z.object({
  id: z.string().optional(),
  companyId: z.string(),
  applicationId: z.string(),
  type: z.string(),
  description: z.string(),
  createdByUserId: z.string().optional(),
  createdAt: z.date().optional(),
});
export type Activity = z.infer<typeof activitiesSchema>;

export const APPLICATION_STATUSES = [
  "new", "reviewing", "shortlisted", "submitted",
  "interview", "offer", "joined", "rejected", "hired",
] as const;
export type ApplicationStatus = typeof APPLICATION_STATUSES[number];

export const insertInterviewSchema = interviewsSchema.omit({ "id": true, "createdAt": true }).extend({
  applicationId: z.string().uuid("Valid application required"),
  scheduledAt: z.coerce.date(),
  mode: z.enum(["phone", "video", "onsite"]).default("video"),
  interviewerName: z.string().trim().min(1).max(150),
  interviewerEmail: z.string().trim().email().max(200).optional().nullable(),
  status: z.enum(["scheduled", "completed", "cancelled", "no_show"]).default("scheduled"),
  feedback: z.string().trim().max(4000).optional().nullable(),
});
export type InsertInterview = z.infer<typeof insertInterviewSchema>;


export const insertSubmissionSchema = submissionsSchema.omit({ "id": true, "submittedAt": true, "ownerUserId": true }).extend({
  applicationId: z.string().uuid("Valid application required"),
  clientId: z.string().uuid("Valid client required"),
  status: z.enum(["submitted", "client_review", "interview", "rejected", "selected"]).default("submitted"),
  rateOfferedInr: z.number().int().min(0).optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
});
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;


export const insertActivitySchema = activitiesSchema.omit({ "id": true, "createdAt": true, "createdByUserId": true }).extend({
  applicationId: z.string().uuid("Valid application required"),
  type: z.enum(["note", "status_change", "interview", "submission", "hotlist"]),
  description: z.string().trim().min(1).max(2000),
});
export type InsertActivity = z.infer<typeof insertActivitySchema>;


export const hotlistToggleSchema = z.object({
  isHotlisted: z.boolean(),
  hotlistNotes: z.string().trim().max(1000).optional().nullable(),
});
export type HotlistToggle = z.infer<typeof hotlistToggleSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;

export const vendorsSchema = z.object({
  id: z.string().optional(),
  companyName: z.string(),
  contactPerson: z.string(),
  email: z.string(),
  phone: z.string(),
  website: z.string().optional(),
  servicesOffered: z.string(),
  industriesExpertise: z.string(),
  geographicCoverage: z.string(),
  yearsInBusiness: z.number(),
  companyDescription: z.string(),
  partnershipReason: z.string(),
  submittedDate: z.date().optional(),
});
export type Vendor = z.infer<typeof vendorsSchema>;

export const clientsSchema = z.object({
  id: z.string().optional(),
  ownerUserId: z.string(),
  companyName: z.string(),
  industry: z.string(),
  city: z.string(),
  primaryContactName: z.string(),
  primaryContactEmail: z.string(),
  primaryContactPhone: z.string().optional(),
  status: z.string().optional(),
  accountOwner: z.string().optional(),
  arrInr: z.number().optional(),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
});
export type Client = z.infer<typeof clientsSchema>;

export const dealsSchema = z.object({
  id: z.string().optional(),
  ownerUserId: z.string(),
  clientId: z.string(),
  title: z.string(),
  stage: z.string().optional(),
  valueInr: z.number().optional(),
  positions: z.number().optional(),
  expectedCloseDate: z.date().optional(),
  owner: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
});
export type Deal = z.infer<typeof dealsSchema>;

export const insertClientSchema = clientsSchema.omit({ "id": true, "createdAt": true, "ownerUserId": true }).extend({
  companyName: z.string().trim().min(1, "Company name is required").max(200),
  industry: z.string().trim().min(1).max(100),
  city: z.string().trim().min(1).max(100),
  primaryContactName: z.string().trim().min(1, "Contact name is required").max(150),
  primaryContactEmail: z.string().trim().email("Valid email required").max(200),
  primaryContactPhone: z.string().trim().max(40).optional().nullable(),
  status: z.enum(["active", "renewal", "pursuit", "inactive"]).default("active"),
  accountOwner: z.string().trim().min(1).max(100).default("Unassigned"),
  arrInr: z.number().int().min(0).default(0),
  notes: z.string().trim().max(2000).optional().nullable(),
});
export type InsertClient = z.infer<typeof insertClientSchema>;


export const insertDealSchema = dealsSchema.omit({ "id": true, "createdAt": true, "ownerUserId": true }).extend({
  clientId: z.string().uuid("Valid client required"),
  title: z.string().trim().min(1, "Deal title is required").max(200),
  stage: z.enum(["qualified", "discovery", "proposal", "negotiation", "won", "lost"]).default("qualified"),
  valueInr: z.number().int().min(0).default(0),
  positions: z.number().int().min(1).default(1),
  owner: z.string().trim().min(1).max(100).default("Unassigned"),
  notes: z.string().trim().max(2000).optional().nullable(),
  expectedCloseDate: z.coerce.date().optional().nullable(),
});
export type InsertDeal = z.infer<typeof insertDealSchema>;


// ─── Onboarding ──────────────────────────────────────────────────────────────
export const onboardingsSchema = z.object({
  id: z.string().optional(),
  applicationId: z.string().optional(),
  candidateName: z.string(),
  jobTitle: z.string(),
  company: z.string(),
  status: z.string().optional(),
  progress: z.number().optional(),
  etaDays: z.number().optional(),
  ownerUserId: z.string(),
  createdAt: z.date().optional(),
});
export type Onboarding = z.infer<typeof onboardingsSchema>;

export const insertOnboardingSchema = onboardingsSchema.omit({ "id": true, "createdAt": true, "ownerUserId": true }).extend({
  progress: z.number().int().min(0).max(100).default(0),
});
export type InsertOnboarding = z.infer<typeof insertOnboardingSchema>;


// ─── Financials ───────────────────────────────────────────────────────────────
export const invoicesSchema = z.object({
  id: z.string().optional(),
  invoiceNumber: z.string(),
  clientId: z.string().optional(),
  clientName: z.string(),
  amountInr: z.number(),
  status: z.string().optional(),
  dueDate: z.date(),
  ownerUserId: z.string(),
  createdAt: z.date().optional(),
});
export type Invoice = z.infer<typeof invoicesSchema>;

export const insertInvoiceSchema = invoicesSchema.omit({ "id": true, "createdAt": true, "ownerUserId": true }).extend({
  dueDate: z.coerce.date(),
  amountInr: z.number().int().min(0),
});
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;


// ─── E-Signatures ─────────────────────────────────────────────────────────────
export const esignaturesSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  recipient: z.string(),
  status: z.string().optional(),
  ownerUserId: z.string(),
  createdAt: z.date().optional(),
});
export type ESignature = z.infer<typeof esignaturesSchema>;

export const insertESignatureSchema = esignaturesSchema.omit({ id: true,
  createdAt: true,
  ownerUserId: true,
 });
export type InsertESignature = z.infer<typeof insertESignatureSchema>;


// ─── Background Checks ────────────────────────────────────────────────────────
export const backgroundChecksSchema = z.object({
  id: z.string().optional(),
  candidateName: z.string(),
  provider: z.string(),
  status: z.string().optional(),
  etaDays: z.number().optional(),
  ownerUserId: z.string(),
  createdAt: z.date().optional(),
});
export type BackgroundCheck = z.infer<typeof backgroundChecksSchema>;

export const insertBackgroundCheckSchema = backgroundChecksSchema.omit({ id: true,
  createdAt: true,
  ownerUserId: true,
 });
export type InsertBackgroundCheck = z.infer<typeof insertBackgroundCheckSchema>;


// ─── Emails & Meetings (Inbox & Calendar) ─────────────────────────────────────
export const emailsSchema = z.object({
  id: z.string().optional(),
  sender: z.string(),
  subject: z.string(),
  body: z.string().optional(),
  unread: z.boolean().optional(),
  ownerUserId: z.string(),
  createdAt: z.date().optional(),
});
export type Email = z.infer<typeof emailsSchema>;

export const insertEmailSchema = emailsSchema.omit({ id: true,
  createdAt: true,
  ownerUserId: true,
 });
export type InsertEmail = z.infer<typeof insertEmailSchema>;


export const meetingsSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  durationMinutes: z.number().optional(),
  startTime: z.date(),
  ownerUserId: z.string(),
  createdAt: z.date().optional(),
});
export type Meeting = z.infer<typeof meetingsSchema>;
export const insertMeetingSchema = meetingsSchema.omit({ id: true, createdAt: true, ownerUserId: true });
export type InsertMeeting = z.infer<typeof insertMeetingSchema>;

export const aiEvaluationsSchema = z.object({
  id: z.string().optional(),
  ownerUserId: z.string(),
  candidateName: z.string(),
  jobTitle: z.string(),
  jdText: z.string(),
  resumeText: z.string(),
  overallScore: z.number(),
  skillsScore: z.number(),
  experienceScore: z.number(),
  cultureScore: z.number(),
  integrityScore: z.number(),
  verdict: z.string(),
  summary: z.string(),
  strengths: z.array(z.string()).optional().nullable(),
  redFlags: z.array(z.string()).optional().nullable(),
  matchedSkills: z.array(z.string()).optional().nullable(),
  missingSkills: z.array(z.string()).optional().nullable(),
  createdAt: z.date().optional(),
});
export type AiEvaluation = z.infer<typeof aiEvaluationsSchema>;

export const aiAssessmentsSchema = z.object({
  id: z.string().optional(),
  ownerUserId: z.string(),
  title: z.string(),
  jobTitle: z.string(),
  jdText: z.string(),
  seniority: z.string().optional(),
  durationMinutes: z.number().optional(),
  questions: z.any().optional(),
  createdAt: z.date().optional(),
});
export type AiAssessment = z.infer<typeof aiAssessmentsSchema>;

export const insertAiEvaluationSchema = aiEvaluationsSchema.omit({ "id": true, "createdAt": true, "ownerUserId": true }).extend({
  candidateName: z.string().trim().min(1).max(200),
  jobTitle: z.string().trim().min(1).max(200),
  jdText: z.string().trim().min(20).max(20000),
  resumeText: z.string().trim().min(20).max(40000),
});
export type InsertAiEvaluation = z.infer<typeof insertAiEvaluationSchema>;


export const aiAssessmentQuestionSchema = z.object({
  q: z.string(),
  options: z.array(z.string()).min(2).max(6),
  correct: z.number().int().min(0),
  explanation: z.string().optional(),
  skill: z.string().optional(),
});
export type AiAssessmentQuestion = z.infer<typeof aiAssessmentQuestionSchema>;

export const generateAssessmentInputSchema = z.object({
  jobTitle: z.string().trim().min(1, "Job title required").max(200),
  jdText: z.string().trim().min(20, "JD too short").max(20000),
  seniority: z.enum(["junior", "mid", "senior", "lead"]).default("mid"),
  numQuestions: z.number().int().min(3).max(20).default(8),
  durationMinutes: z.number().int().min(5).max(180).default(30),
});
export type GenerateAssessmentInput = z.infer<typeof generateAssessmentInputSchema>;

export const scoreCandidateInputSchema = z.object({
  candidateName: z.string().trim().min(1).max(200),
  jobTitle: z.string().trim().min(1).max(200),
  jdText: z.string().trim().min(20).max(20000),
  resumeText: z.string().trim().min(20).max(40000),
});
export type ScoreCandidateInput = z.infer<typeof scoreCandidateInputSchema>;



export const articlesSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  category: z.string(),
  excerpt: z.string(),
  content: z.string(),
  author: z.string().optional(),
  readTime: z.string().optional(),
  published: z.boolean().optional(),
  publishedDate: z.date().optional(),
});
export type Article = z.infer<typeof articlesSchema>;

export const insertArticleSchema = articlesSchema.omit({ id: true,
  publishedDate: true,
 });

export type InsertArticle = z.infer<typeof insertArticleSchema>;

export const insertJobSchema = jobsSchema.omit({ id: true, postedDate: true });

export const insertApplicationSchema = applicationsSchema.omit({ id: true, appliedDate: true, jobSeekerId: true }).extend({
  source: z.enum(["LinkedIn", "Naukri", "Indeed", "Monster", "Referral", "Direct", "Walk-in", "Other"]).optional().nullable(),
});

export const insertContactSchema = contactsSchema.omit({ id: true, submittedDate: true });


export const insertResumeSchema = resumesSchema.omit({ id: true,
  submittedDate: true,
  // jobSeekerId is set server-side from the session, never trusted from client.
  jobSeekerId: true,
 });

export const insertUserSchema = usersSchema.omit({ id: true,
  createdAt: true,
 });

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Company schemas
export const insertCompanySchema = companiesSchema.omit({ "id": true, "createdAt": true }).extend({
  name: z.string().trim().min(1, "Company name is required").max(200),
  domain: z.string().trim().max(200).optional().nullable(),
  plan: z.enum(["starter", "pro", "enterprise"]).default("starter"),
});
export type InsertCompany = z.infer<typeof insertCompanySchema>;


// Schema for onboarding a new company (creates company + company admin user in one step)
export const onboardCompanySchema = z.object({
  companyName: z.string().trim().min(1, "Company name required").max(200),
  domain: z.string().trim().max(200).optional().nullable(),
  plan: z.enum(["starter", "pro", "enterprise"]).default("starter"),
  adminUsername: z.string().trim().min(3, "Min 3 chars").max(50),
  adminPassword: z.string().min(8, "Min 8 characters"),
  adminEmail: z.string().email("Valid email required").max(200),
  adminFullName: z.string().trim().min(1).max(150),
});
export type OnboardCompanyInput = z.infer<typeof onboardCompanySchema>;

// Schema for creating a recruiter inside a company
export const createCompanyUserSchema = z.object({
  username: z.string().trim().min(3).max(50),
  password: z.string().min(8, "Min 8 characters"),
  email: z.string().email().max(200).optional().nullable(),
  fullName: z.string().trim().min(1).max(150),
  role: z.enum(["company_admin", "recruiter"]).default("recruiter"),
});
export type CreateCompanyUserInput = z.infer<typeof createCompanyUserSchema>;

export const insertVendorSchema = vendorsSchema.omit({ id: true,
  submittedDate: true,
 });

export const insertJobSeekerSchema = jobSeekersSchema.omit({ "id": true, "createdAt": true }).extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email address"),
});

export const updateJobSeekerSchema = z.object({
  fullName: z.string().min(1, "Full name is required").optional(),
  phone: z.string().optional().nullable(),
  currentPosition: z.string().optional().nullable(),
  experienceLevel: z.string().optional().nullable(),
  currentSalary: z.string().optional().nullable(),
  expectedSalary: z.string().optional().nullable(),
  noticePeriod: z.string().optional().nullable(),
  skills: z.string().optional().nullable(),
  education: z.string().optional().nullable(),
  portfolioLinks: z.any().optional().nullable(),
});
export type UpdateJobSeeker = z.infer<typeof updateJobSeekerSchema>;

export const jobSeekerLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type InsertJob = z.infer<typeof insertJobSchema>;

export type InsertApplication = z.infer<typeof insertApplicationSchema>;

export type InsertContact = z.infer<typeof insertContactSchema>;

export type InsertResume = z.infer<typeof insertResumeSchema>;

export type InsertUser = z.infer<typeof insertUserSchema>;

export type LoginCredentials = z.infer<typeof loginSchema>;
export type InsertVendor = z.infer<typeof insertVendorSchema>;

export type InsertJobSeeker = z.infer<typeof insertJobSeekerSchema>;

export type JobSeekerLoginCredentials = z.infer<typeof jobSeekerLoginSchema>;

// ─── Super Admin Enterprise CRM Extensions ─────────────────────────────────────

export const subscriptionsSchema = z.object({
  id: z.string().optional(),
  companyId: z.string(),
  planId: z.string(),
  status: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  autoRenew: z.boolean().optional(),
  createdAt: z.date().optional(),
});
export type Subscription = z.infer<typeof subscriptionsSchema>;

export const paymentsSchema = z.object({
  id: z.string().optional(),
  companyId: z.string(),
  subscriptionId: z.string().optional(),
  amountInr: z.number(),
  status: z.string().optional(),
  paymentMethod: z.string().optional(),
  transactionId: z.string().optional(),
  invoiceUrl: z.string().optional(),
  paidAt: z.date().optional(),
  createdAt: z.date().optional(),
});
export type Payment = z.infer<typeof paymentsSchema>;

export const supportTicketsSchema = z.object({
  id: z.string().optional(),
  userId: z.number().optional(),
  companyId: z.string().optional(),
  subject: z.string(),
  description: z.string(),
  status: z.string().optional(),
  priority: z.string().optional(),
  assignedTo: z.number().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type SupportTicket = z.infer<typeof supportTicketsSchema>;

export const auditLogsSchema = z.object({
  id: z.string().optional(),
  userId: z.number(),
  action: z.string(),
  resourceType: z.string(),
  resourceId: z.string().optional(),
  details: z.any().optional(),
  ipAddress: z.string().optional(),
  createdAt: z.date().optional(),
});
export type AuditLog = z.infer<typeof auditLogsSchema>;

export const notificationsSchema = z.object({
  id: z.string().optional(),
  userId: z.number(),
  title: z.string(),
  message: z.string(),
  type: z.string().optional(),
  isRead: z.boolean().optional(),
  link: z.string().optional(),
  createdAt: z.date().optional(),
});
export type Notification = z.infer<typeof notificationsSchema>;

export const insertSubscriptionSchema = subscriptionsSchema;

export const insertPaymentSchema = paymentsSchema;

export const insertSupportTicketSchema = supportTicketsSchema;

export const insertAuditLogSchema = auditLogsSchema;

export const insertNotificationSchema = notificationsSchema;


// ─── Zero-Touch Onboarding & RBAC ─────────────────────────────────────────────

export const rolesSchema = z.object({
  id: z.string().optional(),
  companyId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  isSystem: z.boolean().optional(),
  createdAt: z.date().optional(),
});
export type Role = z.infer<typeof rolesSchema>;

export const permissionsSchema = z.object({
  id: z.string().optional(),
  roleId: z.string(),
  resource: z.string(),
  action: z.string(),
});
export type Permission = z.infer<typeof permissionsSchema>;

export const userRolesSchema = z.object({
  id: z.string().optional(),
  userId: z.number(),
  roleId: z.string(),
  createdAt: z.date().optional(),
});
export type UserRoleRecord = z.infer<typeof userRolesSchema>;

export const departmentsSchema = z.object({
  id: z.string().optional(),
  companyId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.date().optional(),
});
export type Department = z.infer<typeof departmentsSchema>;

export const companySettingsSchema = z.object({
  id: z.string().optional(),
  companyId: z.string(),
  timezone: z.string().optional(),
  brandColor: z.string().optional(),
  logoUrl: z.string().optional(),
  careerPageSlug: z.string().optional(),
  webhookSecret: z.string().optional(),
  updatedAt: z.date().optional(),
});
export type CompanySetting = z.infer<typeof companySettingsSchema>;

export const emailTemplatesSchema = z.object({
  id: z.string().optional(),
  companyId: z.string(),
  name: z.string(),
  subject: z.string(),
  bodyHtml: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type EmailTemplate = z.infer<typeof emailTemplatesSchema>;

export const pipelinesSchema = z.object({
  id: z.string().optional(),
  companyId: z.string(),
  name: z.string(),
  stages: z.any(),
  isDefault: z.boolean().optional(),
  createdAt: z.date().optional(),
});
export type Pipeline = z.infer<typeof pipelinesSchema>;

export const invitesSchema = z.object({
  id: z.string().optional(),
  companyId: z.string(),
  email: z.string(),
  roleId: z.string(),
  token: z.string(),
  status: z.string().optional(),
  invitedBy: z.number().optional(),
  expiresAt: z.date(),
  createdAt: z.date().optional(),
});
export type Invite = z.infer<typeof invitesSchema>;

// ─── Export schemas and types ──────────────────────────────────────────────────
export const insertRoleSchema = rolesSchema;

export const insertPermissionSchema = permissionsSchema;

export const insertUserRoleSchema = userRolesSchema;

export const insertDepartmentSchema = departmentsSchema;

export const insertCompanySettingsSchema = companySettingsSchema;

export const insertEmailTemplateSchema = emailTemplatesSchema;

export const insertPipelineSchema = pipelinesSchema;

export const insertInviteSchema = invitesSchema;

