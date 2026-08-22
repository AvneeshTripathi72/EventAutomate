import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import logoPath from "@assets/logo.webp";

export default function CompanySignUp() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth(); // to check if already logged in
  
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    domain: "",
    adminFullName: "",
    adminEmail: "",
    adminUsername: "",
    adminPassword: ""
  });

  // If they are already logged in, redirect them
  if (user) {
    setLocation("/admin");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register-company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to register company");
      }

      toast({
        title: "Registration Successful!",
        description: "Welcome to Tilcons CRM. Setting up your workspace...",
      });
      
      // Auto-redirect to admin dashboard since the session is established
      setTimeout(() => {
        // Use window.location to force a hard reload and let context fetch the user
        window.location.href = "/admin";
      }, 1000);

    } catch (err: any) {
      toast({
        title: "Registration Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img src={logoPath} alt="Tilcons" className="h-10" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Create your Workspace</h1>
            <p className="text-muted-foreground mt-2">
              Join Tilcons ATS & CRM to streamline your recruitment process.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="companyName" 
                    name="companyName" 
                    placeholder="Acme Staffing Inc." 
                    className="pl-9" 
                    required 
                    value={form.companyName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminFullName">Your Full Name</Label>
                  <Input 
                    id="adminFullName" 
                    name="adminFullName" 
                    placeholder="John Doe" 
                    required 
                    value={form.adminFullName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain">Company Domain (Optional)</Label>
                  <Input 
                    id="domain" 
                    name="domain" 
                    placeholder="acme.com" 
                    value={form.domain}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail">Work Email</Label>
                <Input 
                  id="adminEmail" 
                  name="adminEmail" 
                  type="email" 
                  placeholder="john@acme.com" 
                  required 
                  value={form.adminEmail}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminUsername">Username</Label>
                  <Input 
                    id="adminUsername" 
                    name="adminUsername" 
                    placeholder="johndoe" 
                    required 
                    value={form.adminUsername}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminPassword">Password</Label>
                  <Input 
                    id="adminPassword" 
                    name="adminPassword" 
                    type="password" 
                    required 
                    minLength={8}
                    value={form.adminPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating workspace..." : "Get Started"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/admin/signin">
              <a className="text-primary font-medium hover:underline">Sign in</a>
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex bg-zinc-950 items-center justify-center p-8 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
        <div className="relative max-w-lg space-y-6 text-center z-10">
          <h2 className="text-3xl font-bold text-white leading-tight">
            The all-in-one platform for modern staffing agencies.
          </h2>
          <p className="text-zinc-400 text-lg">
            Manage candidates, jobs, interviews, and payments from a single unified dashboard.
          </p>
          <div className="pt-8">
            <div className="grid grid-cols-3 gap-4 border-t border-zinc-800 pt-8">
              <div>
                <p className="text-3xl font-bold text-white">10M+</p>
                <p className="text-sm text-zinc-500 mt-1">Candidates</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">99.9%</p>
                <p className="text-sm text-zinc-500 mt-1">Uptime</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">24/7</p>
                <p className="text-sm text-zinc-500 mt-1">Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
