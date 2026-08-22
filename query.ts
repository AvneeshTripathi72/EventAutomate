import { supabase } from "./server/supabase";

async function run() {
  const { data, error } = await supabase.from("resumes").select("resume_url").eq("id", "f047fc5f-b05b-4840-9a4f-ceefa279b433").single();
  console.log("Resume URL:", data?.resume_url, "Error:", error);
  process.exit(0);
}

run().catch(console.error);
