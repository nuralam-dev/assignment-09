import type { Metadata } from "next";
import RolePage from "@/components/dashboard/RolePage";
import RoleAccountOverview from "@/components/dashboard/RoleAccountOverview";
import { PageContainer } from "@/components/dashboard/preview/DashboardUI";
import CustomerOverview from "@/components/customer/CustomerOverview";

export const metadata: Metadata = { title: "Customer Overview | FixMate" };

export default function CustomerOverviewPage() {
  return (
    <RolePage role="customer">
      <PageContainer>
        <RoleAccountOverview role="customer" />
        <CustomerOverview />
      </PageContainer>
    </RolePage>
  );
}
