import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Bell, Search, Settings, LogOut, ChevronDown, User as UserIcon, Menu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
export const TopBar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const handleLogout = () => {
    setShowDropdown(false);
    setShowLogoutConfirm(true);
  };
  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };
  return <>
      <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
    onClick={onMenuClick}
    className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
  >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="hidden sm:flex items-center gap-3 bg-slate-100 rounded-full px-4 py-2 w-64 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            <Search className="w-4 h-4 text-slate-400" />
            <input
    type="text"
    placeholder="Search..."
    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400"
  />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>

          <div className="relative">
            <button
    onClick={() => setShowDropdown(!showDropdown)}
    className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
  >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-700 leading-tight">{user?.name}</p>
                <p className="text-xs text-slate-500 font-medium">{user?.role}</p>
              </div>
              <img
    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}`}
    alt={user?.name}
    className="w-8 h-8 rounded-full border border-slate-200"
  />
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            <AnimatePresence>
              {showDropdown && <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 10, scale: 0.95 }}
    transition={{ duration: 0.1 }}
    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 origin-top-right overflow-hidden"
  >
                  <div className="px-4 py-3 border-b border-slate-100 sm:hidden">
                    <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.role}</p>
                  </div>
                  
                  <div className="p-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                      <UserIcon className="w-4 h-4" /> Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" /> Settings
                    </button>
                  </div>
                  
                  <div className="border-t border-slate-100 my-1" />
                  
                  <div className="p-1">
                    <button
    onClick={handleLogout}
    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
  >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </motion.div>}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {
    /* Logout Confirmation Modal */
  }
      <AnimatePresence>
        {showLogoutConfirm && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm"
  >
              <h3 className="text-lg font-bold text-slate-900 mb-2">Sign Out</h3>
              <p className="text-slate-600 mb-6">Are you sure you want to sign out of your account?</p>
              
              <div className="flex gap-3">
                <button
    onClick={() => setShowLogoutConfirm(false)}
    className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
  >
                  Cancel
                </button>
                <button
    onClick={confirmLogout}
    className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
  >
                  Yes, Sign Out
                </button>
              </div>
            </motion.div>
          </div>}
      </AnimatePresence>
    </>;
};
