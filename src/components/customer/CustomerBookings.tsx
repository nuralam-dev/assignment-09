"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FiLoader, FiTool } from "react-icons/fi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DashboardLink, EmptyState, FilterSelect, PageSkeleton, PreviewDialog, StatusBadge,
} from "@/components/dashboard/preview/DashboardUI";

const statuses = ["requested", "accepted", "in-progress", "completed", "rejected", "cancelled"];
type Booking = {
  _id: string;
  serviceId?: string;
  serviceTitle?: string;
  serviceImage?: string;
  category?: string;
  technicianName?: string;
  technicianEmail?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  address?: string;
  preferredDate?: string;
  problemDescription?: string;
  status?: string;
  paymentStatus?: string;
  basePrice?: number | null;
  finalAmount?: number | null;
  createdAt?: string;
};
const textFields = ["serviceId", "serviceTitle", "serviceImage", "category", "technicianName", "technicianEmail", "customerName", "customerEmail", "customerPhone", "address", "preferredDate", "problemDescription", "status", "paymentStatus", "createdAt"] as const;
function isBooking(value: unknown): value is Booking {
  if (!value || typeof value !== "object") return false;
  const booking = value as Booking;
  return typeof booking._id === "string" && /^[a-f\d]{24}$/i.test(booking._id)
    && textFields.every(key => booking[key] == null || typeof booking[key] === "string")
    && [booking.basePrice, booking.finalAmount].every(amount => amount == null || (typeof amount === "number" && Number.isFinite(amount)));
}
function text(value?: string) { return value?.trim() || "Not provided"; }
function date(value?: string) {
  return value && Number.isFinite(Date.parse(value))
    ? new Date(value).toLocaleDateString("en-US", { dateStyle: "medium", timeZone: "UTC" })
    : "Not provided";
}
function money(value?: number | null) {
  return typeof value === "number" && Number.isFinite(value)
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
    : "Not provided";
}
function statusLabel(value?: string) {
  return value && statuses.includes(value) ? value : "Unknown status";
}
function paymentLabel(value?: string) {
  return value === "paid" || value === "unpaid" ? value : "Unknown payment status";
}
function apiError(status: number, fallback: string) {
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403) return "Only customers can manage these bookings.";
  if (status === 404) return "This booking is no longer available to you. Please refresh.";
  if (status === 409) return "This booking can no longer be cancelled. Your bookings will refresh.";
  return fallback;
}
function ServiceImage({ image, title }: { image?: string; title: string }) {
  const [failed, setFailed] = useState(false);
  let valid = false;
  try { valid = ["http:", "https:"].includes(new URL(image || "").protocol); } catch { /* Show the repair icon instead. */ }
  return (
    <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-lg bg-teal-50 text-teal-700">
      {valid && !failed ? <Image src={image!} alt={title} fill unoptimized sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" onError={() => setFailed(true)} />
        : <><FiTool className="size-10" aria-hidden="true" /><span className="sr-only">Service image unavailable</span></>}
    </div>
  );
}

function BookingCard({ booking, onUpdated, onRefresh }: {
  booking: Booking;
  onUpdated: (booking: Booking) => void;
  onRefresh: () => void;
}) {
  const [details, setDetails] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [stale, setStale] = useState(false);
  const submitting = useRef(false);
  const cancelButton = useRef<HTMLButtonElement | null>(null);

  async function cancelBooking() {
    if (submitting.current || !confirm || stale || booking.status !== "requested") return;
    submitting.current = true;
    setPending(true);
    setError("");
    try {
      const response = await fetch(`/api/customer/bookings/${booking._id}/cancel`, {
        method: "PATCH", credentials: "same-origin",
        headers: { "Content-Type": "application/json" }, body: JSON.stringify({}),
        signal: AbortSignal.timeout(15000),
      });
      if ([404, 409].includes(response.status)) {
        setStale(true);
        setConfirm(false);
        onRefresh();
      }
      if (!response.ok) throw new Error(apiError(response.status, "Could not cancel this booking. Please try again."));
      const result = await response.json();
      if (result?.success !== true || !isBooking(result.data) || result.data._id !== booking._id || result.data.status !== "cancelled") {
        throw new Error("Could not confirm cancellation. Refresh your bookings before trying again.");
      }
      setConfirm(false);
      onUpdated(result.data);
      toast.success("Booking cancelled", { description: text(booking.serviceTitle) });
    } catch (err) {
      const message = err instanceof Error && err.name === "Error" ? err.message : "Cannot reach FixMate right now. Please try again.";
      setError(message);
      toast.error("Cancellation failed", { description: message });
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  const information = [
    ["Booking ID", booking._id], ["Service", text(booking.serviceTitle)],
    ["Service ID", text(booking.serviceId)], ["Category", text(booking.category)],
    ["Customer", text(booking.customerName)], ["Customer email", text(booking.customerEmail)],
    ["Phone", text(booking.customerPhone)], ["Technician", text(booking.technicianName)],
    ["Technician email", text(booking.technicianEmail)], ["Problem description", text(booking.problemDescription)],
    ["Service address", text(booking.address)], ["Booked on", date(booking.createdAt)],
    ["Preferred date", date(booking.preferredDate)], ["Booking status", statusLabel(booking.status)],
    ["Payment status", paymentLabel(booking.paymentStatus)], ["Base price", money(booking.basePrice)],
    ["Final amount", money(booking.finalAmount)],
  ];
  return (
    <Card className="min-w-0 rounded-xl shadow-none">
      <CardContent className="space-y-4 wrap-anywhere">
        <ServiceImage key={booking.serviceImage} image={booking.serviceImage} title={text(booking.serviceTitle)} />
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="font-medium text-[#092e33]">{booking.serviceTitle?.trim() || "Repair booking"}</h3>
          <StatusBadge status={statusLabel(booking.status)} />
        </div>
        <dl className="grid gap-2 text-sm text-slate-600">
          {[["Technician", text(booking.technicianName)], ["Booked on", date(booking.createdAt)],
            ["Preferred date", date(booking.preferredDate)], ["Service address", text(booking.address)],
            ["Base price", money(booking.basePrice)], ["Final amount", money(booking.finalAmount)]].map(([label, value]) => (
            <div key={label}><dt className="inline font-medium text-[#092e33]">{label}: </dt><dd className="inline">{value}</dd></div>
          ))}
        </dl>
        <div className="flex flex-wrap items-center gap-2 text-sm"><span>Payment:</span><StatusBadge status={paymentLabel(booking.paymentStatus)} /></div>
        {booking.status === "completed" && booking.paymentStatus === "unpaid" && <p className="rounded-lg bg-orange-50 p-3 text-sm text-orange-800">Payment pending. Online payments are not available yet.</p>}
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setDetails(true)}>View Details</Button>
          {booking.status === "requested" && <Button variant="destructive" disabled={pending || stale} onClick={() => { setError(""); setConfirm(true); }}>Cancel Booking</Button>}
        </div>
        <PreviewDialog open={details} onOpenChange={setDetails} title="Booking details" description="Your repair request and current booking information." closeLabel="Close">
          <dl className="grid gap-3 text-sm">
            {information.map(([label, value]) => <div key={label} className="grid gap-1 border-b pb-2 sm:grid-cols-[140px_1fr]"><dt className="font-medium text-[#092e33]">{label}</dt><dd className="whitespace-pre-wrap wrap-anywhere text-slate-600">{value}</dd></div>)}
          </dl>
        </PreviewDialog>
        <AlertDialog open={confirm} onOpenChange={open => { if (!submitting.current) setConfirm(open); }}>
          <AlertDialogContent initialFocus={cancelButton}>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription className="mt-3 wrap-anywhere">Cancel your request for <strong>{text(booking.serviceTitle)}</strong>? Only requested bookings can be cancelled.</AlertDialogDescription>
            {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <AlertDialogCancel ref={cancelButton} disabled={pending}>Cancel</AlertDialogCancel>
              <Button variant="destructive" disabled={pending || stale} aria-busy={pending} onClick={() => void cancelBooking()}>
                {pending && <FiLoader className="animate-spin" aria-hidden="true" />}{pending ? "Cancelling..." : "Confirm"}
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

export default function CustomerBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/customer/bookings", {
          credentials: "same-origin", cache: "no-store",
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]),
        });
        if (!response.ok) throw new Error(apiError(response.status, "Could not load your bookings. Please try again."));
        const result = await response.json();
        if (result?.success !== true || !Array.isArray(result.data) || !result.data.every(isBooking)) {
          throw new Error("Could not read your bookings. Please try again.");
        }
        if (!controller.signal.aborted) { setBookings(result.data); setError(""); }
      } catch (err) {
        if (!controller.signal.aborted) {
          setBookings([]);
          setError(err instanceof Error && err.name === "Error" ? err.message : "Cannot reach FixMate right now. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [attempt]);
  function refresh() {
    setLoading(true);
    setAttempt(value => value + 1);
  }
  const filtered = bookings.filter(booking => status === "all" || booking.status === status);
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterSelect label="Bookings" value={status} onChange={setStatus} options={["all", ...statuses]} />
        <Button variant="outline" disabled={loading} onClick={refresh}>{loading ? "Loading..." : "Refresh"}</Button>
      </div>
      {loading ? <PageSkeleton /> : error ? <div className="space-y-3">
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>
        <div className="flex flex-wrap gap-3"><Button variant="outline" onClick={refresh}>Try again</Button><DashboardLink href="/sign-in">Sign in</DashboardLink></div>
      </div> : bookings.length === 0 ? <div className="text-center">
        <EmptyState title="You haven't booked any services yet." description="Find a repair service for your device or appliance." />
        <DashboardLink href="/services">Browse Services</DashboardLink>
      </div> : filtered.length ? <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map(booking => <BookingCard key={booking._id} booking={booking} onRefresh={refresh} onUpdated={updated => {
          setBookings(current => current.map(item => item._id === updated._id ? updated : item));
          refresh();
        }} />)}
      </div> : <EmptyState title="No matching bookings" description="Select another status to see your bookings." />}
    </div>
  );
}
