"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FilterSelect,
  PreviewDialog,
  PreviewTable,
  StatusBadge,
} from "@/components/dashboard/preview/DashboardUI";
import AdminData from "./AdminData";
import { date, isBookings, money, type AdminBooking } from "./types";

function BookingsTable({ bookings }: { bookings: AdminBooking[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<AdminBooking | null>(null);
  const filtered = bookings.filter(
    (booking) =>
      (status === "all" || booking.status === status) &&
      [
        booking.serviceTitle,
        booking.customerName,
        booking.customerEmail,
        booking.technicianName,
        booking.technicianEmail,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search.trim().toLowerCase()),
  );
  const badge = (value?: string) =>
    value ? <StatusBadge key={value} status={value} /> : "Not provided";
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        <Input
          aria-label="Search bookings"
          placeholder="Search customer, technician or service"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-sm"
        />
        <FilterSelect
          label="Statuses"
          value={status}
          onChange={setStatus}
          options={[
            "all",
            "requested",
            "accepted",
            "rejected",
            "in-progress",
            "completed",
            "cancelled",
          ]}
        />
      </div>
      <PreviewTable
        headers={[
          "Service",
          "Customer",
          "Technician",
          "Preferred date",
          "Status",
          "Base price",
          "Final amount",
          "Payment",
          "Details",
        ]}
        rows={filtered.map((booking) => [
          booking.serviceTitle ?? "Not provided",
          <div key="customer">
            {booking.customerName ?? "Not provided"}
            <p className="text-xs">{booking.customerEmail}</p>
          </div>,
          <div key="technician">
            {booking.technicianName ?? "Not provided"}
            <p className="text-xs">{booking.technicianEmail}</p>
          </div>,
          date(booking.preferredDate),
          badge(booking.status),
          money(booking.basePrice),
          money(booking.finalAmount),
          badge(booking.paymentStatus),
          <Button
            key="details"
            variant="outline"
            onClick={() => setSelected(booking)}
          >
            View details
          </Button>,
        ])}
      />
      <PreviewDialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        title="Booking details"
        description="Read-only booking information. Status updates belong to the customer and assigned technician workflows."
        closeLabel="Close"
      >
        {selected && (
          <dl className="grid gap-4 text-sm">
            {[
              ["Booking ID", selected._id],
              ["Service", selected.serviceTitle],
              ["Service ID", selected.serviceId],
              ["Category", selected.category],
              ["Customer", selected.customerName],
              ["Customer email", selected.customerEmail],
              ["Phone", selected.customerPhone],
              ["Address", selected.address],
              ["Technician", selected.technicianName],
              ["Technician email", selected.technicianEmail],
              ["Preferred date", date(selected.preferredDate)],
              ["Problem description", selected.problemDescription],
              ["Status", selected.status],
              ["Base price", money(selected.basePrice)],
              ["Final amount", money(selected.finalAmount)],
              ["Payment status", selected.paymentStatus],
              ["Created", date(selected.createdAt)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="grid gap-1 border-b pb-2 sm:grid-cols-[140px_1fr]"
              >
                <dt className="font-medium text-[#092e33]">{label}</dt>
                <dd className="whitespace-pre-wrap break-words text-slate-600">
                  {value ?? "Not provided"}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </PreviewDialog>
    </div>
  );
}
export default function AdminBookings() {
  return (
    <AdminData path="bookings" validate={isBookings}>
      {(bookings) => <BookingsTable bookings={bookings} />}
    </AdminData>
  );
}
