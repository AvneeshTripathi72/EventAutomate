
import { supabase, toCamel, toSnake } from "./supabase";
import {
  type InsertJob, type Job, type InsertApplication, type Application, type Contact, type InsertContact,
  type Resume, type InsertResume, type User, type InsertUser, type Vendor, type InsertVendor,
  type Article, type InsertArticle, type Client, type InsertClient, type Deal, type InsertDeal,
  type Interview, type InsertInterview, type Submission, type InsertSubmission, type Activity, type InsertActivity,
  type AiEvaluation, type AiAssessment, type AiAssessmentQuestion, type JobSeeker, type UpdateJobSeeker,
  type Onboarding, type InsertOnboarding, type Invoice, type InsertInvoice, type ESignature, type InsertESignature,
  type BackgroundCheck, type InsertBackgroundCheck, type Email, type InsertEmail, type Meeting, type InsertMeeting
} from "@shared/schema";

export interface PublicStats {
  activeJobs: number; partnerCompanies: number; registeredCandidates: number; successfulPlacements: number; publishedArticles: number; industriesCovered: number;
}

export interface IStorage {
  init(): Promise<void>;
  getPublicStats(): Promise<PublicStats>;
  getAllJobs(): Promise<Job[]>;
  getJobById(id: string): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: string, job: InsertJob): Promise<Job | undefined>;
  deleteJob(id: string): Promise<boolean>;
  searchJobs(query: string, industry?: string): Promise<Job[]>;
  createApplication(application: InsertApplication, jobSeekerId?: number): Promise<Application>;
  getApplicationsByJobSeekerId(jobSeekerId: number): Promise<Application[]>;
  getApplicationsByJobId(jobId: string): Promise<Application[]>;
  getAllApplications(): Promise<Application[]>;
  updateApplicationStatus(id: string, status: string, notes?: string): Promise<Application | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  createResume(resume: InsertResume, jobSeekerId?: number): Promise<Resume>;
  getAllResumes(): Promise<Resume[]>;
  getResumesByEmail(email: string): Promise<Resume[]>;
  getResumesByJobSeekerId(jobSeekerId: number): Promise<Resume[]>;
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  getAllVendors(): Promise<Vendor[]>;
  getAllArticles(): Promise<Article[]>;
  getArticleById(id: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;
  getAllClients(ownerUserId: string): Promise<Client[]>;
  getClientById(id: string, ownerUserId: string): Promise<Client | undefined>;
  createClient(client: InsertClient, ownerUserId: string): Promise<Client>;
  updateClient(id: string, ownerUserId: string, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: string, ownerUserId: string): Promise<boolean>;
  getAllDeals(ownerUserId: string): Promise<Deal[]>;
  createDeal(deal: InsertDeal, ownerUserId: string): Promise<Deal>;
  updateDeal(id: string, ownerUserId: string, deal: Partial<InsertDeal>): Promise<Deal | undefined>;
  deleteDeal(id: string, ownerUserId: string): Promise<boolean>;
  getInterviewsByApplicationId(applicationId: string): Promise<Interview[]>;
  getAllInterviews(): Promise<Interview[]>;
  createInterview(input: InsertInterview): Promise<Interview>;
  updateInterview(id: string, updates: Partial<InsertInterview>): Promise<Interview | undefined>;
  deleteInterview(id: string): Promise<boolean>;
  getSubmissionsByApplicationId(applicationId: string, ownerUserId: string): Promise<Submission[]>;
  getAllSubmissions(ownerUserId: string): Promise<Submission[]>;
  createSubmission(input: InsertSubmission, ownerUserId: string): Promise<Submission | undefined>;
  updateSubmission(id: string, ownerUserId: string, updates: Partial<InsertSubmission>): Promise<Submission | undefined>;
  deleteSubmission(id: string, ownerUserId: string): Promise<boolean>;
  getActivitiesByApplicationId(applicationId: string): Promise<Activity[]>;
  createActivity(input: InsertActivity, createdByUserId?: string | null): Promise<Activity>;
  setJobSeekerHotlist(id: number, isHotlisted: boolean, hotlistNotes?: string | null): Promise<JobSeeker | undefined>;
  getHotlistedJobSeekers(): Promise<JobSeeker[]>;
  updateJobSeeker(id: number, updates: Partial<UpdateJobSeeker>): Promise<JobSeeker | undefined>;
  createAiEvaluation(input: Omit<AiEvaluation, "id" | "createdAt">): Promise<AiEvaluation>;
  getAiEvaluations(ownerUserId: string): Promise<AiEvaluation[]>;
  getAiEvaluationById(id: string, ownerUserId: string): Promise<AiEvaluation | undefined>;
  deleteAiEvaluation(id: string, ownerUserId: string): Promise<boolean>;
  createAiAssessment(input: any): Promise<AiAssessment>;
  getAiAssessments(ownerUserId: string): Promise<AiAssessment[]>;
  getAiAssessmentById(id: string, ownerUserId: string): Promise<AiAssessment | undefined>;
  deleteAiAssessment(id: string, ownerUserId: string): Promise<boolean>;
  getAllOnboardings(ownerUserId: string): Promise<Onboarding[]>;
  createOnboarding(input: InsertOnboarding, ownerUserId: string): Promise<Onboarding>;
  updateOnboarding(id: string, ownerUserId: string, updates: Partial<InsertOnboarding>): Promise<Onboarding | undefined>;
  deleteOnboarding(id: string, ownerUserId: string): Promise<boolean>;
  getAllInvoices(ownerUserId: string): Promise<Invoice[]>;
  createInvoice(input: InsertInvoice, ownerUserId: string): Promise<Invoice>;
  updateInvoice(id: string, ownerUserId: string, updates: Partial<InsertInvoice>): Promise<Invoice | undefined>;
  deleteInvoice(id: string, ownerUserId: string): Promise<boolean>;
  getAllESignatures(ownerUserId: string): Promise<ESignature[]>;
  createESignature(input: InsertESignature, ownerUserId: string): Promise<ESignature>;
  updateESignature(id: string, ownerUserId: string, updates: Partial<InsertESignature>): Promise<ESignature | undefined>;
  deleteESignature(id: string, ownerUserId: string): Promise<boolean>;
  getAllBackgroundChecks(ownerUserId: string): Promise<BackgroundCheck[]>;
  createBackgroundCheck(input: InsertBackgroundCheck, ownerUserId: string): Promise<BackgroundCheck>;
  updateBackgroundCheck(id: string, ownerUserId: string, updates: Partial<InsertBackgroundCheck>): Promise<BackgroundCheck | undefined>;
  deleteBackgroundCheck(id: string, ownerUserId: string): Promise<boolean>;
  getAllEmails(ownerUserId: string): Promise<Email[]>;
  createEmail(input: InsertEmail, ownerUserId: string): Promise<Email>;
  updateEmail(id: string, ownerUserId: string, updates: Partial<InsertEmail>): Promise<Email | undefined>;
  deleteEmail(id: string, ownerUserId: string): Promise<boolean>;
  getAllMeetings(ownerUserId: string): Promise<Meeting[]>;
  createMeeting(input: InsertMeeting, ownerUserId: string): Promise<Meeting>;
  updateMeeting(id: string, ownerUserId: string, updates: Partial<InsertMeeting>): Promise<Meeting | undefined>;
  deleteMeeting(id: string, ownerUserId: string): Promise<boolean>;
  sessionStore: any;
}

export class SupabaseStorage implements IStorage {
  public sessionStore: any;
  constructor() { this.sessionStore = {} as any; }

  async init() {}

  async getPublicStats(): Promise<PublicStats> {
    const { count: activeJobs } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
    return { activeJobs: activeJobs || 0, partnerCompanies: 0, registeredCandidates: 0, successfulPlacements: 0, publishedArticles: 0, industriesCovered: 5 };
  }

  async getAllJobs(): Promise<Job[]> { const { data } = await supabase.from('jobs').select('*').order('posted_date', { ascending: false }); return toCamel(data || []); }
  async getJobById(id: string): Promise<Job | undefined> { const { data } = await supabase.from('jobs').select('*').eq('id', id).single(); return data ? toCamel(data) : undefined; }
  async createJob(job: InsertJob): Promise<Job> { const { data } = await supabase.from('jobs').insert(toSnake(job)).select().single(); return toCamel(data); }
  async updateJob(id: string, job: InsertJob): Promise<Job | undefined> { const { data } = await supabase.from('jobs').update(toSnake(job)).eq('id', id).select().single(); return data ? toCamel(data) : undefined; }
  async deleteJob(id: string): Promise<boolean> { await supabase.from('applications').delete().eq('job_id', id); const { data } = await supabase.from('jobs').delete().eq('id', id).select(); return !!data?.length; }
  async searchJobs(query: string, industry?: string): Promise<Job[]> { let q = supabase.from('jobs').select('*'); if (industry) q = q.eq('industry', industry); const { data } = await q.order('posted_date', { ascending: false }); return toCamel(data || []); }

  async createApplication(app: InsertApplication, jobSeekerId?: number): Promise<Application> { const { data } = await supabase.from('applications').insert(toSnake({ ...app, jobSeekerId })).select().single(); return toCamel(data); }
  async getApplicationsByJobSeekerId(jobSeekerId: number): Promise<Application[]> { const { data } = await supabase.from('applications').select('*').eq('job_seeker_id', jobSeekerId); return toCamel(data || []); }
  async getApplicationsByJobId(jobId: string): Promise<Application[]> { const { data } = await supabase.from('applications').select('*').eq('job_id', jobId); return toCamel(data || []); }
  async getAllApplications(): Promise<Application[]> { const { data } = await supabase.from('applications').select('*'); return toCamel(data || []); }
  async updateApplicationStatus(id: string, status: string, notes?: string): Promise<Application | undefined> { const { data } = await supabase.from('applications').update(toSnake({ status, notes })).eq('id', id).select().single(); return data ? toCamel(data) : undefined; }

  async createContact(c: InsertContact): Promise<Contact> { const { data } = await supabase.from('contacts').insert(toSnake(c)).select().single(); return toCamel(data); }
  async createResume(r: InsertResume, jobSeekerId?: number): Promise<Resume> { const { data } = await supabase.from('resumes').insert(toSnake({ ...r, jobSeekerId })).select().single(); return toCamel(data); }
  async getAllResumes(): Promise<Resume[]> { const { data } = await supabase.from('resumes').select('*'); return toCamel(data || []); }
  async getResumesByEmail(email: string): Promise<Resume[]> { const { data } = await supabase.from('resumes').select('*').eq('email', email); return toCamel(data || []); }
  async getResumesByJobSeekerId(id: number): Promise<Resume[]> { const { data } = await supabase.from('resumes').select('*').eq('job_seeker_id', id); return toCamel(data || []); }

  async createUser(u: InsertUser): Promise<User> { const { data } = await supabase.from('users').insert(toSnake(u)).select().single(); return toCamel(data); }
  async getUser(id: number): Promise<User | undefined> { const { data } = await supabase.from('users').select('*').eq('id', id).single(); return data ? toCamel(data) : undefined; }
  async getUserByUsername(username: string): Promise<User | undefined> { const { data } = await supabase.from('users').select('*').eq('username', username).single(); return data ? toCamel(data) : undefined; }

  async createVendor(v: InsertVendor): Promise<Vendor> { const { data } = await supabase.from('vendors').insert(toSnake(v)).select().single(); return toCamel(data); }
  async getAllVendors(): Promise<Vendor[]> { const { data } = await supabase.from('vendors').select('*'); return toCamel(data || []); }

  async getAllArticles(): Promise<Article[]> { const { data } = await supabase.from('articles').select('*'); return toCamel(data || []); }
  async getArticleById(id: string): Promise<Article | undefined> { const { data } = await supabase.from('articles').select('*').eq('id', id).single(); return data ? toCamel(data) : undefined; }
  async createArticle(a: InsertArticle): Promise<Article> { const { data } = await supabase.from('articles').insert(toSnake(a)).select().single(); return toCamel(data); }
  async updateArticle(id: string, a: Partial<InsertArticle>): Promise<Article | undefined> { const { data } = await supabase.from('articles').update(toSnake(a)).eq('id', id).select().single(); return data ? toCamel(data) : undefined; }
  async deleteArticle(id: string): Promise<boolean> { const { data } = await supabase.from('articles').delete().eq('id', id).select(); return !!data?.length; }

  async getAllClients(o: string): Promise<Client[]> { const { data } = await supabase.from('clients').select('*').eq('owner_user_id', o); return toCamel(data || []); }
  async getClientById(id: string, o: string): Promise<Client | undefined> { const { data } = await supabase.from('clients').select('*').eq('id', id).eq('owner_user_id', o).single(); return data ? toCamel(data) : undefined; }
  async createClient(c: InsertClient, o: string): Promise<Client> { const { data } = await supabase.from('clients').insert(toSnake({...c, ownerUserId: o})).select().single(); return toCamel(data); }
  async updateClient(id: string, o: string, c: Partial<InsertClient>): Promise<Client | undefined> { const { data } = await supabase.from('clients').update(toSnake(c)).eq('id', id).eq('owner_user_id', o).select().single(); return data ? toCamel(data) : undefined; }
  async deleteClient(id: string, o: string): Promise<boolean> { const { data } = await supabase.from('clients').delete().eq('id', id).eq('owner_user_id', o).select(); return !!data?.length; }

  async getAllDeals(o: string): Promise<Deal[]> { const { data } = await supabase.from('deals').select('*').eq('owner_user_id', o); return toCamel(data || []); }
  async createDeal(d: InsertDeal, o: string): Promise<Deal> { const { data } = await supabase.from('deals').insert(toSnake({...d, ownerUserId: o})).select().single(); return toCamel(data); }
  async updateDeal(id: string, o: string, d: Partial<InsertDeal>): Promise<Deal | undefined> { const { data } = await supabase.from('deals').update(toSnake(d)).eq('id', id).eq('owner_user_id', o).select().single(); return data ? toCamel(data) : undefined; }
  async deleteDeal(id: string, o: string): Promise<boolean> { const { data } = await supabase.from('deals').delete().eq('id', id).eq('owner_user_id', o).select(); return !!data?.length; }

  async getInterviewsByApplicationId(aId: string): Promise<Interview[]> { const { data } = await supabase.from('interviews').select('*').eq('application_id', aId); return toCamel(data || []); }
  async getAllInterviews(): Promise<Interview[]> { const { data } = await supabase.from('interviews').select('*'); return toCamel(data || []); }
  async createInterview(i: InsertInterview): Promise<Interview> { const { data } = await supabase.from('interviews').insert(toSnake(i)).select().single(); return toCamel(data); }
  async updateInterview(id: string, i: Partial<InsertInterview>): Promise<Interview | undefined> { const { data } = await supabase.from('interviews').update(toSnake(i)).eq('id', id).select().single(); return data ? toCamel(data) : undefined; }
  async deleteInterview(id: string): Promise<boolean> { const { data } = await supabase.from('interviews').delete().eq('id', id).select(); return !!data?.length; }

  async getSubmissionsByApplicationId(aId: string, o: string): Promise<Submission[]> { const { data } = await supabase.from('submissions').select('*').eq('application_id', aId).eq('owner_user_id', o); return toCamel(data || []); }
  async getAllSubmissions(o: string): Promise<Submission[]> { const { data } = await supabase.from('submissions').select('*').eq('owner_user_id', o); return toCamel(data || []); }
  async createSubmission(s: InsertSubmission, o: string): Promise<Submission | undefined> { const { data } = await supabase.from('submissions').insert(toSnake({...s, ownerUserId: o})).select().single(); return toCamel(data); }
  async updateSubmission(id: string, o: string, s: Partial<InsertSubmission>): Promise<Submission | undefined> { const { data } = await supabase.from('submissions').update(toSnake(s)).eq('id', id).eq('owner_user_id', o).select().single(); return data ? toCamel(data) : undefined; }
  async deleteSubmission(id: string, o: string): Promise<boolean> { const { data } = await supabase.from('submissions').delete().eq('id', id).eq('owner_user_id', o).select(); return !!data?.length; }

  async getActivitiesByApplicationId(aId: string): Promise<Activity[]> { const { data } = await supabase.from('activities').select('*').eq('application_id', aId); return toCamel(data || []); }
  async createActivity(a: InsertActivity, c?: string | null): Promise<Activity> { const { data } = await supabase.from('activities').insert(toSnake({...a, createdByUserId: c})).select().single(); return toCamel(data); }
  async setJobSeekerHotlist(id: number, h: boolean, n?: string | null): Promise<JobSeeker | undefined> { const { data } = await supabase.from('job_seekers').update(toSnake({ isHotlisted: h, hotlistNotes: n })).eq('id', id).select().single(); return data ? toCamel(data) : undefined; }
  async getHotlistedJobSeekers(): Promise<JobSeeker[]> { const { data } = await supabase.from('job_seekers').select('*').eq('is_hotlisted', true); return toCamel(data || []); }
  async updateJobSeeker(id: number, u: Partial<UpdateJobSeeker>): Promise<JobSeeker | undefined> { const { data } = await supabase.from('job_seekers').update(toSnake(u)).eq('id', id).select().single(); return data ? toCamel(data) : undefined; }

  async createAiEvaluation(e: Omit<AiEvaluation, "id" | "createdAt">): Promise<AiEvaluation> { const { data } = await supabase.from('ai_evaluations').insert(toSnake(e)).select().single(); return toCamel(data); }
  async getAiEvaluations(o: string): Promise<AiEvaluation[]> { const { data } = await supabase.from('ai_evaluations').select('*').eq('owner_user_id', o); return toCamel(data || []); }
  async getAiEvaluationById(id: string, o: string): Promise<AiEvaluation | undefined> { const { data } = await supabase.from('ai_evaluations').select('*').eq('id', id).eq('owner_user_id', o).single(); return data ? toCamel(data) : undefined; }
  async deleteAiEvaluation(id: string, o: string): Promise<boolean> { const { data } = await supabase.from('ai_evaluations').delete().eq('id', id).eq('owner_user_id', o).select(); return !!data?.length; }

  async createAiAssessment(a: any): Promise<AiAssessment> { const { data } = await supabase.from('ai_assessments').insert(toSnake(a)).select().single(); return toCamel(data); }
  async getAiAssessments(o: string): Promise<AiAssessment[]> { const { data } = await supabase.from('ai_assessments').select('*').eq('owner_user_id', o); return toCamel(data || []); }
  async getAiAssessmentById(id: string, o: string): Promise<AiAssessment | undefined> { const { data } = await supabase.from('ai_assessments').select('*').eq('id', id).eq('owner_user_id', o).single(); return data ? toCamel(data) : undefined; }
  async deleteAiAssessment(id: string, o: string): Promise<boolean> { const { data } = await supabase.from('ai_assessments').delete().eq('id', id).eq('owner_user_id', o).select(); return !!data?.length; }

  async getAllOnboardings(o: string): Promise<Onboarding[]> { const { data } = await supabase.from('onboardings').select('*').eq('owner_user_id', o); return toCamel(data || []); }
  async createOnboarding(input: InsertOnboarding, o: string): Promise<Onboarding> { const { data } = await supabase.from('onboardings').insert(toSnake({...input, ownerUserId: o})).select().single(); return toCamel(data); }
  async updateOnboarding(id: string, o: string, updates: Partial<InsertOnboarding>): Promise<Onboarding | undefined> { const { data } = await supabase.from('onboardings').update(toSnake(updates)).eq('id', id).eq('owner_user_id', o).select().single(); return data ? toCamel(data) : undefined; }
  async deleteOnboarding(id: string, o: string): Promise<boolean> { const { data } = await supabase.from('onboardings').delete().eq('id', id).eq('owner_user_id', o).select(); return !!data?.length; }

  async getAllInvoices(o: string): Promise<Invoice[]> { const { data } = await supabase.from('invoices').select('*').eq('owner_user_id', o); return toCamel(data || []); }
  async createInvoice(input: InsertInvoice, o: string): Promise<Invoice> { const { data } = await supabase.from('invoices').insert(toSnake({...input, ownerUserId: o})).select().single(); return toCamel(data); }
  async updateInvoice(id: string, o: string, updates: Partial<InsertInvoice>): Promise<Invoice | undefined> { const { data } = await supabase.from('invoices').update(toSnake(updates)).eq('id', id).eq('owner_user_id', o).select().single(); return data ? toCamel(data) : undefined; }
  async deleteInvoice(id: string, o: string): Promise<boolean> { const { data } = await supabase.from('invoices').delete().eq('id', id).eq('owner_user_id', o).select(); return !!data?.length; }

  async getAllESignatures(o: string): Promise<ESignature[]> { const { data } = await supabase.from('e_signatures').select('*').eq('owner_user_id', o); return toCamel(data || []); }
  async createESignature(input: InsertESignature, o: string): Promise<ESignature> { const { data } = await supabase.from('e_signatures').insert(toSnake({...input, ownerUserId: o})).select().single(); return toCamel(data); }
  async updateESignature(id: string, o: string, updates: Partial<InsertESignature>): Promise<ESignature | undefined> { const { data } = await supabase.from('e_signatures').update(toSnake(updates)).eq('id', id).eq('owner_user_id', o).select().single(); return data ? toCamel(data) : undefined; }
  async deleteESignature(id: string, o: string): Promise<boolean> { const { data } = await supabase.from('e_signatures').delete().eq('id', id).eq('owner_user_id', o).select(); return !!data?.length; }

  async getAllBackgroundChecks(o: string): Promise<BackgroundCheck[]> { const { data } = await supabase.from('background_checks').select('*').eq('owner_user_id', o); return toCamel(data || []); }
  async createBackgroundCheck(input: InsertBackgroundCheck, o: string): Promise<BackgroundCheck> { const { data } = await supabase.from('background_checks').insert(toSnake({...input, ownerUserId: o})).select().single(); return toCamel(data); }
  async updateBackgroundCheck(id: string, o: string, updates: Partial<InsertBackgroundCheck>): Promise<BackgroundCheck | undefined> { const { data } = await supabase.from('background_checks').update(toSnake(updates)).eq('id', id).eq('owner_user_id', o).select().single(); return data ? toCamel(data) : undefined; }
  async deleteBackgroundCheck(id: string, o: string): Promise<boolean> { const { data } = await supabase.from('background_checks').delete().eq('id', id).eq('owner_user_id', o).select(); return !!data?.length; }

  async getAllEmails(o: string): Promise<Email[]> { const { data } = await supabase.from('emails').select('*').eq('owner_user_id', o); return toCamel(data || []); }
  async createEmail(input: InsertEmail, o: string): Promise<Email> { const { data } = await supabase.from('emails').insert(toSnake({...input, ownerUserId: o})).select().single(); return toCamel(data); }
  async updateEmail(id: string, o: string, updates: Partial<InsertEmail>): Promise<Email | undefined> { const { data } = await supabase.from('emails').update(toSnake(updates)).eq('id', id).eq('owner_user_id', o).select().single(); return data ? toCamel(data) : undefined; }
  async deleteEmail(id: string, o: string): Promise<boolean> { const { data } = await supabase.from('emails').delete().eq('id', id).eq('owner_user_id', o).select(); return !!data?.length; }

  async getAllMeetings(o: string): Promise<Meeting[]> { const { data } = await supabase.from('meetings').select('*').eq('owner_user_id', o); return toCamel(data || []); }
  async createMeeting(input: InsertMeeting, o: string): Promise<Meeting> { const { data } = await supabase.from('meetings').insert(toSnake({...input, ownerUserId: o})).select().single(); return toCamel(data); }
  async updateMeeting(id: string, o: string, updates: Partial<InsertMeeting>): Promise<Meeting | undefined> { const { data } = await supabase.from('meetings').update(toSnake(updates)).eq('id', id).eq('owner_user_id', o).select().single(); return data ? toCamel(data) : undefined; }
  async deleteMeeting(id: string, o: string): Promise<boolean> { const { data } = await supabase.from('meetings').delete().eq('id', id).eq('owner_user_id', o).select(); return !!data?.length; }
}

export const storage = new SupabaseStorage();
