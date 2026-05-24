import { LoadingSpinner } from "../LoadingSpinner";

export const LoadingOverlay = ({ active, text = "Please wait..." }) => {
  if (!active) return null;

  return (
    <div className="absolute inset-0 z-50 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl transition-all">
      <LoadingSpinner size="md" className="mb-3" />
      <p className="text-sm font-medium text-slate-700 animate-pulse">{text}</p>
    </div>
  );
};
