"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FiLoader, FiMapPin } from "react-icons/fi";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog, AlertDialogContent, AlertDialogTitle,
  AlertDialogDescription, AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { EmptyState, StatusBadge } from "@/components/dashboard/preview/DashboardUI";
import ServicesLoading from "./ServicesLoading";
import type { Service } from "./ServiceCard";

type AdminService = Service & { technicianEmail: string; createdAt?: string };

function errorMessage(status: number) {
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403) return "Only admins can review services.";
  if (status === 404) return "This service no longer exists. Refresh the list.";
  if (status === 409) return "This service has already been reviewed. The list will refresh.";
  return "Could not complete your request. Please try again.";
}

function ReviewActions({ service, onUpdated, onRefresh }: {
  service: AdminService;
  onUpdated: (service: AdminService) => void;
  onRefresh: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<"approved" | "rejected" | null>(null);
  const [error, setError] = useState("");
  const [conflict, setConflict] = useState(false);
  const submitting = useRef(false);
  const cancelButton = useRef<HTMLButtonElement | null>(null);

  async function review(approvalStatus: "approved" | "rejected") {
    if (submitting.current || conflict || service.approvalStatus !== "pending"
      || (approvalStatus === "rejected" && !open)) return;
    submitting.current = true;
    setPending(approvalStatus);
    setError("");
    try {
      const response = await fetch(`/api/admin/services/${service._id}/approval`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalStatus }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true
        || result.data?._id !== service._id || result.data?.approvalStatus !== approvalStatus) {
        if ([404, 409].includes(response.status)) {
          setConflict(true);
          setOpen(false);
          onRefresh();
        }
        throw new Error(errorMessage(response.status));
      }
      setOpen(false);
      onUpdated(result.data);
      toast.success(approvalStatus === "approved" ? "Service approved" : "Service rejected", {
        description: service.title,
      });
    } catch (err) {
      const message = err instanceof Error && err.name === "Error"
        ? err.message : "Cannot reach FixMate right now. Please try again.";
      setError(message);
      toast.error("Service review failed", { description: message });
    } finally {
      submitting.current = false;
      setPending(null);
    }
  }

  return (
    <div className="space-y-3">
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <Button type="button" disabled={pending !== null || conflict || open} aria-busy={pending === "approved"} onClick={() => void review("approved")}>
          {pending === "approved" && <FiLoader className="animate-spin" aria-hidden="true" />}
          {pending === "approved" ? "Approving..." : "Approve"}
        </Button>
        <Button type="button" variant="destructive" disabled={pending !== null || conflict} onClick={() => { setError(""); setOpen(true); }}>Reject</Button>
      </div>
      <AlertDialog open={open} onOpenChange={next => { if (!submitting.current) setOpen(next); }}>
        <AlertDialogContent initialFocus={cancelButton}>
          <AlertDialogTitle>Reject this service?</AlertDialogTitle>
          <AlertDialogDescription className="mt-3 break-words">
            Reject <strong>{service.title}</strong> by <strong>{service.technicianName}</strong>?
            This service will remain hidden from the public catalogue.
          </AlertDialogDescription>
          {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <AlertDialogCancel ref={cancelButton} disabled={pending !== null}>Cancel</AlertDialogCancel>
            <Button type="button" variant="destructive" disabled={pending !== null} aria-busy={pending === "rejected"} onClick={() => void review("rejected")}>
              {pending === "rejected" && <FiLoader className="animate-spin" aria-hidden="true" />}
              {pending === "rejected" ? "Rejecting..." : "Confirm Reject"}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function AdminServices() {
  const [services, setServices] = useState<AdminService[] | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/admin/services", {
          credentials: "same-origin",
          cache: "no-store",
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]),
        });
        const result = await response.json();
        if (!response.ok || result.success !== true || !Array.isArray(result.data)
          || !result.data.every((service: AdminService) => service
            && typeof service._id === "string" && typeof service.title === "string"
            && typeof service.image === "string" && typeof service.approvalStatus === "string")) {
          throw new Error(errorMessage(response.status));
        }
        if (!controller.signal.aborted) {
          setServices(result.data);
          setError("");
        }
      } catch (err) {
        if (!controller.signal.aborted) setError(err instanceof Error && err.name === "Error"
          ? err.message : "Cannot reach FixMate right now. Please try again.");
      }
    }
    void load();
    return () => controller.abort();
  }, [attempt]);

  const refresh = () => setAttempt(value => value + 1);
  if (services === null && !error) return <ServicesLoading />;
  const filtered = services?.filter(service => (status === "all" || service.approvalStatus === status) && `${service.title} ${service.category} ${service.technicianName} ${service.technicianEmail}`.toLowerCase().includes(search.trim().toLowerCase())) ?? [];

  return (
    <div className="space-y-5">
      {error && <div className="space-y-3">
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>
        <Button variant="outline" onClick={refresh}>Try again</Button>
      </div>}
      {services !== null && <>
        <Input aria-label="Search services" placeholder="Search title, category or technician" value={search} onChange={event => setSearch(event.target.value)} className="max-w-sm" />
        <Tabs value={status} onValueChange={value => setStatus(String(value))}>
          <TabsList className="max-w-full overflow-x-auto" aria-label="Service approval status">
            <TabsTrigger value="all">All Services</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
        {filtered.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(service => (
            <Card key={service._id} className="min-w-0 overflow-hidden rounded-2xl pt-0 shadow-sm">
              <Image src={service.image} alt={service.title} width={600} height={280} unoptimized className="h-36 w-full object-cover" />
              <CardContent className="space-y-4 break-words">
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={service.approvalStatus} />
                  <StatusBadge status={service.isAvailable ? "available" : "unavailable"} />
                </div>
                <div>
                  <p className="text-xs text-orange-600">{service.category}</p>
                  <h3 className="mt-1 text-lg font-semibold text-[#092e33]">{service.title}</h3>
                </div>
                <div className="space-y-2 text-sm text-slate-500">
                  <p className="font-medium text-[#092e33]">{service.technicianName}</p>
                  <p>{service.technicianEmail}</p>
                  <p className="flex items-start gap-2"><FiMapPin className="mt-0.5 shrink-0" aria-hidden="true" />{service.serviceArea}</p>
                  <p>Created: {service.createdAt && Number.isFinite(Date.parse(service.createdAt))
                    ? new Date(service.createdAt).toLocaleDateString("en-US", { dateStyle: "medium", timeZone: "UTC" }) : "Not provided"}</p>
                </div>
                <p className="border-t pt-4 font-semibold text-[#092e33]">
                  Base price: {typeof service.basePrice === "number" && Number.isFinite(service.basePrice)
                    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(service.basePrice) : "Not provided"}
                </p>
                {service.approvalStatus === "pending" ? (
                  <ReviewActions service={service} onRefresh={refresh} onUpdated={updated => {
                    setServices(current => current?.map(item => item._id === updated._id ? updated : item) ?? null);
                    refresh();
                  }} />
                ) : <p className="text-xs text-slate-400">Reviewed</p>}
              </CardContent>
            </Card>
          ))}
        </div> : <EmptyState
          title={services.length ? "No matching services" : "No services yet"}
          description={services.length ? "Try another search or approval status." : "Technician submissions will appear here."}
        />}
      </>}
    </div>
  );
}
