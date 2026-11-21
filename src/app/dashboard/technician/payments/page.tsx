import type { Metadata } from "next";
import RolePage from "@/components/dashboard/RolePage";
import PaymentHistory from "@/components/payments/PaymentHistory";
import { DashboardLink, PageContainer, PageHeader, Panel } from "@/components/dashboard/preview/DashboardUI";

export const metadata: Metadata = { title: "Technician Payment History | FixMate" };

export default function TechnicianPaymentsPage() {
  return (
    <RolePage role="technician">
      <PageContainer>
        <PageHeader
          title="Payment History"
          description="Verified customer payments for your completed repair jobs."
          action={<DashboardLink href="/dashboard/technician/requests">Manage Requests</DashboardLink>}
        />
        <Panel title="Your paid repair jobs" description="Customer payments recorded by FixMate. These are not bank payouts.">
          <PaymentHistory technician />
        </Panel>
      </PageContainer>
    </RolePage>
  );
}
