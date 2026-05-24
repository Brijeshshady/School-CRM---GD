import { FileQuestion } from "lucide-react";

export const EmptyState = ({ 
  title = "No data found", 
  message = "There is nothing to display here right now.",
  icon: Icon = FileQuestion,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-slate-200 border-dashed">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
        {message}
      </p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};
