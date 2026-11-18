"use client";

import type { ChildrenProps, UserRole } from "@/typs";

import { useRouter } from "next/navigation";

import DashboardSidebar from "@/components/dashboard/shared/DashboardSidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// TODO: Import BetterAuth client here.
// import { authClient } from "@/lib/auth-client";

export default function DashboardLayout({ children }: ChildrenProps) {
  const router = useRouter();

  // Temporary data for testing
  // TODO: Replace with BetterAuth session data
  const role: UserRole = "technician";
  const userName = "Demo Technician";

  const handleSignOut = async () => {
    // TODO: Connect BetterAuth Sign Out
    // const { error } = await authClient.signOut();
    // if (error) return;

    // TODO: Enable this redirect after implementing signOut.
    router.replace("/sign-in");
    router.refresh();

    console.log("Connect BetterAuth Sign Out here");
  };

  return (
    <SidebarProvider>
      {/* Sidebar */}
      <DashboardSidebar
        role={role}
        userName={userName}
        onSignOut={handleSignOut}
      />

      {/* Main Dashboard Area */}
      <SidebarInset>
        {/* Dashboard Topbar */}
        <header className="sticky top-0 z-20 flex h-[72px] items-center gap-4 border-b border-slate-200/70 bg-white/95 px-4 backdrop-blur-md md:px-8">
          {/* Sidebar Toggle */}
          <SidebarTrigger className="text-slate-700" />

          <Separator orientation="vertical" className="h-5" />

          <span className="hidden text-sm text-slate-400 sm:inline">Workspace</span>
          <span className="hidden text-slate-300 sm:inline" aria-hidden="true">/</span>
          <span className="text-sm font-medium text-slate-800">Dashboard</span>

          <div className="ml-auto flex items-center gap-3">
            <Badge variant="outline" className="hidden border-teal-200 bg-teal-50 text-teal-700 lg:inline-flex">Demo workspace</Badge>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">{userName}</p>
              <p className="text-xs capitalize text-slate-500">{role}</p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-800 ring-4 ring-teal-50">
              {userName.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-72px)] bg-[#f7f9fa] p-4 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
