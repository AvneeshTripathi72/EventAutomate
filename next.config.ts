import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://lhxcxzbbzgsfyjrocjls.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoeGN4emJiemdzZnlqcm9jamxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxMjg3NDEsImV4cCI6MjEwMDcwNDc0MX0.h98twxSnykYOOSBrcd4iyQ-ZEdDP5NDJk8bENqDKtiQ",
    SUPABASE_SERVICE_ROLE_KEY:
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoeGN4emJiemdzZnlqcm9jamxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTEyODc0MSwiZXhwIjoyMTAwNzA0NzQxfQ.SFLzjzTn0oEg7KDdTPv4FIbJjg2HM-wHZttoRn9mA1E",
    SUPER_ADMIN_EMAIL:
      process.env.SUPER_ADMIN_EMAIL || "scrimsgame8@gmail.com",
    SUPER_ADMIN_PASSWORD:
      process.env.SUPER_ADMIN_PASSWORD || "Scrimsgame@123456789",
    RAZORPAY_KEY_ID:
      process.env.RAZORPAY_KEY_ID || "rzp_live_TJPIxelWX13Z4A",
    RAZORPAY_KEY_SECRET:
      process.env.RAZORPAY_KEY_SECRET || "Kh44Hd7AFP5VBYabIH7E39z4",
    NEXT_PUBLIC_RAZORPAY_KEY_ID:
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_KEY_ID ||
      "rzp_live_TJPIxelWX13Z4A",
    RAZORPAY_WEBHOOK_SECRET:
      process.env.RAZORPAY_WEBHOOK_SECRET || "scrims_secret_webhook_key_2026",
    SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
    SMTP_PORT: process.env.SMTP_PORT || "587",
    SMTP_USER: process.env.SMTP_USER || "scrimsgame8@gmail.com",
    SMTP_PASS: process.env.SMTP_PASS || "wbtthmlvcfmcrdpj",
    CLOUDFLARE_ACCOUNT_ID:
      process.env.CLOUDFLARE_ACCOUNT_ID || "c6482e7f02a98ecdc8a0f7d2a9d14f6e",
    R2_ACCESS_KEY_ID:
      process.env.R2_ACCESS_KEY_ID || "f8936454ca4abdd1d726f93a611e83b6",
    R2_SECRET_ACCESS_KEY:
      process.env.R2_SECRET_ACCESS_KEY ||
      "32f9ac9e5b6a1132e7bdd9cce43c8af68d0ff9410d43d94903b6305fb2d1da26",
    R2_BUCKET_NAME: process.env.R2_BUCKET_NAME || "first",
    NEXT_PUBLIC_R2_PUBLIC_URL:
      process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
      "https://pub-0035a50eaf1046efa85b6e5d1631f721.r2.dev",
  },
};

export default nextConfig;
