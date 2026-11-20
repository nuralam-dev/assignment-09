import type { Metadata } from "next";
import { Suspense } from "react";
import { requireDashboardUser } from "@/lib/dashboard-access";
import ProfileForm from "@/components/dashboard/preview/ProfileForm";
import {
  PageContainer,
  PageHeader,
  PageSkeleton,
} from "@/components/dashboard/preview/DashboardUI";

export const metadata: Metadata = { title: "Update Profile | FixMate" };
async function Profile() {
  const user = await requireDashboardUser();
  return (
    <PageContainer>
      <PageHeader
        title="Update Profile"
        description="Update your name and profile image. Email and role are read-only."
      />
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
