import { Plus, GraduationCap, Clock, BookOpen, Users, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { useTeacherClasses } from "./hooks/useTeacherData";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";

export const TeacherClasses = () => {
  const navigate = useNavigate();
  const { data: classes, isLoading, isError } = useTeacherClasses();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Syncing your academic units...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border-2 border-red-100 p-8 rounded-2xl text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-red-900">Database Sync Failed</h3>
        <p className="text-red-600 mt-2">We couldn't load your assigned classes. Please verify your connection.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">My Classes</h2>
          <p className="text-slate-500 font-medium mt-1">Real-time overview of your assigned academic groups</p>
        </div>
        <Badge variant="primary" className="px-4 py-1.5 rounded-full text-xs font-bold">
          {classes?.length || 0} ACTIVE UNITS
        </Badge>
      </div>

      {!classes || classes.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-20 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Assignments Found</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">You haven't been assigned to any classes yet. Please contact the administrator to synchronize your profile.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {classes.map((cls) => (
            <div key={cls._id} className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
              
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-600/30 group-hover:rotate-6 transition-transform">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Session</span>
                  <span className="text-slate-900 font-bold">{cls.academicYear || "2025-26"}</span>
                </div>
              </div>

              <div className="mb-8 relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-3xl font-black text-slate-900 leading-tight">{cls.name}</h3>
                  <Badge variant="primary" className="px-4 py-1.5 rounded-xl font-black text-xs uppercase tracking-tighter shadow-sm">{cls.section}</Badge>
                </div>
                <div className="flex items-center gap-3 text-slate-500 font-bold">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200/50">
                    <BookOpen className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest leading-none mb-1">Department</span>
                    <span className="text-slate-800 text-sm font-black">{cls.department || "Academic Unit"}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                <div className="bg-slate-50/50 rounded-3xl p-4 border border-slate-100/50 backdrop-blur-sm group-hover:bg-white transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Room Number</p>
                  </div>
                  <p className="text-xl font-black text-slate-900">{cls.roomNumber || "N/A"}</p>
                </div>
                <div className="bg-slate-50/50 rounded-3xl p-4 border border-slate-100/50 backdrop-blur-sm group-hover:bg-white transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned</p>
                  </div>
                  <p className="text-xl font-black text-slate-900">{cls.capacity || "40"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 relative z-10">
                <button 
                  onClick={() => navigate(`/teacher/dashboard/attendance`)}
                  className="py-4 bg-slate-950 text-white rounded-[1.5rem] text-xs font-black hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-slate-950/10 group/btn"
                >
                  <ArrowRight className="w-4 h-4 text-blue-400 group-hover/btn:text-white transition-colors" />
                  Mark Attendance
                </button>
                <button className="py-4 bg-slate-50 text-slate-900 rounded-[1.5rem] text-xs font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-2 border border-slate-100">
                  Unit Analytics
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
