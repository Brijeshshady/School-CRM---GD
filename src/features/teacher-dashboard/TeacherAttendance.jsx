import { useState } from "react";
import { UserCheck, Timer, UserX, Loader2, Check, Clock, MapPin } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { SearchableSelect } from "../../app/components/ui/SearchableSelect";
import { useTeacherClasses, useSubmitAttendance } from "./hooks/useTeacherData";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";
import { toast } from "sonner";
import { ATTENDANCE_STATUS } from "../../app/constants";

export const TeacherAttendance = () => {
  const [selectedClassId, setSelectedClassId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [markedRecords, setMarkedRecords] = useState({}); // { studentId: status }

  const { data: classes, isLoading: classesLoading } = useTeacherClasses();
  const submitAttendance = useSubmitAttendance();

  // Fetch students for the selected class
  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ['class-students', selectedClassId],
    queryFn: async () => {
      const { data } = await api.get(`/students?class=${selectedClassId}&limit=100`);
      return data.data;
    },
    enabled: !!selectedClassId,
  });

  const handleStatusChange = (studentId, status) => {
    setMarkedRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(markedRecords).length < (students?.length || 0)) {
      toast.error("Please mark attendance for all students");
      return;
    }

    const payload = {
      classId: selectedClassId,
      records: Object.entries(markedRecords).map(([studentId, status]) => ({
        student: studentId,
        status,
        date
      }))
    };

    try {
      await submitAttendance.mutateAsync(payload);
      toast.success("Attendance submitted successfully");
      setMarkedRecords({});
      setSelectedClassId("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit attendance");
    }
  };

  const allMarked = students && Object.keys(markedRecords).length === students.length;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Mark Attendance</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <SearchableSelect
              label="Select Class"
              options={classes?.map(cls => ({ label: `${cls.name}-${cls.section}`, value: cls._id })) || []}
              value={selectedClassId}
              onChange={(val) => setSelectedClassId(val)}
              placeholder="Choose a class..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendance Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        {selectedClassId ? (
          <div className="mt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-lg">
                  {classes.find(c => c._id === selectedClassId)?.name} Deployment
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Clock className="w-3 h-3" /> {classes.find(c => c._id === selectedClassId)?.academicYear || "Active Session"}
                  </span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  <span className="flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                    <MapPin className="w-3 h-3" /> Room {classes.find(c => c._id === selectedClassId)?.roomNumber || "TBD"}
                  </span>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <Check className="w-4 h-4" /> Present: {Object.values(markedRecords).filter(v => v === ATTENDANCE_STATUS.PRESENT).length}
                </span>
                <span className="flex items-center gap-1 text-red-600 font-medium">
                   Absent: {Object.values(markedRecords).filter(v => v === ATTENDANCE_STATUS.ABSENT).length}
                </span>
              </div>
            </div>

            {studentsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Student Name</th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {students?.map((student) => (
                      <tr key={student._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">{student.user?.name || "Unknown Student"}</p>
                          <p className="text-xs text-slate-500">ID: {student.studentId}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            {[ATTENDANCE_STATUS.PRESENT, ATTENDANCE_STATUS.ABSENT, ATTENDANCE_STATUS.LATE].map((status) => (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(student._id, status)}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                  markedRecords[student._id] === status
                                    ? status === ATTENDANCE_STATUS.PRESENT ? "bg-green-500 text-white" : status === ATTENDANCE_STATUS.ABSENT ? "bg-red-500 text-white" : "bg-orange-500 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={!allMarked || submitAttendance.isPending}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitAttendance.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit Attendance
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <UserCheck className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p>Select a class to view and mark student attendance</p>
          </div>
        )}
      </Card>
    </div>
  );
};
