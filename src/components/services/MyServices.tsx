"use client";

import { useEffect, useState } from "react";
import ServiceList, { type OwnedService } from "@/components/dashboard/preview/ServiceList";
import ServicesLoading from "./ServicesLoading";
import { Button } from "@/components/ui/button";

export default function MyServices() {
  const [services, setServices] = useState<OwnedService[] | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/technician/services", {
          credentials: "same-origin",
          cache: "no-store",
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]),
        });
        const result = await response.json();
        if (response.status === 401) throw new Error("Your session has expired. Please sign in again.");
        if (response.status === 403) throw new Error("Only technicians can view this page.");
        if (!response.ok || !result.success || !Array.isArray(result.data)) {
          throw new Error("Could not load your services. Please try again.");
        }
        if (!controller.signal.aborted) setServices(result.data);
      } catch (err) {
        if (!controller.signal.aborted) setError(err instanceof Error && err.name === "Error" ? err.message : "Cannot reach FixMate right now. Please try again.");
      }
    }
    void load();
    return () => controller.abort();
  }, [attempt]);

  if (error) return (
    <div className="space-y-3">
      <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>
      <Button variant="outline" onClick={() => { setError(""); setServices(null); setAttempt(value => value + 1); }}>Try again</Button>
    </div>
  );
  if (services === null) return <ServicesLoading />;
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">Editing service details requires admin approval again. Availability changes keep the current approval status.</p>
      <ServiceList liveServices={services} onServiceDeleted={(id) => {
        setServices(current => current?.filter(service => service._id !== id) ?? null);
        setAttempt(value => value + 1);
      }} onServiceUpdated={(updated) => {
        setServices(current => current?.map(service => service._id === updated._id ? updated : service) ?? null);
        setAttempt(value => value + 1);
      }} />
    </div>
  );
}
