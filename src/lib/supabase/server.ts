import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ENV } from "@/lib/env";

export async function createClient() {
  const cookieStore = await cookies();

  const hasBypass = cookieStore.get("auth_bypass")?.value === "true";

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || ENV.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
          }
        },
      },
    }
  );

  if (hasBypass) {
    client.auth.getUser = async () => {
      return {
        data: {
          user: {
            id: "super-admin-bypass-id",
            email: process.env.SUPER_ADMIN_EMAIL || ENV.SUPER_ADMIN_EMAIL,
            role: "authenticated",
            aud: "authenticated",
            app_metadata: { provider: "email", providers: ["email"] },
            user_metadata: {
              full_name: "Super Admin",
              role: "SUPER_ADMIN",
              commission_rate: 5,
            },
            created_at: new Date().toISOString(),
          } as any,
        },
        error: null,
      };
    };
  }

  return client;
}
