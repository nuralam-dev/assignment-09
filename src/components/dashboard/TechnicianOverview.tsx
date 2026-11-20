"use client";

import { useEffect, useState } from "react";
import { FiActivity, FiCheckCircle, FiClock, FiList, FiPlus, FiTool } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLink, EmptyState, Panel, StatusBadge } from "./preview/DashboardUI";

type RecentRequest = {
  _id: string;
  serviceTitle?: string;
  customerName?: string;
  preferredDate?: string;
  status?: string;
  basePrice?: number;
};

type Overview = {
  totalServices: number;
  pendingRequests: number;
  activeJobs: number;
  completedJobs: number;
  recentRequests: RecentRequest[];
};

function isOverview(value: unknown): value is Overview {
  if (!value || typeof value !== "object") return false;
  const data = value as Overview;
  return [data.totalServices, data.pendingRequests, data.activeJobs, data.completedJobs]
    .every(count => Number.isSafeInteger(count) && count >= 0)
    && Array.isArray(data.recentRequests) && data.recentRequests.length <= 5
    && data.recentRequests.every(booking => booking && typeof booking._id === "string"
      && [booking.serviceTitle, booking.customerName, booking.preferredDate, booking.status]
        .every(field => field === undefined || typeof field === "string")
      && (booking.basePrice === undefined || (typeof booking.basePrice === "number" && Number.isFinite(booking.basePrice))));
}

function dateLabel(value: string) {
  if (!Number.isFinite(Date.parse(value))) return "Not provided";
  return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

export default function TechnicianOverview() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/technician/overview", {
          credentials: "same-origin",
          cache: "no-store",
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]),
        });
        if (response.status === 401) throw new Error("Your session has expired. Please sign in again.");
        if (response.status === 403) throw new Error("Only technicians can view this overview.");
        const result = await response.json();
        if (!response.ok || result.success !== true || !isOverview(result.data)) {
          throw new Error("Could not load your overview. Please try again.");
        }
        if (!controller.signal.aborted) setOverview(result.data);
      } catch (err) {
        if (!controller.signal.aborted) setError(err instanceof Error && err.name === "Error"
          ? err.message : "Cannot reach FixMate right now. Please try again.");
      }
    }
    void load();
    return () => controller.abort();
  }, [attempt]);

  const stats = overview ? [
    { title: "Total Services", value: overview.totalServices, description: "All approval and availability states", icon: FiTool },
    { title: "Pending Requests", value: overview.pendingRequests, description: "Awaiting your response", icon: FiClock },
    { title: "Active Jobs", value: overview.activeJobs, description: "Accepted and in progress", icon: FiActivity },
    { title: "Completed Jobs", value: overview.completedJobs, description: "Repairs marked completed", icon: FiCheckCircle },
  ] : [];

  return (
    <div className="space-y-6">
      {error ? (
        <div className="space-y-3">
          <p role="alert" className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</p>
          <Button variant="outline" onClick={() => { setError(""); setOverview(null); setAttempt(value => value + 1); }}>Try again</Button>
        </div>
      ) : overview === null ? (
        <div role="status" aria-label="Loading technician overview" className="space-y-6">
          <span className="sr-only">Loading your overview...</span>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map(index => <Skeleton key={index} className="h-36 rounded-2xl" />)}
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ title, value, description, icon: Icon }, index) => (
              <Card key={title} className={`min-w-0 rounded-2xl shadow-sm ${index === 0 ? "bg-[#092e33] text-white ring-0" : ""}`}>
                <CardContent className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className={`text-sm ${index === 0 ? "text-teal-100" : "text-slate-500"}`}>{title}</h2>
                    <p className={`mt-3 text-3xl font-semibold ${index === 0 ? "text-white" : "text-[#092e33]"}`}>{value}</p>
                    <p className={`mt-2 text-xs ${index === 0 ? "text-teal-100" : "text-slate-500"}`}>{description}</p>
                  </div>
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${index === 0 ? "bg-white/10 text-orange-300" : "bg-orange-50 text-[#f97316]"}`}><Icon className="size-5" aria-hidden="true" /></span>
                </CardContent>
              </Card>
            ))}
          </div>
          <Panel title="Recent Booking Requests" description="Your five most recent assigned bookings, newest first." action={<DashboardLink href="/dashboard/technician/requests">View All</DashboardLink>}>
            {overview.recentRequests.length === 0 ? (
              <EmptyState title="No booking requests yet" description="Your assigned repair requests will appear here when customers book your services." />
            ) : (
              <ul className="divide-y divide-slate-100">
                {overview.recentRequests.map(booking => (
                  <li key={booking._id} className="grid min-w-0 gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                    <div className="min-w-0 space-y-1 wrap-break-word">
                      {booking.serviceTitle && <h3 className="font-medium text-[#092e33]">{booking.serviceTitle}</h3>}
                      {booking.customerName && <p className="text-sm text-slate-600">{booking.customerName}</p>}
                      {booking.preferredDate && <p className="text-xs text-slate-500">Preferred: {dateLabel(booking.preferredDate)}</p>}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
                      {booking.status && <StatusBadge status={booking.status} />}
                      {typeof booking.basePrice === "number" && <p className="text-sm font-medium text-[#092e33]">Base price: {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(booking.basePrice)}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </>
      )}
      <Panel title="Quick Actions" description="Manage your services and repair requests.">
        <div className="flex flex-wrap gap-3">
          <DashboardLink href="/dashboard/technician/add-service"><FiPlus aria-hidden="true" />Add New Service</DashboardLink>
          <DashboardLink href="/dashboard/technician/my-services"><FiTool aria-hidden="true" />Manage My Services</DashboardLink>
          <DashboardLink href="/dashboard/technician/requests"><FiList aria-hidden="true" />Manage Requests</DashboardLink>
        </div>
      </Panel>
    </div>
  );
}
