"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { FiInbox, FiX } from "react-icons/fi";
import { Dialog } from "@base-ui/react/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#092e33] sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
export function PreviewNotice() {
  return (
    <p className="rounded-xl border border-dashed border-orange-200 bg-orange-50/60 px-4 py-3 text-xs leading-relaxed text-orange-800">
      <strong>UI preview</strong> · Temporary sample data. Actions do not save
      changes or process payments.
    </p>
  );
}
export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl space-y-6 pb-4">{children}</section>
  );
}
export function Panel({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Card className="min-w-0 rounded-2xl shadow-sm">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="font-semibold text-[#092e33]">
            {title}
          </CardTitle>
          {description && (
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              {description}
            </p>
          )}
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
export function StatsCard({
  title,
  value,
  icon,
  accent = false,
}: {
  title: string;
  value: string;
  icon: ReactNode;
  accent?: boolean;
}) {
  return (
    <Card
      className={`rounded-2xl shadow-sm ${accent ? "bg-[#092e33] text-white ring-0" : ""}`}
    >
      <CardContent className="flex items-start justify-between gap-3">
        <div>
          <p
            className={`text-sm ${accent ? "text-teal-100" : "text-slate-500"}`}
          >
            {title}
          </p>
          <p
            className={`mt-3 text-3xl font-semibold tracking-tight ${accent ? "text-white" : "text-[#092e33]"}`}
          >
            {value}
          </p>
          <p
            className={`mt-2 text-xs ${accent ? "text-teal-100" : "text-slate-400"}`}
          >
            Sample preview
          </p>
        </div>
        <span
          aria-hidden="true"
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl [&_svg]:size-5 ${accent ? "bg-white/10 text-orange-300" : "bg-orange-50 text-orange-500"}`}
        >
          {icon}
        </span>
      </CardContent>
    </Card>
  );
}
const styles: Record<string, string> = {
  requested: "border-amber-200 bg-amber-50 text-amber-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  accepted: "border-blue-200 bg-blue-50 text-blue-700",
  "in-progress": "border-violet-200 bg-violet-50 text-violet-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
  cancelled: "border-slate-200 bg-slate-50 text-slate-600",
  unpaid: "border-orange-200 bg-orange-50 text-orange-700",
  available: "border-teal-200 bg-teal-50 text-teal-700",
  unavailable: "border-slate-200 bg-slate-100 text-slate-500",
  customer: "border-blue-200 bg-blue-50 text-blue-700",
  technician: "border-teal-200 bg-teal-50 text-teal-700",
  admin: "border-violet-200 bg-violet-50 text-violet-700",
};
export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={`gap-1.5 px-2.5 py-1 capitalize ${styles[status] || ""}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status === "in-progress" ? "In Progress" : status}
    </Badge>
  );
}
export function EmptyState({
  title = "No results found",
  description = "Try another search or filter to find what you need.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
        <FiInbox className="size-6" />
      </span>
      <h3 className="font-semibold text-[#092e33]">{title}</h3>
      <p className="max-w-sm text-sm leading-relaxed text-slate-500">
        {description}
      </p>
    </div>
  );
}
export function PreviewTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: ReactNode[][];
}) {
  if (!rows.length) return <EmptyState />;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((h) => (
            <TableHead key={h} className="h-11 text-xs text-slate-500">
              {h}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, i) => (
          <TableRow key={i}>
            {row.map((cell, j) => (
              <TableCell key={j} className="py-4 text-slate-600">
                {cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
export function PageSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading dashboard page"
      className="mx-auto max-w-7xl space-y-6"
    >
      <span className="sr-only">Loading dashboard page...</span>
      <Skeleton className="h-10 w-56" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-80 rounded-2xl" />
    </div>
  );
}
export function DashboardLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Button
      render={<Link href={href} />}
      className="h-10 w-fit gap-2 bg-[#f97316] px-4 text-white hover:bg-orange-600"
    >
      {children}
    </Button>
  );
}
export function PreviewDialog({
  open,
  onOpenChange,
  title,
  children,
  description = "Frontend preview only. No records, statuses, roles, or payments will be changed.",
  closeLabel = "Close preview",
  busy = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children?: ReactNode;
  description?: string;
  closeLabel?: string;
  busy?: boolean;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => { if (!busy) onOpenChange(nextOpen); }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[70] bg-[#092e33]/50 backdrop-blur-sm" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-[71] max-h-[90svh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-2xl bg-white p-6 shadow-xl outline-none">
          <Dialog.Title className="pr-8 text-xl font-semibold text-[#092e33]">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mb-5 mt-2 text-sm leading-relaxed text-slate-500">
            {description}
          </Dialog.Description>
          <Dialog.Close
            render={<Button variant="ghost" size="icon" />}
            className="absolute right-3 top-3"
            aria-label="Close dialog"
            disabled={busy}
          >
            <FiX />
          </Dialog.Close>
          {children}
          <div className="mt-5 flex justify-end">
            <Dialog.Close disabled={busy} render={<Button variant="outline" />}>
              {closeLabel}
            </Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export function PreviewAction({
  label,
  title = label,
  children,
  destructive = false,
}: {
  label: string;
  title?: string;
  children?: ReactNode;
  destructive?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="button"
        variant={destructive ? "destructive" : "outline"}
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>
      <PreviewDialog open={open} onOpenChange={setOpen} title={title}>
        {children || (
          <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            This action is ready for future integration. Close this dialog to
            return to the preview.
          </p>
        )}
      </PreviewDialog>
    </>
  );
}
export function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 max-w-full rounded-lg border border-input bg-white px-3 text-sm text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option === "all"
            ? `All ${label.toLowerCase()}`
            : option.replaceAll("-", " ")}
        </option>
      ))}
    </select>
  );
}
