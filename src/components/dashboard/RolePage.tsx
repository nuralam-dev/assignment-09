import { Suspense } from "react";
import { requireDashboardUser } from "@/lib/dashboard-access";
import type { ChildrenProps, UserRole } from "@/typs";

async function AuthorizedRolePage({
  children,
  role,
}: ChildrenProps & { role: UserRole }) {
  await requireDashboardUser(role);
  return children;
}

// Reuse the former role layout's existing guard after moving to explicit role folders.
export default function RolePage(props: ChildrenProps & { role: UserRole }) {
  return (
    <Suspense fallback={<p role="status">Checking dashboard access...</p>}>
      <AuthorizedRolePage {...props} />
    </Suspense>
  );
}
