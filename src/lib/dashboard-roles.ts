import type { UserRole } from "@/typs";

export function isUserRole(role: unknown): role is UserRole {
  return role === "customer" || role === "technician" || role === "admin";
}
