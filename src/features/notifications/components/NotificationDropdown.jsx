import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { 
  Bell, Check, CheckCheck, Trash2, ExternalLink, 
  BookOpen, Award, FileText, Calendar, ShieldAlert 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'assignment':
      return <BookOpen className="w-4 h-4 text-blue-400" />;
    case 'grade':
      return <Award className="w-4 h-4 text-emerald-400" />;
    case 'attendance':
      return <Calendar className="w-4 h-4 text-amber-400" />;
    case 'ticket':
      return <ShieldAlert className="w-4 h-4 text-rose-400" />;
    default:
      return <FileText className="w-4 h-4 text-slate-400" />;
  }
};

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllRead, deleteNotification } = useNotifications();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (n) => {
    if (!n.read) {
      markAsRead(n._id);
    }
    setIsOpen(false);
    if (n.actionUrl) {
      navigate(n.actionUrl);
    }
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800/80 rounded-xl border border-slate-700/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
      >
        <Bell className="w-5 h-5 transition-transform duration-300 hover:rotate-12" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-orange-500 text-[10px] font-bold text-white ring-2 ring-slate-900 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 origin-top-right rounded-2xl border border-slate-700/60 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-top-2">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-indigo-400 font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead()}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[350px] overflow-y-auto py-1 divide-y divide-slate-800/50">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="mb-3 rounded-full bg-slate-800/40 p-3">
                  <Bell className="w-6 h-6 text-slate-500" />
                </div>
                <p className="text-sm font-medium text-slate-400">All caught up!</p>
                <p className="text-xs text-slate-500 mt-1">No new notifications at the moment.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`group relative flex gap-3 p-3.5 hover:bg-slate-800/40 rounded-xl transition-all duration-200 cursor-pointer ${
                    !n.read ? 'bg-indigo-950/20' : ''
                  }`}
                  onClick={() => handleNotificationClick(n)}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5 rounded-xl bg-slate-800/80 p-2 border border-slate-700/30 group-hover:scale-105 transition-transform duration-200">
                    {getNotificationIcon(n.type)}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs font-semibold truncate ${!n.read ? 'text-white' : 'text-slate-300'}`}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${!n.read ? 'text-slate-200' : 'text-slate-400'}`}>
                      {n.message}
                    </p>
                  </div>

                  {/* Quick Action Overlay (Delete) */}
                  <div className="absolute right-3 top-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(n._id);
                      }}
                      className="p-1 text-slate-500 hover:text-rose-400 bg-slate-800/80 rounded-md border border-slate-700/50 hover:bg-slate-800 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-800 p-2 mt-1">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-semibold text-center text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all duration-200"
            >
              View all notifications
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
