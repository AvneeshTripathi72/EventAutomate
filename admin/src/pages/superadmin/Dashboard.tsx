import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, Users, Briefcase, FileText, 
  TrendingUp, CreditCard, Activity, CalendarClock
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from "recharts";

const data = [
  { name: 'Jan', signups: 4000, revenue: 2400 },
  { name: 'Feb', signups: 3000, revenue: 1398 },
  { name: 'Mar', signups: 2000, revenue: 9800 },
  { name: 'Apr', signups: 2780, revenue: 3908 },
  { name: 'May', signups: 1890, revenue: 4800 },
  { name: 'Jun', signups: 2390, revenue: 3800 },
  { name: 'Jul', signups: 3490, revenue: 4300 },
];

const STATS = [
  { title: "Total Companies", value: "2,845", change: "+12.5%", icon: Building2, trend: "up" },
  { title: "Active Recruiters", value: "14,293", change: "+8.2%", icon: Users, trend: "up" },
  { title: "Candidates", value: "1.2M", change: "+23.1%", icon: Users, trend: "up" },
  { title: "Jobs Posted", value: "45,231", change: "+15.3%", icon: Briefcase, trend: "up" },
  { title: "MRR", value: "$1.2M", change: "+18.2%", icon: CreditCard, trend: "up" },
  { title: "System Health", value: "99.99%", change: "0.0%", icon: Activity, trend: "neutral" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
        <p className="text-muted-foreground mt-1">
          Monitor your ATS and CRM platform metrics in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {STATS.map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs mt-1 flex items-center gap-1 ${
                stat.trend === 'up' ? 'text-emerald-500' : 'text-muted-foreground'
              }`}>
                {stat.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Growth (Signups)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="signups" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorSignups)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Recurring Revenue (MRR)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Companies Onboarded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      A{i}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Acme Staffing {i} Pvt. Ltd.</p>
                      <p className="text-xs text-muted-foreground">IT Services & Consulting</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Enterprise Plan</p>
                    <p className="text-xs text-muted-foreground">2 mins ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Resume Parsed", time: "Just now", icon: FileText },
                { action: "Candidate AI Match", time: "2 mins ago", icon: Activity },
                { action: "New Job Published", time: "15 mins ago", icon: Briefcase },
                { action: "Interview Scheduled", time: "1 hr ago", icon: CalendarClock },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full p-1.5 bg-muted">
                    <activity.icon className="h-3 w-3 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">{activity.action}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
