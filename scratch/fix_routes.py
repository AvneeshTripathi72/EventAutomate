import re

def process_file():
    with open('server/routes.ts', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Fix line 666
    content = content.replace(
        'const [row] = await supabase.from("users").select("id, username, email, full_name, role, company_id, created_at, active").eq("company_id", companyId).order("created_at", { ascending: false }).then(r => toCamel(r.data) || []);',
        'const rows = await supabase.from("users").select("id, username, email, full_name, role, company_id, created_at, active").eq("company_id", me.companyId).order("created_at", { ascending: false }).then(r => toCamel(r.data) || []);'
    )
    
    # 2. Fix line 702
    content = re.sub(
        r'const \[updated\] = await db\.update\(users\)[\s\S]*?\.returning\(\{ id: users\.id, username: users\.username, role: users\.role, email: users\.email, fullName: users\.fullName, isActive: users\.isActive \}\);',
        'const [updated] = await supabase.from("users").update(toSnake({ fullName, email, role, isActive })).eq("id", parseInt(req.params.id, 10)).eq("company_id", me.companyId).select("id, username, role, email, full_name, is_active").then(r => r.data && r.data.length > 0 ? [toCamel(r.data[0])] : []);',
        content
    )
    
    # 3. Fix line 716
    content = re.sub(
        r'const \[deleted\] = await db\.delete\(users\)[\s\S]*?\.returning\(\{ id: users\.id \}\);',
        'const [deleted] = await supabase.from("users").delete().eq("id", parseInt(req.params.id, 10)).eq("company_id", me.companyId).select("id").then(r => r.data && r.data.length > 0 ? [toCamel(r.data[0])] : []);',
        content
    )

    with open('server/routes.ts', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    process_file()
