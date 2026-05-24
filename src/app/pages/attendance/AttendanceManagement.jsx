import { useState, useEffect } from "react";
import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { useApp } from "@/app/context/AppContext";
import { toast } from "sonner";
export function AttendanceManagement() {
  const { students, attendanceRecords, markAttendance, getAttendanceByDate, user } = useApp();
  const [selectedClass, setSelectedClass] = useState("Grade 10 A");
  const [selectedDate, setSelectedDate] = useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const classStudents = students.filter((s) => `${s.class} ${s.section}` === selectedClass);
  useEffect(() => {
    const existingAttendance = getAttendanceByDate(selectedDate, selectedClass);
    const attendanceMap = {};
    classStudents.forEach((student) => {
      const record = existingAttendance.find((r) => r.studentId === student.id);
      attendanceMap[student.id] = record?.status || "present";
    });
    setAttendance(attendanceMap);
    setHasChanges(false);
  }, [selectedDate, selectedClass]);
  const toggleAttendance = (studentId) => {
    setAttendance((prev) => {
      const current = prev[studentId] || "present";
      const next = current === "present" ? "absent" : current === "absent" ? "late" : current === "late" ? "excused" : "present";
      return { ...prev, [studentId]: next };
    });
    setHasChanges(true);
  };
  const setAllPresent = () => {
    const allPresent = {};
    classStudents.forEach((s) => {
      allPresent[s.id] = "present";
    });
    setAttendance(allPresent);
    setHasChanges(true);
  };
  const handleSave = () => {
    const records = classStudents.map((student) => ({
      studentId: student.id,
      date: selectedDate,
      class: selectedClass,
      status: attendance[student.id] || "present",
      markedBy: user?.name || "Admin"
    }));
    markAttendance(records);
    setHasChanges(false);
    toast.success("Attendance saved successfully");
  };
  const presentCount = Object.values(attendance).filter((a) => a === "present").length;
  const absentCount = Object.values(attendance).filter((a) => a === "absent").length;
  const lateCount = Object.values(attendance).filter((a) => a === "late").length;
  const attendancePercentage = classStudents.length > 0 ? Math.round(presentCount / classStudents.length * 100) : 0;
  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-accent/10 text-accent";
      case "absent":
        return "bg-destructive/10 text-destructive";
      case "late":
        return "bg-chart-5/10 text-chart-5";
      case "excused":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Attendance Management</h1>
          <p className="text-muted-foreground">Mark and track student attendance</p>
        </div>
        <button
    onClick={setAllPresent}
    className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
  >
          Mark All Present
        </button>
      </div>

      {
    /* Stats */
  }
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Students</div>
          <div className="text-2xl font-bold">{classStudents.length}</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-sm text-muted-foreground mb-1">Present</div>
          <div className="text-2xl font-bold text-accent">{presentCount}</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-sm text-muted-foreground mb-1">Absent</div>
          <div className="text-2xl font-bold text-destructive">{absentCount}</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-sm text-muted-foreground mb-1">Attendance Rate</div>
          <div className="text-2xl font-bold text-primary">{attendancePercentage}%</div>
        </div>
      </div>

      {
    /* Filters */
  }
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Select Class</label>
            <select
    value={selectedClass}
    onChange={(e) => setSelectedClass(e.target.value)}
    className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
  >
              <option>Grade 8 A</option>
              <option>Grade 9 B</option>
              <option>Grade 10 A</option>
              <option>Grade 11 C</option>
              <option>Grade 12 B</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Select Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
    type="date"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
    className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
  />
            </div>
          </div>
        </div>
      </div>

      {
    /* Attendance List */
  }
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-sm">Roll No.</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Student Name</th>
                <th className="text-center py-3 px-4 font-medium text-sm">Status</th>
                <th className="text-center py-3 px-4 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classStudents.map((student) => {
    const status = attendance[student.id] || "present";
    return <tr key={student.id} className="border-b border-border hover:bg-muted/30">
                    <td className="py-4 px-4 font-medium">{student.rollNo}</td>
                    <td className="py-4 px-4">{student.name}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                        {status === "present" && <CheckCircle className="w-4 h-4" />}
                        {status === "absent" && <XCircle className="w-4 h-4" />}
                        {status === "late" && <Clock className="w-4 h-4" />}
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
      onClick={() => toggleAttendance(student.id)}
      className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
    >
                        Change Status
                      </button>
                    </td>
                  </tr>;
  })}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {hasChanges ? "Unsaved changes" : "All changes saved"}
          </div>
          <div className="flex gap-2">
            <button
    onClick={() => {
      const existingAttendance = getAttendanceByDate(selectedDate, selectedClass);
      const attendanceMap = {};
      classStudents.forEach((student) => {
        const record = existingAttendance.find((r) => r.studentId === student.id);
        attendanceMap[student.id] = record?.status || "present";
      });
      setAttendance(attendanceMap);
      setHasChanges(false);
    }}
    className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
  >
              Cancel
            </button>
            <button
    onClick={handleSave}
    disabled={!hasChanges}
    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
              Save Attendance
            </button>
          </div>
        </div>
      </div>
    </div>;
}
