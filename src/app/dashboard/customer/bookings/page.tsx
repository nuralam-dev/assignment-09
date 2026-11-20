import type { Metadata } from "next";
import RolePage from "@/components/dashboard/RolePage";
import CustomerBookings from "@/components/customer/CustomerBookings";
import {
  DashboardLink,
  PageContainer,
  PageHeader,
  Panel,
} from "@/components/dashboard/preview/DashboardUI";

export const metadata: Metadata = {
  title: "My Bookings | FixMate",
  description: "Your FixMate repair bookings workspace.",
};
export default function MyBookingsPage() {
  return (
    <RolePage role="customer">
      <PageContainer>
        <PageHeader
          title="My Bookings"
          description="Review your repair requests, preferred dates, and payment status."
          action={
            <DashboardLink href="/dashboard/customer">
              Back to overview
            </DashboardLink>
          }
        />
        <Panel
          title="Repair bookings"
          description="Track your repair requests and manage your bookings."
        >
          <CustomerBookings />
        </Panel>
      </PageContainer>
    </RolePage>
  );
}
