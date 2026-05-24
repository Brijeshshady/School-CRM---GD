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
  Settings
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
    (t) => t.createdBy === user?.id && (t.status === "Open" || t.status === "In Progress")
  ).length;

  const menuItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
    { id: "students", label: "Students", icon: GraduationCap, path: "/students" },
    { id: "admissions", label: "Admissions", icon: Users, path: "/admissions" },
    { id: "academics", label: "Academics", icon: BookOpen, path: "/academics" },
    { id: "attendance", label: "Attendance", icon: Calendar, path: "/attendance" },
    { id: "fees", label: "Fees & Payments", icon: FileText, path: "/fees" },
    { id: "communications", label: "Communications", icon: MessageSquare, path: "/communications" },
    { id: "reports", label: "Reports", icon: BarChart3, path: "/reports" },
    { id: "support", label: "Support", icon: TicketIcon, path: "/support", badge: openTicketsCount },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" }
  ];

  // We wrap children in a fragment because DashboardShell uses <Outlet /> normally,
  // but StaffLayout is used as a wrapper component in Layout.jsx
  return (
    <DashboardShell menuItems={menuItems} roleName="Teacher Portal">
      {children}
    </DashboardShell>
  );
};
