import { hashPassword } from "../server/auth";
import { storage } from "../server/storage";
import { supabase } from "../server/supabase";

async function createUser(email: string, role: string, fullName: string) {
  const password = "password123";
  
  const existingUser = await storage.getUserByUsername(email);
  if (existingUser) {
    console.log(`User already exists locally: ${email} (${role})`);
  } else {
    const hashedPassword = await hashPassword(password);
    
    await storage.createUser({
      username: email,
      password: hashedPassword,
      role: role,
      isActive: true,
      isVerified: true,
      email: email,
      fullName: fullName,
    });
    console.log(`Successfully created user locally: ${email} (${role})`);
  }

  // Create in Supabase Auth (admin API bypasses email confirmation)
  const { data: adminUser, error: authError } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
  });

  if (authError) {
    if (authError.message.includes("already registered")) {
      console.log(`User already exists in Supabase Auth: ${email}`);
    } else {
      console.error(`Error creating user in Supabase Auth (${email}):`, authError);
    }
  } else {
    console.log(`Successfully created user in Supabase Auth: ${email}`);
  }
}

async function main() {
  await createUser(
    process.env.VITE_TEST_USERNAME || "admin@tilcons.com", 
    "super_admin", 
    "Super Admin"
  );
  
  await createUser(
    "basic@tilcons.com", 
    "company_admin", 
    "Basic Admin"
  );

  process.exit(0);
}

main().catch((err) => {
  console.error("Error creating users:", err);
  process.exit(1);
});
