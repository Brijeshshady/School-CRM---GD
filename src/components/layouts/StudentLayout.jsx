import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Award,
  UserCheck,
  HelpCircle,
  TrendingUp,
  Target,
  MessageSquare,
  TicketIcon,
  Brain,
  Truck
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useData } from "@/app/context/DataContext";
import { useChatContext } from "@/app/context/ChatContext";
import { DashboardShell } from "./DashboardShell";

export const StudentLayout = () => {
  const { user } = useAuth();
  const { tickets } = useData();
  const { unreadConversationsCount } = useChatContext();
  
  const openTicketsCount = tickets.filter(
    (t) => t.createdBy === user?.id && (t.status === "Open" || t.status === "In Progress")
  ).length;

  const menuItems = [
    { id: "home", path: "/student/dashboard", label: "Home", icon: LayoutDashboard },
    { id: "timetable", path: "/student/dashboard/timetable", label: "Timetable", icon: Calendar },
    { id: "grades", path: "/student/dashboard/grades", label: "Grades", icon: Award },
    { id: "assignments", path: "/student/dashboard/assignments", label: "Assignments", icon: ClipboardList },
    { id: "quizzes", path: "/student/dashboard/quizzes", label: "Quizzes", icon: Brain },
    { id: "attendance", path: "/student/dashboard/attendance", label: "Attendance", icon: UserCheck },
    { id: "transport", path: "/student/dashboard/transport", label: "School Bus", icon: Truck },
    { id: "doubts", path: "/student/dashboard/doubts", label: "Doubts", icon: HelpCircle },
    { id: "career", path: "/student/dashboard/career", label: "Career", icon: Target },
    { id: "completions", path: "/student/dashboard/completions", label: "Completions", icon: TrendingUp },
    { id: "chat", path: "/student/dashboard/chat", label: "Chat", icon: MessageSquare, badge: unreadConversationsCount },
    { id: "support", path: "/student/dashboard/support", label: "Support", icon: TicketIcon, badge: openTicketsCount }
  ];

  return <DashboardShell menuItems={menuItems} roleName="Student Portal" />;
};


