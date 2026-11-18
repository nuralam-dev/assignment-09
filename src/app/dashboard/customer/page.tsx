import type { Metadata } from "next";
import { FiActivity, FiCalendar, FiCheckCircle } from "react-icons/fi";
import RolePage from "@/components/dashboard/RolePage";
import RoleAccountOverview from "@/components/dashboard/RoleAccountOverview";
import BookingList from "@/components/dashboard/preview/BookingList";
import {
  DashboardLink,
  PageContainer,
  Panel,
  PreviewNotice,
  PreviewAction,
  StatsCard,
  StatusBadge,
} from "@/components/dashboard/preview/DashboardUI";

export const metadata: Metadata = { title: "Customer Overview | FixMate" };
export default function CustomerOverviewPage() {
  return (
    <RolePage role="customer">
      <PageContainer>
        <RoleAccountOverview role="customer" />
        <PreviewNotice />
        <div className="grid gap-4 sm:grid-cols-3">
          <StatsCard
            title="Total Requests"
            value="3"
            icon={<FiCalendar />}
            accent
          />
          <StatsCard title="Active Jobs" value="1" icon={<FiActivity />} />
          <StatsCard
            title="Completed Jobs"
            value="1"
            icon={<FiCheckCircle />}
          />
        </div>
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <Panel
            title="Recent Bookings"
            description="The latest repair requests in the sample customer workspace."
            action={
              <DashboardLink href="/dashboard/customer/bookings">
                All bookings
              </DashboardLink>
            }
          >
            <BookingList recent />
          </Panel>
          <div className="space-y-6">
            <Panel title="Booking Status Overview">
              {[
                ["requested", "1"],
                ["completed", "1"],
                ["cancelled", "1"],
              ].map(([status, count]) => (
                <div
                  key={status}
                  className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0"
                >
                  <StatusBadge status={status} />
                  <span className="font-semibold text-[#092e33]">{count}</span>
                </div>
              ))}
            </Panel>
            <Panel
              title="Need a repair?"
              description="Find the right service for your next repair."
            >
              <PreviewAction
                label="Browse Services"
                title="Browse services preview"
              />
            </Panel>
          </div>
        </div>
      </PageContainer>
    </RolePage>
  );
}
