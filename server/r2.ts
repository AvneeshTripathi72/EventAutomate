
import { supabase } from "./supabase";

export async function uploadToR2(fileName: string, fileBuffer: Buffer, contentType: string): Promise<string> {
    const { data, error } = await supabase.storage.from("uploads").upload(fileName, fileBuffer, { contentType, upsert: true });
    if (error) throw new Error("Supabase upload failed: " + error.message);
    const { data: publicData } = supabase.storage.from("uploads").getPublicUrl(fileName);
    return publicData.publicUrl;
}

export async function deleteFromR2(fileName: string): Promise<void> {
    const { error } = await supabase.storage.from("uploads").remove([fileName]);
    if (error) throw new Error("Supabase delete failed: " + error.message);
}

export async function getSignedUrlForDownload(fileName: string): Promise<string> {
    const { data, error } = await supabase.storage.from("uploads").createSignedUrl(fileName, 3600);
    if (error) throw new Error("Supabase signed URL failed: " + error.message);
    return data.signedUrl;
}
