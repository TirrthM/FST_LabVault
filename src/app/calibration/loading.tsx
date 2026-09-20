import { Skeleton } from "@/components/ui/skeleton";

export default function CalibrationLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in-50">
      <div className="space-y-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-96" />
      </div>

      <Skeleton className="h-64 rounded-lg" />
      <Skeleton className="h-64 rounded-lg" />
    </div>
  );
}
