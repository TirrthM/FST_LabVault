import { Skeleton } from "@/components/ui/skeleton";

export default function BorrowRequestsLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in-50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-9 w-44" />
      </div>

      <Skeleton className="h-10 w-full rounded-lg" />
      <Skeleton className="h-80 rounded-lg" />
    </div>
  );
}
