"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FiUser } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Panel, StatusBadge } from "./DashboardUI";

export default function ProfileForm({
  user,
}: {
  user: { name: string; email: string; role: string; image?: string | null };
}) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [image, setImage] = useState(user.image ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const busy = useRef(false);
  const field = "grid gap-2 text-sm font-medium text-slate-700";
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    if (!name.trim() || name.trim().length > 100) {
      setError("Enter a name between 1 and 100 characters.");
      return;
    }
    if (image.trim()) {
      try {
        if (!["http:", "https:"].includes(new URL(image.trim()).protocol))
          throw new Error();
      } catch {
        setError("Use an HTTP or HTTPS image URL.");
        return;
      }
    }
    busy.current = true;
    setSaving(true);
    setError("");
    try {
      // BetterAuth updates only the current session's user; identity/email/role are never submitted.
      const result = await authClient.updateUser(
        { name: name.trim(), image: image.trim() || null },
        { signal: AbortSignal.timeout(15000) },
      );
      if (result.error)
        throw new Error(
          result.error.status === 401
            ? "Your session has expired. Please sign in again."
            : "Could not save your profile. Please try again.",
        );
      toast.success("Profile updated");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error && err.name === "Error"
          ? err.message
          : "Cannot reach FixMate. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <Panel title="Your account">
        <div className="flex flex-col items-center gap-4 py-4">
          {user.image && /^https?:\/\//.test(user.image) ? (
            <Image
              src={user.image}
              alt={`${user.name} profile`}
              width={96}
              height={96}
              unoptimized
              className="size-24 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-24 items-center justify-center rounded-full bg-teal-50 text-3xl font-semibold text-teal-800">
              {user.name.trim().charAt(0).toUpperCase() || <FiUser />}
            </span>
          )}
          <h2 className="font-semibold text-[#092e33]">{user.name}</h2>
          <p className="break-all text-sm text-slate-500">{user.email}</p>
          <StatusBadge status={user.role} />
        </div>
      </Panel>
      <Panel
        title="Personal information"
        description="Save your account name and profile image."
      >
        <form onSubmit={save} className="space-y-5">
          <fieldset disabled={saving} className="space-y-5">
            <label className={field}>
              Full Name
              <Input
                name="name"
                required
                maxLength={100}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <label className={field}>
              Profile image URL
              <Input
                name="image"
                type="url"
                maxLength={2048}
                placeholder="https://..."
                value={image}
                onChange={(event) => setImage(event.target.value)}
              />
              <span className="text-xs font-normal text-slate-500">
                Use an existing image URL, or leave blank to remove your photo.
              </span>
            </label>
            <label className={field}>
              Email
              <Input value={user.email} readOnly className="bg-slate-50" />
            </label>
            <label className={field}>
              Role
              <Input
                value={user.role}
                readOnly
                className="bg-slate-50 capitalize"
              />
            </label>
          </fieldset>
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-3 border-t pt-5">
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() => {
                setName(user.name);
                setImage(user.image ?? "");
                setError("");
              }}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#f97316] text-white hover:bg-orange-600"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}
