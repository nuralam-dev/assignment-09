import type { Metadata } from "next";
import { Suspense } from "react";
import { requireDashboardUser } from "@/lib/dashboard-access";
import ProfileForm from "@/components/dashboard/preview/ProfileForm";
import {
  PageContainer,
  PageHeader,
  PageSkeleton,
  PreviewNotice,
} from "@/components/dashboard/preview/DashboardUI";

export const metadata: Metadata = { title: "Update Profile | FixMate" };
async function Profile() {
  const user = await requireDashboardUser();
  return (
    <PageContainer>
      <PageHeader
        title="Update Profile"
        description="Review your account information and preview your profile details."
      />
      <PreviewNotice />
      <ProfileForm user={user} />
    </PageContainer>
  );
}
export default function ProfilePage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Profile />
    </Suspense>
  );
}
