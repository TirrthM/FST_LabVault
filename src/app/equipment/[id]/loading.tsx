import { Skeleton } from "@/components/ui/skeleton";

export default function EquipmentDetailLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in-50">
      {/* Header skeleton */}
      <Skeleton className="h-64 rounded-xl" />

      {/* Custody card skeleton */}
      <Skeleton className="h-32 rounded-lg" />

      {/* Tabs skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    </div>
  );
}
