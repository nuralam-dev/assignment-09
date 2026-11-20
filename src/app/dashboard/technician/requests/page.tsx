import type { Metadata } from "next";
import RolePage from "@/components/dashboard/RolePage";
import TechnicianRequests from "@/components/bookings/TechnicianRequests";
import {
  PageContainer,
  PageHeader,
  Panel,
} from "@/components/dashboard/preview/DashboardUI";

export const metadata: Metadata = { title: "Manage Requests | FixMate" };
export default function Page() {
  return (
    <RolePage role="technician">
      <PageContainer>
        <PageHeader
          title="Manage Requests"
          description="Review your assigned repair requests and accept or reject pending bookings."
        />
        <Panel
          title="Repair requests"
          description="Customer contact details, repair descriptions, and current booking status."
        >
          <TechnicianRequests />
        </Panel>
      </PageContainer>
    </RolePage>
  );
}
