import type { Metadata } from "next";
import RolePage from "@/components/dashboard/RolePage";
import AdminServices from "@/components/services/AdminServices";
import {
  PageContainer,
  PageHeader,
  Panel,
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
        <Panel
          title="Service review queue"
          description="Review all services and approve or reject pending submissions."
        >
          <AdminServices />
        </Panel>
      </PageContainer>
    </RolePage>
  );
}
