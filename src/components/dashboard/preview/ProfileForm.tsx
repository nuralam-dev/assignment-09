"use client";
import { useState } from "react";
import { FiEdit2, FiUser } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Panel, PreviewDialog, StatusBadge } from "./DashboardUI";

export default function ProfileForm({
  user,
}: {
  user: { name: string; email: string; role: string; image?: string | null };
}) {
  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const field = "grid gap-2 text-sm font-medium text-slate-700";
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <Panel title="Profile photo" description="Your account at a glance">
        <div className="flex flex-col items-center gap-4 py-4">
          <span
            className="flex size-24 items-center justify-center rounded-full bg-teal-50 text-3xl font-semibold text-teal-800"
            aria-label={`${user.name} avatar`}
          >
            {user.name.trim().charAt(0).toUpperCase() || <FiUser />}
          </span>
          <div className="text-center">
            <h2 className="font-semibold text-[#092e33]">{user.name}</h2>
            <p className="mb-3 mt-1 break-all text-xs text-slate-500">
              {user.email}
            </p>
            <StatusBadge status={user.role} />
          </div>
          <label className="w-full space-y-2 text-xs text-slate-500">
            Profile Image
            <Input
              aria-label="Profile Image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              disabled={!editing}
              className="h-auto py-2"
            />
            <span className="block">
              Local selection only. No upload takes place.
            </span>
          </label>
        </div>
      </Panel>
      <Panel
        title="Personal information"
        description="Edit fields to preview your profile form."
        action={
          <Button
            type="button"
            variant="outline"
            onClick={() => setEditing(!editing)}
            aria-pressed={editing}
          >
            <FiEdit2 />
            {editing ? "Finish Editing" : "Edit Profile"}
          </Button>
        }
      >
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            setOpen(true);
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={field}>
              Full Name
              <Input
                defaultValue={user.name}
                readOnly={!editing}
                className="h-10"
              />
            </label>
            <label className={field}>
              Email
              <Input
                type="email"
                value={user.email}
                readOnly
                className="h-10 bg-slate-50 text-slate-500"
              />
            </label>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={field}>
              Phone
              <Input
                type="tel"
                placeholder="e.g. +880 1712 345678"
                readOnly={!editing}
                className="h-10"
              />
            </label>
            <label className={field}>
              Area
              <Input
                placeholder="e.g. Dhanmondi, Dhaka"
                readOnly={!editing}
                className="h-10"
              />
            </label>
          </div>
          <label className={field}>
            Bio
            <textarea
              rows={4}
              readOnly={!editing}
              placeholder="Tell us a little about yourself..."
              className="w-full rounded-lg border border-input px-3 py-2 font-normal outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
            />
          </label>
          <label className={field}>
            Role
            <Input
              value={user.role}
              readOnly
              className="h-10 bg-slate-50 capitalize text-slate-500"
            />
          </label>
          <p className="text-xs leading-relaxed text-slate-500">
            Email and role are read-only. Form changes stay in this preview and
            are not saved to your account.
          </p>
          <div className="flex justify-end border-t pt-5">
            <Button
              type="submit"
              disabled={!editing}
              className="h-10 bg-[#f97316] px-5 text-white hover:bg-orange-600"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Panel>
      <PreviewDialog
        open={open}
        onOpenChange={setOpen}
        title="Profile changes preview"
      >
        <p className="rounded-xl bg-orange-50 p-4 text-sm leading-relaxed text-orange-800">
          No profile changes have been saved. This is the UI for a future
          profile update feature.
        </p>
      </PreviewDialog>
    </div>
  );
}
