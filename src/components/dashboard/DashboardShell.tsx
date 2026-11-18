"use client";

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import type { ChildrenProps } from "@/typs";
import { authClient } from "@/lib/auth-client";
import { isUserRole } from "@/lib/dashboard-roles";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "@/components/ui/toast";
import DashboardSidebar from "./shared/DashboardSidebar";
import DashboardLoading from "./DashboardLoading";

export default function DashboardShell({ children }: ChildrenProps) {
  const router = useRouter();
  const { data: session, isPending, error, refetch } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.add({ type: "error", title: "Sign out failed", description: error.message || "Please try again." });
        return;
      }
      router.replace("/sign-in");
      router.refresh();
    } catch {
      toast.add({ type: "error", title: "Sign out failed", description: "Please try again." });
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isPending) return <DashboardLoading />;
  if (error) {
    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-xl font-semibold text-[#092e33]">Unable to load your session</h1>
        <p className="text-sm text-slate-500">Check your connection and try again.</p>
        <Button onClick={() => refetch()}>Try again</Button>
      </main>
    );
  }
  if (!session) redirect("/sign-in");
  const { role, name } = session.user;
  if (!isUserRole(role)) redirect("/sign-in?error=invalid-role");

  return (
    <SidebarProvider>
      <DashboardSidebar role={role} userName={name} isSigningOut={isSigningOut} onSignOut={handleSignOut} />
      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-20 flex h-[72px] min-w-0 items-center gap-3 border-b border-slate-200/70 bg-white/95 px-4 backdrop-blur-md md:px-8">
          <SidebarTrigger className="shrink-0 text-[#092e33]" aria-label="Toggle dashboard sidebar" />
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm font-medium text-[#092e33]">Dashboard</span>
          <div className="ml-auto flex min-w-0 items-center gap-3">
            <div className="hidden min-w-0 text-right sm:block">
              <p className="max-w-48 truncate text-sm font-semibold text-[#092e33]">{name}</p>
              <p className="text-xs text-slate-500 capitalize">{role}</p>
            </div>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600" aria-hidden="true">{name.trim().charAt(0).toUpperCase() || "U"}</span>
          </div>
        </header>
        <main className="min-h-[calc(100svh-72px)] min-w-0 bg-[#f7f9fa] p-4 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
