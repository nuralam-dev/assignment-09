import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import { isUserRole } from "@/lib/dashboard-roles";
import type { UserRole } from "@/typs";

// Share the database-backed session read within one server render only.
const getDashboardSession = cache(async () => {
  const auth = await getAuth();
  return auth.api.getSession({
    headers: await headers(),
    query: { disableCookieCache: true },
  });
});

export async function requireDashboardUser(requiredRole?: UserRole) {
  const session = await getDashboardSession();
  if (!session) redirect("/sign-in");

  const role = session.user.role;
  if (!isUserRole(role)) redirect("/sign-in?error=invalid-role");
  if (requiredRole && role !== requiredRole) redirect(`/dashboard/${role}`);

  return { ...session.user, role };
}
