import { motion } from "motion/react";
import {
  Calendar,
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  Video,
  FileText,
  Target,
  MessageSquare
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { studentProfile, mockAssignments, todaySchedule, mockAttendance } from "../../data/mockData";
import { useNavigate } from "react-router-dom";
export const StudentDashboard = () => {
  const navigate = useNavigate();
  const student = studentProfile;
  const totalDays = mockAttendance.length;
  const presentDays = mockAttendance.filter((a) => a.status === "present").length;
  const attendancePercentage = Math.round(presentDays / totalDays * 100);
  const pendingAssignments = mockAssignments.filter((a) => a.status === "pending");
  const submittedAssignments = mockAssignments.filter((a) => a.status === "submitted");
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
  return <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {
    /* Header */
  }
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome back, {student.name.split(" ")[0]}! 👋
            </h1>
            <p className="text-slate-500 mt-1">
              {student.class} - Section {student.section} • Roll No: {student.rollNo}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <img
    src={student.avatar}
    alt={student.name}
    className="w-12 h-12 rounded-full border-2 border-blue-200"
  />
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
                {todaySchedule.map((cls, index) => {
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
                <button className="text-sm text-blue-600 font-medium hover:underline">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {mockAssignments.slice(0, 4).map((assignment) => {
    const daysLeft = differenceInDays(assignment.dueDate, /* @__PURE__ */ new Date());
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
                          {isOverdue ? "Overdue" : `Due ${format(assignment.dueDate, "MMM dd")}`}
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
    onClick={() => navigate("/student/career-options")}
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

                <button className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all text-left">
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

                <button className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
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
                      {mockAttendance.filter((a) => a.status === "absent").length}
                    </p>
                    <p className="text-xs text-slate-500">Absent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {mockAttendance.filter((a) => a.status === "late").length}
                    </p>
                    <p className="text-xs text-slate-500">Late</p>
                  </div>
                </div>
              </div>
            </div>

            {
    /* Upcoming Events */
  }
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Upcoming Events</h2>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs text-blue-600 font-medium">FEB</span>
                    <span className="text-lg font-bold text-blue-600">10</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 text-sm">Mid-term Exams</p>
                    <p className="text-xs text-slate-500">Mathematics & Science</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs text-purple-600 font-medium">FEB</span>
                    <span className="text-lg font-bold text-purple-600">12</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 text-sm">Career Webinar</p>
                    <p className="text-xs text-slate-500">Engineering Careers</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs text-green-600 font-medium">FEB</span>
                    <span className="text-lg font-bold text-green-600">15</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 text-sm">Sports Day</p>
                    <p className="text-xs text-slate-500">Annual athletics meet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
