"use client";

import type { DashboardSidebarProps, MenuItem } from "@/typs";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  FiTool,
  FiGrid,
  FiCalendar,
  FiCreditCard,
  FiPlusCircle,
  FiClipboard,
  FiUsers,
  FiCheckCircle,
  FiList,
  FiDollarSign,
  FiUser,
  FiHome,
  FiLogOut,
} from "react-icons/fi";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

// Customer Menu
const customerMenu: MenuItem[] = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: FiGrid,
  },
  {
    title: "My Bookings",
    url: "/dashboard/customer/bookings",
    icon: FiCalendar,
  },
  {
    title: "Payment History",
    url: "/dashboard/customer/payments",
    icon: FiCreditCard,
  },
];

// Technician Menu
const technicianMenu: MenuItem[] = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: FiGrid,
  },
  {
    title: "Add Service",
    url: "/dashboard/technician/add-service",
    icon: FiPlusCircle,
  },
  {
    title: "My Services",
    url: "/dashboard/technician/my-services",
    icon: FiTool,
  },
  {
    title: "Manage Requests",
    url: "/dashboard/technician/requests",
    icon: FiClipboard,
  },
];

// Admin Menu
const adminMenu: MenuItem[] = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: FiGrid,
  },
  {
    title: "Manage Users",
    url: "/dashboard/admin/users",
    icon: FiUsers,
  },
  {
    title: "Service Approval",
    url: "/dashboard/admin/services",
    icon: FiCheckCircle,
  },
  {
    title: "All Bookings",
    url: "/dashboard/admin/bookings",
    icon: FiList,
  },
  {
    title: "Transactions",
    url: "/dashboard/admin/transactions",
    icon: FiDollarSign,
  },
];

export default function DashboardSidebar({
  role,
  userName,
  onSignOut,
}: DashboardSidebarProps) {

  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  // Select Menu Based on Role
  let menuItems = customerMenu;

  if (role === "technician") {
    menuItems = technicianMenu;
  }

  if (role === "admin") {
    menuItems = adminMenu;
  }

  // Check Active Menu
  const isActive = (url: string) => {
    if (pathname === url) return true;

    // Prevent Overview from highlighting child routes
    if (url === "/dashboard") {
      return false;
    }

    return pathname.startsWith(url + "/");
  };

  // Close Mobile Sidebar After Navigation
  const closeSidebar = () => {
    setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200/70">

      {/* Sidebar Header */}
      <SidebarHeader className="border-b px-3 py-4">

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/" onClick={closeSidebar} />}
              size="lg"
              tooltip="FixMate"
            >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white">
                  <FiTool className="size-5" />
                </div>

                <span className="text-xl font-bold text-[#092e33]">
                  Fix<span className="text-orange-500">Mate</span>
                </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>

        <SidebarGroup>
          <SidebarGroupLabel>
            {role.charAt(0).toUpperCase() + role.slice(1)}
            {" "}Dashboard
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>

              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      render={<Link href={item.url} onClick={closeSidebar} />}
                      isActive={isActive(item.url)}
                      tooltip={item.title}
                      className="h-11 rounded-lg text-slate-600 transition-colors data-active:bg-teal-50 data-active:text-teal-800 data-active:hover:bg-teal-100"
                    >
                        <Icon className="size-5" />
                        <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>

              {/* Update Profile */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/dashboard/profile" onClick={closeSidebar} />}
                  isActive={isActive("/dashboard/profile")}
                  tooltip="Update Profile"
                  className="h-11 data-[active=true]:bg-orange-500 data-[active=true]:text-white"
                >
                    <FiUser className="size-5" />
                    <span>Update Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Back to Home */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/" onClick={closeSidebar} />}
                  tooltip="Back to Home"
                  className="h-11"
                >
                    <FiHome className="size-5" />
                    <span>Back to Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="border-t p-3">

        {/* User Information */}
        <div className="flex items-center gap-3 rounded-lg bg-gray-100 p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-1">

          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
            {userName.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold text-slate-800">
              {userName}
            </p>

            <p className="text-xs capitalize text-slate-500">
              {role}
            </p>
          </div>
        </div>

        {/* Sign Out */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onSignOut}
              tooltip="Sign Out"
              className="h-11 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <FiLogOut className="size-5" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

      </SidebarFooter>

    </Sidebar>
  );
}
