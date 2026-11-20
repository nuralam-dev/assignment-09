"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  FilterSelect,
  PreviewTable,
  StatusBadge,
} from "@/components/dashboard/preview/DashboardUI";
import AdminData, { adminRequest } from "./AdminData";
import { date, isUsers, type AdminUser } from "./types";

function UserDirectory({
  users,
  refresh,
}: {
  users: AdminUser[];
  refresh: () => void;
}) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const busy = useRef(false);
  const cancel = useRef<HTMLButtonElement | null>(null);
  const filtered = users.filter(
    (user) =>
      (role === "all" || user.role === role) &&
      `${user.name ?? ""} ${user.email ?? ""}`
        .toLowerCase()
        .includes(search.trim().toLowerCase()),
  );
  async function changeRole() {
    if (!selected || busy.current) return;
    busy.current = true;
    setSaving(true);
    setError("");
    const nextRole = selected.role === "customer" ? "technician" : "customer";
    try {
      const result = await adminRequest(`users/${selected._id}/role`, {
        role: nextRole,
      });
      if (
        !result ||
        typeof result !== "object" ||
        !("role" in result) ||
        result.role !== nextRole ||
        !("_id" in result) ||
        result._id !== selected._id
      )
        throw new Error(
          "Unexpected role update response. Refresh and try again.",
        );
      toast.success("User role updated");
      setSelected(null);
      refresh();
    } catch (err) {
      const message =
        err instanceof Error && err.name === "Error"
          ? err.message
          : "Could not save the role. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        <Input
          aria-label="Search users"
          placeholder="Search name or email"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-sm"
        />
        <FilterSelect
          label="Roles"
          value={role}
          onChange={setRole}
          options={["all", "customer", "technician", "admin"]}
        />
      </div>
      <PreviewTable
        headers={["User", "Email", "Role", "Registered", "Action"]}
        rows={filtered.map((user) => [
          <div key="user" className="flex items-center gap-3">
            {user.image && /^https?:\/\//.test(user.image) ? (
              <Image
                src={user.image}
                alt=""
                width={36}
                height={36}
                unoptimized
                className="size-9 rounded-full object-cover"
              />
            ) : (
              <span
                aria-hidden
                className="flex size-9 items-center justify-center rounded-full bg-teal-50 text-teal-800"
              >
                {user.name?.trim().charAt(0).toUpperCase() || "U"}
              </span>
            )}
            <span>{user.name || "Not provided"}</span>
          </div>,
          user.email || "Not provided",
          user.role ? (
            <StatusBadge key="role" status={user.role} />
          ) : (
            "Not provided"
          ),
          date(user.createdAt),
          ["customer", "technician"].includes(user.role ?? "") ? (
            <Button
              key="action"
              variant="outline"
              disabled={saving}
              onClick={() => {
                setError("");
                setSelected(user);
              }}
            >
              Make {user.role === "customer" ? "Technician" : "Customer"}
            </Button>
          ) : (
            "Protected role"
          ),
        ])}
      />
      <AlertDialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!busy.current && !open) setSelected(null);
        }}
      >
        <AlertDialogContent initialFocus={cancel}>
          <AlertDialogTitle>Change user role?</AlertDialogTitle>
          <AlertDialogDescription className="mt-3 break-words">
            Change {selected?.name || selected?.email} from {selected?.role} to{" "}
            {selected?.role === "customer" ? "technician" : "customer"}? Their
            dashboard access will change.
          </AlertDialogDescription>
          {error && (
            <p role="alert" className="mt-4 text-sm text-red-700">
              {error}
            </p>
          )}
          <div className="mt-6 flex justify-end gap-3">
            <AlertDialogCancel ref={cancel} disabled={saving}>
              Cancel
            </AlertDialogCancel>
            <Button disabled={saving} onClick={() => void changeRole()}>
              {saving ? "Saving..." : "Confirm change"}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
export default function AdminUsers() {
  return (
    <AdminData path="users" validate={isUsers}>
      {(users, refresh) => <UserDirectory users={users} refresh={refresh} />}
    </AdminData>
  );
}
