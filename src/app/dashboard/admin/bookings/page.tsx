import type { Metadata } from "next";
import RolePage from "@/components/dashboard/RolePage";
import AdminBookings from "@/components/admin/AdminBookings";
import {
  PageContainer,
  PageHeader,
  Panel,
} from "@/components/dashboard/preview/DashboardUI";

export const metadata: Metadata = { title: "All Bookings | FixMate" };
export default function Page() {
  return (
    <RolePage role="admin">
      <PageContainer>
        <PageHeader
          title="All Bookings"
          description="Monitor customer repair requests and inspect booking details."
        />
        <Panel title="All Bookings">
          <AdminBookings />
        </Panel>
      </PageContainer>
    </RolePage>
  );
}
