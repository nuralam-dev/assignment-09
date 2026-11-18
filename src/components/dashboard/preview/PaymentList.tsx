"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { payments } from "./data";
import { PreviewTable, StatusBadge } from "./DashboardUI";

export default function PaymentList({
  customerOnly = false,
}: {
  customerOnly?: boolean;
}) {
  const [query, setQuery] = useState("");
  const rows = payments.filter(
    (payment) =>
      (!customerOnly || payment.customer === "Ayesha Rahman") &&
      `${payment.service} ${payment.id} ${payment.customer}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <div className="space-y-4">
      <Input
        type="search"
        aria-label="Search transactions"
        placeholder="Search service or transaction ID..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-10 sm:max-w-xs"
      />
      <PreviewTable
        headers={
          customerOnly
            ? [
                "Service",
                "Technician",
                "Amount",
                "Transaction ID",
                "Payment date",
                "Status",
              ]
            : [
                "Customer",
                "Service",
                "Technician",
                "Transaction ID",
                "Amount",
                "Payment date",
                "Status",
              ]
        }
        rows={rows.map((payment) =>
          customerOnly
            ? [
                payment.service,
                payment.technician,
                payment.amount,
                <code key="id" className="text-xs">
                  {payment.id}
                </code>,
                payment.date,
                <StatusBadge key="status" status={payment.status} />,
              ]
            : [
                payment.customer,
                payment.service,
                payment.technician,
                <code key="id" className="text-xs">
                  {payment.id}
                </code>,
                payment.amount,
                payment.date,
                <StatusBadge key="status" status={payment.status} />,
              ],
        )}
      />
    </div>
  );
}
