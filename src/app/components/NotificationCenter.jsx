import { Bell, X, MessageSquare, BookOpen, Award, UserCheck, Trash2 } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
export const NotificationCenter = ({ onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const navigate = useNavigate();
  const getNotificationIcon = (type) => {
    switch (type) {
      case "message":
        return <MessageSquare className="w-4 h-4" />;
      case "assignment":
        return <BookOpen className="w-4 h-4" />;
      case "grade":
        return <Award className="w-4 h-4" />;
      case "attendance":
        return <UserCheck className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };
  const getNotificationColor = (type) => {
    switch (type) {
      case "message":
        return "bg-blue-100 text-blue-600";
      case "assignment":
        return "bg-purple-100 text-purple-600";
      case "grade":
        return "bg-green-100 text-green-600";
      case "attendance":
        return "bg-orange-100 text-orange-600";
      case "error":
        return "bg-red-100 text-red-600";
      case "warning":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };
  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id || notification._id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onClose();
    }
  };
  return <>
      {
    /* Backdrop */
  }
      <div
    className="fixed inset-0 z-40 bg-black/20"
    onClick={onClose}
  />

      {
    /* Notification Panel */
  }
      <div className="fixed right-4 top-20 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 max-h-[calc(100vh-6rem)] flex flex-col">
        {
    /* Header */
  }
        <div className="p-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="font-bold text-slate-900">Notifications</h3>
            {unreadCount > 0 && <p className="text-xs text-slate-500 mt-0.5">
                {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
              </p>}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && <button
    onClick={markAllAsRead}
    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
  >
                Mark all read
              </button>}
            <button
    onClick={onClose}
    className="p-1 hover:bg-slate-100 rounded transition-colors"
  >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto">
          {Array.isArray(notifications) && notifications.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {notifications.map((notification) => {
                const notificationId = notification.id || notification._id;
                const timestamp = notification.timestamp || notification.createdAt;
                
                // Safe date formatting
                let displayTime = "Just now";
                try {
                  if (timestamp) {
                    displayTime = format(new Date(timestamp), "MMM d, h:mm a");
                  }
                } catch (e) {
                  console.error("Date formatting error:", e);
                }

                return (
                  <div
                    key={notificationId}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 transition-colors cursor-pointer ${!notification.read ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-slate-50"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-slate-900 text-sm">{notification.title}</p>
                          {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />}
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-slate-400 mt-2">
                          {displayTime}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium">No notifications</p>
              <p className="text-sm text-slate-500 mt-1">You're all caught up!</p>
            </div>
          )}
        </div>

        {
    /* Footer */
  }
        {notifications.length > 0 && <div className="p-3 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
            <button
    onClick={clearAll}
    className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
  >
              <Trash2 className="w-3 h-3" />
              Clear all
            </button>
            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              View all
            </button>
          </div>}
      </div>
    </>;
};
