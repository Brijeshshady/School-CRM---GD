import { useState } from "react";
import { motion } from "motion/react";
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  UserCheck,
  Award
} from "lucide-react";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { format } from "date-fns";
import { AdminLayout } from "../../components/layouts/AdminLayout";
import { UserManagement } from "../admin/UserManagement";
import { AdminTicketManagement } from "../support/AdminTicketManagement";
import { AdminStudentManagement } from "../admin/AdminStudentManagement";
import { AdminTeacherManagement } from "../admin/AdminTeacherManagement";
import { AdminClassManagement } from "../admin/AdminClassManagement";
import { AdminFeesManagement } from "../admin/AdminFeesManagement";
import { AdminReports } from "../admin/AdminReports";
import { AdminSettings } from "../admin/AdminSettings";
import { useData } from "../../context/DataContext";
export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { tickets, users, attendance, assignments } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");

  const studentsCount = users.filter(u => u.role === "Student").length;
  const teachersCount = users.filter(u => u.role === "Teacher").length;
  const classesCount = [...new Set(users.filter(u => u.role === "Student").map(u => u.class))].filter(Boolean).length;

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UserManagement />;
      case "tickets":
        return <AdminTicketManagement />;
      case "students":
        return <AdminStudentManagement />;
      case "teachers":
        return <AdminTeacherManagement />;
      case "classes":
        return <AdminClassManagement />;
      case "fees":
        return <AdminFeesManagement />;
      case "reports":
        return <AdminReports />;
      case "settings":
        return <AdminSettings />;
      default:
        return renderDashboard();
    }
  };
  const renderPlaceholder = (title) => <div className="flex flex-col items-center justify-center h-96 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">🚧</span>
      </div>
      <h1 className="text-xl font-bold text-slate-800">{title}</h1>
      <p className="text-slate-500 max-w-sm mt-2">This module is part of the comprehensive scope but not fully implemented in this prototype.</p>
    </div>;
  const renderDashboard = () => {
    const stats = [
      { label: "Total Students", value: studentsCount.toString(), change: "+8.2%", trend: "up", icon: Users, color: "text-blue-600 bg-blue-50" },
      { label: "Total Teachers", value: teachersCount.toString(), change: "+2.3%", trend: "up", icon: GraduationCap, color: "text-teal-600 bg-teal-50" },
      { label: "Active Classes", value: classesCount.toString(), change: "0%", trend: "neutral", icon: BookOpen, color: "text-purple-600 bg-purple-50" },
      { label: "Revenue (Feb)", value: "\u20B942.5L", change: "+12.4%", trend: "up", icon: DollarSign, color: "text-green-600 bg-green-50" }
    ];

    const quickStats = [
      { label: "Attendance Today", value: "94.2%", icon: UserCheck, color: "bg-green-500" },
      { label: "Pending Admissions", value: "23", icon: Clock, color: "bg-orange-500" },
      { label: "Open Tickets", value: tickets.filter((t) => t.status === "Open").length.toString(), icon: AlertCircle, color: "bg-red-500" },
      { label: "Fee Collection", value: "\u20B938.2L", icon: CheckCircle2, color: "bg-blue-500" }
    ];
    const recentActivities = [
      { id: 1, type: "admission", title: "New admission: Priya Mehta - Class 9", time: "10 minutes ago", icon: Users },
      { id: 2, type: "attendance", title: "Attendance marked for Class 10-A", time: "25 minutes ago", icon: UserCheck },
      { id: 3, type: "fee", title: "Fee payment: \u20B945,000 - Aarav Kumar", time: "1 hour ago", icon: DollarSign },
      { id: 4, type: "ticket", title: "New support ticket: Portal access issue", time: "2 hours ago", icon: AlertCircle },
      { id: 5, type: "grade", title: "Grades published for Class 12 - Chemistry", time: "3 hours ago", icon: Award }
    ];
    const classPerformance = [
      { class: "Class 10-A", students: 32, avgScore: 88.5, attendance: 96.2 },
      { class: "Class 10-B", students: 30, avgScore: 85.3, attendance: 94.5 },
      { class: "Class 9-A", students: 35, avgScore: 82.1, attendance: 92.8 },
      { class: "Class 9-B", students: 33, avgScore: 84.7, attendance: 95.1 },
      { class: "Class 11-Science", students: 38, avgScore: 86.9, attendance: 93.4 }
    ];
    const upcomingEvents = [
      { id: 1, title: "Annual Sports Day", date: /* @__PURE__ */ new Date("2026-02-15"), type: "Event" },
      { id: 2, title: "Parent-Teacher Meeting", date: /* @__PURE__ */ new Date("2026-02-20"), type: "Meeting" },
      { id: 3, title: "Mid-term Exams Begin", date: /* @__PURE__ */ new Date("2026-02-25"), type: "Exam" },
      { id: 4, title: "Science Fair", date: /* @__PURE__ */ new Date("2026-03-05"), type: "Event" }
    ];
    return <>
        {
      /* Header */
    }
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
              <p className="text-slate-500 mt-1">Welcome back, manage your school efficiently</p>
            </div>
            <div className="flex gap-3">
              <select
      value={selectedPeriod}
      onChange={(e) => setSelectedPeriod(e.target.value)}
      className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>
          </div>
        </div>

        {
      /* Main Stats */
    }
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
      const Icon = stat.icon;
      return <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
                <Card className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : stat.trend === "down" ? "text-red-600" : "text-slate-500"}`}>
                          {stat.change}
                        </span>
                        <span className="text-xs text-slate-400">vs last period</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </Card>
              </motion.div>;
    })}
        </div>

        {
      /* Quick Stats */
    }
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => {
      const Icon = stat.icon;
      return <Card key={index} className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                </div>
              </Card>;
    })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {
      /* Recent Activities */
    }
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
      const Icon = activity.icon;
      return <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                    </div>
                  </div>;
    })}
            </div>
          </Card>

          {
      /* Upcoming Events */
    }
          <Card className="p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {upcomingEvents.map((event) => <div key={event.id} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="text-xs">{event.type}</Badge>
                    <span className="text-xs text-slate-500">
                      {format(event.date, "MMM dd")}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-900">{event.title}</p>
                </div>)}
            </div>
          </Card>
        </div>

        {
      /* Class Performance */
    }
        <Card className="p-6 mt-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Class Performance Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-3 font-semibold text-slate-700">Class</th>
                  <th className="text-center p-3 font-semibold text-slate-700">Students</th>
                  <th className="text-center p-3 font-semibold text-slate-700">Avg Score</th>
                  <th className="text-center p-3 font-semibold text-slate-700">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {classPerformance.map((cls, index) => <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-900">{cls.class}</td>
                    <td className="p-3 text-center text-slate-700">{cls.students}</td>
                    <td className="p-3 text-center">
                      <span className="font-semibold text-blue-600">{cls.avgScore}%</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-semibold text-green-600">{cls.attendance}%</span>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </Card>
      </>;
  };
  return <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </AdminLayout>;
};
