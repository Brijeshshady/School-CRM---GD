import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { 
  Bell, Check, CheckCheck, Trash2, ExternalLink, 
  BookOpen, Award, FileText, Calendar, ShieldAlert,
  Inbox, SlidersHorizontal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'assignment':
      return <BookOpen className="w-5 h-5 text-blue-400" />;
    case 'grade':
      return <Award className="w-5 h-5 text-emerald-400" />;
    case 'attendance':
      return <Calendar className="w-5 h-5 text-amber-400" />;
    case 'ticket':
      return <ShieldAlert className="w-5 h-5 text-rose-400" />;
    default:
      return <FileText className="w-5 h-5 text-slate-400" />;
  }
};

export const NotificationCenter = () => {
  const { notifications, unreadCount, markAsRead, markAllRead, deleteNotification } = useNotifications();
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const navigate = useNavigate();

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const handleNotificationClick = (n) => {
    if (!n.read) {
      markAsRead(n._id);
    }
    if (n.actionUrl) {
      navigate(n.actionUrl);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-slate-900/60 rounded-3xl border border-slate-800/80 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
              <Bell className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Notification Center</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Manage your real-time alerts, support updates, and academic notifications.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead()}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-white rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all duration-300 shadow-sm cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls & List Block */}
        <div className="bg-slate-900/40 rounded-3xl border border-slate-800/60 backdrop-blur-xl shadow-xl overflow-hidden">
          
          {/* Filters Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-850 bg-slate-900/40">
            <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-850/60">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                  filter === 'all' 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                  filter === 'unread' 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                  filter === 'read' 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Read
              </button>
            </div>
            
            <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {filteredNotifications.length} items
            </div>
          </div>

          {/* List Content */}
          <div className="divide-y divide-slate-850">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="mb-4 rounded-full bg-slate-950/40 p-4 border border-slate-850">
                  <Inbox className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-base font-semibold text-slate-300">No notifications found</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  There are no notifications matching your current filter. Real-time updates will automatically appear here.
                </p>
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={`group relative flex gap-4 p-5 hover:bg-slate-800/20 transition-all duration-200 cursor-pointer ${
                    !n.read ? 'bg-indigo-950/5' : ''
                  }`}
                >
                  {/* Glowing vertical bar for unread */}
                  {!n.read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                  )}

                  {/* Icon Box */}
                  <div className="flex-shrink-0 rounded-2xl bg-slate-800/60 p-3 border border-slate-700/30 group-hover:scale-105 transition-transform duration-200 shadow-inner">
                    {getNotificationIcon(n.type)}
                  </div>

                  {/* Message Body */}
                  <div className="flex-1 min-w-0 pr-10">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${!n.read ? 'text-white' : 'text-slate-300'}`}>
                        {n.title}
                      </span>
                      {!n.read && (
                        <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.8)]" />
                      )}
                    </div>
                    
                    <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed ${!n.read ? 'text-slate-200' : 'text-slate-400'}`}>
                      {n.message}
                    </p>

                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {n.actionUrl && (
                        <span className="text-[10px] text-indigo-400 font-bold flex items-center gap-1 group-hover:text-indigo-300">
                          Click to open
                          <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions (Delete/Read Button) */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {!n.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(n._id);
                        }}
                        title="Mark as read"
                        className="p-2 text-slate-400 hover:text-white bg-slate-850 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors shadow-md cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(n._id);
                      }}
                      title="Delete notification"
                      className="p-2 text-slate-400 hover:text-rose-400 bg-slate-850 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors shadow-md cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
