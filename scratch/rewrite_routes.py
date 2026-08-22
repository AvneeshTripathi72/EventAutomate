import re

def process_file():
    with open('server/routes.ts', 'r', encoding='utf-8') as f:
        content = f.read()

    # Imports
    content = content.replace('import { db } from "./db";', 'import { supabase, toCamel, toSnake } from "./supabase";')
    
    # 558: const existingUser = await db.select().from(jobSeekers).where(eq(jobSeekers.email, validatedData.email)).limit(1);
    content = content.replace(
        'await db.select().from(jobSeekers).where(eq(jobSeekers.email, validatedData.email)).limit(1);',
        'await supabase.from("job_seekers").select("*").eq("email", validatedData.email).single().then(r => r.data ? [toCamel(r.data)] : []);'
    )
    
    # 570: const [jobSeeker] = await db.insert(jobSeekers).values({
    content = content.replace(
        'await db.insert(jobSeekers).values(',
        'await supabase.from("job_seekers").insert(toSnake('
    )
    # The returning() at the end of insert
    content = content.replace('      }).returning();', '      })).select().then(r => toCamel(r.data) || []);')
    
    # 597: const [jobSeeker] = await db.select().from(jobSeekers).where(eq(jobSeekers.email, validatedData.email)).limit(1);
    # This is identical to 558, so the first replace might have caught it or we can do it again (it used regex).
    
    # 666: const [row] = await db.select({
    #         password: users.password,
    #         id: users.id,
    #         companyId: users.companyId,
    #         role: users.role,
    #       }).from(users).where(eq(users.username, username)).limit(1);
    content = re.sub(
        r'await db\.select\(\{\s*password: users\.password,\s*id: users\.id,\s*companyId: users\.companyId,\s*role: users\.role,\s*\}\)\.from\(users\)\.where\(eq\(users\.username, username\)\)\.limit\(1\);',
        'await supabase.from("users").select("password, id, company_id, role").eq("username", username).single().then(r => r.data ? [toCamel(r.data)] : []);',
        content
    )
    
    # 780: const [jobSeeker] = await db.select().from(jobSeekers).where(eq(jobSeekers.email, email)).limit(1);
    content = content.replace(
        'await db.select().from(jobSeekers).where(eq(jobSeekers.email, email)).limit(1);',
        'await supabase.from("job_seekers").select("*").eq("email", email).single().then(r => r.data ? [toCamel(r.data)] : []);'
    )
    
    # 796: await db.update(jobSeekers)
    content = content.replace(
        'await db.update(jobSeekers)\n        .set({ resetToken: tokenHash, resetTokenExpiry: new Date(Date.now() + 3600000) })\n        .where(eq(jobSeekers.id, jobSeeker.id));',
        'await supabase.from("job_seekers").update(toSnake({ resetToken: tokenHash, resetTokenExpiry: new Date(Date.now() + 3600000) })).eq("id", jobSeeker.id);'
    )
    
    # 853: const [jobSeeker] = await db.select().from(jobSeekers).where(eq(jobSeekers.resetToken, tokenHash)).limit(1);
    content = content.replace(
        'await db.select().from(jobSeekers).where(eq(jobSeekers.resetToken, tokenHash)).limit(1);',
        'await supabase.from("job_seekers").select("*").eq("reset_token", tokenHash).single().then(r => r.data ? [toCamel(r.data)] : []);'
    )
    
    # 864: await db.update(jobSeekers)
    content = content.replace(
        'await db.update(jobSeekers)\n        .set({ \n          password: hashedPassword, \n          resetToken: null, \n          resetTokenExpiry: null \n        })\n        .where(eq(jobSeekers.id, jobSeeker.id));',
        'await supabase.from("job_seekers").update(toSnake({ password: hashedPassword, resetToken: null, resetTokenExpiry: null })).eq("id", jobSeeker.id);'
    )
    
    # 989: const rows = await db.select().from(companies).orderBy(desc(companies.createdAt));
    content = content.replace(
        'await db.select().from(companies).orderBy(desc(companies.createdAt));',
        'await supabase.from("companies").select("*").order("created_at", { ascending: false }).then(r => toCamel(r.data) || []);'
    )
    
    # 999: const existing = await db.select({ id: users.id }).from(users).where(eq(users.username, data.adminUsername)).limit(1);
    content = content.replace(
        'await db.select({ id: users.id }).from(users).where(eq(users.username, data.adminUsername)).limit(1);',
        'await supabase.from("users").select("id").eq("username", data.adminUsername).single().then(r => r.data ? [toCamel(r.data)] : []);'
    )
    
    # 1002: const [company] = await db.insert(companies).values({
    content = content.replace(
        'await db.insert(companies).values(',
        'await supabase.from("companies").insert(toSnake('
    )
    
    # 1010: const [adminUser] = await db.insert(users).values({
    content = content.replace(
        'await db.insert(users).values(',
        'await supabase.from("users").insert(toSnake('
    )
    
    # 1030: const [updated] = await db.update(companies)
    content = content.replace(
        'await db.update(companies)\n        .set(data)\n        .where(eq(companies.id, req.params.id))\n        .returning();',
        'await supabase.from("companies").update(toSnake(data)).eq("id", req.params.id).select().then(r => toCamel(r.data) || []);'
    )
    
    # 1042: await db.delete(users).where(eq(users.companyId, req.params.id));
    content = content.replace(
        'await db.delete(users).where(eq(users.companyId, req.params.id));',
        'await supabase.from("users").delete().eq("company_id", req.params.id);'
    )
    
    # 1043: const [deleted] = await db.delete(companies).where(eq(companies.id, req.params.id)).returning({ id: companies.id });
    content = content.replace(
        'await db.delete(companies).where(eq(companies.id, req.params.id)).returning({ id: companies.id });',
        'await supabase.from("companies").delete().eq("id", req.params.id).select("id").then(r => toCamel(r.data) || []);'
    )
    
    # 1052: const rows = await db.select({ ... }).from(users).where(eq(users.companyId, companyId)).orderBy(desc(users.createdAt));
    content = re.sub(
        r'await db\.select\(\{[\s\S]*?\}\)\.from\(users\)\.where\(eq\(users\.companyId, companyId\)\)\.orderBy\(desc\(users\.createdAt\)\);',
        'await supabase.from("users").select("id, username, email, full_name, role, company_id, created_at, active").eq("company_id", companyId).order("created_at", { ascending: false }).then(r => toCamel(r.data) || []);',
        content
    )
    
    # 1067: const rows = await db.select({ ... }).from(users).orderBy(desc(users.createdAt));
    content = re.sub(
        r'await db\.select\(\{[\s\S]*?\}\)\.from\(users\)\.orderBy\(desc\(users\.createdAt\)\);',
        'await supabase.from("users").select("id, username, email, full_name, role, company_id, created_at, active").order("created_at", { ascending: false }).then(r => toCamel(r.data) || []);',
        content
    )
    
    # 1081: const existing = await db.select({ id: users.id }).from(users).where(eq(users.username, data.username)).limit(1);
    content = content.replace(
        'await db.select({ id: users.id }).from(users).where(eq(users.username, data.username)).limit(1);',
        'await supabase.from("users").select("id").eq("username", data.username).single().then(r => r.data ? [toCamel(r.data)] : []);'
    )
    
    # 1106: const [updated] = await db.update(users)
    content = content.replace(
        'await db.update(users)\n        .set(updateData)\n        .where(eq(users.id, parseInt(req.params.id)))\n        .returning({',
        'await supabase.from("users").update(toSnake(updateData)).eq("id", parseInt(req.params.id)).select("id, username, email, full_name, role, company_id, created_at, active").then(r => toCamel(r.data) || []); /*'
    )
    # Hack to comment out the rest of the object
    content = content.replace('          active: users.active,\n        });', '          active: users.active,\n        }); */')
    
    # 1120: const [deleted] = await db.delete(users)
    content = content.replace(
        'await db.delete(users)\n        .where(eq(users.id, parseInt(req.params.id)))\n        .returning({ id: users.id });',
        'await supabase.from("users").delete().eq("id", parseInt(req.params.id)).select("id").then(r => toCamel(r.data) || []);'
    )
    
    # 1232: const [app] = await db.select().from(applications).where(eq(applications.id, data.applicationId)).limit(1);
    content = content.replace(
        'await db.select().from(applications).where(eq(applications.id, data.applicationId)).limit(1);',
        'await supabase.from("applications").select("*").eq("id", data.applicationId).single().then(r => r.data ? [toCamel(r.data)] : []);'
    )

    with open('server/routes.ts', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    process_file()
