import { useState } from "react";
import {
  UserCheck,
  UserX,
  Timer,
  TrendingUp,
  Download,
  Filter
} from "lucide-react";
export function AttendanceManagement() {
  const [selectedDate, setSelectedDate] = useState("2026-02-07");
  const [selectedClass, setSelectedClass] = useState("10-A");
  const stats = [
    { label: "Today's Attendance", value: "94.2%", icon: UserCheck, color: "bg-green-500", change: "1,167/1,239 present" },
    { label: "Absent Today", value: "72", icon: UserX, color: "bg-red-500", change: "5.8% of total" },
    { label: "Late Arrivals", value: "28", icon: Timer, color: "bg-orange-500", change: "Before 9:30 AM" },
    { label: "Monthly Average", value: "92.8%", icon: TrendingUp, color: "bg-blue-500", change: "+1.5% vs last month" }
  ];
  const classAttendance = [
    { class: "10-A", present: 40, absent: 2, late: 0, total: 42, percentage: 95.2 },
    { class: "10-B", present: 36, absent: 2, late: 0, total: 38, percentage: 94.7 },
    { class: "11-A", present: 33, absent: 2, late: 0, total: 35, percentage: 94.3 },
    { class: "11-B", present: 37, absent: 3, late: 0, total: 40, percentage: 92.5 },
    { class: "12-A", present: 29, absent: 1, late: 0, total: 30, percentage: 96.7 }
  ];
  const recentAbsentees = [
    { name: "Rahul Verma", class: "10-B", consecutiveDays: 3, reason: "Sick Leave", contact: "+91 98765 43210" },
    { name: "Sneha Gupta", class: "11-A", consecutiveDays: 2, reason: "Family Emergency", contact: "+91 97654 32109" },
    { name: "Amit Singh", class: "10-A", consecutiveDays: 1, reason: "Medical Appointment", contact: "+91 99887 76655" }
  ];
  return <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Attendance Management</h1>
          <p className="text-slate-600 mt-1">Track and manage student attendance records</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-5 h-5" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {
    /* Stats */
  }
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">{stat.change}</p>
          </div>)}
      </div>

      {
    /* Date and Class Selector */
  }
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
    type="date"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
          <select
    value={selectedClass}
    onChange={(e) => setSelectedClass(e.target.value)}
    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
            <option value="10-A">Class 10-A</option>
            <option value="10-B">Class 10-B</option>
            <option value="11-A">Class 11-A</option>
            <option value="11-B">Class 11-B</option>
            <option value="12-A">Class 12-A</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            View Attendance
          </button>
        </div>
      </div>

      {
    /* Class-wise Attendance */
  }
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Class-wise Attendance - Today</h2>
        <div className="space-y-3">
          {classAttendance.map((item, idx) => <div key={idx} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900">Class {item.class}</h3>
                  <p className="text-sm text-slate-500">{item.total} students</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">{item.percentage}%</p>
                  <p className="text-sm text-slate-500">{item.present}/{item.total} present</p>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-slate-600">Present: {item.present}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-slate-600">Absent: {item.absent}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-slate-600">Late: {item.late}</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
    className="bg-green-500 h-2 rounded-full"
    style={{ width: `${item.percentage}%` }}
  />
                </div>
              </div>
            </div>)}
        </div>
      </div>

      {
    /* Recent Absentees */
  }
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Students Requiring Attention</h2>
        <div className="space-y-3">
          {recentAbsentees.map((student, idx) => <div key={idx} className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{student.name}</h3>
                  <p className="text-sm text-slate-600">Class {student.class}</p>
                  <p className="text-sm text-red-700 mt-1">Absent for {student.consecutiveDays} consecutive day(s)</p>
                  <p className="text-sm text-slate-600 mt-1">Reason: {student.reason}</p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                  Contact Parent
                </button>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
}
