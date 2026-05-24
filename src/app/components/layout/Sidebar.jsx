import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  ClipboardList,
  DollarSign,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Building2,
  Calendar,
  FileText
} from "lucide-react";
const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/",
    roles: ["super-admin", "school-admin", "teacher", "parent"]
  },
  {
    icon: Building2,
    label: "Schools",
    path: "/schools",
    roles: ["super-admin"]
  },
  {
    icon: UserPlus,
    label: "Admissions",
    path: "/admissions",
    roles: ["school-admin"]
  },
  {
    icon: Users,
    label: "Students",
    path: "/students",
    roles: ["school-admin", "teacher"]
  },
  {
    icon: ClipboardList,
    label: "Attendance",
    path: "/attendance",
    roles: ["school-admin", "teacher"]
  },
  {
    icon: DollarSign,
    label: "Fees & Payments",
    path: "/fees",
    roles: ["school-admin", "parent"]
  },
  {
    icon: Calendar,
    label: "Schedule",
    path: "/schedule",
    roles: ["teacher", "parent"]
  },
  {
    icon: MessageSquare,
    label: "Communications",
    path: "/communications",
    roles: ["school-admin", "teacher"]
  },
  {
    icon: BarChart3,
    label: "Reports",
    path: "/reports",
    roles: ["super-admin", "school-admin"]
  },
  {
    icon: FileText,
    label: "Billing",
    path: "/billing",
    roles: ["super-admin"]
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
    roles: ["super-admin", "school-admin"]
  }
];
export function Sidebar({ userRole, isCollapsed, onToggleCollapse }) {
  const location = useLocation();
  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole));
  return <div
    className={`relative bg-card border-r border-border transition-all duration-300 flex flex-col ${isCollapsed ? "w-20" : "w-64"}`}
  >
      {
    /* Logo */
  }
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!isCollapsed ? <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold">EduCRM</h1>
              <p className="text-xs text-muted-foreground">School Management</p>
            </div>
          </div> : <div className="p-1.5 bg-primary/10 rounded-lg mx-auto">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>}
      </div>

      {
    /* Navigation */
  }
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    return <Link
      key={item.path}
      to={item.path}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive ? "bg-primary text-white" : "hover:bg-accent/50 text-foreground"}`}
      title={isCollapsed ? item.label : void 0}
    >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "" : "text-muted-foreground group-hover:text-foreground"}`} />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </Link>;
  })}
      </nav>

      {
    /* Collapse Toggle */
  }
      <div className="p-3 border-t border-border">
        <button
    onClick={onToggleCollapse}
    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors text-muted-foreground hover:text-foreground"
  >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Collapse</span>
            </>}
        </button>
      </div>
    </div>;
}
