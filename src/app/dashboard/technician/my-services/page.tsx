import type { Metadata } from "next";
import RolePage from "@/components/dashboard/RolePage";
import ServiceList from "@/components/dashboard/preview/ServiceList";
import {
  PageContainer,
  PageHeader,
  Panel,
  PreviewNotice,
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
        <PreviewNotice />
        <Panel
          title="Your service catalogue"
          description="Preview availability, pricing, and service management controls."
        >
          <ServiceList />
        </Panel>
      </PageContainer>
    </RolePage>
  );
}
