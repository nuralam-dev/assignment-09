import { Suspense } from "react";
import { notFound } from "next/navigation";
import { requireDashboardUser } from "@/lib/dashboard-access";
import { isUserRole } from "@/lib/dashboard-roles";
import type { DashboardRoleLayoutProps } from "@/typs";

async function AuthorizedRoleLayout({ children, params }: DashboardRoleLayoutProps) {
  const { role } = await params;
  if (!isUserRole(role)) notFound();
  await requireDashboardUser(role);
  return children;
}

export default function RoleLayout(props: DashboardRoleLayoutProps) {
  return (
    <Suspense fallback={<p role="status">Checking dashboard access...</p>}>
      <AuthorizedRoleLayout {...props} />
    </Suspense>
  );
}
