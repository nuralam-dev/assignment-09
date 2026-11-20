import type { Metadata } from "next";
import RolePage from "@/components/dashboard/RolePage";
import RoleAccountOverview from "@/components/dashboard/RoleAccountOverview";
import AdminOverview from "@/components/admin/AdminOverview";
import { PageContainer } from "@/components/dashboard/preview/DashboardUI";

export const metadata: Metadata = { title: "Admin Overview | FixMate" };
export default function AdminOverviewPage() {
  return (
    <RolePage role="admin">
      <PageContainer>
        <RoleAccountOverview role="admin" />
        <AdminOverview />
      </PageContainer>
    </RolePage>
  );
}
