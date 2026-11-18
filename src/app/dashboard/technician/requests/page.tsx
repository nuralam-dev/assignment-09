import type { Metadata } from "next";
import RolePage from "@/components/dashboard/RolePage";
import BookingList from "@/components/dashboard/preview/BookingList";
import {
  PageContainer,
  PageHeader,
  Panel,
  PreviewNotice,
} from "@/components/dashboard/preview/DashboardUI";

export const metadata: Metadata = { title: "Manage Requests | FixMate" };
export default function Page() {
  return (
    <RolePage role="technician">
      <PageContainer>
        <PageHeader
          title="Manage Requests"
          description="Review customer repair requests and preview the service workflow."
        />
        <PreviewNotice />
        <Panel
          title="Repair requests"
          description="Customer contact details, repair descriptions, and status-based action previews."
        >
          <BookingList mode="technician" />
        </Panel>
      </PageContainer>
    </RolePage>
  );
}
