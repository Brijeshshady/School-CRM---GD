import { CardSkeleton } from "./CardSkeleton";
import { TableSkeleton } from "./TableSkeleton";

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 w-full animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200 rounded-lg"></div>
          <div className="h-4 w-48 bg-slate-200 rounded-lg"></div>
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TableSkeleton rows={4} />
        </div>
        <div className="space-y-4">
          <div className="h-64 bg-slate-100 rounded-xl border border-slate-200"></div>
          <div className="h-48 bg-slate-100 rounded-xl border border-slate-200"></div>
        </div>
      </div>
    </div>
  );
};
