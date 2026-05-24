import {
  LayoutDashboard,
  BookOpen,
  UserCheck,
  FileText,
  Award,
  MessageSquare
} from "lucide-react";
import { useChatContext } from "../../context/ChatContext";
import { DashboardShell } from "../../../components/layouts/DashboardShell";

export const TeacherLayout = () => {
  const { unreadConversationsCount } = useChatContext();
  const menuItems = [
    { id: "overview", path: "/teacher/dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "classes", path: "/teacher/dashboard/classes", label: "My Classes", icon: BookOpen },
    { id: "attendance", path: "/teacher/dashboard/attendance", label: "Attendance", icon: UserCheck },
    { id: "assignments", path: "/teacher/dashboard/assignments", label: "Assignments", icon: FileText },
    { id: "grades", path: "/teacher/dashboard/grades", label: "Grades", icon: Award },
    { id: "chat", path: "/teacher/dashboard/chat", label: "Messages", icon: MessageSquare, badge: unreadConversationsCount }
  ];

  return <DashboardShell menuItems={menuItems} roleName="Teacher Portal" />;
};
