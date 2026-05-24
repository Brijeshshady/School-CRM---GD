import {
  LayoutDashboard,
  BookOpen,
  DollarSign,
  MessageSquare,
  TicketIcon,
  Calendar,
  Clock
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useChatContext } from "../../context/ChatContext";
import { DashboardShell } from "../../../components/layouts/DashboardShell";

export const ParentLayout = () => {
  const { user } = useAuth();
  const { tickets, linkedStudents } = useData();
  const { unreadConversationsCount } = useChatContext();
  
  const openTicketsCount = tickets.filter(
    (t) => t.createdBy === user?.id && (t.status === "Open" || t.status === "In Progress")
  ).length;

  const menuItems = [
    { id: "overview", path: "/parent/dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "progress", path: "/parent/dashboard/progress", label: "Student Progress", icon: BookOpen },
    { id: "attendance", path: "/parent/dashboard/attendance", label: "Attendance", icon: Calendar },
    { id: "schedule", path: "/parent/dashboard/schedule", label: "Schedule", icon: Clock },
    { id: "fees", path: "/parent/dashboard/fees", label: "Fees", icon: DollarSign },
    { id: "chat", path: "/parent/dashboard/chat", label: "Chat", icon: MessageSquare, badge: unreadConversationsCount },
    { id: "support", path: "/parent/dashboard/support", label: "Support", icon: TicketIcon, badge: openTicketsCount }
  ];

  const sidebarFooter = (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100">
      <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1">Parent Identity</p>
      <p className="text-sm font-bold text-slate-900">{user?.name || "Parent"}</p>
      <p className="text-xs text-slate-500 mb-2">{linkedStudents.length} Linked Students</p>
      <div className="flex -space-x-2">
        {linkedStudents.map((student, i) => (
          <img 
            key={student._id} 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.user?.name)}&background=random`} 
            className="w-6 h-6 rounded-full border-2 border-white" 
            title={student.user?.name}
          />
        ))}
      </div>
    </div>
  );

  return (
    <DashboardShell 
      menuItems={menuItems} 
      roleName="Parent Portal" 
      sidebarFooter={sidebarFooter}
    />
  );
};
