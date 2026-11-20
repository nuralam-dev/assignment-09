"use client";

import { useEffect, useState } from "react";
import { FiActivity, FiCalendar, FiCheckCircle, FiClock } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  DashboardLink, EmptyState, PageSkeleton, Panel, StatsCard, StatusBadge,
} from "@/components/dashboard/preview/DashboardUI";

type Overview = {
  totalBookings: number;
  pendingRequests: number;
  activeBookings: number;
  completedBookings: number;
  recentBookings: {
    _id: string;
    serviceTitle?: string;
    preferredDate?: string;
    status?: string;
    createdAt?: string;
  }[];
};

function isOverview(data: unknown): data is Overview {
  if (!data || typeof data !== "object") return false;
  const value = data as Overview;
  return [value.totalBookings, value.pendingRequests, value.activeBookings, value.completedBookings]
    .every(count => Number.isSafeInteger(count) && count >= 0)
    && Array.isArray(value.recentBookings)
    && value.recentBookings.length <= 5
    && value.recentBookings.every(booking => booking && typeof booking._id === "string"
      && (booking.serviceTitle === undefined || typeof booking.serviceTitle === "string")
      && (booking.preferredDate === undefined || typeof booking.preferredDate === "string")
      && (booking.status === undefined || typeof booking.status === "string"));
}

export default function CustomerOverview() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/customer/overview", {
          credentials: "same-origin",
          cache: "no-store",
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]),
        });
        const result = await response.json();
        if (response.status === 401) throw new Error("Your session has expired. Please sign in again.");
        if (response.status === 403) throw new Error("Only customers can access this overview.");
        if (!response.ok || result.success !== true || !isOverview(result.data)) {
          throw new Error("Could not load your overview. Please try again.");
        }
        if (!controller.signal.aborted) {
          setData(result.data);
          setError("");
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error && err.name === "Error"
            ? err.message : "Cannot reach FixMate right now. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [attempt]);

  function refresh() {
    if (loading) return;
    setLoading(true);
    setAttempt(value => value + 1);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <DashboardLink href="/services">Browse Services</DashboardLink>
        <DashboardLink href="/dashboard/customer/bookings">View All Bookings</DashboardLink>
        <Button variant="outline" disabled={loading} onClick={refresh}>{loading ? "Loading..." : "Refresh"}</Button>
      </div>
      {loading ? <PageSkeleton /> : error ? (
        <div className="space-y-3">
          <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>
          <Button variant="outline" onClick={refresh}>Try again</Button>
          <DashboardLink href="/sign-in">Sign in</DashboardLink>
        </div>
      ) : data && <>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard title="Total Bookings" value={String(data.totalBookings)} icon={<FiCalendar />} accent />
          <StatsCard title="Pending Requests" value={String(data.pendingRequests)} icon={<FiClock />} />
          <StatsCard title="Active Bookings" value={String(data.activeBookings)} icon={<FiActivity />} />
          <StatsCard title="Completed Bookings" value={String(data.completedBookings)} icon={<FiCheckCircle />} />
        </div>
        <Panel title="Recent Bookings" description="Your five most recent repair requests. Refresh to see technician updates.">
          {data.recentBookings.length ? (
            <div className="divide-y divide-slate-100">
              {data.recentBookings.map(booking => (
                <div key={booking._id} className="flex min-w-0 flex-wrap items-center justify-between gap-3 py-4">
                  <div className="min-w-0">
                    <p className="wrap-anywhere font-medium text-[#092e33]">{booking.serviceTitle || "Repair booking"}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Preferred: {booking.preferredDate && Number.isFinite(Date.parse(booking.preferredDate))
                        ? new Date(booking.preferredDate).toLocaleDateString("en-US", { dateStyle: "medium", timeZone: "UTC" })
                        : "Not provided"}
                    </p>
                  </div>
                  {booking.status && <StatusBadge status={booking.status} />}
                </div>
              ))}
            </div>
          ) : <EmptyState title="No bookings yet" description="Browse services to find a repair service for your device or appliance." />}
        </Panel>
      </>}
    </div>
  );
}
