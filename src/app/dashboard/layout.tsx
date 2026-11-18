import { Suspense } from "react";
import type { ChildrenProps } from "@/typs";
import { requireDashboardUser } from "@/lib/dashboard-access";
import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardLoading from "@/components/dashboard/DashboardLoading";

async function AuthenticatedDashboard({ children }: ChildrenProps) {
  await requireDashboardUser();
  return <DashboardShell>{children}</DashboardShell>;
}

export default function DashboardLayout({ children }: ChildrenProps) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <AuthenticatedDashboard>{children}</AuthenticatedDashboard>
    </Suspense>
  );
}
