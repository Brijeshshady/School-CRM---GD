import { useStudentAttendance } from "./hooks/useStudentData";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";

export const StudentAttendance = () => {
  const { data: attendanceData, isLoading, isError } = useStudentAttendance();
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-600" />
        <p>Loading attendance records...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500">
        <p>Failed to load attendance data. Please try again later.</p>
      </div>
    );
  }

  const attendance = attendanceData || [];
  const totalDays = attendance.length;
  const presentDays = attendance.filter((a) => a.status.toLowerCase() === "present").length;
  const absentDays = attendance.filter((a) => a.status.toLowerCase() === "absent").length;
  const lateDays = attendance.filter((a) => a.status.toLowerCase() === "late").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Attendance Record</h1>
        <p className="text-slate-500">Your attendance history and statistics</p>
      </div>

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
              {absentDays}
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
              {lateDays}
            </p>
            <p className="text-sm text-slate-500 mt-1">Times Late</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        {attendance.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-4 font-semibold text-slate-700">Date</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Class</th>
                  <th className="text-center p-4 font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4 text-slate-900">{format(new Date(record.date), "MMM dd, yyyy")}</td>
                    <td className="p-4 text-slate-700">{record.class?.name || "General"}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                        record.status.toLowerCase() === "present" ? "bg-green-100 text-green-700" : 
                        record.status.toLowerCase() === "absent" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                      }`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">
            No attendance records found.
          </div>
        )}
      </div>
    </div>
  );
};
