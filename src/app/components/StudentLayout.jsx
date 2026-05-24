import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Target,
  Award,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Bell,
  Search
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
export const StudentLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuItems = [
    { path: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/student/timetable", label: "Timetable", icon: Calendar },
    { path: "/student/assignments", label: "Assignments", icon: BookOpen },
    { path: "/student/career-options", label: "Career Options", icon: Target },
    { path: "/student/grades", label: "My Grades", icon: Award },
    { path: "/student/messages", label: "Messages", icon: MessageSquare }
  ];
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return <div className="min-h-screen bg-slate-50">
      {
    /* Mobile Sidebar Overlay */
  }
      <AnimatePresence>
        {sidebarOpen && <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={() => setSidebarOpen(false)}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
  />}
      </AnimatePresence>

      {
    /* Sidebar */
  }
      <motion.aside
    initial={false}
    animate={{ x: sidebarOpen ? 0 : -320 }}
    className="fixed left-0 top-0 h-full w-72 bg-white border-r border-slate-200 z-50 lg:translate-x-0 transition-transform"
  >
        <div className="flex flex-col h-full">
          {
    /* Logo & Close Button */
  }
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-slate-900">School CRM</h2>
                <p className="text-xs text-slate-500">Student Portal</p>
              </div>
            </div>
            <button
    onClick={() => setSidebarOpen(false)}
    className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100"
  >
              <X className="w-5 h-5" />
            </button>
          </div>

          {
    /* User Profile */
  }
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <img
    src={user?.avatar}
    alt={user?.name}
    className="w-12 h-12 rounded-full border-2 border-blue-200"
  />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.studentId}</p>
                <p className="text-xs text-slate-400">{user?.class}</p>
              </div>
            </div>
          </div>

          {
    /* Navigation */
  }
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    return <li key={item.path}>
                    <Link
      to={item.path}
      onClick={() => setSidebarOpen(false)}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  </li>;
  })}
            </ul>
          </nav>

          {
    /* Footer */
  }
          <div className="p-4 border-t border-slate-200">
            <button
    onClick={handleLogout}
    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all"
  >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </motion.aside>

      {
    /* Main Content */
  }
      <div className="lg:pl-72">
        {
    /* Top Bar */
  }
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between px-6 py-4">
            <button
    onClick={() => setSidebarOpen(true)}
    className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100"
  >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex-1 max-w-md mx-4 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
    type="text"
    placeholder="Search..."
    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
  />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {
    /* Page Content */
  }
        <main>
          <Outlet />
        </main>
      </div>
    </div>;
};
