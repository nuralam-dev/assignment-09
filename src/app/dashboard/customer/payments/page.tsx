import type { Metadata } from "next";
import { FiCalendar, FiCreditCard, FiDollarSign } from "react-icons/fi";
import RolePage from "@/components/dashboard/RolePage";
import PaymentList from "@/components/dashboard/preview/PaymentList";
import {
  DashboardLink,
  PageContainer,
  PageHeader,
  Panel,
  PreviewNotice,
  StatsCard,
} from "@/components/dashboard/preview/DashboardUI";

export const metadata: Metadata = {
  title: "Payment History | FixMate",
  description: "Your FixMate repair payment history workspace.",
};
export default function PaymentHistoryPage() {
  return (
    <RolePage role="customer">
      <PageContainer>
        <PageHeader
          title="Payment History"
          description="A clear overview of your repair payments and transaction details."
          action={
            <DashboardLink href="/dashboard/customer/bookings">
              My Bookings
            </DashboardLink>
          }
        />
        <PreviewNotice />
        <div className="grid gap-4 sm:grid-cols-3">
          <StatsCard
            title="Total Paid"
            value="৳1,800"
            icon={<FiDollarSign />}
            accent
          />
          <StatsCard title="Transactions" value="1" icon={<FiCreditCard />} />
          <StatsCard
            title="Latest Payment"
            value="27 Oct"
            icon={<FiCalendar />}
          />
        </div>
        <Panel
          title="Your transactions"
          description="Sample payment amounts, references, and dates."
        >
          <PaymentList customerOnly />
        </Panel>
      </PageContainer>
    </RolePage>
  );
}
