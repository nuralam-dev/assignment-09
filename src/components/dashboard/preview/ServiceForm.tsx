"use client";
import { useState } from "react";
import { FiImage, FiInfo } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PreviewDialog } from "./DashboardUI";
import type { PreviewService } from "./data";

export default function ServiceForm({
  service,
  compact = false,
}: {
  service?: PreviewService;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const field = "grid gap-2 text-sm font-medium text-slate-700";
  const control =
    "min-h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-orange-300";
  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setOpen(true);
        }}
        className="space-y-5"
      >
        <label
          className={field}
          htmlFor={compact ? "edit-service-title" : "service-title"}
        >
          Service Title
          <Input
            id={compact ? "edit-service-title" : "service-title"}
            defaultValue={service?.title}
            placeholder="e.g. AC repair & servicing"
            className="h-10"
          />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={field}>
            Category
            <select defaultValue={service?.category || ""} className={control}>
              <option value="" disabled>
                Select a category
              </option>
              <option>Air conditioning</option>
              <option>Home appliances</option>
              <option>Electrical</option>
              <option>Plumbing</option>
              <option>Electronics</option>
            </select>
          </label>
          <label className={field}>
            Base Price (BDT)
            <Input
              type="number"
              min="0"
              placeholder="1800"
              defaultValue={service ? service.price.replace(/[^0-9]/g, "") : ""}
              className="h-10"
            />
          </label>
        </div>
        <label className={field}>
          Description
          <textarea
            rows={4}
            defaultValue={service?.description}
            placeholder="Describe the repair service and what is included..."
            className={control}
          />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={field}>
            Estimated Duration
            <Input
              defaultValue={service?.duration}
              placeholder="e.g. 1–2 hours"
              className="h-10"
            />
          </label>
          <label className={field}>
            Service Mode
            <select defaultValue={service?.mode || ""} className={control}>
              <option value="" disabled>
                Select service mode
              </option>
              <option>At home</option>
              <option>Workshop</option>
              <option>Both</option>
            </select>
          </label>
        </div>
        <label className={field}>
          Service Area
          <Input
            defaultValue={service?.area}
            placeholder="e.g. Dhanmondi, Dhaka"
            className="h-10"
          />
        </label>
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
          <label className={`${field} justify-items-start`}>
            <span className="flex items-center gap-2">
              <FiImage className="text-orange-500" />
              Service Image
            </span>
            <span className="text-xs font-normal text-slate-500">
              Choose an image for the form preview. No file will be uploaded.
            </span>
            <Input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="mt-2 h-auto bg-white py-2"
            />
          </label>
        </div>
        <div className="flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-xs text-slate-500">
            <FiInfo className="shrink-0" />
            Form preview only. Nothing is submitted.
          </p>
          <Button
            type="submit"
            className="h-10 bg-[#f97316] px-5 text-white hover:bg-orange-600"
          >
            {service ? "Preview Changes" : "Preview Service"}
          </Button>
        </div>
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
