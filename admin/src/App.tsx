import React, { Suspense } from "react";
import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import AgastyaChat from "@/components/AgastyaChat";
import SuperAdminLayout from "./components/layout/SuperAdminLayout";

const Admin = React.lazy(() => import("./pages/Admin"));
const SignIn = React.lazy(() => import("./pages/SignIn"));
const CompanySignUp = React.lazy(() => import("./pages/CompanySignUp"));
const Dashboard = React.lazy(() => import("./pages/superadmin/Dashboard"));

// If a not-found page is available, you can add it here.
const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
    <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
    <p>The page you are looking for does not exist in the Admin Portal.</p>
  </div>
);

function Router() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <Switch>
        {/* Auth routes without layout */}
        <Route path="/admin/login" component={SignIn} />
        <Route path="/admin/signin" component={SignIn} />
        <Route path="/admin/signup" component={CompanySignUp} />
        <Route path="/login"><Redirect to="/admin/signin" /></Route>
        <Route path="/signin"><Redirect to="/admin/signin" /></Route>

        {/* Super Admin Routes with Layout */}
        <Route path="/super-admin">
          <ProtectedRoute path="/super-admin" component={() => (
            <SuperAdminLayout>
              <Dashboard />
            </SuperAdminLayout>
          )} />
        </Route>
        <Route path="/admin/super-admin">
          <ProtectedRoute path="/admin/super-admin" component={() => (
            <SuperAdminLayout>
              <Dashboard />
            </SuperAdminLayout>
          )} />
        </Route>

        {/* Regular Admin Routes */}
        <ProtectedRoute path="/admin" component={Admin} />
        <ProtectedRoute path="/admin/:section" component={Admin} />

        {/* Catch-all redirect to /admin or NotFound */}
        <Route path="/"><Redirect to="/admin" /></Route>
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
          <AgastyaChat />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
