"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { PreviewDialog } from "@/components/dashboard/preview/DashboardUI";
import ServiceForm from "@/components/dashboard/preview/ServiceForm";
import type { OwnedService } from "@/components/dashboard/preview/ServiceList";
import DeleteServiceDialog from "./DeleteServiceDialog";

export default function TechnicianServiceActions({ service, onUpdated, onDeleted }: {
  service: OwnedService;
  onUpdated: (service: OwnedService) => void;
  onDeleted?: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState("");
  const updating = useRef(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function changeAvailability(isAvailable: boolean) {
    if (updating.current || open || saving || deleteOpen) return;
    updating.current = true;
    setToggling(true);
    setError("");
    try {
      const response = await fetch(`/api/technician/services/${service._id}/availability`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not update availability. Please try again.");
      }
      if (result.data?._id !== service._id || result.data.isAvailable !== isAvailable) {
        throw new Error("The server returned an unexpected response. Please reload your services.");
      }
      onUpdated(result.data);
      toast.add({ type: "success", title: "Availability updated", description: isAvailable ? "Your service is available. Its approval status stays the same." : "Your service is unavailable and hidden from public listings." });
    } catch (err) {
      const message = err instanceof Error && err.name === "Error" ? err.message : "Cannot reach FixMate right now. Please try again.";
      setError(message);
      toast.add({ type: "error", title: "Availability update failed", description: message });
    } finally {
      updating.current = false;
      setToggling(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="outline" disabled={toggling || deleteOpen} onClick={() => setOpen(true)}>Edit</Button>
        {onDeleted && <DeleteServiceDialog service={service} onDeleted={onDeleted} disabled={toggling || open || saving} onOpenChange={setDeleteOpen} />}
        <label className="flex items-center gap-2 text-xs text-slate-600">
          <Switch checked={service.isAvailable} onCheckedChange={changeAvailability} disabled={toggling || open || saving || deleteOpen} aria-label={`Availability for ${service.title}`} aria-busy={toggling} />
          <span>{toggling ? "Updating..." : service.isAvailable ? "Available" : "Unavailable"}</span>
        </label>
      </div>
      {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
      <PreviewDialog open={open} onOpenChange={setOpen} title="Edit service" description="Update your service details. Changed details will be reviewed by an admin again." closeLabel="Cancel" busy={saving}>
        {open && <ServiceForm ownedService={service} compact onSubmittingChange={setSaving} onSaved={(updated) => { onUpdated(updated); setOpen(false); }} />}
      </PreviewDialog>
    </div>
  );
}
