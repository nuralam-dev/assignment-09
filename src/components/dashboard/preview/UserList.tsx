"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { users } from "./data";
import {
  FilterSelect,
  PreviewAction,
  PreviewTable,
  StatusBadge,
} from "./DashboardUI";

export default function UserList({ recent = false }: { recent?: boolean }) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const filtered = users.filter(
    (user) =>
      (role === "all" || user.role === role) &&
      `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase()),
  );
  const rows = recent ? filtered.slice(0, 3) : filtered;
  return (
    <div className="space-y-4">
      {!recent && (
        <div className="flex flex-wrap gap-3">
          <Input
            type="search"
            aria-label="Search users"
            placeholder="Search by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 sm:max-w-xs"
          />
          <FilterSelect
            label="Roles"
            value={role}
            onChange={setRole}
            options={["all", "customer", "technician", "admin"]}
          />
        </div>
      )}
      <PreviewTable
        headers={
          recent
            ? ["User", "Role", "Joined"]
            : ["User", "Email", "Role", "Joined date", "Role preview"]
        }
        rows={rows.map((user) => {
          const identity = (
            <div className="flex items-center gap-3">
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-teal-800"
                aria-label={`${user.name} avatar`}
              >
                {user.initials}
              </span>
              <span className="font-medium text-[#092e33]">{user.name}</span>
            </div>
          );
          return recent
            ? [
                identity,
                <StatusBadge key="role" status={user.role} />,
                user.joined,
              ]
            : [
                identity,
                user.email,
                <StatusBadge key="role" status={user.role} />,
                user.joined,
                <PreviewAction
                  key="action"
                  label="Change role"
                  title={`Role preview: ${user.name}`}
                >
                  <label className="grid gap-2 text-sm text-slate-600">
                    Select role (preview only)
                    <select
                      defaultValue={user.role}
                      className="h-10 rounded-lg border px-3"
                    >
                      <option value="customer">Customer</option>
                      <option value="technician">Technician</option>
                      <option value="admin">Admin</option>
                    </select>
                  </label>
                </PreviewAction>,
              ];
        })}
      />
    </div>
  );
}
