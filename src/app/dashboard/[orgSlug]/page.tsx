import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  CreditCard,
  FormInput,
  Users,
  GraduationCap,
  Sparkles,
  QrCode,
  ArrowRight,
  Clock,
  CheckCircle2,
  Zap,
  Ticket,
  Send,
  PlusCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* ── Header with Title & Action ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <GraduationCap className="h-3.5 w-3.5" />
              College Event Automation Platform
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Club &amp; Event Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Managing event automation for <strong className="text-foreground">{orgSlug}</strong>. Seamless registration, automated UPI/Razorpay payments &amp; digital QR passes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href={`/dashboard/${orgSlug}/event-registration`}>
              <ExternalLink className="h-4 w-4" />
              Student Portal
            </Link>
          </Button>
          <Button asChild size="sm" className="gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md shadow-violet-500/20">
            <Link href={`/dashboard/${orgSlug}/forms/new`}>
              <PlusCircle className="h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>
      </div>

      {/* ── College Event Automation Pipeline Flow ── */}
      <div className="rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-950/40 via-background to-indigo-950/30 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-violet-400" />
            <h3 className="text-sm font-semibold text-foreground">Club Event Automation Workflow</h3>
          </div>
          <span className="text-xs text-muted-foreground">Automated from start to finish</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-lg bg-card/60 border border-border/60 flex items-start gap-3">
            <div className="p-2 rounded-md bg-violet-500/10 text-violet-400 shrink-0">
              <FormInput className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">1. Create Event Form</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Define fee, team size &amp; custom club questions.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-card/60 border border-border/60 flex items-start gap-3">
            <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-400 shrink-0">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">2. Auto Payment</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">UPI &amp; Razorpay payment verified instantly.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-card/60 border border-border/60 flex items-start gap-3">
            <div className="p-2 rounded-md bg-cyan-500/10 text-cyan-400 shrink-0">
              <QrCode className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">3. QR Passes Sent</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Auto-generated entry passes sent to student inbox.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-card/60 border border-border/60 flex items-start gap-3">
            <div className="p-2 rounded-md bg-amber-500/10 text-amber-400 shrink-0">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">4. Live Check-in</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Volunteer QR scanning &amp; auto certificates.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Key Metrics ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow border-border/80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue Collected</CardTitle>
            <CreditCard className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{formattedRevenue}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-500 font-medium">100% automated</span> via Razorpay/UPI
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-border/80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Event Forms</CardTitle>
            <FormInput className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Accepting student registrations
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-border/80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Club Coordinators</CardTitle>
            <Users className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{membersCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active organizers in {orgSlug}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-border/80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Campus Events Live</CardTitle>
            <Activity className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active campus fest in progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Main Content Area: Recent Activity & Quick Actions ── */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 min-h-[340px] border-border/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Registrations &amp; Payments</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Latest automated student entries and ticket payments.
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs">
                <Link href={`/dashboard/${orgSlug}/billing`}>
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col text-sm h-full space-y-4">
            {recentPayments.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-muted-foreground h-44 text-center border rounded-lg border-dashed">
                <Ticket className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="font-medium text-foreground">No registrations recorded yet</p>
                <p className="text-xs text-muted-foreground mt-0.5">Share your event form link to begin collecting registrations.</p>
              </div>
            ) : (
              recentPayments.map((payment: any) => (
                <div key={payment.id} className="flex items-center justify-between border-b border-border/60 pb-3 last:border-0">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">Student Registration Paid</p>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold">
                        Confirmed
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[280px]">
                      {payment.submission?.form?.title || "Campus Event Pass"} • {payment.razorpay_payment_id || "Direct"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-500">+₹{(payment.amount * commissionMultiplier).toFixed(2)}</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 justify-end mt-0.5">
                      <Clock className="h-3 w-3" />
                      {new Date(payment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* ── Quick Actions Toolkit ── */}
        <Card className="col-span-3 min-h-[340px] border-border/80">
          <CardHeader>
            <CardTitle className="text-base">Club Automation Toolkit</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Instant actions for student fests &amp; club organizers.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link
              href={`/dashboard/${orgSlug}/forms/new`}
              className="p-3.5 border border-border/80 rounded-lg hover:border-violet-500/60 hover:bg-violet-500/5 transition-all cursor-pointer group block focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium group-hover:text-violet-400 transition-colors flex items-center gap-2">
                  <FormInput className="h-4 w-4 text-violet-400" />
                  Create Event Form
                </h4>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-violet-400 transition-colors" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Set up custom registration fields, team limits, and fees.</p>
            </Link>

            <Link
              href={`/dashboard/${orgSlug}/notifications`}
              className="p-3.5 border border-border/80 rounded-lg hover:border-violet-500/60 hover:bg-violet-500/5 transition-all cursor-pointer group block focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium group-hover:text-violet-400 transition-colors flex items-center gap-2">
                  <Send className="h-4 w-4 text-cyan-400" />
                  Send Broadcast &amp; QR Passes
                </h4>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-violet-400 transition-colors" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Email digital tickets, rulebooks &amp; WhatsApp reminders.</p>
            </Link>

            <Link
              href={`/dashboard/${orgSlug}/members`}
              className="p-3.5 border border-border/80 rounded-lg hover:border-violet-500/60 hover:bg-violet-500/5 transition-all cursor-pointer group block focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium group-hover:text-violet-400 transition-colors flex items-center gap-2">
                  <Users className="h-4 w-4 text-amber-400" />
                  Invite Club Volunteers
                </h4>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-violet-400 transition-colors" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Add student coordinators and gate check-in scanners.</p>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
