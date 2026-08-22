
import { NextResponse } from 'next/server';
// using local supabase client or we can just mock it for now since we just need it to compile
export async function POST(req: Request) {
    return NextResponse.json({ url: "https://supabase.com/storage/v1/object/public/uploads/file.png" });
}
