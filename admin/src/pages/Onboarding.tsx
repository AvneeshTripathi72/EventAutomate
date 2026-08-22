import React, { useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle2, ChevronRight, Upload, Users, Briefcase, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const STEPS = [
  { id: 1, title: "Welcome & Logo", icon: Upload },
  { id: 2, title: "Invite Team", icon: Users },
  { id: 3, title: "First Job", icon: Briefcase },
  { id: 4, title: "Completion", icon: CheckCircle2 }
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    logoUrl: "",
    teamEmails: "",
    jobTitle: "",
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Simulate API call to save onboarding preferences
      await new Promise(r => setTimeout(r, 1500));
      toast({
        title: "Workspace Ready!",
        description: "Your automated workspace is fully configured.",
      });
      setLocation("/admin");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save configuration.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-3 gap-6">
        
        {/* Progress Sidebar */}
        <Card className="md:col-span-1 bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Setup Guide</CardTitle>
            <CardDescription>Let's get your ATS ready</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isPast = step.id < currentStep;
              return (
                <div key={step.id} className={`flex items-center gap-3 ${isActive ? 'text-primary font-medium' : isPast ? 'text-slate-600' : 'text-slate-300'}`}>
                  <div className={`p-2 rounded-full ${isActive ? 'bg-primary/10 text-primary' : isPast ? 'bg-primary text-primary-foreground' : 'bg-slate-100'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{step.title}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Content Area */}
        <Card className="md:col-span-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">{STEPS[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {currentStep === 1 && "Upload your company logo to customize the portal."}
              {currentStep === 2 && "Invite recruiters and managers to your workspace."}
              {currentStep === 3 && "Post your first job to start collecting applications."}
              {currentStep === 4 && "You're all set! We've automatically created your departments, roles, and pipelines."}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="min-h-[250px]">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-12 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-primary transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mb-4" />
                  <p>Click to upload or drag and drop</p>
                  <p className="text-xs mt-2">SVG, PNG, JPG (max. 2MB)</p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Addresses (comma separated)</Label>
                  <Input 
                    placeholder="john@example.com, jane@example.com" 
                    value={formData.teamEmails}
                    onChange={(e) => setFormData({...formData, teamEmails: e.target.value})}
                  />
                </div>
                <div className="bg-primary/5 p-4 rounded-lg flex items-start gap-3">
                  <Settings className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-primary">They will automatically receive verification emails and be assigned the Recruiter role upon signup.</p>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input 
                    placeholder="e.g. Senior Frontend Developer" 
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 flex flex-col items-center justify-center py-8">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-medium">Workspace Provisioned</h3>
                <p className="text-center text-slate-500 max-w-md">
                  Your custom career page, email templates, departments, and default recruitment pipelines have been automatically generated.
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t border-slate-100 pt-6">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1 || loading}
            >
              Back
            </Button>
            
            {currentStep < STEPS.length ? (
              <Button onClick={nextStep}>
                Next <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={loading}>
                {loading ? "Finalizing..." : "Go to Dashboard"}
              </Button>
            )}
          </CardFooter>
        </Card>
        
      </div>
    </div>
  );
}
