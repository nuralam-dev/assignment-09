import type { Metadata } from "next";
import RolePage from "@/components/dashboard/RolePage";
import ServiceList from "@/components/dashboard/preview/ServiceList";
import {
  PageContainer,
  PageHeader,
  Panel,
  PreviewNotice,
} from "@/components/dashboard/preview/DashboardUI";

export const metadata: Metadata = { title: "Service Approval | FixMate" };
export default function Page() {
  return (
    <RolePage role="admin">
      <PageContainer>
        <PageHeader
          title="Service Approval"
          description="Review technician services before they become available on FixMate."
        />
        <PreviewNotice />
        <Panel
          title="Service review queue"
          description="Filter by approval status and preview review actions."
        >
          <ServiceList approval />
        </Panel>
      </PageContainer>
    </RolePage>
  );
}
