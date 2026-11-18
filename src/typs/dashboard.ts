import type { IconType } from "react-icons";

export type UserRole = "customer" | "technician" | "admin";

export type DashboardSidebarProps = {
  role: UserRole;
  userName: string;
  onSignOut: () => void | Promise<void>;
};

export type MenuItem = {
  title: string;
  url: string;
  icon: IconType;
};
