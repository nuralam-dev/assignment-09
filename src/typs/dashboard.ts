import type { IconType } from "react-icons";
import type { ChildrenProps } from "./shared";

export type UserRole = "customer" | "technician" | "admin";

export type DashboardSidebarProps = {
  role: UserRole;
  userName: string;
  isSigningOut: boolean;
  onSignOut: () => void | Promise<void>;
};

export type DashboardRolePageProps = {
  params: Promise<{ role: string }>;
};

export type DashboardRoleLayoutProps = ChildrenProps & DashboardRolePageProps;

export type MenuItem = {
  title: string;
  url: string;
  icon: IconType;
};
