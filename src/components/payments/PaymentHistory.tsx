"use client";

import { useEffect, useState } from "react";
import { FiCheckCircle, FiDollarSign } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState, FilterSelect, PageSkeleton, PreviewTable, StatusBadge } from "@/components/dashboard/preview/DashboardUI";
import { date, isPaymentReport, money, type PaymentReport } from "@/components/admin/types";

export default function PaymentHistory({ admin = false, technician = false }: { admin?: boolean; technician?: boolean }) {
  const [report, setReport] = useState<PaymentReport | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState("all");
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(technician ? "/api/technician/payments" : admin ? "/api/admin/payments" : "/api/customer/payments", { credentials: "same-origin", cache: "no-store", signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]) });
        if (response.status === 401) throw new Error("Your session has expired. Please sign in again.");
        if (response.status === 403) throw new Error("You do not have permission to view these payments.");
        const result = await response.json();
        if (!response.ok || result?.success !== true || !isPaymentReport(result.data)) throw new Error("Could not load payment history. Please try again.");
        if (technician && (typeof result.data.totalPaidAmount !== "number" || !Number.isFinite(result.data.totalPaidAmount)
          || result.data.totalPaidAmount < 0 || !Number.isSafeInteger(result.data.paidJobCount) || result.data.paidJobCount < 0)) {
          throw new Error("Could not read verified payment totals. Please try again.");
        }
        if (!controller.signal.aborted) { setReport(result.data); setError(""); }
      } catch (err) {
        if (!controller.signal.aborted) { setReport(null); setError(err instanceof Error && err.name === "Error" ? err.message : "Cannot reach FixMate. Please try again."); }
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }
    void load();
    return () => controller.abort();
  }, [admin, technician, attempt]);
  function refresh() { setLoading(true); setAttempt(value => value + 1); }
  const rows = report?.records.filter(record => status === "all" || record.paymentStatus === status) ?? [];
  if (loading) return <PageSkeleton />;
  if (error) return <div className="space-y-3"><p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p><Button variant="outline" onClick={refresh}>Try again</Button></div>;
  return <div className="min-w-0 space-y-5">
    {technician && <div className="grid gap-4 sm:grid-cols-2">
      {[
        { title: "Total paid amount (USD)", value: money(report?.totalPaidAmount), icon: <FiDollarSign /> },
        { title: "Paid jobs", value: String(report?.paidJobCount ?? 0), icon: <FiCheckCircle /> },
      ].map(item => <Card key={item.title} className="min-w-0 rounded-2xl shadow-sm">
        <CardContent className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-slate-500">{item.title}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight wrap-anywhere text-[#092e33]">{item.value}</p>
          </div>
          <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 [&_svg]:size-5">{item.icon}</span>
        </CardContent>
      </Card>)}
    </div>}
    <div className="flex flex-wrap items-center justify-between gap-3">{!technician && <FilterSelect label="Payment statuses" value={status} onChange={setStatus} options={["all", "paid", "pending", "failed"]} />}<Button variant="outline" onClick={refresh}>Refresh</Button></div>
    <p className="rounded-xl bg-orange-50 p-4 text-sm text-orange-800">{report?.dependency}</p>
    {!technician && <p className="font-medium text-[#092e33]">Verified Test Mode total: {report?.revenue.length ? report.revenue.map(total => money(total.amount, total.currency)).join(" · ") : "$0.00"}</p>}
    {rows.length ? <PreviewTable headers={technician ? ["Service", "Customer", "Amount", "Currency", "Payment status", "Transaction ID", "Payment date"] : [...(admin ? ["Customer"] : []), "Service", "Technician", "Amount", "Transaction ID", "Paid date", "Status", "Verification"]} rows={rows.map(record => technician ? [
      record.serviceTitle || "Not provided", record.customerName || "Not provided", money(record.amount, record.currency || ""),
      record.currency?.toUpperCase() || "Not provided", <StatusBadge key="status" status={record.paymentStatus || "unknown"} />,
      record.transactionId || "Not provided", date(record.paidAt),
    ] : [
      ...(admin ? [<div key="customer">{record.customerName || "Not provided"}<p className="text-xs">{record.customerEmail}</p></div>] : []),
      record.serviceTitle || "Not provided", record.technicianName || "Not provided", money(record.amount, record.currency || ""), record.transactionId || "Not provided", date(record.paidAt),
      <StatusBadge key="status" status={record.paymentStatus || "unknown"} />,
      record.verified === true && ["stripe-webhook", "stripe-api"].includes(record.verificationSource || "") && record.testMode === true
        && record.paymentStatus === "paid" && record.currency === "usd" && typeof record.amount === "number"
        && Number.isFinite(record.amount) && record.amount > 0 && record.stripeSessionId?.startsWith("cs_test_")
        && record.transactionId?.startsWith("pi_") ? "Verified · Stripe Test Mode" : "Unverified · excluded from total",
    ])} /> : <EmptyState title={technician ? "No verified payments yet" : report?.records.length ? "No matching transactions" : "No payment records yet"} description={technician ? "Verified payments for your completed repair jobs will appear here. These records are customer payments, not bank payouts." : "Verified payments will appear here after Stripe confirms the payment."} />}
  </div>;
}
