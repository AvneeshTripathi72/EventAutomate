import fs from 'fs';
import path from 'path';
import { uploadFileToR2 } from './server/r2';

async function testUpload() {
  const filePath = "C:\\Users\\avani\\Downloads\\Resume_v7.pdf";
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  console.log(`Reading file: ${filePath}`);
  const buffer = fs.readFileSync(filePath);

  console.log("Uploading to Cloudflare R2...");
  try {
    const filename = `resumes/test-upload-${Date.now()}.pdf`;
    const url = await uploadFileToR2(buffer, filename, "application/pdf");
    console.log("=========================================");
    console.log("SUCCESS! File uploaded to Cloudflare R2!");
    console.log("Public URL:", url);
    console.log("=========================================");
    console.log("\nIMPORTANT: To see this file in the Cloudflare Dashboard:");
    console.log("1. Open your 'first' bucket");
    console.log("2. Click into the 'resumes' folder (or search for 'resumes/')");
  } catch (error) {
    console.error("Upload failed:", error);
  }
}

testUpload();
