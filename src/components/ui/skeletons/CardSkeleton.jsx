export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="h-4 w-24 bg-slate-200 rounded"></div>
          <div className="h-8 w-16 bg-slate-200 rounded"></div>
          <div className="h-3 w-32 bg-slate-200 rounded"></div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-slate-200"></div>
      </div>
    </div>
  );
};
