import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "info",
  confirmText = "Confirm",
  cancelText = "Cancel"
}) => {
  if (!isOpen) return null;
  const getIcon = () => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-orange-600" />;
      case "error":
        return <XCircle className="w-6 h-6 text-red-600" />;
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      default:
        return <Info className="w-6 h-6 text-blue-600" />;
    }
  };
  const getIconBgColor = () => {
    switch (type) {
      case "warning":
        return "bg-orange-100";
      case "error":
        return "bg-red-100";
      case "success":
        return "bg-green-100";
      default:
        return "bg-blue-100";
    }
  };
  const getConfirmButtonColor = () => {
    switch (type) {
      case "warning":
        return "bg-orange-600 hover:bg-orange-700";
      case "error":
        return "bg-red-600 hover:bg-red-700";
      case "success":
        return "bg-green-600 hover:bg-green-700";
      default:
        return "bg-blue-600 hover:bg-blue-700";
    }
  };
  return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getIconBgColor()}`}>
              {getIcon()}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
              <p className="text-slate-600">{message}</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50 rounded-b-lg flex items-center justify-end gap-3">
          <button
    onClick={onClose}
    className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
  >
            {cancelText}
          </button>
          <button
    onClick={() => {
      onConfirm();
      onClose();
    }}
    className={`px-4 py-2 text-white rounded-lg transition-colors ${getConfirmButtonColor()}`}
  >
            {confirmText}
          </button>
        </div>
      </div>
    </div>;
};
