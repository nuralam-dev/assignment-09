import type { Metadata } from "next";
import { FiCreditCard, FiDollarSign } from "react-icons/fi";
import RolePage from "@/components/dashboard/RolePage";
import PaymentList from "@/components/dashboard/preview/PaymentList";
import {
  PageContainer,
  PageHeader,
  Panel,
  PreviewNotice,
  StatsCard,
} from "@/components/dashboard/preview/DashboardUI";

export const metadata: Metadata = { title: "Transactions | FixMate" };
export default function TransactionsPage() {
  return (
    <RolePage role="admin">
      <PageContainer>
        <PageHeader
          title="Transactions"
          description="Review repair payment records and the platform revenue summary."
        />
        <PreviewNotice />
        <div className="grid gap-4 sm:grid-cols-2">
          <StatsCard
            title="Total Revenue"
            value="৳5,200"
            icon={<FiDollarSign />}
            accent
          />
          <StatsCard
            title="Total Transactions"
            value="3"
            icon={<FiCreditCard />}
          />
        </div>
        <Panel
          title="Recent Transactions"
          description="Sample transaction references and payment details."
        >
          <PaymentList />
        </Panel>
      </PageContainer>
    </RolePage>
  );
}
