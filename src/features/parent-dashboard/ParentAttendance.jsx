import { motion } from "motion/react";
import { CheckCircle2, AlertCircle, Clock, TrendingUp, XCircle } from "lucide-react";
import { Card, CardTitle } from "../../components/ui/Card";
import { useParentStudentData } from "./hooks/useParentData";

export const ParentAttendance = () => {
  const { linkedStudents, selectedStudentId, setSelectedStudentId, studentData, isLoading } = useParentStudentData();

  if (isLoading) return <div className="py-20 text-center text-slate-400">Loading student data...</div>;

  if (linkedStudents.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-slate-200 max-w-lg mx-auto mt-20">
        <AlertCircle className="w-12 h-12 text-indigo-500 mx-auto mb-4 animate-pulse" />
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-wider">No Student Linked</h3>
        <p className="text-slate-500 mt-2 font-medium">Please contact administration to link your child's account to this portal.</p>
      </div>
    );
  }

  const attendance = studentData.attendance || [];
  
  const presentDays = attendance.filter(a => a.status === "present" || a.status === "Present").length;
  const absentDays = attendance.filter(a => a.status === "absent" || a.status === "Absent").length;
  const lateDays = attendance.filter(a => a.status === "late" || a.status === "Late").length;
  const totalDays = attendance.length;
  const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  return (
    <motion.div
      key="attendance"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance Record</h1>
          <p className="text-slate-500 mt-1">Monthly attendance tracking and statistics</p>
        </div>
        
        {linkedStudents.length > 1 && (
          <select 
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
          >
            {linkedStudents.map(student => (
              <option key={student._id} value={student._id}>
                {student.user?.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">{presentDays}</p>
          <p className="text-sm text-slate-500 mt-1">Days Present</p>
        </Card>

        <Card className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-600">{absentDays}</p>
          <p className="text-sm text-slate-500 mt-1">Days Absent</p>
        </Card>

        <Card className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-600">{lateDays}</p>
          <p className="text-sm text-slate-500 mt-1">Times Late</p>
        </Card>

        <Card className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{totalDays > 0 ? percentage : "N/A"}%</p>
          <p className="text-sm text-slate-500 mt-1">Overall %</p>
        </Card>
      </div>

      <Card>
        <CardTitle className="mb-6">Recent Records</CardTitle>
        <div className="space-y-4">
          {attendance.length > 0 ? attendance.slice(0, 10).map((record) => (
            <div key={record._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  record.status === "present" || record.status === "Present" ? "bg-green-100 text-green-600" :
                  record.status === "absent" || record.status === "Absent" ? "bg-red-100 text-red-600" :
                  "bg-orange-100 text-orange-600"
                }`}>
                  {record.status === "present" || record.status === "Present" ? <CheckCircle2 className="w-5 h-5" /> :
                   record.status === "absent" || record.status === "Absent" ? <XCircle className="w-5 h-5" /> :
                   <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{new Date(record.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p className="text-sm text-slate-500 capitalize">{record.status}</p>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-10 text-center text-slate-400 italic">No attendance records found</div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
