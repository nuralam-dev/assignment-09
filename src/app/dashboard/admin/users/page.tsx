import type { Metadata } from "next";
import RolePage from "@/components/dashboard/RolePage";
import AdminUsers from "@/components/admin/AdminUsers";
import {
  PageContainer,
  PageHeader,
  Panel,
} from "@/components/dashboard/preview/DashboardUI";

export const metadata: Metadata = { title: "Manage Users | FixMate" };
export default function Page() {
  return (
    <RolePage role="admin">
      <PageContainer>
        <PageHeader
          title="Manage Users"
          description="Find members and manage customer and technician roles."
        />
        <Panel title="Manage Users">
          <AdminUsers />
        </Panel>
      </PageContainer>
    </RolePage>
  );
}
