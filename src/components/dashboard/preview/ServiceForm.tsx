"use client";
import { useRef, useState, type FormEvent } from "react";
import { FiImage, FiInfo } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PreviewDialog } from "./DashboardUI";
import type { PreviewService } from "./data";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import type { OwnedService } from "./ServiceList";

export default function ServiceForm({
  service,
  compact = false,
  live = false,
  ownedService,
  onSaved,
  onSubmittingChange,
}: {
  service?: PreviewService;
  compact?: boolean;
  live?: boolean;
  ownedService?: OwnedService;
  onSaved?: (service: OwnedService) => void;
  onSubmittingChange?: (pending: boolean) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [savedTitle, setSavedTitle] = useState("");
  const submitting = useRef(false);
  const isEditing = Boolean(ownedService);
  const isLive = (live || isEditing) && !service;
  const categories = isLive
    ? ["Smartphone", "Laptop & PC", "AC", "Refrigerator", "TV", "Washing Machine", "Electrical"]
    : ["Air conditioning", "Home appliances", "Electrical", "Plumbing", "Electronics"];
  const modes = isLive ? ["Home Visit", "Shop Drop-off"] : ["At home", "Workshop", "Both"];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLive) {
      setOpen(true);
      return;
    }
    if (submitting.current) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const basePrice = Number(formData.get("basePrice"));
    setError("");
    setSavedTitle("");
    if (!Number.isFinite(basePrice) || basePrice <= 0) {
      setError("Please enter a price greater than zero.");
      return;
    }

    submitting.current = true;
    setIsSubmitting(true);
    onSubmittingChange?.(true);
    try {
      const response = await fetch(`/api/technician/services${ownedService ? `/${ownedService._id}` : ""}`, {
        method: isEditing ? "PATCH" : "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({
          title: String(formData.get("title") || "").trim(),
          category: formData.get("category"),
          description: String(formData.get("description") || "").trim(),
          image: String(formData.get("image") || "").trim(),
          basePrice,
          estimatedDuration: String(formData.get("estimatedDuration") || "").trim(),
          serviceMode: formData.get("serviceMode"),
          serviceArea: String(formData.get("serviceArea") || "").trim(),
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not save your service. Please try again.");
      }
      if (!result.data?._id || typeof result.data.title !== "string") {
        throw new Error("The server returned an unexpected response. Check before submitting again.");
      }

      if (isEditing) {
        toast.add({ type: "success", title: "Service saved", description: result.message });
        onSaved?.(result.data);
      } else {
        setSavedTitle(result.data.title);
        form.reset();
        toast.add({ type: "success", title: "Service added", description: "Your service is waiting for admin approval." });
        router.push("/dashboard/technician/my-services");
        router.refresh();
      }
    } catch (err) {
      const message = err instanceof TypeError || (err instanceof Error && err.name === "TimeoutError")
        ? "Cannot reach FixMate right now. Please check your connection and try again."
        : err instanceof SyntaxError ? "The server returned an unexpected response. Check before submitting again."
        : err instanceof Error ? err.message : "Could not add your service. Please try again.";
      setError(message);
      toast.add({ type: "error", title: "Service submission failed", description: message });
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
      onSubmittingChange?.(false);
    }
  }
  const field = "grid gap-2 text-sm font-medium text-slate-700";
  const control =
    "min-h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-orange-300";
  return (
    <>
      <form
        onSubmit={handleSubmit}
        aria-busy={isSubmitting}
        className="space-y-5"
      >
        {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {savedTitle && (
          <p role="status" className="rounded-lg bg-teal-50 p-4 text-sm text-teal-800">
            <strong>{savedTitle}</strong> was saved and is waiting for admin approval.
            It will appear on the public Services page after approval, while available.
          </p>
        )}
        <fieldset disabled={isSubmitting} className="space-y-5">
          <label
            className={field}
            htmlFor={compact ? "edit-service-title" : "service-title"}
          >
            Service Title
            <Input
              id={compact ? "edit-service-title" : "service-title"}
              name="title"
              required={isLive}
              defaultValue={ownedService?.title ?? service?.title}
              placeholder="e.g. AC repair & servicing"
              className="h-10"
            />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={field}>
              Category
              <select name="category" required={isLive} defaultValue={ownedService?.category ?? service?.category ?? ""} className={control}>
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map(category => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            <label className={field}>
              Base Price ({isLive ? "USD" : "BDT"})
              <Input
                name="basePrice"
                required={isLive}
                type="number"
                min={isLive ? "0.01" : "0"}
                step={isLive ? "0.01" : undefined}
              placeholder={isLive ? "50" : "1800"}
                defaultValue={ownedService?.basePrice ?? (service ? service.price.replace(/[^0-9]/g, "") : "")}
                className="h-10"
              />
            </label>
          </div>
          <label className={field}>
            Description
            <textarea
              name="description"
              required={isLive}
              rows={4}
              defaultValue={ownedService?.description ?? service?.description}
              placeholder="Describe the repair service and what is included..."
              className={control}
            />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={field}>
              Estimated Duration
              <Input
                name="estimatedDuration"
                required={isLive}
                defaultValue={ownedService?.estimatedDuration ?? service?.duration}
                placeholder="e.g. 1–2 hours"
                className="h-10"
              />
            </label>
            <label className={field}>
              Service Mode
              <select name="serviceMode" required={isLive} defaultValue={ownedService?.serviceMode ?? service?.mode ?? ""} className={control}>
                <option value="" disabled>
                  Select service mode
                </option>
                {modes.map(mode => <option key={mode}>{mode}</option>)}
              </select>
            </label>
          </div>
          <label className={field}>
            Service Area
            <Input
              name="serviceArea"
              required={isLive}
              defaultValue={ownedService?.serviceArea ?? service?.area}
              placeholder="e.g. Dhanmondi, Dhaka"
              className="h-10"
            />
          </label>
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
            <label className={`${field} justify-items-start`}>
              <span className="flex items-center gap-2">
                <FiImage className="text-orange-500" />
                Service Image{isLive ? " URL" : ""}
              </span>
              <span className="text-xs font-normal text-slate-500">
                {isLive ? "Paste a public HTTP or HTTPS image URL for your service." : "Choose an image for the form preview. No file will be uploaded."}
              </span>
              <Input
                type={isLive ? "url" : "file"}
                name="image"
                defaultValue={isEditing ? ownedService?.image : undefined}
                required={isLive}
                pattern={isLive ? "https?://.+" : undefined}
                placeholder={isLive ? "https://example.com/repair.jpg" : undefined}
                accept={isLive ? undefined : "image/png,image/jpeg,image/webp"}
                className="mt-2 h-auto bg-white py-2"
              />
            </label>
          </div>
          <div className="flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-xs text-slate-500">
              <FiInfo className="shrink-0" />
              {isEditing ? "Changes require admin approval again. Saving unchanged details keeps the current approval." : isLive ? "Your service will be submitted for admin approval." : "Form preview only. Nothing is submitted."}
            </p>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 bg-[#f97316] px-5 text-white hover:bg-orange-600"
            >
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : isLive ? "Add Service" : service ? "Preview Changes" : "Preview Service"}
            </Button>
          </div>
        </fieldset>
      </form>
      <PreviewDialog
        open={open}
        onOpenChange={setOpen}
        title={service ? "Service changes preview" : "Service form preview"}
      >
        <p className="rounded-xl bg-orange-50 p-4 text-sm leading-relaxed text-orange-800">
          Your form is ready for a future backend connection. This preview has
          not created or updated a service.
        </p>
      </PreviewDialog>
    </>
  );
}
