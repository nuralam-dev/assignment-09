"use client";

import { useEffect, useRef, useState } from "react";
import { FiCalendar, FiLoader, FiMapPin, FiPhone, FiTool } from "react-icons/fi";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { EmptyState, StatusBadge } from "@/components/dashboard/preview/DashboardUI";

type Booking = {
  _id: string;
  serviceTitle: string;
  customerName: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  basePrice: number;
  status: string;
  finalAmount?: number | null;
  createdAt?: string;
};

function dateLabel(value?: string) {
  if (!value || !Number.isFinite(Date.parse(value))) return "Not provided";
  return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

function requestError(status: number, fallback: string) {
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403) return "Only technicians can access these requests.";
  if (status === 404) return "This booking is no longer available to you. Refresh your requests.";
  if (status === 409) return "This booking has already changed status. Your requests will refresh.";
  return fallback;
}

type NextStatus = "accepted" | "rejected" | "in-progress" | "completed";

function RequestCard({ booking, onUpdated, onRefresh }: {
  booking: Booking;
  onUpdated: (booking: Booking) => void;
  onRefresh: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<NextStatus | null>(null);
  const [finalAmount, setFinalAmount] = useState(booking.finalAmount?.toString() ?? "");
  const [error, setError] = useState("");
  const [conflict, setConflict] = useState(false);
  const submitting = useRef(false);
  const cancelButton = useRef<HTMLButtonElement | null>(null);

  async function changeStatus(status: NextStatus) {
    const previous = { accepted: "requested", rejected: "requested", "in-progress": "accepted", completed: "in-progress" };
    if (submitting.current || booking.status !== previous[status] || conflict || (status === "rejected" && !open)) return;
    const amount = Number(finalAmount);
    if (status === "completed" && (!Number.isFinite(amount) || amount <= 0)) {
      setError("Enter a valid positive final amount in USD.");
      return;
    }
    submitting.current = true;
    setPending(status);
    setError("");
    try {
      const response = await fetch(`/api/technician/bookings/${booking._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(status === "completed" ? { status, finalAmount: amount } : { status }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true || result.data?._id !== booking._id || result.data?.status !== status) {
        if ([404, 409].includes(response.status)) {
          setConflict(true);
          setOpen(false);
          onRefresh();
        }
        throw new Error(requestError(response.status, "Could not update this request. Please try again."));
      }
      setOpen(false);
      onUpdated(result.data);
      toast.success({ accepted: "Booking accepted", rejected: "Booking rejected", "in-progress": "Repair started", completed: "Repair completed" }[status], { description: `${booking.serviceTitle} — ${booking.customerName}` });
    } catch (err) {
      const message = err instanceof Error && err.name === "Error" ? err.message : "Cannot reach FixMate right now. Please try again.";
      setError(message);
      toast.error("Request update failed", { description: message });
    } finally {
      submitting.current = false;
      setPending(null);
    }
  }

  return (
    <Card className="min-w-0 rounded-xl shadow-none">
      <CardContent className="space-y-4 break-words">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><FiTool aria-hidden="true" /></span>
            <h3 className="font-medium text-[#092e33]">{booking.serviceTitle}</h3>
          </div>
          <StatusBadge status={booking.status} />
        </div>
        <div className="space-y-2 text-sm text-slate-500">
          <p className="font-medium text-[#092e33]">{booking.customerName}</p>
          <p className="flex items-start gap-2"><FiPhone className="mt-0.5 shrink-0" aria-hidden="true" /><span>{booking.customerPhone || "Not provided"}</span></p>
          <p className="flex items-start gap-2"><FiMapPin className="mt-0.5 shrink-0" aria-hidden="true" /><span>{booking.address || "Not provided"}</span></p>
          <p className="flex items-start gap-2"><FiCalendar className="mt-0.5 shrink-0" aria-hidden="true" /><span>Preferred: {dateLabel(booking.preferredDate)}</span></p>
          {booking.createdAt && <p>Requested: {dateLabel(booking.createdAt)}</p>}
        </div>
        <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-600">{booking.problemDescription || "No problem description provided."}</p>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-semibold text-[#092e33]">Base price: {typeof booking.basePrice === "number" && Number.isFinite(booking.basePrice) ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(booking.basePrice) : "Not provided"}</span>
          {booking.status === "requested" && (
            <div className="flex gap-2">
              <Button type="button" disabled={pending !== null || conflict || open} aria-busy={pending === "accepted"} onClick={() => void changeStatus("accepted")}>
                {pending === "accepted" && <FiLoader className="animate-spin" aria-hidden="true" />}{pending === "accepted" ? "Accepting..." : "Accept"}
              </Button>
              <Button type="button" variant="destructive" disabled={pending !== null || conflict} onClick={() => { setError(""); setOpen(true); }}>Reject</Button>
            </div>
          )}
        </div>
        {booking.status === "accepted" && <Button type="button" disabled={pending !== null || conflict} aria-busy={pending === "in-progress"} onClick={() => void changeStatus("in-progress")}>
          {pending === "in-progress" ? "Starting..." : "Start Repair"}
        </Button>}
        {booking.status === "in-progress" && <form className="space-y-3" onSubmit={event => { event.preventDefault(); void changeStatus("completed"); }}>
          <label className="block space-y-2 text-sm font-medium text-[#092e33]">
            <span>Final amount (USD)</span>
            <Input type="number" min="0.01" step="0.01" required value={finalAmount} disabled={pending !== null || conflict} onChange={event => setFinalAmount(event.target.value)} />
          </label>
          <Button type="submit" disabled={pending !== null || conflict} aria-busy={pending === "completed"}>{pending === "completed" ? "Completing..." : "Complete Repair"}</Button>
        </form>}
        {booking.status === "completed" && <p className="text-sm font-medium text-[#092e33]">Final amount: {typeof booking.finalAmount === "number" && Number.isFinite(booking.finalAmount) ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(booking.finalAmount) : "Not provided"}</p>}
        <AlertDialog open={open} onOpenChange={(next) => { if (!submitting.current) setOpen(next); }}>
          <AlertDialogContent initialFocus={cancelButton}>
            <AlertDialogTitle>Reject this repair request?</AlertDialogTitle>
            <AlertDialogDescription className="mt-3 break-words">
              Reject <strong>{booking.serviceTitle}</strong> requested by <strong>{booking.customerName}</strong>? This request cannot be accepted afterward.
            </AlertDialogDescription>
            {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <AlertDialogCancel ref={cancelButton} disabled={pending !== null}>Cancel</AlertDialogCancel>
              <Button type="button" variant="destructive" disabled={pending !== null} aria-busy={pending === "rejected"} onClick={() => void changeStatus("rejected")}>
                {pending === "rejected" && <FiLoader className="animate-spin" aria-hidden="true" />}{pending === "rejected" ? "Rejecting..." : "Confirm Reject"}
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

export default function TechnicianRequests() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/technician/bookings", {
          credentials: "same-origin", cache: "no-store",
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]),
        });
        const result = await response.json();
        if (!response.ok || result.success !== true || !Array.isArray(result.data)
          || !result.data.every((booking: Booking) => booking && typeof booking._id === "string" && typeof booking.status === "string")) {
          throw new Error(requestError(response.status, "Could not load your booking requests. Please try again."));
        }
        if (!controller.signal.aborted) { setBookings(result.data); setError(""); }
      } catch (err) {
        if (!controller.signal.aborted) setError(err instanceof Error && err.name === "Error" ? err.message : "Cannot reach FixMate right now. Please try again.");
      }
    }
    void load();
    return () => controller.abort();
  }, [attempt]);

  const refresh = () => setAttempt(value => value + 1);
  if (bookings === null && !error) return <div role="status" className="grid gap-4 lg:grid-cols-2"><span className="sr-only">Loading booking requests...</span>{[1, 2, 3, 4].map(id => <div key={id} aria-hidden="true" className="h-64 animate-pulse rounded-xl border bg-slate-100" />)}</div>;
  const rows = bookings?.filter(booking => tab === "all" || booking.status === tab) ?? [];
  return (
    <div className="space-y-5">
      {error && <div className="space-y-3"><p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p><Button variant="outline" onClick={refresh}>Try again</Button></div>}
      {bookings !== null && <>
        <Tabs value={tab} onValueChange={value => setTab(String(value))}>
          <TabsList className="max-w-full overflow-x-auto" aria-label="Request status">
            <TabsTrigger value="all">All requests</TabsTrigger><TabsTrigger value="requested">Requested</TabsTrigger><TabsTrigger value="accepted">Accepted</TabsTrigger><TabsTrigger value="in-progress">In progress</TabsTrigger><TabsTrigger value="completed">Completed</TabsTrigger><TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
        {rows.length ? <div className="grid gap-4 lg:grid-cols-2">{rows.map(booking => <RequestCard key={booking._id} booking={booking} onRefresh={refresh} onUpdated={updated => {
          setBookings(current => current?.map(item => item._id === updated._id ? updated : item) ?? null);
          refresh();
        }} />)}</div> : <EmptyState title={bookings.length ? "No matching requests" : "No booking requests yet"} description={bookings.length ? "Select another status to see your requests." : "Repair requests assigned to you will appear here."} />}
      </>}
    </div>
  );
}
