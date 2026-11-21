"use client";

import { useEffect, useRef, useState } from "react";
import { FiLoader } from "react-icons/fi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type PaymentState = "checking" | "retry" | "open" | "processing" | "paid" | "unknown";
export default function PayBooking({ bookingId, onRefresh }: { bookingId: string; onRefresh?: () => void }) {
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<PaymentState>("checking");
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const refresh = useRef(onRefresh);
  useEffect(() => { refresh.current = onRefresh; }, [onRefresh]);
  useEffect(() => {
    const controller = new AbortController();
    async function verify() {
      try {
        const response = await fetch(`/api/customer/payments/booking/${bookingId}`, {
          credentials: "same-origin", cache: "no-store", signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]),
        });
        const result = await response.json();
        if (!response.ok || result?.success !== true || !["paid", "processing", "retry", "open"].includes(result.data?.state)) {
          throw new Error(response.status === 401 ? "Your session has expired. Please sign in again." : "Could not confirm the previous payment. Check its status before paying again.");
        }
        if (!controller.signal.aborted) {
          if (result.data.state === "paid" && result.data.paid !== true) throw new Error("Payment records need verification. Please contact FixMate support.");
          setState(result.data.state); setError("");
          if (result.data.paid) refresh.current?.();
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          const message = err instanceof Error && err.name === "Error" ? err.message : "Payment verification is unavailable. Please check again.";
          setState("unknown"); setError(message); toast.error("Payment status unavailable", { description: message });
        }
      }
    }
    void verify();
    return () => controller.abort();
  }, [bookingId, attempt]);
  async function pay() {
    if (submitting.current || !["retry", "open"].includes(state)) return;
    submitting.current = true; setPending(true); setError("");
    let redirecting = false;
    try {
      const response = await fetch("/api/customer/payments/checkout", {
        method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }), signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (response.status === 401) throw new Error("Your session has expired. Please sign in again.");
      if (response.status === 403) throw new Error("Only Customers can pay for their own bookings.");
      if (response.status === 409 && result?.code === "PAYMENT_PROCESSING") {
        setState("processing"); throw new Error("Payment is processing. Check its status before trying again.");
      }
      if ([404, 409].includes(response.status)) onRefresh?.();
      if (!response.ok || result?.success !== true) throw new Error(
        [400, 404, 409].includes(response.status) && typeof result?.message === "string" ? result.message
          : "Stripe Test Checkout is temporarily unavailable. Please check payment status before trying again.",
      );
      if (result.data?.paid === true) { setState("paid"); toast.success("Payment verified"); onRefresh?.(); return; }
      if (typeof result.data?.url !== "string" || new URL(result.data.url).origin !== "https://checkout.stripe.com") throw new Error("Could not start Stripe Checkout. Please try again.");
      window.location.assign(result.data.url); redirecting = true;
    } catch (err) {
      const message = err instanceof Error && err.name === "Error" ? err.message : "Cannot reach Stripe Checkout. Please check payment status before trying again.";
      setError(message); toast.error("Payment could not start", { description: message });
    } finally { if (!redirecting) { submitting.current = false; setPending(false); } }
  }
  return <div className="space-y-2">
    {state === "checking" ? <p role="status" className="text-sm text-slate-600">Checking payment status...</p>
      : state === "paid" ? <p role="status" className="text-sm font-medium text-teal-700">Paid</p>
      : ["processing", "unknown"].includes(state) ? <>
        <p role="status" className="text-sm text-orange-800">{state === "processing" ? "Payment Processing — please wait for Stripe confirmation." : "Payment status needs confirmation."}</p>
        <Button type="button" variant="outline" onClick={() => { setState("checking"); setAttempt(value => value + 1); }}>Check payment status</Button>
      </> : <Button type="button" disabled={pending} aria-busy={pending} onClick={() => void pay()} className="bg-orange-500 text-white hover:bg-orange-600">{pending && <FiLoader className="animate-spin" aria-hidden="true" />}{pending ? "Opening Checkout..." : "Pay Now"}</Button>}
    <p className="text-xs text-slate-500">Stripe Test Mode — no real money.</p>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
  </div>;
}
