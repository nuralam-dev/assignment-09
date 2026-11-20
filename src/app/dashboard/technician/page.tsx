import type { Metadata } from "next";
import RolePage from "@/components/dashboard/RolePage";
import RoleAccountOverview from "@/components/dashboard/RoleAccountOverview";
import TechnicianOverview from "@/components/dashboard/TechnicianOverview";
import { PageContainer } from "@/components/dashboard/preview/DashboardUI";

export const metadata: Metadata = { title: "Technician Overview | FixMate" };

export default function TechnicianOverviewPage() {
  return (
    <RolePage role="technician">
      <PageContainer>
        <RoleAccountOverview role="technician" />
        <TechnicianOverview />
      </PageContainer>
    </RolePage>
  );
}
