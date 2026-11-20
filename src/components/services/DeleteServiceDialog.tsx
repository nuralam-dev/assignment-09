"use client";

import { useRef, useState } from "react";
import { FiAlertTriangle, FiLoader, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export default function DeleteServiceDialog({ service, disabled, onDeleted, onOpenChange }: {
  service: { _id: string; title: string };
  disabled?: boolean;
  onDeleted: (id: string) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const cancelButton = useRef<HTMLButtonElement | null>(null);

  function changeOpen(nextOpen: boolean) {
    if (submitting.current) return;
    setOpen(nextOpen);
    setError("");
    onOpenChange(nextOpen);
  }

  async function deleteService() {
    if (!open || submitting.current || disabled) return;
    submitting.current = true;
    setDeleting(true);
    setError("");
    try {
      const response = await fetch(`/api/technician/services/${service._id}`, {
        method: "DELETE",
        credentials: "same-origin",
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) {
        throw new Error(result.message || "Could not delete your service. Please try again.");
      }
      setOpen(false);
      onOpenChange(false);
      toast.success("Service deleted", { description: `${service.title} was deleted successfully.` });
      onDeleted(service._id);
    } catch (err) {
      const message = err instanceof Error && err.name === "Error" ? err.message : "Cannot reach FixMate right now. Please try again.";
      setError(message);
      toast.error("Service deletion failed", { description: message });
    } finally {
      submitting.current = false;
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={changeOpen}>
      <AlertDialogTrigger render={<Button type="button" variant="destructive" disabled={disabled || deleting} />}>
        <FiTrash2 aria-hidden="true" /> Delete
      </AlertDialogTrigger>
      <AlertDialogContent initialFocus={cancelButton}>
        <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <FiAlertTriangle className="size-6" aria-hidden="true" />
        </div>
        <AlertDialogTitle>Delete this service?</AlertDialogTitle>
        <AlertDialogDescription className="mt-3">
          Are you sure you want to delete <strong className="break-words text-slate-700">{service.title}</strong>?
          This action cannot be undone. Services with bookings or payment history cannot be deleted.
        </AlertDialogDescription>
        {error && <p role="alert" className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
          <AlertDialogCancel ref={cancelButton} disabled={deleting}>Cancel</AlertDialogCancel>
          <Button type="button" onClick={deleteService} disabled={deleting} aria-busy={deleting} className="bg-red-600 text-white hover:bg-red-700">
            {deleting ? <FiLoader aria-hidden="true" className="animate-spin" /> : <FiTrash2 aria-hidden="true" />}
            {deleting ? "Deleting..." : "Delete Service"}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
