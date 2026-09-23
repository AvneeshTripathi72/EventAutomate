import { createClient } from '@supabase/supabase-js';
import { ENV } from "@/lib/env";
import { createRamQueryBuilder } from "@/lib/ram-store";

export const createAdminClient = () => {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || ENV.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || ENV.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  client.from = ((table: string) => createRamQueryBuilder(table)) as any;

  return client;
};
