"use client";

import { useRef, useState } from "react";
import { FiLoader } from "react-icons/fi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function PayBooking({ bookingId, onRefresh }: { bookingId: string; onRefresh?: () => void }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  async function pay() {
    if (submitting.current) return;
    submitting.current = true;
    setPending(true);
    setError("");
    let redirecting = false;
    try {
      const response = await fetch("/api/customer/payments/checkout", {
        method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }), signal: AbortSignal.timeout(15000),
      });
      if (response.status === 401) throw new Error("Your session has expired. Please sign in again.");
      if (response.status === 403) throw new Error("Only Customers can pay for their own bookings.");
      if ([404, 409].includes(response.status)) onRefresh?.();
      if (response.status === 503) throw new Error("Stripe Test Checkout is temporarily unavailable. Please try again or contact FixMate support.");
      if (response.status === 409) throw new Error("This booking is not ready for a new payment. Refresh My Bookings to check its status.");
      const result = await response.json();
      if (!response.ok || result?.success !== true || typeof result.data?.url !== "string"
        || new URL(result.data.url).origin !== "https://checkout.stripe.com") throw new Error("Could not start Stripe Checkout. Please try again.");
      window.location.assign(result.data.url);
      redirecting = true;
    } catch (err) {
      const message = err instanceof Error && err.name === "Error" ? err.message : "Cannot reach Stripe Checkout. Please try again.";
      setError(message);
      toast.error("Payment could not start", { description: message });
    } finally { if (!redirecting) { submitting.current = false; setPending(false); } }
  }
  return <div className="space-y-2">
    <Button type="button" disabled={pending} aria-busy={pending} onClick={() => void pay()} className="bg-orange-500 text-white hover:bg-orange-600">{pending && <FiLoader className="animate-spin" aria-hidden="true" />}{pending ? "Opening Checkout..." : "Pay Now"}</Button>
    <p className="text-xs text-slate-500">Stripe Test Mode — no real money.</p>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
  </div>;
}
