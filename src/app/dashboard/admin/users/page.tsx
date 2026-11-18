import type { Metadata } from "next";
import RolePage from "@/components/dashboard/RolePage";
import UserList from "@/components/dashboard/preview/UserList";
import {
  PageContainer,
  PageHeader,
  Panel,
  PreviewNotice,
} from "@/components/dashboard/preview/DashboardUI";

export const metadata: Metadata = { title: "Manage Users | FixMate" };
export default function Page() {
  return (
    <RolePage role="admin">
      <PageContainer>
        <PageHeader
          title="Manage Users"
          description="Find community members and preview account role controls."
        />
        <PreviewNotice />
        <Panel
          title="User directory"
          description="Sample users, account roles, and joining dates."
        >
          <UserList />
        </Panel>
      </PageContainer>
    </RolePage>
  );
}
