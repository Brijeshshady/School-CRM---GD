export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
        <div className="h-6 w-48 bg-slate-200 rounded"></div>
        <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
      </div>
      <div className="w-full">
        {/* Header row */}
        <div className="grid grid-cols-4 gap-4 p-4 border-b border-slate-100 bg-slate-50">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-slate-200 rounded w-full"></div>
          ))}
        </div>
        {/* Body rows */}
        <div className="divide-y divide-slate-100">
          {[...Array(rows)].map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-4 gap-4 p-4">
              {[...Array(4)].map((_, colIndex) => (
                <div key={colIndex} className="h-4 bg-slate-100 rounded w-full"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
