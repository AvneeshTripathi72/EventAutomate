import { Route, Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { ComponentType } from "react";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: ComponentType<any>;
}) {
  const { user, isLoading } = useAuth();

  return (
    <Route path={path}>
      {(params) => {
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-border" />
            </div>
          );
        }

        if (!user) {
          return <Redirect to="/admin/signin" />;
        }

        return <Component params={params} />;
      }}
    </Route>
  );
}
