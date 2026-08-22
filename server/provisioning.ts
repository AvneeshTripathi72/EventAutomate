import { toSnake } from "./supabase";

export const DEFAULT_DEPARTMENTS = [
  "Engineering",
  "Human Resources",
  "Marketing",
  "Sales",
  "Finance",
  "Operations",
  "Customer Support"
];

export const DEFAULT_PIPELINE = [
  "Applied",
  "Screening",
  "Shortlisted",
  "Assessment",
  "Interview Round 1",
  "Interview Round 2",
  "Offer",
  "Hired",
  "Rejected"
];

export const DEFAULT_ROLES = [
  { name: "Company Owner", description: "Full administrative access to the entire workspace", isSystem: true },
  { name: "Company Admin", description: "Administrative access, cannot delete company or owner", isSystem: true },
  { name: "Recruiter", description: "Can manage jobs, candidates, and pipelines", isSystem: true },
  { name: "Hiring Manager", description: "Can view candidates and submit feedback", isSystem: true },
  { name: "Interviewer", description: "Can only view assigned interviews and submit feedback", isSystem: true },
  { name: "HR", description: "Can manage internal HR operations", isSystem: true },
  { name: "Finance", description: "Can view subscriptions and payments", isSystem: true }
];

export const DEFAULT_EMAIL_TEMPLATES = [
  { name: "Welcome Email", subject: "Welcome to our Talent Network", bodyHtml: "<p>Hi {{candidate_name}}, welcome...</p>" },
  { name: "Interview Invitation", subject: "Interview Scheduled: {{job_title}}", bodyHtml: "<p>You have an interview on {{date}}.</p>" },
  { name: "Offer Letter", subject: "Offer of Employment", bodyHtml: "<p>We are thrilled to offer you...</p>" }
];

export function generateProvisioningPayloads(companyId: string, ownerUserId: number) {
  const departments = DEFAULT_DEPARTMENTS.map(name => toSnake({ companyId, name }));
  
  const pipeline = toSnake({
    companyId,
    name: "Default Recruitment",
    stages: DEFAULT_PIPELINE,
    isDefault: true
  });
  
  const roles = DEFAULT_ROLES.map(r => toSnake({ companyId, name: r.name, description: r.description, isSystem: r.isSystem }));
  
  const settings = toSnake({
    companyId,
    timezone: "Asia/Kolkata",
    brandColor: "#0ea5e9",
  });

  const emailTemplates = DEFAULT_EMAIL_TEMPLATES.map(t => toSnake({
    companyId,
    name: t.name,
    subject: t.subject,
    bodyHtml: t.bodyHtml
  }));

  return { departments, pipeline, roles, settings, emailTemplates };
}
