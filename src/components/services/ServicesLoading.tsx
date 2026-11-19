import { Skeleton } from "@/components/ui/skeleton";

export default function ServicesLoading() {
  return (
    <div role="status" aria-label="Loading repair services" aria-busy="true">
      <p className="sr-only">Loading repair services...</p>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <Skeleton className="h-48 w-full rounded-none" />
            <div className="space-y-4 p-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
