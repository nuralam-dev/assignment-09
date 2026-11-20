import {
  FiCalendar, FiCheckCircle, FiClipboard, FiCreditCard, FiDollarSign,
  FiGrid, FiHome, FiList, FiPlusCircle, FiTool, FiUser, FiUsers,
} from "react-icons/fi";
import type { MenuItem, UserRole } from "@/typs";

export const sidebarMenus: Record<UserRole, MenuItem[]> = {
  customer: [
    { title: "Overview", url: "/dashboard/customer", icon: FiGrid },
    { title: "My Bookings", url: "/dashboard/customer/bookings", icon: FiCalendar },
    { title: "Payment History", url: "/dashboard/customer/payments", icon: FiCreditCard },
  ],
  technician: [
    { title: "Overview", url: "/dashboard/technician", icon: FiGrid },
    { title: "Add Service", url: "/dashboard/technician/add-service", icon: FiPlusCircle },
    { title: "My Services", url: "/dashboard/technician/my-services", icon: FiTool },
    { title: "Manage Requests", url: "/dashboard/technician/requests", icon: FiClipboard },
  ],
  admin: [
    { title: "Overview", url: "/dashboard/admin", icon: FiGrid },
    { title: "Manage Users", url: "/dashboard/admin/users", icon: FiUsers },
    { title: "Manage Services", url: "/dashboard/admin/services", icon: FiCheckCircle },
    { title: "All Bookings", url: "/dashboard/admin/bookings", icon: FiList },
    { title: "Transactions", url: "/dashboard/admin/transactions", icon: FiDollarSign },
  ],
};

export const accountMenu: MenuItem[] = [
  { title: "Profile", url: "/dashboard/profile", icon: FiUser },
  { title: "Back to Home", url: "/", icon: FiHome },
];
