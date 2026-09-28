import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  CreditCard,
  FormInput,
  Users,
  Plus,
  ExternalLink,
  Clock,
  Send,
  Ticket,
  UserPlus,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationPayments } from "@/actions/payment";

export default async function OrgDashboardPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let formsCount = 2;
  let membersCount = 1;

  try {
    const { data: orgData } = await supabase.from("organizations").select("id").eq("slug", orgSlug).single();
    if (orgData) {
      const [{ count: fCount }, { count: mCount }] = await Promise.all([
        supabase.from("forms").select("*", { count: "exact", head: true }).eq("organization_id", orgData.id),
        supabase.from("organization_members").select("*", { count: "exact", head: true }).eq("organization_id", orgData.id)
      ]);
      formsCount = fCount || 0;
      membersCount = mCount || 1;
    }
  } catch (e) {
    console.warn("Could not query org counts from Supabase, using RAM stats:", e);
  }

  const payments = await getOrganizationPayments(orgSlug);
  const realTotalRevenue = payments.reduce((acc: number, p: any) => acc + p.amount, 0);

  const commissionRate = user?.user_metadata?.commission_rate || 5;
  const commissionMultiplier = commissionRate / 100;

  const finalRevenue = realTotalRevenue * commissionMultiplier;
  const formattedRevenue = finalRevenue.toFixed(2);

  const recentPayments = payments.slice(0, 6);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* ── Standard Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Club Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back to <strong className="text-foreground">{orgSlug}</strong>. Overview of campus events, registrations, and club funds.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={`/dashboard/${orgSlug}/event-registration`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex items-center gap-2")}
          >
            <ExternalLink className="h-4 w-4" />
            <span>Student Portal</span>
          </Link>
          <Link
            href={`/dashboard/${orgSlug}/forms/new`}
            className={cn(buttonVariants({ size: "sm" }), "flex items-center gap-2")}
          >
            <Plus className="h-4 w-4" />
            <span>Create Event</span>
          </Link>
        </div>
      </div>

      {/* ── 4 Key Metrics Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Funds Collected</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{formattedRevenue}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From event &amp; fest registrations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Forms</CardTitle>
            <FormInput className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Open for student submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Club Coordinators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{membersCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active members in your org
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Campus Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active campus events scheduled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Content Grid: Recent Activity + Quick Actions ── */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 min-h-[320px]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Registrations &amp; Payments</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Latest participants and paid event entries.
                </CardDescription>
              </div>
              <Link
                href={`/dashboard/${orgSlug}/billing`}
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs")}
              >
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col text-sm h-full space-y-4">
            {recentPayments.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-muted-foreground h-44 text-center border rounded-lg border-dashed">
                <Ticket className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="font-medium text-foreground">No registrations recorded yet</p>
                <p className="text-xs text-muted-foreground mt-0.5">Share your event form link to begin collecting registrations.</p>
              </div>
            ) : (
              recentPayments.map((payment: any) => (
                <div key={payment.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="space-y-0.5">
                    <p className="font-medium text-sm">Form Submission Paid</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[280px]">
                      {payment.submission?.form?.title || "Campus Event Pass"} • {payment.razorpay_payment_id || "Direct"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">+₹{(payment.amount * commissionMultiplier).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-0.5">
                      <Clock className="h-3 w-3" />
                      {new Date(payment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* ── Quick Actions ── */}
        <Card className="col-span-3 min-h-[320px]">
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Common tasks to manage your events.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link
              href={`/dashboard/${orgSlug}/forms/new`}
              className="p-3.5 border rounded-lg hover:border-primary transition-colors cursor-pointer group block"
            >
              <h4 className="text-sm font-medium group-hover:text-primary transition-colors flex items-center gap-2">
                <FormInput className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                Create a new event form
              </h4>
              <p className="text-xs text-muted-foreground mt-1">Build an event registration form with custom fields and fees.</p>
            </Link>

            <Link
              href={`/dashboard/${orgSlug}/notifications`}
              className="p-3.5 border rounded-lg hover:border-primary transition-colors cursor-pointer group block"
            >
              <h4 className="text-sm font-medium group-hover:text-primary transition-colors flex items-center gap-2">
                <Send className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                Send broadcast / passes
              </h4>
              <p className="text-xs text-muted-foreground mt-1">Email announcements, passes, and updates to participants.</p>
            </Link>

            <Link
              href={`/dashboard/${orgSlug}/members`}
              className="p-3.5 border rounded-lg hover:border-primary transition-colors cursor-pointer group block"
            >
              <h4 className="text-sm font-medium group-hover:text-primary transition-colors flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                Invite team members
              </h4>
              <p className="text-xs text-muted-foreground mt-1">Add student coordinators or admins to help manage your club.</p>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
