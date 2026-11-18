"use client";

import { useState } from "react";
import { FiCalendar, FiMapPin, FiPhone, FiTool } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bookings, type PreviewBooking } from "./data";
import {
  EmptyState,
  FilterSelect,
  PreviewAction,
  PreviewTable,
  StatusBadge,
} from "./DashboardUI";

function BookingActions({
  booking,
  mode,
}: {
  booking: PreviewBooking;
  mode: "customer" | "technician";
}) {
  if (mode === "customer")
    return (
      <div className="flex gap-2">
        {booking.status === "requested" && (
          <PreviewAction
            label="Cancel"
            title="Cancel booking preview"
            destructive
          />
        )}
        {booking.status === "completed" && booking.payment === "unpaid" && (
          <PreviewAction label="Pay Now" title="Payment preview" />
        )}
        {booking.payment === "paid" && <StatusBadge status="paid" />}
      </div>
    );
  return (
    <div className="flex flex-wrap gap-2">
      {booking.status === "requested" && (
        <>
          <PreviewAction label="Accept" />
          <PreviewAction label="Reject" destructive />
        </>
      )}
      {booking.status === "accepted" && <PreviewAction label="Start Work" />}
      {booking.status === "in-progress" && (
        <PreviewAction label="Mark Completed" />
      )}
    </div>
  );
}
export default function BookingList({
  mode = "customer",
  recent = false,
}: {
  mode?: "customer" | "technician" | "admin";
  recent?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [payment, setPayment] = useState("all");
  const [tab, setTab] = useState("all");
  const source =
    mode === "customer"
      ? bookings.filter((b) => b.customer === "Ayesha Rahman")
      : mode === "technician"
        ? bookings.filter((b) => b.technician === "Rafiq Hasan")
        : bookings;
  const filtered = source.filter(
    (booking) =>
      `${booking.service} ${booking.customer} ${booking.technician} ${booking.id}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (status === "all" || booking.status === status) &&
      (payment === "all" || booking.payment === payment) &&
      (tab === "all" || booking.status === tab),
  );
  const rows = recent ? filtered.slice(0, 3) : filtered;
  const service = (booking: PreviewBooking) => (
    <div className="flex items-center gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
        <FiTool />
      </span>
      <div>
        <p className="font-medium text-[#092e33]">{booking.service}</p>
        <p className="mt-1 text-xs text-slate-400">{booking.id}</p>
      </div>
    </div>
  );
  if (mode === "technician")
    return (
      <div className="space-y-5">
        <Tabs value={tab} onValueChange={(value) => setTab(String(value))}>
          <TabsList
            className="max-w-full overflow-x-auto"
            aria-label="Request status"
          >
            <TabsTrigger value="all">All requests</TabsTrigger>
            <TabsTrigger value="requested">Requested</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
          </TabsList>
        </Tabs>
        {rows.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {rows.map((booking) => (
              <Card key={booking.id} className="rounded-xl shadow-none">
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {service(booking)}
                    <StatusBadge status={booking.status} />
                  </div>
                  <div>
                    <p className="font-medium text-[#092e33]">
                      {booking.customer}
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                      <FiPhone />
                      {booking.phone}
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                      <FiMapPin />
                      {booking.address}
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                      <FiCalendar />
                      {booking.date}
                    </p>
                  </div>
                  <p className="rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-600">
                    {booking.problem}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-semibold text-[#092e33]">
                      {booking.price}
                    </span>
                    <BookingActions booking={booking} mode="technician" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    );
  const headers =
    mode === "admin"
      ? [
          "Service",
          "Customer",
          "Technician",
          "Preferred date",
          "Status",
          "Payment",
          "Amount",
        ]
      : [
          "Service",
          "Technician",
          "Preferred date",
          "Price",
          "Status",
          "Payment",
          "Actions",
        ];
  return (
    <div className="space-y-4">
      {!recent && (
        <div className="flex flex-wrap gap-3">
          <Input
            type="search"
            aria-label="Search bookings"
            placeholder="Search bookings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 w-full bg-white sm:max-w-xs"
          />
          <FilterSelect
            label="Statuses"
            value={status}
            onChange={setStatus}
            options={[
              "all",
              "requested",
              "accepted",
              "in-progress",
              "completed",
              "rejected",
              "cancelled",
            ]}
          />
          <FilterSelect
            label="Payments"
            value={payment}
            onChange={setPayment}
            options={["all", "paid", "unpaid"]}
          />
        </div>
      )}
      <PreviewTable
        headers={headers}
        rows={rows.map((booking) =>
          mode === "admin"
            ? [
                service(booking),
                booking.customer,
                booking.technician,
                booking.date,
                <StatusBadge key="status" status={booking.status} />,
                <StatusBadge key="payment" status={booking.payment} />,
                booking.price,
              ]
            : [
                service(booking),
                booking.technician,
                booking.date,
                booking.price,
                <StatusBadge key="status" status={booking.status} />,
                <StatusBadge key="payment" status={booking.payment} />,
                <BookingActions
                  key="actions"
                  booking={booking}
                  mode="customer"
                />,
              ],
        )}
      />
    </div>
  );
}
