import { useState } from "react";
import { motion } from "motion/react";
import {
  Calendar,
  Award,
  BookOpen,
  Target,
  Video,
  Clock,
  CheckCircle2,
  FileText
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { todaySchedule } from "../../data/mockData";
import { useAuth } from "../../app/context/AuthContext";

import { CareerOptions } from "../student/CareerOptions";
import { SubjectCompletions } from "../student/SubjectCompletions";
import { Timetable } from "../student/Timetable";
import { ChatInterface } from "../ChatInterface";
import { Doubts } from "../student/Doubts";
import { StudentLayout } from "../../components/layouts/StudentLayout";
import { SupportTickets } from "../support/SupportTickets";
import { useData } from "../../context/DataContext";
export const EnhancedStudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { user } = useAuth();
  const { assignments, attendance, grades } = useData();
  const student = user || { name: "Student", role: "Student" };

  const totalDays = attendance.length;
  const presentDays = attendance.filter((a) => a.status === "present").length;
  const attendancePercentage = totalDays > 0 ? Math.round(presentDays / totalDays * 100) : 0;
  const pendingAssignments = assignments.filter((a) => a.status === "pending");
  const currentTime = /* @__PURE__ */ new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  const getCurrentClass = () => {
    return todaySchedule.find((cls) => {
      const [startHour, startMin] = cls.startTime.split(":").map(Number);
      const [endHour, endMin] = cls.endTime.split(":").map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      return currentTimeInMinutes >= startMinutes && currentTimeInMinutes <= endMinutes;
    });
  };
  const currentClass = getCurrentClass();
  const renderContent = () => {
    switch (activeTab) {
      case "timetable":
        return <Timetable />;
      case "career":
        return <CareerOptions />;
      case "completions":
        return <SubjectCompletions />;
      case "chat":
        return <ChatInterface />;
      case "grades":
        return renderGradesTab();
      case "assignments":
        return renderAssignmentsTab();
      case "attendance":
        return renderAttendanceTab();
      case "doubts":
        return <Doubts />;
      case "support":
        return <SupportTickets />;
      default:
        return renderHomeTab();
    }
  };
  const renderHomeTab = () => <div className="space-y-6">
      {
    /* Header */
  }
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {student.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-slate-500 mt-1">
            {student.role} • ID: {student._id?.slice(-6).toUpperCase()}
          </p>

        </div>
      </div>

      {
    /* Stats Cards */
  }
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
  >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Attendance</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{attendancePercentage}%</p>
              <p className="text-xs text-slate-400 mt-1">This month</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
  >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Pending Tasks</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{pendingAssignments.length}</p>
              <p className="text-xs text-slate-400 mt-1">Assignments due</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
  >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Classes Today</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{todaySchedule.length}</p>
              <p className="text-xs text-slate-400 mt-1">Scheduled</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
  >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Average Grade</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">A-</p>
              <p className="text-xs text-slate-400 mt-1">Overall performance</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {
    /* Left Column - 2/3 width */
  }
        <div className="lg:col-span-2 space-y-6">
          {
    /* Current Class */
  }
          {currentClass && <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
  >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-sm font-medium">HAPPENING NOW</span>
                </div>
                <div className="text-sm bg-white/20 px-3 py-1 rounded-lg">
                  {currentClass.startTime} - {currentClass.endTime}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">{currentClass.subject}</h3>
              <p className="text-blue-100 mb-4">
                {currentClass.teacher} • {currentClass.room}
              </p>
              <div className="flex gap-3">
                <button className="flex-1 bg-white text-blue-600 px-4 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                  <Video className="w-4 h-4" />
                  Join Class
                </button>
                <button className="px-4 py-2.5 bg-white/20 rounded-lg font-medium hover:bg-white/30 transition-all">
                  View Materials
                </button>
              </div>
            </motion.div>}

          {
    /* Today's Schedule */
  }
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Today's Schedule
              </h2>
              <span className="text-sm text-slate-500">{format(/* @__PURE__ */ new Date(), "EEEE, MMM dd")}</span>
            </div>
            <div className="space-y-3">
              {todaySchedule.map((cls) => {
    const [startHour, startMin] = cls.startTime.split(":").map(Number);
    const startMinutes = startHour * 60 + startMin;
    const isPast = currentTimeInMinutes > startMinutes;
    const isCurrent = currentClass?.id === cls.id;
    return <div
      key={cls.id}
      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${isCurrent ? "border-blue-500 bg-blue-50" : isPast ? "border-slate-100 bg-slate-50 opacity-50" : "border-slate-100 bg-white hover:border-slate-200"}`}
    >
                    <div className={`text-center min-w-[60px] ${isCurrent ? "text-blue-600" : "text-slate-600"}`}>
                      <p className="text-xs font-medium">{cls.startTime}</p>
                      <p className="text-xs text-slate-400">{cls.endTime}</p>
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${isCurrent ? "text-blue-900" : "text-slate-900"}`}>
                        {cls.subject}
                      </p>
                      <p className="text-sm text-slate-500">{cls.teacher}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">{cls.room}</p>
                      {isCurrent && <span className="inline-block mt-1 text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                          Live
                        </span>}
                    </div>
                  </div>;
  })}
            </div>
          </div>

          {
    /* Assignments */
  }
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Assignments
              </h2>
              <button
    onClick={() => setActiveTab("assignments")}
    className="text-sm text-blue-600 font-medium hover:underline"
  >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {assignments.slice(0, 4).map((assignment) => {
    const daysLeft = differenceInDays(new Date(assignment.dueDate), /* @__PURE__ */ new Date());
    const isOverdue = daysLeft < 0;
    const isDueSoon = daysLeft <= 2 && daysLeft >= 0;
    return <div
      key={assignment.id}
      className="flex items-start gap-4 p-4 rounded-lg border border-slate-100 hover:border-slate-200 transition-all"
    >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${assignment.status === "graded" ? "bg-green-100" : assignment.status === "submitted" ? "bg-blue-100" : isOverdue ? "bg-red-100" : isDueSoon ? "bg-orange-100" : "bg-slate-100"}`}>
                      <BookOpen className={`w-5 h-5 ${assignment.status === "graded" ? "text-green-600" : assignment.status === "submitted" ? "text-blue-600" : isOverdue ? "text-red-600" : isDueSoon ? "text-orange-600" : "text-slate-600"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 mb-1">{assignment.title}</p>
                      <p className="text-sm text-slate-500 mb-2">{assignment.subject}</p>
                      <p className="text-xs text-slate-400">{assignment.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-xs font-medium mb-1 ${isOverdue ? "text-red-600" : isDueSoon ? "text-orange-600" : "text-slate-500"}`}>
                        {isOverdue ? "Overdue" : `Due ${format(new Date(assignment.dueDate), "MMM dd")}`}
                      </p>
                      <span className={`inline-block text-xs px-2 py-1 rounded ${assignment.status === "graded" ? "bg-green-100 text-green-700" : assignment.status === "submitted" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                        {assignment.status === "graded" ? `Grade: ${assignment.grade}` : assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                      </span>
                    </div>
                  </div>;
  })}
            </div>
          </div>
        </div>

        {
    /* Right Column - 1/3 width */
  }
        <div className="space-y-6">
          {
    /* Quick Actions */
  }
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
    onClick={() => setActiveTab("career")}
    className="w-full p-4 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg hover:from-purple-100 hover:to-blue-100 transition-all text-left group"
  >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 group-hover:text-purple-700 transition-colors">
                      Career Options
                    </p>
                    <p className="text-xs text-slate-500">Explore future paths</p>
                  </div>
                </div>
              </button>

              <button
    onClick={() => setActiveTab("grades")}
    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all text-left"
  >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">View Marks</p>
                    <p className="text-xs text-slate-500">Check your grades</p>
                  </div>
                </div>
              </button>

              <button
    onClick={() => setActiveTab("doubts")}
    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all text-left"
  >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Ask Teacher</p>
                    <p className="text-xs text-slate-500">Get help & support</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {
    /* Attendance Summary */
  }
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Attendance Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">This Month</span>
                <span className="font-semibold text-slate-900">{attendancePercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
    className="bg-green-500 h-2 rounded-full transition-all"
    style={{ width: `${attendancePercentage}%` }}
  />
              </div>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{presentDays}</p>
                  <p className="text-xs text-slate-500">Present</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {attendance.filter((a) => a.status === "absent").length}
                  </p>
                  <p className="text-xs text-slate-500">Absent</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {attendance.filter((a) => a.status === "late").length}
                  </p>
                  <p className="text-xs text-slate-500">Late</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
  const renderGradesTab = () => <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Academic Performance</h1>
        <p className="text-slate-500">Your grades and performance overview</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left p-4 font-semibold text-slate-700">Subject</th>
                <th className="text-left p-4 font-semibold text-slate-700">Exam</th>
                <th className="text-center p-4 font-semibold text-slate-700">Marks Obtained</th>
                <th className="text-center p-4 font-semibold text-slate-700">Total Marks</th>
                <th className="text-center p-4 font-semibold text-slate-700">Percentage</th>
                <th className="text-center p-4 font-semibold text-slate-700">Grade</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade, index) => {
                const marks = grade.marksObtained !== undefined ? grade.marksObtained : (grade.score !== undefined ? grade.score : 0);
                const total = grade.totalMarks !== undefined ? grade.totalMarks : (grade.maxScore !== undefined ? grade.maxScore : 100);
                const percentage = total > 0 ? (marks / total) * 100 : 0;
                return (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4 font-medium text-slate-900">{grade.subject?.name || grade.subject}</td>
                    <td className="p-4 text-slate-700">{grade.exam || "Term Exam"}</td>
                    <td className="p-4 text-center text-slate-700">{marks}</td>
                    <td className="p-4 text-center text-slate-700">{total}</td>
                    <td className="p-4 text-center">
                      <span className={`font-semibold ${percentage >= 90 ? "text-green-600" : percentage >= 75 ? "text-blue-600" : percentage >= 60 ? "text-orange-600" : "text-red-600"}`}>
                        {percentage.toFixed(1)}%
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-medium text-sm">
                        {grade.grade}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
  const renderAssignmentsTab = () => <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Assignments</h1>
        <p className="text-slate-500">Track and manage your homework and assignments</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {assignments.map((assignment) => {
    const daysLeft = differenceInDays(new Date(assignment.dueDate), /* @__PURE__ */ new Date());
    const isOverdue = daysLeft < 0;
    const isDueSoon = daysLeft <= 2 && daysLeft >= 0;
    return <div
      key={assignment.id}
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
    >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${assignment.status === "graded" ? "bg-green-100" : assignment.status === "submitted" ? "bg-blue-100" : isOverdue ? "bg-red-100" : isDueSoon ? "bg-orange-100" : "bg-slate-100"}`}>
                    <BookOpen className={`w-6 h-6 ${assignment.status === "graded" ? "text-green-600" : assignment.status === "submitted" ? "text-blue-600" : isOverdue ? "text-red-600" : isDueSoon ? "text-orange-600" : "text-slate-600"}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1">{assignment.title}</h3>
                    <p className="text-sm text-slate-500 mb-2">{assignment.subject}</p>
                    <p className="text-sm text-slate-600">{assignment.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium mb-2 ${isOverdue ? "text-red-600" : isDueSoon ? "text-orange-600" : "text-slate-500"}`}>
                    {isOverdue ? "Overdue" : `Due ${format(new Date(assignment.dueDate), "MMM dd, yyyy")}`}
                  </p>
                  <span className={`inline-block text-sm px-3 py-1 rounded-lg ${assignment.status === "graded" ? "bg-green-100 text-green-700" : assignment.status === "submitted" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                    {assignment.status === "graded" ? `Grade: ${assignment.grade}` : assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>;
  })}
      </div>
    </div>;
  const renderAttendanceTab = () => <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Attendance Record</h1>
        <p className="text-slate-500">Your attendance history and statistics</p>
      </div>

      {
    /* Stats Cards */
  }
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">{presentDays}</p>
            <p className="text-sm text-slate-500 mt-1">Days Present</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">❌</span>
            </div>
            <p className="text-3xl font-bold text-red-600">
              {attendance.filter((a) => a.status === "absent").length}
            </p>
            <p className="text-sm text-slate-500 mt-1">Days Absent</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-orange-600">
              {attendance.filter((a) => a.status === "late").length}
            </p>
            <p className="text-sm text-slate-500 mt-1">Times Late</p>
          </div>
        </div>
      </div>

      {
    /* Attendance Table */
  }
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left p-4 font-semibold text-slate-700">Date</th>
                <th className="text-left p-4 font-semibold text-slate-700">Subject</th>
                <th className="text-center p-4 font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record, index) => <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 text-slate-900">{format(new Date(record.date), "MMM dd, yyyy")}</td>
                  <td className="p-4 text-slate-700">{record.subject}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${record.status === "present" ? "bg-green-100 text-green-700" : record.status === "absent" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
  return <StudentLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </StudentLayout>;
};
