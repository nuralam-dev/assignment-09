"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { FiLoader } from "react-icons/fi";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PreviewDialog } from "@/components/dashboard/preview/DashboardUI";

export default function BookingRequest({ serviceId, serviceTitle }: { serviceId: string; serviceTitle: string }) {
  const { data: session, isPending, error: sessionError, refetch } = authClient.useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [needsSignIn, setNeedsSignIn] = useState(false);
  const submitting = useRef(false);
  const signInUrl = `/sign-in?callbackURL=${encodeURIComponent(`/services/${serviceId}`)}`;
  const isCustomer = session?.user.role === "customer";

  function book() {
    if (isPending || sessionError) return;
    if (!session) { router.push(signInUrl); return; }
    if (!isCustomer) return;
    setError("");
    setNeedsSignIn(false);
    setOpen(true);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || isPending || sessionError || !isCustomer) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const customerPhone = String(fields.get("customerPhone") || "").trim();
    const address = String(fields.get("address") || "").trim();
    const preferredDate = String(fields.get("preferredDate") || "");
    const problemDescription = String(fields.get("problemDescription") || "").trim();
    if (!customerPhone || !address || !preferredDate || !problemDescription) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/^[+0-9() .-]{6,30}$/.test(customerPhone) || customerPhone.replace(/\D/g, "").length < 6
      || preferredDate < new Date().toISOString().slice(0, 10)) {
      setError("Enter a valid phone number and a preferred date today or later.");
      return;
    }
    submitting.current = true;
    setPending(true);
    setError("");
    setNeedsSignIn(false);
    try {
      const response = await fetch("/api/customer/bookings", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, customerPhone, address, preferredDate, problemDescription }),
        signal: AbortSignal.timeout(15000),
      });
      if (response.status === 401) {
        setNeedsSignIn(true);
        throw new Error("Your session has expired. Please sign in again to book this service.");
      }
      if (response.status === 403) throw new Error("Booking is available only to Customers.");
      if (response.status === 404) throw new Error("This service is no longer approved and available. Please browse other services.");
      if (response.status === 409) throw new Error("You already have an active booking for this service. Check My Bookings.");
      const result = await response.json();
      if (!response.ok || result?.success !== true || typeof result.data?._id !== "string"
        || !/^[a-f\d]{24}$/i.test(result.data._id) || result.data?.status !== "requested") {
        throw new Error("Could not create your booking. Please try again.");
      }
      setOpen(false);
      toast.success("Repair request submitted", { description: serviceTitle });
      router.push("/dashboard/customer/bookings");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error && err.name === "Error" ? err.message : "Cannot reach FixMate right now. Please try again.";
      setError(message);
      toast.error("Booking failed", { description: message });
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button className="h-auto w-full bg-orange-500 py-3 text-white hover:bg-orange-600" disabled={isPending || !!sessionError || (!!session && !isCustomer)} onClick={book}>
        {isPending && <FiLoader className="animate-spin" aria-hidden="true" />}
        {isPending ? "Checking session..." : "Book this service"}
      </Button>
      {!isPending && sessionError ? <div role="alert" className="text-sm text-red-700">
        <p>Could not check your session. Please try again.</p>
        <Button variant="outline" onClick={() => void refetch()}>Retry session check</Button>
      </div> : !isPending && session && !isCustomer && <p role="status" className="text-sm text-orange-800">Booking is available only to Customers. You are signed in with a different role.</p>}
      <PreviewDialog open={open && isCustomer} onOpenChange={setOpen} title="Request a repair" description={`Book ${serviceTitle}. Your technician will review this request.`} closeLabel="Close" busy={pending}>
        <form onSubmit={submit} className="space-y-4">
          <p className="text-sm text-slate-600">Customer: {session?.user.name}</p>
          <fieldset disabled={pending} className="space-y-4">
            <label className="block space-y-2 text-sm font-medium text-[#092e33]">Phone number
              <Input name="customerPhone" type="tel" autoComplete="tel" required minLength={6} maxLength={30} />
            </label>
            <label className="block space-y-2 text-sm font-medium text-[#092e33]">Service address
              <Input name="address" autoComplete="street-address" required maxLength={500} />
            </label>
            <label className="block space-y-2 text-sm font-medium text-[#092e33]">Preferred date
              <Input name="preferredDate" type="date" required />
            </label>
            <label className="block space-y-2 text-sm font-medium text-[#092e33]">Problem description
              <textarea name="problemDescription" required maxLength={2000} rows={4} className="w-full rounded-lg border border-input bg-white p-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-orange-300" />
            </label>
          </fieldset>
          {error && <div role="alert" className="space-y-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <p>{error}</p>
            {needsSignIn && <Link href={signInUrl} className="font-medium underline">Sign in to continue</Link>}
            <Link href="/dashboard/customer/bookings" className="block font-medium underline">View My Bookings</Link>
          </div>}
          <Button type="submit" disabled={pending || isPending || !!sessionError} aria-busy={pending} className="w-full bg-orange-500 text-white hover:bg-orange-600">
            {pending && <FiLoader className="animate-spin" aria-hidden="true" />}{pending ? "Submitting..." : "Submit repair request"}
          </Button>
        </form>
      </PreviewDialog>
    </div>
  );
}
