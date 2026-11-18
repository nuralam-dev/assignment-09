import type { Metadata } from "next";
import RolePage from "@/components/dashboard/RolePage";
import BookingList from "@/components/dashboard/preview/BookingList";
import {
  DashboardLink,
  PageContainer,
  PageHeader,
  Panel,
  PreviewNotice,
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
        <PreviewNotice />
        <Panel
          title="Repair bookings"
          description="Temporary sample bookings with status-based action previews."
        >
          <BookingList />
        </Panel>
      </PageContainer>
    </RolePage>
  );
}
