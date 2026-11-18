import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div role="status" aria-label="Loading dashboard" className="flex min-h-svh bg-slate-50">
      <div className="hidden w-64 shrink-0 space-y-6 border-r bg-white p-6 md:block">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="min-w-0 flex-1 space-y-6 p-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
      <span className="sr-only">Loading your session...</span>
    </div>
  );
}
