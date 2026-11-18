import type { Metadata } from "next";
import {
  FiCalendar,
  FiCheckCircle,
  FiDollarSign,
  FiTool,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import RolePage from "@/components/dashboard/RolePage";
import RoleAccountOverview from "@/components/dashboard/RoleAccountOverview";
import BookingList from "@/components/dashboard/preview/BookingList";
import UserList from "@/components/dashboard/preview/UserList";
import ServiceList from "@/components/dashboard/preview/ServiceList";
import {
  DashboardLink,
  PageContainer,
  Panel,
  PreviewNotice,
  StatsCard,
} from "@/components/dashboard/preview/DashboardUI";

export const metadata: Metadata = { title: "Admin Overview | FixMate" };
export default function AdminOverviewPage() {
  return (
    <RolePage role="admin">
      <PageContainer>
        <RoleAccountOverview role="admin" />
        <PreviewNotice />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard title="Total Users" value="5" icon={<FiUsers />} accent />
          <StatsCard title="Total Technicians" value="2" icon={<FiTool />} />
          <StatsCard title="Total Customers" value="2" icon={<FiUser />} />
          <StatsCard title="Total Services" value="4" icon={<FiTool />} />
          <StatsCard
            title="Pending Approvals"
            value="1"
            icon={<FiCheckCircle />}
          />
          <StatsCard title="Total Bookings" value="7" icon={<FiCalendar />} />
          <StatsCard
            title="Total Revenue"
            value="৳5,200"
            icon={<FiDollarSign />}
          />
        </div>
        <div className="grid items-start gap-6 xl:grid-cols-2">
          <Panel
            title="Recent Users"
            description="New members in the sample workspace."
            action={
              <DashboardLink href="/dashboard/admin/users">
                Manage users
              </DashboardLink>
            }
          >
            <UserList recent />
          </Panel>
          <Panel
            title="Pending Service Approvals"
            description="Services awaiting review."
            action={
              <DashboardLink href="/dashboard/admin/services">
                Review services
              </DashboardLink>
            }
          >
            <ServiceList approval recent />
          </Panel>
        </div>
        <Panel
          title="Recent Bookings"
          description="Latest service requests across the platform."
          action={
            <DashboardLink href="/dashboard/admin/bookings">
              All bookings
            </DashboardLink>
          }
        >
          <BookingList mode="admin" recent />
        </Panel>
      </PageContainer>
    </RolePage>
  );
}
