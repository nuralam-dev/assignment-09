import type { Metadata } from "next";
import RolePage from "@/components/dashboard/RolePage";
import AdminPayments from "@/components/admin/AdminPayments";
import {
  PageContainer,
  PageHeader,
  Panel,
} from "@/components/dashboard/preview/DashboardUI";

export const metadata: Metadata = { title: "Transactions | FixMate" };
export default function Page() {
  return (
    <RolePage role="admin">
      <PageContainer>
        <PageHeader
          title="Transactions"
          description="Read payment records and check payment verification availability."
        />
        <Panel title="Transactions">
          <AdminPayments />
        </Panel>
      </PageContainer>
    </RolePage>
  );
}
