"use client";
import { FiGrid } from "react-icons/fi";
import AdminData from "./AdminData";
import { date, isOverview } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import {
  DashboardLink,
  EmptyState,
  Panel,
  PreviewTable,
  StatusBadge,
} from "@/components/dashboard/preview/DashboardUI";

const labels: Record<string, string> = {
  totalUsers: "Total Users",
  totalCustomers: "Total Customers",
  totalTechnicians: "Total Technicians",
  totalServices: "Total Services",
  pendingServiceApprovals: "Pending Service Approvals",
  totalBookings: "Total Bookings",
  activeBookings: "Active Bookings",
  completedBookings: "Completed Bookings",
};
export default function AdminOverview() {
  return (
    <AdminData path="overview" validate={isOverview}>
      {(data) => (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Object.entries(labels).map(([key, label]) => (
              <Card key={key} className="rounded-2xl">
                <CardContent>
                  <p className="flex items-center gap-2 text-sm text-slate-500">
                    <FiGrid aria-hidden />
                    {label}
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-[#092e33]">
                    {data.counts[key]}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Panel title="Quick links">
            <div className="flex flex-wrap gap-3">
              {[
                ["users", "Manage Users"],
                ["services", "Manage Services"],
                ["bookings", "All Bookings"],
                ["transactions", "Transactions"],
              ].map(([path, title]) => (
                <DashboardLink key={path} href={`/dashboard/admin/${path}`}>
                  {title}
                </DashboardLink>
              ))}
            </div>
          </Panel>
          <Panel title="Latest service submissions">
            {data.latestServices.length ? (
              <PreviewTable
                headers={["Service", "Technician", "Approval", "Submitted"]}
                rows={data.latestServices.map((item) => [
                  item.title ?? "Not provided",
                  item.technicianName ?? "Not provided",
                  item.approvalStatus ? (
                    <StatusBadge key="status" status={item.approvalStatus} />
                  ) : (
                    "Not provided"
                  ),
                  date(item.createdAt),
                ])}
              />
            ) : (
              <EmptyState
                title="No service submissions yet"
                description="New technician submissions will appear here."
              />
            )}
          </Panel>
          <Panel title="Latest bookings">
            {data.latestBookings.length ? (
              <PreviewTable
                headers={[
                  "Service",
                  "Customer",
                  "Technician",
                  "Status",
                  "Created",
                ]}
                rows={data.latestBookings.map((item) => [
                  item.serviceTitle ?? "Not provided",
                  item.customerName ?? "Not provided",
                  item.technicianName ?? "Not provided",
                  item.status ? (
                    <StatusBadge key="status" status={item.status} />
                  ) : (
                    "Not provided"
                  ),
                  date(item.createdAt),
                ])}
              />
            ) : (
              <EmptyState
                title="No bookings yet"
                description="Customer repair requests will appear here."
              />
            )}
          </Panel>
          <p className="rounded-xl border bg-slate-50 p-4 text-sm text-slate-600">
            {data.paymentRecordCount
              ? `${data.paymentRecordCount} payment record(s). `
              : "No payment records yet. "}
            {data.payments.dependency}
          </p>
        </>
      )}
    </AdminData>
  );
}
