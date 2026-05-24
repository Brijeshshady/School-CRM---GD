import { useState } from "react";
import {
  Clock,
  Users,
  CheckCircle,
  BookOpen,
  FileText,
  TrendingUp,
  Award,
  AlertCircle,
  Bell,
  MessageSquare,
  BarChart3,
  ClipboardList,
  GraduationCap,
  Plus,
  ChevronRight,
  UserCheck,
  UserX,
  Timer,
  Star
} from "lucide-react";
import { useAuth } from "../../app/context/AuthContext";
import { useTeacherDashboard } from "../../../features/teacher-dashboard/hooks/useTeacherData";
import { SupportTickets } from "../support/SupportTickets";
import { useData } from "../../context/DataContext";
import { LayoutDashboard } from "lucide-react";

export function EnhancedTeacherDashboard() {
  const { user } = useAuth();
  const { data: dashboardData, isLoading: dashboardLoading } = useTeacherDashboard();
  const { assignments, attendance, users } = useData();

  const [activeTab, setActiveTab] = useState("overview");
  const teacherProfile = {
    name: user?.name || "Teacher",
    email: user?.email || "",
    employeeId: user?._id?.slice(-6).toUpperCase() || "N/A",
    department: dashboardData?.department || "General",
  };

  const myClasses = [
    {
      id: "class1",
      name: "Class 10-A",
      subject: "Physics",
      students: 42,
      schedule: "Mon, Wed, Fri - 09:00 AM",
      room: "Room 301",
      avgAttendance: 94.5,
      avgGrade: 78.2
    },
    {
      id: "class2",
      name: "Class 10-B",
      subject: "Physics",
      students: 38,
      schedule: "Tue, Thu - 10:00 AM",
      room: "Room 301",
      avgAttendance: 91.2,
      avgGrade: 75.8
    },
    {
      id: "class3",
      name: "Class 11-A",
      subject: "Chemistry",
      students: 35,
      schedule: "Mon, Wed, Fri - 11:00 AM",
      room: "Lab 2",
      avgAttendance: 89.7,
      avgGrade: 72.5
    },
    {
      id: "class4",
      name: "Class 11-B",
      subject: "Chemistry",
      students: 40,
      schedule: "Tue, Thu - 02:00 PM",
      room: "Lab 2",
      avgAttendance: 92.3,
      avgGrade: 76.1
    }
  ];
  const todaySchedule = [
    {
      time: "09:00 - 10:00 AM",
      subject: "Physics",
      class: "Class 10-A",
      room: "Room 301",
      topic: "Newton's Laws of Motion",
      status: "completed"
    },
    {
      time: "10:15 - 11:15 AM",
      subject: "Physics",
      class: "Class 10-B",
      room: "Room 301",
      topic: "Force and Momentum",
      status: "ongoing"
    },
    {
      time: "11:30 - 12:30 PM",
      subject: "Chemistry",
      class: "Class 11-A",
      room: "Lab 2",
      topic: "Chemical Bonding",
      status: "upcoming"
    },
    {
      time: "02:00 - 03:00 PM",
      subject: "Chemistry",
      class: "Class 11-B",
      room: "Lab 2",
      topic: "Acids and Bases",
      status: "upcoming"
    }
  ];
  const recentActivities = [
    {
      id: "1",
      type: "attendance",
      message: "Marked attendance for Class 10-A - 40/42 present",
      time: "30 min ago",
      icon: UserCheck,
      color: "text-green-600"
    },
    {
      id: "2",
      type: "assignment",
      message: "28 students submitted Physics Lab Report",
      time: "1 hour ago",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      id: "3",
      type: "grade",
      message: "Graded Chemistry Quiz for Class 11-A",
      time: "2 hours ago",
      icon: Award,
      color: "text-purple-600"
    },
    {
      id: "4",
      type: "meeting",
      message: "Parent-teacher meeting with student's parents",
      time: "3 hours ago",
      icon: MessageSquare,
      color: "text-orange-600"
    },
    {
      id: "5",
      type: "announcement",
      message: "Posted announcement about Science Fair on Feb 15",
      time: "5 hours ago",
      icon: Bell,
      color: "text-indigo-600"
    }
  ];
  const pendingTasks = [
    {
      id: "t1",
      task: "Grade Physics Lab Reports",
      count: 12,
      deadline: "Feb 8, 2026",
      priority: "high"
    },
    {
      id: "t2",
      task: "Prepare Chemistry Quiz",
      count: 1,
      deadline: "Feb 9, 2026",
      priority: "medium"
    },
    {
      id: "t3",
      task: "Submit Monthly Progress Reports",
      count: 4,
      deadline: "Feb 10, 2026",
      priority: "high"
    },
    {
      id: "t4",
      task: "Review Homework Submissions",
      count: 38,
      deadline: "Feb 7, 2026",
      priority: "urgent"
    }
  ];
  const topPerformers = [
    { name: "Aarav Kumar", class: "Class 10-A", avg: 94.5, trend: "+2%" },
    { name: "Priya Patel", class: "Class 10-B", avg: 92.8, trend: "+3%" },
    { name: "Rohan Sharma", class: "Class 11-A", avg: 91.2, trend: "+1%" },
    { name: "Ananya Singh", class: "Class 10-A", avg: 89.7, trend: "+4%" },
    { name: "Vikram Reddy", class: "Class 11-B", avg: 88.5, trend: "+2%" }
  ];
  const needsAttention = [
    { name: "Rahul Verma", class: "Class 10-B", issue: "Low attendance (72%)", severity: "high" },
    { name: "Sneha Gupta", class: "Class 11-A", issue: "Declining grades", severity: "medium" },
    { name: "Amit Singh", class: "Class 10-A", issue: "Missing 3 assignments", severity: "high" },
    { name: "Kavya Iyer", class: "Class 11-B", issue: "Failed last quiz", severity: "medium" }
  ];
  const upcomingEvents = [
    { date: "Feb 8", title: "Physics Lab Practical", class: "Class 10-A", time: "09:00 AM" },
    { date: "Feb 10", title: "Chemistry Quiz", class: "Class 11-A", time: "11:00 AM" },
    { date: "Feb 12", title: "Parent-Teacher Meeting", class: "All Classes", time: "02:00 PM" },
    { date: "Feb 15", title: "Science Fair", class: "School Event", time: "10:00 AM" }
  ];
  const statsData = [
    {
      label: "Assigned Classes",
      value: dashboardData?.totalClasses || "0",
      change: "Current session",
      icon: Users,
      color: "bg-blue-500"
    },
    {
      label: "Active Assignments",
      value: dashboardData?.activeAssignments || "0",
      change: "Due this week",
      icon: BookOpen,
      color: "bg-green-500"
    },
    {
      label: "Pending Attendance",
      value: dashboardData?.pendingAttendance || "0",
      change: "Action required",
      icon: UserCheck,
      color: "bg-purple-500"
    },
    {
      label: "Avg Attendance",
      value: "92%",
      change: "+1.2% this month",
      icon: TrendingUp,
      color: "bg-orange-500"
    }
  ];

  return <div className="min-h-screen bg-slate-50">
      {
    /* Header */
  }
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Teacher Portal</h1>
              <p className="text-blue-100">Welcome back, {teacherProfile.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-blue-100">Employee ID</p>
                <p className="font-semibold">{teacherProfile.employeeId}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                PS
              </div>
            </div>
          </div>

          {
    /* Quick Stats */
  }
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statsData.map((stat, idx) => <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-blue-100">{stat.label}</p>
                  </div>
                </div>
                <p className="text-xs text-blue-200 mt-2">{stat.change}</p>
              </div>)}
          </div>

        </div>
      </div>

      {
    /* Main Content */
  }
      <div className="max-w-7xl mx-auto px-6 py-8">
        {
    /* Tab Navigation */
  }
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="flex border-b border-slate-200 overflow-x-auto">
            {[
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "classes", label: "My Classes", icon: BookOpen },
    { id: "attendance", label: "Attendance", icon: UserCheck },
    { id: "assignments", label: "Assignments", icon: FileText },
    { id: "grades", label: "Grades", icon: Award }
  ].map((tab) => <button
    key={tab.id}
    onClick={() => setActiveTab(tab.id)}
    className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
  >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>)}
          </div>
        </div>

        {
    /* Overview Tab */
  }
        {activeTab === "overview" && <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {
    /* Today's Schedule */
  }
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900">Today's Schedule</h2>
                  <span className="text-sm text-slate-500">Saturday, Feb 7, 2026</span>
                </div>
                <div className="space-y-3">
                  {todaySchedule.map((cls, idx) => <div key={idx} className={`p-4 rounded-lg border-2 ${cls.status === "completed" ? "border-green-200 bg-green-50" : cls.status === "ongoing" ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${cls.status === "completed" ? "bg-green-500" : cls.status === "ongoing" ? "bg-blue-500 animate-pulse" : "bg-slate-300"}`} />
                          <div>
                            <h3 className="font-semibold text-slate-900">{cls.subject}</h3>
                            <p className="text-sm text-slate-500">{cls.class} • {cls.room}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-700">{cls.time}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${cls.status === "completed" ? "bg-green-100 text-green-700" : cls.status === "ongoing" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                            {cls.status.charAt(0).toUpperCase() + cls.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 ml-5">Topic: {cls.topic}</p>
                    </div>)}
                </div>
              </div>

              {
    /* Pending Tasks */
  }
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Pending Tasks</h2>
                <div className="space-y-3">
                  {pendingTasks.map((task) => <div key={task.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-slate-900 text-sm">{task.task}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${task.priority === "urgent" ? "bg-red-100 text-red-700" : task.priority === "high" ? "bg-orange-100 text-orange-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{task.count} items</span>
                        <span>Due: {task.deadline}</span>
                      </div>
                    </div>)}
                </div>
                <button className="w-full mt-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  View All Tasks
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {
    /* Recent Activity */
  }
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivities.map((activity) => <div key={activity.id} className="flex gap-3">
                      <div className={`w-10 h-10 rounded-full ${activity.color} bg-opacity-10 flex items-center justify-center flex-shrink-0`}>
                        <activity.icon className={`w-5 h-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-900">{activity.message}</p>
                        <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                      </div>
                    </div>)}
                </div>
              </div>

              {
    /* Upcoming Events */
  }
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Upcoming Events</h2>
                <div className="space-y-3">
                  {upcomingEvents.map((event, idx) => <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="w-12 flex-shrink-0 text-center">
                        <p className="text-xs font-medium text-slate-500">{event.date.split(" ")[0]}</p>
                        <p className="text-lg font-bold text-slate-900">{event.date.split(" ")[1]}</p>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900">{event.title}</h3>
                        <p className="text-sm text-slate-500">{event.class} • {event.time}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    </div>)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {
    /* Top Performers */
  }
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900">Top Performers</h2>
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="space-y-3">
                  {topPerformers.map((student, idx) => <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900">{student.name}</h3>
                          <p className="text-xs text-slate-500">{student.class}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{student.avg}%</p>
                        <p className="text-xs text-green-600">{student.trend}</p>
                      </div>
                    </div>)}
                </div>
              </div>

              {
    /* Students Needing Attention */
  }
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900">Needs Attention</h2>
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <div className="space-y-3">
                  {needsAttention.map((student, idx) => <div key={idx} className="flex items-start justify-between p-3 rounded-lg bg-red-50 border border-red-200">
                      <div>
                        <h3 className="font-medium text-slate-900">{student.name}</h3>
                        <p className="text-xs text-slate-500 mb-1">{student.class}</p>
                        <p className="text-sm text-red-700">{student.issue}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${student.severity === "high" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>
                        {student.severity}
                      </span>
                    </div>)}
                </div>
              </div>
            </div>
          </div>}

        {
    /* Classes Tab */
  }
        {activeTab === "classes" && <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">My Classes</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-5 h-5" />
                Add Class
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myClasses.map((cls) => <div key={cls.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{cls.name}</h3>
                      <p className="text-blue-600 font-medium">{cls.subject}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Total Students</span>
                      <span className="font-semibold text-slate-900">{cls.students}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Avg Attendance</span>
                      <span className="font-semibold text-green-600">{cls.avgAttendance}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Avg Grade</span>
                      <span className="font-semibold text-purple-600">{cls.avgGrade}%</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                      <Clock className="w-4 h-4" />
                      {cls.schedule}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <BookOpen className="w-4 h-4" />
                      {cls.room}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                      View Details
                    </button>
                    <button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                      Mark Attendance
                    </button>
                  </div>
                </div>)}
            </div>
          </div>}

        {
    /* Attendance Tab */
  }
        {activeTab === "attendance" && <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Mark Attendance</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select Class</option>
                  {myClasses.map((cls) => <option key={cls.id}>{cls.name} - {cls.subject}</option>)}
                </select>
                <input
    type="date"
    defaultValue="2026-02-07"
    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Load Students
                </button>
              </div>

              <div className="text-center py-12 text-slate-500">
                <UserCheck className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p>Select a class and date to mark attendance</p>
              </div>
            </div>

            {
    /* Attendance Statistics */
  }
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Avg Attendance</p>
                    <p className="text-2xl font-bold text-slate-900">91.9%</p>
                  </div>
                </div>
                <p className="text-sm text-green-600">+2.3% from last month</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Timer className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Late Arrivals</p>
                    <p className="text-2xl font-bold text-slate-900">23</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600">This week</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <UserX className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Absences</p>
                    <p className="text-2xl font-bold text-slate-900">12</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600">This week</p>
              </div>
            </div>
          </div>}

        {
    /* Assignments Tab */
  }
        {activeTab === "assignments" && <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Assignments</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-5 h-5" />
                Create Assignment
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <div className="flex gap-4">
                  <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Classes</option>
                    {myClasses.map((cls) => <option key={cls.id}>{cls.name} - {cls.subject}</option>)}
                  </select>
                  <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Statuses</option>
                    <option>Active</option>
                    <option>Graded</option>
                    <option>Overdue</option>
                  </select>
                </div>
              </div>

              <div className="divide-y divide-slate-200">
                {[
    {
      title: "Newton's Laws Lab Report",
      class: "Class 10-A",
      dueDate: "Feb 8, 2026",
      submitted: 28,
      total: 42,
      status: "active"
    },
    {
      title: "Chemical Bonding Worksheet",
      class: "Class 11-A",
      dueDate: "Feb 10, 2026",
      submitted: 15,
      total: 35,
      status: "active"
    },
    {
      title: "Force and Motion Quiz",
      class: "Class 10-B",
      dueDate: "Feb 5, 2026",
      submitted: 38,
      total: 38,
      status: "graded"
    },
    {
      title: "Acids and Bases Practical",
      class: "Class 11-B",
      dueDate: "Feb 12, 2026",
      submitted: 8,
      total: 40,
      status: "active"
    }
  ].map((assignment, idx) => <div key={idx} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">{assignment.title}</h3>
                        <p className="text-sm text-slate-600">{assignment.class}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${assignment.status === "graded" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                        {assignment.status === "graded" ? "Graded" : "Active"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="w-4 h-4" />
                          Due: {assignment.dueDate}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-slate-900">{assignment.submitted}</span>
                            <span className="text-slate-500">/ {assignment.total}</span>
                          </div>
                          <span className="text-slate-600">submitted</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium">
                          View Submissions
                        </button>
                        {assignment.status === "active" && <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            Grade
                          </button>}
                      </div>
                    </div>

                    {
    /* Progress Bar */
  }
                    <div className="mt-4">
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
    className={`h-2 rounded-full ${assignment.status === "graded" ? "bg-green-500" : "bg-blue-500"}`}
    style={{ width: `${assignment.submitted / assignment.total * 100}%` }}
  />
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>}

        {
    /* Grades Tab */
  }
        {activeTab === "grades" && <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Submit Grades</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select Class</option>
                  {myClasses.map((cls) => <option key={cls.id}>{cls.name} - {cls.subject}</option>)}
                </select>
                <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select Exam</option>
                  <option>Unit Test 1</option>
                  <option>Mid Term</option>
                  <option>Unit Test 2</option>
                  <option>Final Exam</option>
                </select>
                <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select Subject</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                </select>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Load Students
                </button>
              </div>

              <div className="text-center py-12 text-slate-500">
                <Award className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p>Select class, exam, and subject to enter grades</p>
              </div>
            </div>

            {
    /* Grade Statistics */
  }
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Class Average</p>
                    <p className="text-2xl font-bold text-slate-900">76.2%</p>
                  </div>
                </div>
                <p className="text-sm text-green-600">+3.1% improvement</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Above 80%</p>
                    <p className="text-2xl font-bold text-slate-900">62</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600">Out of 155 students</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Below 50%</p>
                    <p className="text-2xl font-bold text-slate-900">8</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600">Need intervention</p>
              </div>
            </div>
          </div>}

        {
    /* Quick Actions */
  }
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">Mark Attendance</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-slate-300 hover:border-green-500 hover:bg-green-50 transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">Create Assignment</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-slate-300 hover:border-purple-500 hover:bg-purple-50 transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">Submit Grades</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-slate-300 hover:border-orange-500 hover:bg-orange-50 transition-all">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>;
}
import { LayoutDashboard } from "lucide-react";
