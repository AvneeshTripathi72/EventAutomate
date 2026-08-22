import { Request, Response, NextFunction } from "express";
import { supabase } from "./supabase";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface Request {
      user?: SelectUser;
      isAuthenticated?: () => boolean;
    }
  }
}

// Attach a basic isAuthenticated method to req
export function setupAuth(app: any) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    req.isAuthenticated = () => !!req.user;
    next();
  });
}

// Middleware to extract user from Supabase session
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.['sb-access-token'];
  
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // Fetch local user metadata if you mirror it in the public.users table
  const { data: profile } = await supabase.from('users').select('*').eq('email', user.email).single();
  
  if (!profile) {
    // If not found in custom table, just construct a mock or return 401
    return res.status(401).json({ error: "User profile not found" });
  }

  req.user = profile as SelectUser;
  
  if (!req.user.isActive) {
    return res.status(403).json({ error: "Account disabled" });
  }

  next();
}

export async function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  await requireAuth(req, res, () => {
    if (req.user?.role !== "super_admin") {
      return res.status(403).json({ error: "Require super admin" });
    }
    next();
  });
}

export async function requireCompanyAdmin(req: Request, res: Response, next: NextFunction) {
  await requireAuth(req, res, () => {
    if (req.user?.role !== "super_admin" && req.user?.role !== "company_admin") {
      return res.status(403).json({ error: "Require company admin" });
    }
    next();
  });
}

// Mock hash logic if needed elsewhere, but Supabase handles Auth natively
export async function hashPassword(password: string) {
  return password; // Supabase uses its own hashing on the edge
}

export async function comparePasswords(supplied: string, stored: string) {
  return supplied === stored;
} 