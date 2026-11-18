import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { requireDashboardUser } from "@/lib/dashboard-access";

export const metadata: Metadata = { title: "Dashboard | FixMate" };

async function DashboardRedirect() {
  const user = await requireDashboardUser();
  return redirect(`/dashboard/${user.role}`);
}

export default function DashboardPage() {
  return <Suspense fallback={<p role="status">Opening your dashboard...</p>}><DashboardRedirect /></Suspense>;
}
