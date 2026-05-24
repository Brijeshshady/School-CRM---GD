import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
  Bell,
  BookOpen,
  MapPin,
  User as UserIcon
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";
import { useData } from "../context/DataContext";
import { useChatContext } from "../context/ChatContext";
import { ChatInterface } from "./ChatInterface";
import { SupportTickets } from "./support/SupportTickets";

export const ParentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { linkedStudents } = useData();
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // Derive active tab from URL
  const pathParts = location.pathname.split("/");
  const activeTab = pathParts[pathParts.length - 1] === "dashboard" ? "overview" : pathParts[pathParts.length - 1];

  // Sync selected student with linked students list
  useEffect(() => {
    if (linkedStudents.length === 0) {
      setSelectedStudentId(null);
      return;
    }

    // If no student is selected, or currently selected student is no longer in the list
    const isCurrentStillLinked = linkedStudents.some(s => s._id === selectedStudentId);
    if (!selectedStudentId || !isCurrentStillLinked) {
      setSelectedStudentId(linkedStudents[0]._id);
    }
  }, [linkedStudents, selectedStudentId]);

  const { data: studentData, isLoading: isDataLoading } = useQuery({
    queryKey: ["studentData", selectedStudentId],
    queryFn: async () => {
      if (!selectedStudentId) return null;
      const response = await api.get(`/parents/students/${selectedStudentId}/data`);
      return response.data.data;
    },
    enabled: !!selectedStudentId
  });

  const { unreadConversationsCount } = useChatContext();

  const renderContent = () => {
    if (isDataLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Clock className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      );
    }

    if (!selectedStudentId && linkedStudents.length === 0) {
      return (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-100">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No Student Linked</h3>
          <p className="text-slate-500 mt-2">Please contact administration to link your child's account.</p>
        </div>
      );
    }

    switch (activeTab) {
      case "progress":
        return renderProgressTab();
      case "attendance":
        return renderAttendanceTab();
      case "fees":
        return renderFeesTab();
      case "schedule":
        return renderScheduleTab();
      case "chat":
        return <ChatInterface />;
      case "support":
        return <SupportTickets />;
      default:
        return renderOverviewTab();
    }
  };

  const renderOverviewTab = () => {
    const attendance = studentData?.attendance || [];
    const attendancePercentage = attendance.length > 0 
      ? Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100)
      : 0;

    const grades = studentData?.grades || [];
    const averageGrade = grades.length > 0
      ? Math.round(grades.reduce((acc, g) => acc + g.marks, 0) / grades.length)
      : 0;

    const assignments = studentData?.assignments || [];
    const announcements = studentData?.announcements || [];

    return (
      <motion.div
        key="overview"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500 font-medium">Attendance</span>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{attendancePercentage}%</p>
            <p className="text-xs text-slate-500 mt-1">Attendance rate</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500 font-medium">Overall Performance</span>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{averageGrade}%</p>
            <p className="text-xs text-slate-500 mt-1">Average score</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500 font-medium">Assignments</span>
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{assignments.length}</p>
            <p className="text-xs text-slate-500 mt-1">Academic tasks</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500 font-medium">Messages</span>
              <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold text-red-600">
                {unreadConversationsCount}
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{unreadConversationsCount}</p>
            <p className="text-xs text-slate-500 mt-1">Unread chats</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Academic Progress</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={grades.map(g => ({ subject: g.subject?.name, score: g.marks }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="subject" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Announcements</h2>
              <Bell className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
              {announcements.length > 0 ? announcements.map(announcement => (
                <div key={announcement._id} className={`p-4 rounded-lg border ${announcement.priority === 'High' || announcement.priority === 'Urgent' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                  <p className="text-sm font-bold text-slate-900">{announcement.title}</p>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{announcement.content}</p>
                  <p className="text-[10px] text-slate-400 mt-2">{new Date(announcement.createdAt).toLocaleDateString()}</p>
                </div>
              )) : (
                <div className="text-center py-12 text-slate-400 italic text-sm">No new announcements</div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Upcoming Assignments</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.length > 0 ? assignments.slice(0, 5).map(assignment => (
                  <tr key={assignment._id}>
                    <td className="px-4 py-4 text-sm font-medium text-slate-900">{assignment.subject?.name}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{assignment.title}</td>
                    <td className="px-4 py-4 text-sm text-slate-500">{new Date(assignment.dueDate).toLocaleDateString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="px-4 py-8 text-center text-slate-500 italic text-sm">No pending assignments</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderProgressTab = () => {
    const grades = studentData?.grades || [];
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 mb-8">Subject-wise Breakdown</h2>
        <div className="grid gap-8">
          {grades.map((grade) => (
            <div key={grade._id} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-900 text-lg">{grade.subject?.name}</p>
                <p className="text-2xl font-extrabold text-indigo-600">{grade.marks}%</p>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div className="bg-indigo-600 h-3 rounded-full transition-all duration-1000" style={{ width: `${grade.marks}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAttendanceTab = () => {
    const attendance = studentData?.attendance || [];
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {attendance.map((record) => (
              <tr key={record._id}>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{new Date(record.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${record.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{record.remarks || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderFeesTab = () => {
    const fees = studentData?.fees || [];
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {fees.map((fee) => (
          <div key={fee._id} className="p-6 flex items-center justify-between border-b last:border-0">
            <div>
              <p className="font-bold text-slate-900">{fee.title}</p>
              <p className="text-xs text-slate-500">Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-6">
              <p className="font-black text-slate-900">₹{fee.amount.toLocaleString()}</p>
              <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${fee.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {fee.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderScheduleTab = () => {
    const schedules = studentData?.schedule || [];
    return (
      <div className="space-y-6">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
          const daySchedule = schedules.find(s => s.day === day);
          return (
            <div key={day} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b font-black text-xs uppercase tracking-widest">{day}</div>
              {daySchedule?.periods.map((p, i) => (
                <div key={i} className="p-6 flex items-center gap-8 border-b last:border-0">
                  <div className="w-24 text-indigo-600 font-bold">{p.startTime}</div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{p.subject?.name}</p>
                    <p className="text-xs text-slate-500">{p.teacher?.user?.name} • {p.room}</p>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Monitoring Hub
          </h2>
          <p className="text-slate-500 font-medium">Real-time academic performance & activities</p>
        </div>

        <div className="flex items-center gap-4">
          {linkedStudents.length > 1 && (
            <div className="relative">
              <select 
                value={selectedStudentId} 
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-2xl px-6 py-3 pr-12 text-sm font-bold text-slate-700 shadow-sm hover:border-indigo-300 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none cursor-pointer"
              >
                {linkedStudents.map(s => <option key={s._id} value={s._id}>{s.user?.name}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
          )}
          {studentData?.student?.user && (
            <div className="flex items-center gap-4 bg-white p-2.5 pr-8 rounded-3xl shadow-sm border border-slate-100 group hover:border-indigo-200 transition-all">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(studentData.student.user.name)}&background=6366f1&color=fff&bold=true&rounded=true`} 
                className="w-12 h-12 rounded-2xl shadow-lg shadow-indigo-500/10 group-hover:scale-105 transition-transform" 
                alt="" 
              />
              <div>
                <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{studentData.student.user.name}</p>
                <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">{studentData.student.class?.name || "Class"} • ROLL: {studentData.student.studentId?.slice(-4) || "N/A"}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + (selectedStudentId || "")}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
