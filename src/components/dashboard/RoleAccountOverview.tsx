import { Suspense } from "react";
import { requireDashboardUser } from "@/lib/dashboard-access";
import { Badge } from "@/components/ui/badge";
import type { UserRole } from "@/typs";

async function RoleOverview({ role }: { role: UserRole }) {
  // Check the page too: shared layouts can persist across navigation.
  const user = await requireDashboardUser(role);

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <div>
        <Badge
          variant="outline"
          className="mb-3 border-orange-200 bg-orange-50 text-orange-700 capitalize"
        >
          {role} workspace
        </Badge>
        <h1 className="text-2xl font-semibold tracking-tight wrap-break-word text-[#092e33] capitalize sm:text-3xl">
          {role} Overview
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Welcome, {user.name}. Here is your FixMate workspace at a glance.
        </p>
      </div>
    </section>
  );
}

export default function RoleAccountOverview(props: { role: UserRole }) {
  return (
    <Suspense fallback={<p role="status">Loading your overview...</p>}>
      <RoleOverview {...props} />
    </Suspense>
  );
}
