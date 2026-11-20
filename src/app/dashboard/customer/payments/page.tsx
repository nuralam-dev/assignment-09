import type { Metadata } from "next";
import RolePage from "@/components/dashboard/RolePage";
import PaymentHistory from "@/components/payments/PaymentHistory";
import {
  DashboardLink,
  PageContainer,
  PageHeader,
  Panel,
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
        <Panel
          title="Your transactions"
          description="Your stored payment records and verified Stripe Test Mode transactions."
        >
          <PaymentHistory />
        </Panel>
      </PageContainer>
    </RolePage>
  );
}
