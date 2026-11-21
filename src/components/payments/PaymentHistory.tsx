"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState, FilterSelect, PageSkeleton, PreviewTable, StatusBadge } from "@/components/dashboard/preview/DashboardUI";
import { date, isPaymentReport, money, type PaymentReport } from "@/components/admin/types";

export default function PaymentHistory({ admin = false }: { admin?: boolean }) {
  const [report, setReport] = useState<PaymentReport | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState("all");
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(admin ? "/api/admin/payments" : "/api/customer/payments", { credentials: "same-origin", cache: "no-store", signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]) });
        if (response.status === 401) throw new Error("Your session has expired. Please sign in again.");
        if (response.status === 403) throw new Error("You do not have permission to view these payments.");
        const result = await response.json();
        if (!response.ok || result?.success !== true || !isPaymentReport(result.data)) throw new Error("Could not load payment history. Please try again.");
        if (!controller.signal.aborted) { setReport(result.data); setError(""); }
      } catch (err) {
        if (!controller.signal.aborted) { setReport(null); setError(err instanceof Error && err.name === "Error" ? err.message : "Cannot reach FixMate. Please try again."); }
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }
    void load();
    return () => controller.abort();
  }, [admin, attempt]);
  function refresh() { setLoading(true); setAttempt(value => value + 1); }
  const rows = report?.records.filter(record => status === "all" || record.paymentStatus === status) ?? [];
  if (loading) return <PageSkeleton />;
  if (error) return <div className="space-y-3"><p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p><Button variant="outline" onClick={refresh}>Try again</Button></div>;
  return <div className="min-w-0 space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><FilterSelect label="Payment statuses" value={status} onChange={setStatus} options={["all", "paid", "pending", "failed"]} /><Button variant="outline" onClick={refresh}>Refresh</Button></div>
    <p className="rounded-xl bg-orange-50 p-4 text-sm text-orange-800">{report?.dependency}</p>
    <p className="font-medium text-[#092e33]">Verified Test Mode total: {report?.revenue.length ? report.revenue.map(total => money(total.amount, total.currency)).join(" · ") : "$0.00"}</p>
    {rows.length ? <PreviewTable headers={[...(admin ? ["Customer"] : []), "Service", "Technician", "Amount", "Transaction ID", "Paid date", "Status", "Verification"]} rows={rows.map(record => [
      ...(admin ? [<div key="customer">{record.customerName || "Not provided"}<p className="text-xs">{record.customerEmail}</p></div>] : []),
      record.serviceTitle || "Not provided", record.technicianName || "Not provided", money(record.amount, record.currency || ""), record.transactionId || "Not provided", date(record.paidAt),
      <StatusBadge key="status" status={record.paymentStatus || "unknown"} />,
      record.verified === true && ["stripe-webhook", "stripe-api"].includes(record.verificationSource || "") && record.testMode === true
        && record.paymentStatus === "paid" && record.currency === "usd" && typeof record.amount === "number"
        && Number.isFinite(record.amount) && record.amount > 0 && record.stripeSessionId?.startsWith("cs_test_")
        && record.transactionId?.startsWith("pi_") ? "Verified · Stripe Test Mode" : "Unverified · excluded from total",
    ])} /> : <EmptyState title={report?.records.length ? "No matching transactions" : "No payment records yet"} description="Verified payments will appear here after Stripe confirms the payment." />}
  </div>;
}
