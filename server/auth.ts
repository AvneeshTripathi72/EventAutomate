// Based on blueprint:javascript_auth_all_persistance
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";

import { users } from "@shared/schema";
import { supabase, toCamel, toSnake } from "./supabase";
import { User as SelectUser, insertUserSchema, loginSchema } from "@shared/schema";
import { ZodError } from "zod";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// ─── Role-check middleware ────────────────────────────────────────────────────

/** Any authenticated admin-side user (super_admin, company_admin, recruiter). */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) return res.status(401).json({ error: "Not authenticated" });
  const user = req.user as SelectUser;
  if (!user.isActive) return res.status(403).json({ error: "Account disabled" });
  next();
}

/** Only super_admin. Used for website management and company onboarding. */
export function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) return res.status(401).json({ error: "Not authenticated" });
  const user = req.user as SelectUser;
  if (!user.isActive) return res.status(403).json({ error: "Account disabled" });
  if (user.role !== "super_admin") return res.status(403).json({ error: "Super admin access required" });
  next();
}

/** company_admin or super_admin. Used for team management within a company. */
export function requireCompanyAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) return res.status(401).json({ error: "Not authenticated" });
  const user = req.user as SelectUser;
  if (!user.isActive) return res.status(403).json({ error: "Account disabled" });
  if (user.role !== "company_admin" && user.role !== "super_admin") {
    return res.status(403).json({ error: "Company admin access required" });
  }
  next();
}

export { hashPassword, comparePasswords };

// ─── Passport + session setup ────────────────────────────────────────────────

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          return done(null, false, { message: "unverified" });
        }
        return done(null, false, { message: error.message });
      }

      // 2. Fetch the local user record from our database
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "User record not found" });
      }

      if (!user.isActive) {
        return done(null, false, { message: "Account disabled" });
      }

      return done(null, user);
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    const user = await storage.getUser(id);
    done(null, user || null);
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const existing = await storage.getUserByUsername(data.username);
      if (existing) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // 1. Sign up the user in Supabase Auth
      // This will automatically send the Supabase verification email!
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email || data.username,
        password: data.password,
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      // 2. Create the user in our local database
      const verificationToken = randomBytes(32).toString("hex");
      
      const user = await storage.createUser({
        ...data,
        password: "managed_by_supabase_auth", // Password is now handled by Supabase
        isActive: true, 
        isVerified: false, // Legacy field; Supabase handles actual verification now
        verificationToken,
      });

      res.status(201).json({ message: "Registration successful. Please check your email to verify your account." });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      next(error);
    }
  });

  app.get("/api/verify", async (req, res) => {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
      return res.status(400).json({ error: "Invalid token" });
    }

    const [user] = await supabase.from('users').select('*').eq('verification_token', token).single().then(r => r.data ? [toCamel(r.data)] : []);
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired verification link" });
    }

    await supabase.from('users').update(toSnake({ isVerified: true, verificationToken: null })).eq('id', user.id);

    res.status(200).json({ message: "Account verified successfully" });
  });

  app.post("/api/login", (req, res, next) => {
    try {
      const validatedData = loginSchema.parse(req.body);

      passport.authenticate("local", (err: any, user: SelectUser | false, info?: { message: string }) => {
        if (err) return next(err);
        if (!user) {
          if (info?.message === "unverified") {
            return res.status(401).json({
              error: "Account not verified",
              message: "Please check your email and verify your account before logging in.",
            });
          }
          return res.status(401).json({
            error: "Authentication failed",
            message: "Invalid username or password. Please try again.",
          });
        }

        req.login(user, (loginErr) => {
          if (loginErr) return next(loginErr);
          // Return full user object (including role) so client can redirect correctly
          res.status(200).json(user);
        });
      })(req, res, next);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          message: "Please provide a valid username and password.",
          details: error.errors,
        });
      }
      next(error);
    }
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });

  app.post("/api/auth/register-company", async (req, res, next) => {
    try {
      // 1. We expect data matching onboardCompanySchema (or a subset for self-serve)
      const { companyName, domain, adminUsername, adminPassword, adminEmail, adminFullName } = req.body;
      if (!companyName || !adminUsername || !adminPassword || !adminEmail) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // 2. Create Company in Supabase
      const { data: company, error: companyErr } = await supabase
        .from('companies')
        .insert(toSnake({ 
          name: companyName, 
          domain: domain || null, 
          plan: 'starter',
          isActive: true
        }))
        .select()
        .single();

      if (companyErr || !company) {
        console.error("Supabase company creation error:", companyErr);
        return res.status(500).json({ error: "Failed to create company workspace" });
      }

      const companyId = company.id;

      // 3. Create Admin User in Supabase Auth
      const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true, // Auto-confirm for self-serve to remove friction
      });

      if (authErr || !authData.user) {
        console.error("Supabase auth creation error:", authErr);
        // Rollback company? For now we just return error
        return res.status(500).json({ error: "Failed to create admin user" });
      }

      // 4. Create User Profile in `users` table linked to `companyId`
      const { data: userProfile, error: profileErr } = await supabase
        .from('users')
        .insert(toSnake({
          username: adminUsername,
          password: await hashPassword(adminPassword), // Legacy hash if used
          email: adminEmail,
          fullName: adminFullName,
          role: "company_admin",
          companyId: companyId,
          isActive: true,
          isVerified: true
        }))
        .select()
        .single();

      if (profileErr || !userProfile) {
         console.error("Supabase profile creation error:", profileErr);
         return res.status(500).json({ error: "Failed to create user profile" });
      }

      // 5. Automatically log them in (establish session)
      const mappedUser = toCamel(userProfile) as SelectUser;
      req.login(mappedUser, (loginErr) => {
        if (loginErr) return next(loginErr);
        res.status(201).json({ message: "Registration successful", user: mappedUser, company: toCamel(company) });
      });

    } catch (err) {
      console.error("Register company error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
