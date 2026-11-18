"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiLogOut, FiTool } from "react-icons/fi";
import type { DashboardSidebarProps } from "@/typs";
import { accountMenu, sidebarMenus } from "./sidebarMenus";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

export default function DashboardSidebar({
  role, userName, isSigningOut, onSignOut,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const menuItems = sidebarMenus[role];
  const menuClassName = "h-11 rounded-xl text-[#092e33] transition-colors hover:bg-orange-50 hover:text-orange-700 data-active:bg-[#f97316] data-active:text-white data-active:hover:bg-orange-600 data-active:hover:text-white";

  const isActive = (url: string) => {
    if (pathname === url) return true;
    // Overview is active only on its own page.
    if (url === `/dashboard/${role}` || url === "/") return false;
    return pathname.startsWith(`${url}/`);
  };

  const closeSidebar = () => setOpenMobile(false);

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200/70">
      <SidebarHeader className="border-b border-slate-100 px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/" onClick={closeSidebar} />} size="lg" tooltip="FixMate" className="gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#092e33] text-orange-400">
                <FiTool className="size-5" aria-hidden="true" />
              </span>
              <span className="text-xl font-bold tracking-tight text-[#092e33]">Fix<span className="text-[#f97316]">Mate</span></span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-2 px-1 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 text-xs tracking-wide text-slate-400 capitalize">{role} Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      render={<Link href={item.url} onClick={closeSidebar} aria-current={isActive(item.url) ? "page" : undefined} />}
                      isActive={isActive(item.url)} tooltip={item.title} className={menuClassName}
                    >
                      <Icon aria-hidden="true" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 text-xs tracking-wide text-slate-400">Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {accountMenu.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      render={<Link href={item.url} onClick={closeSidebar} aria-current={isActive(item.url) ? "page" : undefined} />}
                      isActive={isActive(item.url)} tooltip={item.title} className={menuClassName}
                    >
                      <Icon aria-hidden="true" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onSignOut} disabled={isSigningOut} tooltip="Sign Out" className="h-11 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700">
                  <FiLogOut aria-hidden="true" />
                  <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#092e33] text-sm font-semibold text-white" aria-hidden="true">{userName.trim().charAt(0).toUpperCase() || "U"}</span>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold text-[#092e33]">{userName}</p>
            <p className="text-xs text-slate-500 capitalize">{role}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
