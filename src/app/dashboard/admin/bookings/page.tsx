import type { Metadata } from "next";
import RolePage from "@/components/dashboard/RolePage";
import BookingList from "@/components/dashboard/preview/BookingList";
import {
  PageContainer,
  PageHeader,
  Panel,
  PreviewNotice,
} from "@/components/dashboard/preview/DashboardUI";

export const metadata: Metadata = { title: "All Bookings | FixMate" };
export default function Page() {
  return (
    <RolePage role="admin">
      <PageContainer>
        <PageHeader
          title="All Bookings"
          description="Review service requests, booking progress, and payment statuses."
        />
        <PreviewNotice />
        <Panel
          title="Platform bookings"
          description="Search and filter the sample booking workspace."
        >
          <BookingList mode="admin" />
        </Panel>
      </PageContainer>
    </RolePage>
  );
}
