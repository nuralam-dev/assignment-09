import type { Metadata } from "next";
import RolePage from "@/components/dashboard/RolePage";
import MyServices from "@/components/services/MyServices";
import {
  PageContainer,
  PageHeader,
  Panel,
  DashboardLink,
} from "@/components/dashboard/preview/DashboardUI";

export const metadata: Metadata = { title: "My Services | FixMate" };
export default function Page() {
  return (
    <RolePage role="technician">
      <PageContainer>
        <PageHeader
          title="My Services"
          description="Organize your repair services and review their approval status."
          action={
            <DashboardLink href="/dashboard/technician/add-service">
              Add New Service
            </DashboardLink>
          }
        />
        <Panel
          title="Your service catalogue"
          description="Review your services, approval status, pricing, and availability."
        >
          <MyServices />
        </Panel>
      </PageContainer>
    </RolePage>
  );
}
