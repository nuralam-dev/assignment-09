import type { Metadata } from "next";
import { FiCheckCircle, FiClock, FiPlus, FiTool } from "react-icons/fi";
import RolePage from "@/components/dashboard/RolePage";
import RoleAccountOverview from "@/components/dashboard/RoleAccountOverview";
import BookingList from "@/components/dashboard/preview/BookingList";
import ServiceList from "@/components/dashboard/preview/ServiceList";
import {
  DashboardLink,
  PageContainer,
  Panel,
  PreviewNotice,
  StatsCard,
} from "@/components/dashboard/preview/DashboardUI";

export const metadata: Metadata = { title: "Technician Overview | FixMate" };
export default function TechnicianOverviewPage() {
  return (
    <RolePage role="technician">
      <PageContainer>
        <RoleAccountOverview role="technician" />
        <PreviewNotice />
        <div className="flex flex-wrap gap-3">
          <DashboardLink href="/dashboard/technician/add-service">
            <FiPlus />
            Add Service
          </DashboardLink>
          <DashboardLink href="/dashboard/technician/requests">
            Manage Requests
          </DashboardLink>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatsCard
            title="Total Services"
            value="4"
            icon={<FiTool />}
            accent
          />
          <StatsCard
            title="Approved Services"
            value="2"
            icon={<FiCheckCircle />}
          />
          <StatsCard title="Pending Requests" value="1" icon={<FiClock />} />
        </div>
        <Panel
          title="Recent Service Requests"
          description="A preview of your upcoming work."
          action={
            <DashboardLink href="/dashboard/technician/requests">
              View requests
            </DashboardLink>
          }
        >
          <BookingList mode="technician" recent />
        </Panel>
        <Panel
          title="Recent Services"
          description="Your service catalogue at a glance."
          action={
            <DashboardLink href="/dashboard/technician/my-services">
              All services
            </DashboardLink>
          }
        >
          <ServiceList recent />
        </Panel>
      </PageContainer>
    </RolePage>
  );
}
