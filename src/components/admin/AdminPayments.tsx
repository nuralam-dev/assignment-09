"use client";
import { useState } from "react";
import {
  EmptyState,
  FilterSelect,
  PreviewTable,
  StatusBadge,
} from "@/components/dashboard/preview/DashboardUI";
import AdminData from "./AdminData";
import { date, isPaymentReport, money, type PaymentReport } from "./types";

function PaymentsTable({ report }: { report: PaymentReport }) {
  const [status, setStatus] = useState("all");
  const statuses = Array.from(
    new Set([
      "paid",
      "pending",
      "failed",
      ...report.records
        .map((record) => record.paymentStatus)
        .filter((value): value is string => !!value),
    ]),
  );
  const filtered = report.records.filter(
    (record) => status === "all" || record.paymentStatus === status,
  );
  return (
    <div className="space-y-5">
      <p
        role="status"
        className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800"
      >
        {report.dependency} No amount is counted as verified revenue.
      </p>
      <p className="text-sm text-slate-500">
        Stored records: {report.records.length}. Different currencies are shown
        separately on each record.
      </p>
      <FilterSelect
        label="Payment statuses"
        value={status}
        onChange={setStatus}
        options={["all", ...statuses]}
      />
      {filtered.length ? (
        <PreviewTable
          headers={[
            "Customer",
            "Service",
            "Technician",
            "Amount",
            "Currency",
            "Transaction ID",
            "Stored status",
            "Paid date",
            "Verification",
          ]}
          rows={filtered.map((record) => [
            record.customerName ?? "Not provided",
            record.serviceTitle ?? "Not provided",
            record.technicianName ?? "Not provided",
            record.currency
              ? money(record.amount, record.currency)
              : (record.amount ?? "Not provided"),
            record.currency?.toUpperCase() ?? "Not provided",
            record.transactionId ?? "Not provided",
            record.paymentStatus ? (
              <StatusBadge key="status" status={record.paymentStatus} />
            ) : (
              "Not provided"
            ),
            date(record.paidAt),
            "Unverified — excluded from revenue",
          ])}
        />
      ) : (
        <EmptyState
          title={
            report.records.length
              ? "No matching transactions"
              : "No payment records yet"
          }
          description={
            report.records.length
              ? "Choose another payment status."
              : "Transactions will be available after the payment integration is completed. No payments can be created from this page."
          }
        />
      )}
    </div>
  );
}
export default function AdminPayments() {
  return (
    <AdminData path="payments" validate={isPaymentReport}>
      {(report) => <PaymentsTable report={report} />}
    </AdminData>
  );
}
