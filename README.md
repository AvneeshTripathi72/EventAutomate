# EventAutomate - College & School Event Automation Platform

EventAutomate is an all-in-one web application built for managing college and school events, student fests, hackathons, workshops, club registrations, and ticketing. It empowers student councils, campus clubs, and educational institutions with the tools they need to automate event registration, collect attendee details, generate digital passes, and manage registrations seamlessly.

## 🚀 Key Features

* **Custom Event Form Builder:** Create dynamic registration forms for campus events, hackathons, seminars, and club recruitments with custom student fields (Student ID / Roll No, College Email, Department, Year, etc.).
* **Payment Integration:** Seamlessly integrated with **Razorpay** to collect event and fest registration fees securely via a native checkout popup.
* **Automated Webhooks:** Robust Razorpay webhook integration to ensure payments and registrations are recorded even if attendees close the browser early.
* **Participant & Team Management:** Automatically extracts and manages participant and team information from form submissions, allowing organizers to view and organize attendees.
* **Broadcast Announcements & Passes:** Send mass email announcements, schedules, and event credentials directly to registered student participants.
* **Permanent Analytics Data:** Features an `analytics_teams` and `analytics_payments` system to ensure crucial registration and financial data is never lost, even if original forms are archived.
* **Role-Based Access Control:** Advanced roles including Super Admins, Campus Organizers, Moderators, and Viewers.
* **Modern UI:** Built with Tailwind CSS and shadcn/ui for a responsive, modern dark-themed aesthetic.

## 🛠️ Tech Stack

* **Frontend:** Next.js (App Router), React, Tailwind CSS, shadcn/ui, Lucide Icons.
* **Backend:** Next.js Server Actions.
* **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Authentication).
* **Payments:** Razorpay API.

## ⚙️ Environment Setup

To run this project locally, you will need to set up your `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Admin Configuration
SUPER_ADMIN_EMAIL=your_super_admin_email
```

## 📦 Installation & Running Locally

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema Notes

This project relies heavily on **Supabase Postgres Triggers** to automatically sync data.

* When a `submission` is created, it syncs to `analytics_users`.
* When a `payment` is created, it syncs to `analytics_payments`.
* The `analytics_teams` table retains permanent records of all team registrations independent of the forms table.

## 🚀 Deployment

The project is optimized for deployment on **Vercel**. Ensure all environment variables are correctly mapped in the Vercel project settings, specifically `NEXT_PUBLIC_RAZORPAY_KEY_ID` which is required for the client-side checkout modal.
