import {
  LayoutDashboard,
  BookOpen,
  UserCheck,
  FileText,
  Award,
  MessageSquare,
  TicketIcon,
  Settings,
  Calendar
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useChatContext } from "../../context/ChatContext";
import { DashboardShell } from "../../../components/layouts/DashboardShell";

export const TeacherLayout = () => {
  const { user } = useAuth();
  const { tickets } = useData();
  const { unreadConversationsCount } = useChatContext();
  
  const openTicketsCount = tickets.filter(
    (t) => (t.createdBy?._id === user?.id || t.createdBy === user?.id) && (t.status === "Open" || t.status === "In Progress")
  ).length;

  const menuItems = [
    { id: "overview", path: "/teacher/dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "classes", path: "/teacher/dashboard/classes", label: "My Classes", icon: BookOpen },
    { id: "attendance", path: "/teacher/dashboard/attendance", label: "Attendance", icon: UserCheck },
    { id: "assignments", path: "/teacher/dashboard/assignments", label: "Assignments", icon: FileText },
    { id: "grades", path: "/teacher/dashboard/grades", label: "Grades", icon: Award },
    { id: "lms", path: "/lms", label: "LMS & Quizzes", icon: BookOpen },
    { id: "leaves", path: "/teacher/dashboard/leaves", label: "Apply Leave", icon: Calendar },
    { id: "chat", path: "/teacher/dashboard/chat", label: "Messages", icon: MessageSquare, badge: unreadConversationsCount },
    { id: "support", path: "/teacher/dashboard/support", label: "Support", icon: TicketIcon, badge: openTicketsCount },
    { id: "settings", path: "/settings", label: "Settings", icon: Settings }
  ];

  return <DashboardShell menuItems={menuItems} roleName="Teacher Portal" />;
};
