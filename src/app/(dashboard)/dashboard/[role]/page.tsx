import { Suspense } from "react";
import { notFound } from "next/navigation";
import { FiCheckCircle, FiShield, FiUser } from "react-icons/fi";
import { requireDashboardUser } from "@/lib/dashboard-access";
import { isUserRole } from "@/lib/dashboard-roles";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardRolePageProps } from "@/typs";

async function RoleOverview({ params }: DashboardRolePageProps) {
  const { role } = await params;
  if (!isUserRole(role)) notFound();
  // Check the page too: shared layouts can persist across navigation.
  const user = await requireDashboardUser(role);

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <div>
        <Badge variant="outline" className="mb-3 border-orange-200 bg-orange-50 text-orange-700 capitalize">{role} workspace</Badge>
        <h1 className="text-2xl font-semibold tracking-tight break-words text-[#092e33] sm:text-3xl">Welcome, {user.name}</h1>
        <p className="mt-2 text-sm text-slate-500">Your FixMate workspace. Choose an option from the sidebar to get started.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><FiUser className="mb-2 size-5 text-[#f97316]" aria-hidden="true" /><CardTitle>Account</CardTitle><CardDescription>Your signed-in email</CardDescription></CardHeader>
          <CardContent className="break-all font-medium text-[#092e33]">{user.email}</CardContent>
        </Card>
        <Card>
          <CardHeader><FiShield className="mb-2 size-5 text-[#f97316]" aria-hidden="true" /><CardTitle>Your role</CardTitle><CardDescription>Assigned to your FixMate account</CardDescription></CardHeader>
          <CardContent className="font-medium text-[#092e33] capitalize">{role}</CardContent>
        </Card>
        <Card>
          <CardHeader><FiCheckCircle className="mb-2 size-5 text-[#f97316]" aria-hidden="true" /><CardTitle>Email status</CardTitle><CardDescription>Your account verification</CardDescription></CardHeader>
          <CardContent className="font-medium text-[#092e33]">{user.emailVerified ? "Verified" : "Not verified"}</CardContent>
        </Card>
      </div>
    </section>
  );
}

export default function RoleDashboardPage(props: DashboardRolePageProps) {
  return <Suspense fallback={<p role="status">Loading your overview...</p>}><RoleOverview {...props} /></Suspense>;
}
