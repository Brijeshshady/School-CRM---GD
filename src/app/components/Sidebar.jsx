import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  CreditCard,
  MessageSquare,
  BarChart3,
  Settings,
  BookOpen,
  School,
  LifeBuoy
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx";
export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const links = [
    { icon: LayoutDashboard, label: "Overview", to: user?.role === "Parent" ? "/parent/dashboard" : "/dashboard" },
    { icon: GraduationCap, label: "Students", to: "/students", hidden: user?.role === "Parent" },
    // Maybe show "My Kids" instead
    { icon: Users, label: "Admissions", to: "/admissions", hidden: user?.role === "Parent" || user?.role === "Teacher" },
    { icon: BookOpen, label: "Academics", to: "/academics", hidden: user?.role === "Parent" },
    { icon: Calendar, label: "Attendance", to: "/attendance" },
    // Parent sees their kid's attendance
    { icon: CreditCard, label: "Fees & Payments", to: "/fees" },
    { icon: MessageSquare, label: "Communications", to: user?.role === "Parent" ? "/parent/chat" : "/communications" },
    { icon: LifeBuoy, label: "Support", to: user?.role === "Parent" ? "/parent/support" : "/support" },
    { icon: BarChart3, label: "Reports", to: "/reports", hidden: user?.role === "Parent" }
  ].filter((link) => !link.hidden);
  return <>
      {
    /* Mobile Overlay */
  }
      <AnimatePresence>
        {isOpen && <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden backdrop-blur-sm"
  />}
      </AnimatePresence>

      {
    /* Sidebar */
  }
      <motion.aside
    className={clsx(
      "fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200 transition-transform duration-300 lg:translate-x-0 lg:static",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}
  >
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-blue-600/20">
            <School className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">EduMaster</span>
        </div>

        <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2 mt-2">
            Main Menu
          </div>
          
          {links.map((link) => <NavLink
    key={link.to}
    to={link.to}
    onClick={() => {
      if (window.innerWidth < 1024) onClose();
    }}
    className={({ isActive }) => clsx(
      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm",
      isActive ? "bg-blue-50 text-blue-700 shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    )}
  >
              {({ isActive }) => (
                <>
                  <link.icon className={clsx("w-5 h-5", isActive ? "text-blue-600" : "text-slate-400")} />
                  <span>{link.label}</span>
                </>
              )}
            </NavLink>)}

          <div className="pt-4 mt-4 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
              System
            </div>
            <NavLink
              to="/settings"
              className={({ isActive }) => clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm",
                isActive ? "bg-blue-50 text-blue-700 shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {({ isActive }) => (
                <>
                  <Settings className={clsx("w-5 h-5", isActive ? "text-blue-600" : "text-slate-400")} />
                  <span>Settings</span>
                </>
              )}
            </NavLink>
          </div>
        </div>
      </motion.aside>
    </>;
};
