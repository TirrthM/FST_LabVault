import { Skeleton } from "@/components/ui/skeleton";

export default function EquipmentLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in-50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>

      {/* Filter bar skeleton */}
      <Skeleton className="h-28 rounded-lg" />

      {/* Grid items skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
