import { motion } from "motion/react";
import {
  Calendar,
  Award,
  BookOpen,
  Target,
  Video,
  Clock,
  CheckCircle2,
  FileText,
  Users
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/context/AuthContext";
import { useStudentDashboard, useStudentAssignments, useStudentSchedule, useStudentTeachers } from "./hooks/useStudentData";
import { AsyncWrapper } from "../../components/ui/AsyncWrapper";
import { DashboardSkeleton } from "../../components/ui/skeletons/DashboardSkeleton";

export const StudentDashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const parts = timeStr.split(":");
    if (parts.length !== 2) return timeStr;
    const hours = parts[0];
    const minutes = parts[1].padEnd(2, '0');
    return `${hours}:${minutes}`;
  };
  
  // Real data hooks
  const { data: stats, isLoading: statsLoading, isError: statsError } = useStudentDashboard();
  const { data: assignments, isLoading: assignmentsLoading, isError: assignmentsError } = useStudentAssignments();
  const { data: scheduleData } = useStudentSchedule();
  const { data: teachers } = useStudentTeachers();

  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  
  const getCurrentClass = () => {
    if (!scheduleData || !Array.isArray(scheduleData)) return null;
    
    const today = format(new Date(), 'EEEE');
    const todayScheduleData = scheduleData.find(s => s.day?.toLowerCase() === today.toLowerCase());
    if (!todayScheduleData) return null;

    return todayScheduleData.periods.find((cls) => {
      const [startHour, startMin] = cls.startTime.split(":").map(Number);
      const [endHour, endMin] = cls.endTime.split(":").map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      return currentTimeInMinutes >= startMinutes && currentTimeInMinutes <= endMinutes;
    });
  };
  const currentClass = getCurrentClass();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user?.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-slate-500 mt-1">
            {user?.role} Profile • Roll No: {user?.studentId || user?.rollNumber || "N/A"}
          </p>
        </div>
      </div>

      <AsyncWrapper 
        isLoading={statsLoading} 
        isError={statsError}
        loadingFallback={<DashboardSkeleton />}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Attendance</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.attendancePercentage}%</p>
                <p className="text-xs text-slate-400 mt-1">Overall present</p>
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
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.pendingAssignments}</p>
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
                <p className="text-sm text-slate-500 font-medium">Total Subjects</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.totalSubjects}</p>
                <p className="text-xs text-slate-400 mt-1">Enrolled</p>
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
                <p className="text-sm text-slate-500 font-medium">Avg Performance</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.averageGrade}%</p>
                <p className="text-xs text-slate-400 mt-1">Overall score</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>
      </AsyncWrapper>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {currentClass && (
            <motion.div
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
              <h3 className="text-2xl font-bold mb-2">{currentClass.subject?.name || "Subject"}</h3>
              <p className="text-blue-100 mb-4">
                {currentClass.teacher?.user?.name || "Teacher"} • {currentClass.room || "Room"}
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
            </motion.div>
          )}

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Today's Schedule
              </h2>
              <span className="text-sm text-slate-500">{format(new Date(), "EEEE, MMM dd")}</span>
            </div>
            <div className="space-y-3">
              {(() => {
                if (!scheduleData || !Array.isArray(scheduleData)) {
                  return <p className="text-center text-slate-500 py-4">No classes scheduled for today.</p>;
                }
                const today = format(new Date(), 'EEEE');
                const todayScheduleData = scheduleData.find(s => s.day?.toLowerCase() === today.toLowerCase());
                const periods = todayScheduleData?.periods || [];
                
                if (periods.length === 0) {
                  return <p className="text-center text-slate-500 py-4">No classes scheduled for today.</p>;
                }

                return periods.map((cls, idx) => {
                  const [startHour, startMin] = cls.startTime.split(":").map(Number);
                  const startMinutes = startHour * 60 + startMin;
                  const isPast = currentTimeInMinutes > startMinutes;
                  const isCurrent = currentClass?._id === cls._id;
                  return (
                    <div
                      key={cls._id || idx}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                        isCurrent ? "border-blue-500 bg-blue-50" : isPast ? "border-slate-100 bg-slate-50 opacity-50" : "border-slate-100 bg-white hover:border-slate-200"
                      }`}
                    >
                      <div className={`text-center min-w-[60px] ${isCurrent ? "text-blue-600" : "text-slate-600"}`}>
                        <p className="text-xs font-medium">{formatTime(cls.startTime)}</p>
                        <p className="text-xs text-slate-400">{formatTime(cls.endTime)}</p>
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${isCurrent ? "text-blue-900" : "text-slate-900"}`}>
                          {cls.subject?.name || "Subject"}
                        </p>
                        <p className="text-sm text-slate-500">{cls.teacher?.user?.name || "Teacher"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">{cls.room}</p>
                        {isCurrent && (
                          <span className="inline-block mt-1 text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                            Live
                          </span>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Latest Assignments
              </h2>
              <button
                onClick={() => navigate("/student/dashboard/assignments")}
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                View All
              </button>
            </div>
            
            <AsyncWrapper isLoading={assignmentsLoading} isError={assignmentsError}>
              <div className="space-y-3">
                {assignments?.slice(0, 4).map((assignment) => {
                  const daysLeft = differenceInDays(new Date(assignment.dueDate), new Date());
                  const isOverdue = daysLeft < 0;
                  const isDueSoon = daysLeft <= 2 && daysLeft >= 0;
                  return (
                    <div
                      key={assignment._id}
                      className="flex items-start gap-4 p-4 rounded-lg border border-slate-100 hover:border-slate-200 transition-all"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        assignment.status === "graded" ? "bg-green-100" : assignment.status === "submitted" ? "bg-blue-100" : isOverdue ? "bg-red-100" : isDueSoon ? "bg-orange-100" : "bg-slate-100"
                      }`}>
                        <BookOpen className={`w-5 h-5 ${
                          assignment.status === "graded" ? "text-green-600" : assignment.status === "submitted" ? "text-blue-600" : isOverdue ? "text-red-600" : isDueSoon ? "text-orange-600" : "text-slate-600"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 mb-1">{assignment.title}</p>
                        <p className="text-sm text-slate-500 mb-2">{assignment.subject?.name}</p>
                        <p className="text-xs text-slate-400 line-clamp-1">{assignment.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-xs font-medium mb-1 ${
                          isOverdue ? "text-red-600" : isDueSoon ? "text-orange-600" : "text-slate-500"
                        }`}>
                          {isOverdue ? "Overdue" : `Due ${format(new Date(assignment.dueDate), "MMM dd")}`}
                        </p>
                        <span className={`inline-block text-xs px-2 py-1 rounded ${
                          assignment.status === "graded" ? "bg-green-100 text-green-700" : assignment.status === "submitted" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                        }`}>
                          {assignment.status === "graded" ? `Grade: ${assignment.grade}` : (assignment.status || 'Pending').charAt(0).toUpperCase() + (assignment.status || 'Pending').slice(1)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {(!assignments || assignments.length === 0) && (
                  <p className="text-center text-slate-500 py-4">No assignments found.</p>
                )}
              </div>
            </AsyncWrapper>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                My Teachers
              </h2>
              <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">
                {teachers?.length || 0}
              </span>
            </div>
            <div className="space-y-3">
              {teachers?.slice(0, 3).map((teacher) => (
                <div key={teacher._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs">
                    {teacher.user?.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{teacher.user?.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{teacher.department || 'Faculty'}</p>
                  </div>
                  <div className="flex gap-1">
                    <a href={`mailto:${teacher.user?.email}`} className="p-1.5 hover:bg-white rounded-md text-slate-400 hover:text-indigo-600 transition-colors">
                      <Clock className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
              {(!teachers || teachers.length === 0) && (
                <p className="text-center py-4 text-slate-400 text-xs italic">No specific teachers assigned yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/student/dashboard/career")}
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
                onClick={() => navigate("/student/dashboard/grades")}
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
                onClick={() => navigate("/student/dashboard/doubts")}
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

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Attendance Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Overall Attendance</span>
                <span className="font-semibold text-slate-900">{stats?.attendancePercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${stats?.attendancePercentage}%` }}
                />
              </div>
              <p className="text-xs text-slate-400">
                You have {stats?.attendancePercentage >= 75 ? 'good' : 'low'} attendance this session.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
