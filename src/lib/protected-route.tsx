import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
  adminOnly = false,
  masterAdminOnly = false,
  superAdminOnly = false,
}: {
  path: string;
  component: () => React.JSX.Element;
  adminOnly?: boolean;
  masterAdminOnly?: boolean;
  superAdminOnly?: boolean;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/" />
      </Route>
    );
  }

  // Check for admin access if required
  if (adminOnly && !user.isAdmin) {
    return (
      <Route path={path}>
        <Redirect to="/" />
      </Route>
    );
  }

  // Check for super admin access if required
  if (superAdminOnly && !user.isSuperAdmin) {
    return (
      <Route path={path}>
        <Redirect to="/admin/dashboard" />
      </Route>
    );
  }

  // Check for master admin access if required
  if (masterAdminOnly && !user.isMasterAdmin) {
    return (
      <Route path={path}>
        <Redirect to="/admin/dashboard" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}
