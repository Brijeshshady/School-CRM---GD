import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  FileText,
  MessageSquare,
  BarChart3,
  TicketIcon,
  GraduationCap,
  Settings,
  DollarSign,
  Book,
  Award,
  UserCheck
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useChatContext } from "../../context/ChatContext";
import { DashboardShell } from "../../../components/layouts/DashboardShell";

export const StaffLayout = ({ children }) => {
  const { user } = useAuth();
  const { tickets } = useData();
  const { unreadConversationsCount } = useChatContext();
  
  const openTicketsCount = tickets.filter(
    (t) => (t.createdBy?._id === user?.id || t.createdBy === user?.id) && (t.status === "Open" || t.status === "In Progress")
  ).length;

  const isAdmin = user?.role === "Admin" || user?.role === "SuperAdmin";

  const menuItems = isAdmin ? [
    { id: "dashboard", path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", path: "/admin/dashboard/users", label: "User Management", icon: Users },
    { id: "students", path: "/admin/dashboard/students", label: "Students", icon: GraduationCap },
    { id: "teachers", path: "/admin/dashboard/teachers", label: "Teachers", icon: Users },
    { id: "classes", path: "/admin/dashboard/classes", label: "Classes", icon: Book },
    { id: "subjects", path: "/admin/dashboard/subjects", label: "Subject Management", icon: Book },
    { id: "timetable", path: "/admin/dashboard/timetable-approvals", label: "Timetable Approvals", icon: Calendar },
    { id: "leaves", path: "/admin/dashboard/leaves", label: "Leave Approvals", icon: Calendar },
    { id: "lms", path: "/lms", label: "LMS & Quizzes", icon: Book },
    { id: "gradebook", path: "/admin/dashboard/gradebook", label: "Gradebook", icon: Award },
    { id: "fees", path: "/admin/dashboard/fees", label: "Fees & Payments", icon: DollarSign },
    { id: "reports", path: "/admin/dashboard/reports", label: "Reports", icon: BarChart3 },
    { id: "tickets", path: "/admin/dashboard/tickets", label: "Support Tickets", icon: TicketIcon, badge: openTicketsCount },
    { id: "chat", path: "/admin/dashboard/chat", label: "Messages", icon: MessageSquare, badge: unreadConversationsCount },
    { id: "settings", path: "/admin/dashboard/settings", label: "Settings", icon: Settings }
  ] : [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
    { id: "students", label: "Students", icon: GraduationCap, path: "/students" },
    { id: "admissions", label: "Admissions", icon: Users, path: "/admissions" },
    { id: "academics", label: "Academics", icon: BookOpen, path: "/academics" },
    { id: "lms", label: "LMS & Quizzes", icon: BookOpen, path: "/lms" },
    { id: "leaves", label: "Apply Leave", icon: Calendar, path: "/teacher/dashboard/leaves" },
    { id: "attendance", label: "Attendance", icon: Calendar, path: "/attendance" },
    { id: "fees", label: "Fees & Payments", icon: FileText, path: "/fees" },
    { id: "communications", label: "Communications", icon: MessageSquare, path: "/communications" },
    { id: "reports", label: "Reports", icon: BarChart3, path: "/reports" },
    { id: "support", label: "Support", icon: TicketIcon, path: "/support", badge: openTicketsCount },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" }
  ];

  const getRoleName = () => {
    if (isAdmin) return "Admin Portal";
    if (user?.role === "Teacher") return "Teacher Portal";
    if (user?.role === "Staff") return "Staff Portal";
    return "Portal";
  };

  return (
    <DashboardShell menuItems={menuItems} roleName={getRoleName()}>
      {children}
    </DashboardShell>
  );
};
