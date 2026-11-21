"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardLink } from "@/components/dashboard/preview/DashboardUI";
import { money } from "@/components/admin/types";

export default function PaymentResult() {
  const params = useSearchParams();
  const id = params.get("session_id");
  const [paid, setPaid] = useState(false);
  const [paymentState, setPaymentState] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [details, setDetails] = useState<{ amount: number; transactionId: string } | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        if (!id || !/^cs_test_[A-Za-z0-9]+$/.test(id) || id.length > 250) throw new Error("This Checkout reference is invalid. Check My Bookings for the current payment status.");
        const response = await fetch(`/api/customer/payments/session/${id}`, { credentials: "same-origin", cache: "no-store", signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]) });
        if (response.status === 401) throw new Error("Please sign in again to check your payment.");
        const result = await response.json();
        if (!response.ok || result?.success !== true || typeof result.data?.paid !== "boolean") throw new Error("Could not verify this payment reference. Please check My Bookings.");
        if (result.data.paid && (result.data.payment?.verified !== true || !["stripe-webhook", "stripe-api"].includes(result.data.payment?.verificationSource)
          || typeof result.data.payment?.amount !== "number" || !Number.isFinite(result.data.payment.amount)
          || typeof result.data.payment?.transactionId !== "string")) throw new Error("The verified payment details are not available yet. Please try again.");
        if (!controller.signal.aborted) {
          setPaid(result.data.paid);
          setPaymentState(result.data.state || "processing");
          setDetails(result.data.paid ? result.data.payment : null);
          setError("");
        }
      } catch (err) { if (!controller.signal.aborted) { setPaid(false); setDetails(null); setError(err instanceof Error && err.name === "Error" ? err.message : "Could not check payment. Please try again."); } }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }
    void load();
    return () => controller.abort();
  }, [id, attempt]);
  return <Card className="mx-auto max-w-xl"><CardContent className="space-y-5 p-6">
    <h1 className="text-2xl font-semibold text-[#092e33]">{loading ? "Checking payment..." : paid ? "Test payment verified" : "Payment verification"}</h1>
    {loading ? <p role="status">Waiting for the verified backend payment record...</p> : error ? <p role="alert" className="text-red-700">{error}</p> : paid ? <><p>Your payment was verified directly with Stripe. This was a Test Mode payment.</p>{details && <p className="wrap-anywhere">{money(details.amount)} · {details.transactionId}</p>}</> : ["retry", "open"].includes(paymentState) ? <p>Payment has not completed. Return to My Bookings to resume or safely retry Checkout.</p> : <p>Stripe confirmation is still being processed. This redirect does not mark your booking as paid. Refresh the status in a moment.</p>}
    <div className="flex flex-wrap gap-3"><Button variant="outline" disabled={loading} onClick={() => { setLoading(true); setAttempt(value => value + 1); }}>Refresh status</Button><DashboardLink href="/dashboard/customer/bookings">My Bookings</DashboardLink><DashboardLink href="/dashboard/customer/payments">Payment History</DashboardLink></div>
  </CardContent></Card>;
}
