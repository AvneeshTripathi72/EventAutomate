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
  Bot,
  ShieldCheck,
  Cpu,
  Flame,
  Layers,
  Wand2,
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
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* ── Top Neural Status Bar & Header ── */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-950/80 via-slate-950 to-indigo-950/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-cyan-600/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-inner">
                <Bot className="h-3.5 w-3.5 text-violet-400 animate-pulse" />
                EventAutomate Neural Engine v3.4
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                AI Auto-Pilot Active
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
              AI Club &amp; Event Operating System
              <Sparkles className="h-6 w-6 text-amber-400" />
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Autonomous college event automation for <span className="text-violet-300 font-semibold">{orgSlug}</span>. 
              Zero-friction registration pipelines, instant Razorpay/UPI smart verification, dynamic encrypted QR tickets &amp; AI broadcast.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/dashboard/${orgSlug}/event-registration`}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-violet-500/40 bg-violet-950/40 px-3.5 py-2 text-xs font-medium text-violet-200 shadow-sm transition-all hover:border-violet-400 hover:bg-violet-900/60 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
              <span>Student Portal</span>
            </Link>
            <Link
              href={`/dashboard/${orgSlug}/forms/new`}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/40"
            >
              <PlusCircle className="h-3.5 w-3.5 shrink-0 text-white" />
              <span>Create Event</span>
            </Link>
          </div>
        </div>

        {/* AI Copilot Quick Action Chips */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1 mr-1">
            <Zap className="h-3.5 w-3.5 text-amber-400" /> Quick AI Triggers:
          </span>
          <Link
            href={`/dashboard/${orgSlug}/forms/new`}
            className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <Sparkles className="h-3 w-3 text-violet-400" /> Generate Hackathon Form
          </Link>
          <Link
            href={`/dashboard/${orgSlug}/notifications`}
            className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <Send className="h-3 w-3 text-cyan-400" /> Dispatch WhatsApp Passes
          </Link>
          <Link
            href={`/dashboard/${orgSlug}/billing`}
            className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="h-3 w-3 text-emerald-400" /> Verify Payment Logs
          </Link>
        </div>
      </div>

      {/* ── 4-Stage Autonomous Event Pipeline Matrix ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold tracking-wider uppercase text-slate-400 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-violet-400" /> Autonomous Event Pipeline Matrix
          </h2>
          <span className="text-xs text-violet-400 font-medium bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
            End-to-End Orchestrated
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/60 p-4 transition-all duration-300 hover:border-violet-500/50 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-violet-500/10">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-violet-500/15 text-violet-400 border border-violet-500/30">
                <FormInput className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">
                Stage 01
              </span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
              Smart Form Synthesizer
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Dynamically sets registration caps, custom team fields, fees, and rules with zero code.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/60 p-4 transition-all duration-300 hover:border-emerald-500/50 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-emerald-500/10">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <CreditCard className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Stage 02
              </span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
              Razorpay &amp; UPI AI Gateway
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Instant transaction reconciliation, automated webhook confirmations &amp; fraud checks.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/60 p-4 transition-all duration-300 hover:border-cyan-500/50 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-cyan-500/10">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                <QrCode className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                Stage 03
              </span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
              Encrypted QR Pass Dispatch
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Anti-tamper digital tickets generated instantly and delivered to student emails &amp; phones.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/60 p-4 transition-all duration-300 hover:border-amber-500/50 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-amber-500/10">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                Stage 04
              </span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
              Gate Scanner &amp; Certificates
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Volunteer phone camera check-in scanner with live headcount analytics and auto e-certificates.
            </p>
          </div>
        </div>
      </div>

      {/* ── Key Telemetry & Metrics ── */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-3">
        <Card className="border border-white/10 bg-slate-900/50 hover:border-violet-500/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Event Forms</CardTitle>
            <FormInput className="h-4 w-4 text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">{formsCount}</div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-violet-300">
              <Sparkles className="h-3 w-3 text-violet-400" />
              <span>Accepting Registrations</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-slate-900/50 hover:border-cyan-500/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">Club Coordinators</CardTitle>
            <Users className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">{membersCount}</div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-cyan-300">
              <Bot className="h-3 w-3 text-cyan-400" />
              <span>Org Managers Active</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-slate-900/50 hover:border-amber-500/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">Live Campus Fests</CardTitle>
            <Activity className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">1</div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-amber-400">
              <Flame className="h-3 w-3 text-amber-400" />
              <span>Inter-College Fest Live</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Main Content Area: Live Activity & Quick Actions ── */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 min-h-[360px] border border-white/10 bg-slate-900/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Activity className="h-4 w-4 text-violet-400" />
                  Live Registration &amp; Payment Telemetry
                </CardTitle>
                <CardDescription className="text-xs mt-0.5 text-slate-400">
                  Real-time automated participant entries and instant settlements.
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="text-xs border-white/10 text-slate-300 hover:text-white">
                <Link href={`/dashboard/${orgSlug}/billing`}>
                  All Logs
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col text-sm h-full space-y-4">
            {recentPayments.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-slate-400 h-48 text-center border rounded-xl border-dashed border-white/10 bg-white/[0.02]">
                <Ticket className="h-9 w-9 text-slate-500 mb-2 opacity-60" />
                <p className="font-semibold text-slate-200">No registrations recorded yet</p>
                <p className="text-xs text-slate-400 mt-0.5">Publish your event link to start receiving automated registrations &amp; payments.</p>
              </div>
            ) : (
              recentPayments.map((payment: any) => (
                <div key={payment.id} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-white">Student Pass Auto-Confirmed</p>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30">
                        Paid &amp; Pass Sent
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-[280px]">
                      {payment.submission?.form?.title || "Campus Event Pass"} • {payment.razorpay_payment_id || "Instant Gateway"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-400 text-base">+₹{(payment.amount * commissionMultiplier).toFixed(2)}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 justify-end mt-0.5">
                      <Clock className="h-3 w-3 text-slate-500" />
                      {new Date(payment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* ── AI Quick Actions Toolkit ── */}
        <Card className="col-span-3 min-h-[360px] border border-white/10 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Bot className="h-4 w-4 text-cyan-400" />
              Club Automation Toolkit
            </CardTitle>
            <CardDescription className="text-xs mt-0.5 text-slate-400">
              Autonomous workflows for college fests &amp; student club heads.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link
              href={`/dashboard/${orgSlug}/forms/new`}
              className="p-3.5 border border-white/10 rounded-xl hover:border-violet-500/60 hover:bg-violet-500/10 transition-all cursor-pointer group block"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors flex items-center gap-2">
                  <Wand2 className="h-4 w-4 text-violet-400" />
                  Launch New Event Form
                </h4>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-violet-300 transition-colors" />
              </div>
              <p className="text-xs text-slate-400 mt-1">Configure ticket tiers, team caps, and custom screening questions.</p>
            </Link>

            <Link
              href={`/dashboard/${orgSlug}/notifications`}
              className="p-3.5 border border-white/10 rounded-xl hover:border-cyan-500/60 hover:bg-cyan-500/10 transition-all cursor-pointer group block"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                  <Send className="h-4 w-4 text-cyan-400" />
                  Broadcast Passes &amp; Updates
                </h4>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-300 transition-colors" />
              </div>
              <p className="text-xs text-slate-400 mt-1">Instant mass emails, WhatsApp announcements &amp; event rulebooks.</p>
            </Link>

            <Link
              href={`/dashboard/${orgSlug}/members`}
              className="p-3.5 border border-white/10 rounded-xl hover:border-amber-500/60 hover:bg-amber-500/10 transition-all cursor-pointer group block"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center gap-2">
                  <Users className="h-4 w-4 text-amber-400" />
                  Manage Club Coordinators
                </h4>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-amber-300 transition-colors" />
              </div>
              <p className="text-xs text-slate-400 mt-1">Invite student council leads and assign gate check-in scanners.</p>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
