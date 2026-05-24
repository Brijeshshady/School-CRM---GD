import { UserCheck, FileText, Award, MessageSquare, Bell, Star, AlertCircle, ChevronRight, Clock, Plus, Users, BookOpen, Activity, Loader2 } from "lucide-react";
import { Card, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { useAuth } from "../../app/context/AuthContext";
import { useTeacherDashboard, useTeacherClasses } from "./hooks/useTeacherData";
import { AsyncWrapper } from "../../components/ui/AsyncWrapper";
import { DashboardSkeleton } from "../../components/ui/skeletons/DashboardSkeleton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TimetableUploadModal } from "./components/TimetableUploadModal";
import api from "../../lib/api";
import { format } from "date-fns";

export const TeacherHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { data: stats, isLoading, isError } = useTeacherDashboard();
  const { data: classes } = useTeacherClasses();

  const { data: permissionData } = useQuery({
    queryKey: ['timetable-permission'],
    queryFn: async () => {
      const res = await api.get('/timetables/check-permission');
      return res.data.data;
    }
  });

  const dashboardStats = [
    { label: "Academic Units", value: stats?.totalClasses || "0", change: "Active groups", icon: UserCheck, color: "bg-blue-600" },
    { label: "Active Students", value: stats?.totalAssignedStudents || "0", change: "Synced enrollment", icon: Users, color: "bg-indigo-600" },
    { label: "Course Catalog", value: stats?.totalSubjects || "0", change: "Assigned modules", icon: BookOpen, color: "bg-purple-600" },
    { label: "Attendance Status", value: stats?.pendingAttendance || "0", change: "Pending updates", icon: Clock, color: "bg-orange-600" }
  ];

  return (
    <div className="space-y-8 min-h-screen bg-slate-50/30 animate-in fade-in duration-700">
      {/* Premium Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
        
        <div className="p-10 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/20 text-blue-300 text-xs font-black uppercase tracking-widest mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Teacher Environment Active
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">Welcome, {user?.name}</h1>
              <p className="text-slate-400 font-medium text-lg max-w-md">Orchestrating academic units and student progression metrics.</p>
            </div>
            
            <div className="flex items-center gap-6 bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 shadow-2xl">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Teacher ID</p>
                <p className="text-lg font-black text-white">{user?._id.slice(-8).toUpperCase()}</p>
              </div>
              <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[1.5rem] flex items-center justify-center text-2xl font-black border-4 border-white/10 shadow-2xl text-white transform hover:rotate-6 transition-transform">
                {user?.name.split(" ").map(n => n[0]).join("")}
              </div>
            </div>
          </div>

          <AsyncWrapper 
            isLoading={isLoading} 
            isError={isError}
            loadingFallback={<div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-white/5 rounded-3xl" />)}
            </div>}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStats.map((stat, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/5 hover:border-white/20 transition-all group/stat">
                  <div className="flex items-center gap-4">
                    <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transform group-hover/stat:scale-110 transition-transform`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-white tracking-tight">{stat.value}</p>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AsyncWrapper>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions Grid */}
          <Card className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60">
            <CardTitle className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <Activity className="w-6 h-6 text-blue-600" />
              Command Center
            </CardTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <button 
                onClick={() => navigate("/teacher/dashboard/attendance")}
                className="group flex flex-col items-center gap-4 p-6 rounded-3xl border-2 border-dashed border-slate-100 hover:border-blue-600 hover:bg-blue-50/50 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <UserCheck className="w-8 h-8 text-blue-600" />
                </div>
                <span className="text-xs font-black text-slate-900 uppercase tracking-widest text-center">Sync Attendance</span>
              </button>
              <button 
                onClick={() => navigate("/teacher/dashboard/assignments")}
                className="group flex flex-col items-center gap-4 p-6 rounded-3xl border-2 border-dashed border-slate-100 hover:border-emerald-600 hover:bg-emerald-50/50 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <FileText className="w-8 h-8 text-emerald-600" />
                </div>
                <span className="text-xs font-black text-slate-900 uppercase tracking-widest text-center">New Assignment</span>
              </button>
              
              {permissionData?.canUpload && (
                <button 
                  onClick={() => setIsUploadModalOpen(true)}
                  className="group flex flex-col items-center gap-4 p-6 rounded-3xl border-2 border-dashed border-indigo-200 bg-indigo-50/20 hover:border-indigo-600 hover:bg-indigo-50/50 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <Plus className="w-8 h-8 text-indigo-600" />
                  </div>
                  <span className="text-xs font-black text-slate-900 uppercase tracking-widest text-center">Push Timetable</span>
                </button>
              )}

              <button className="group flex flex-col items-center gap-4 p-6 rounded-3xl border-2 border-dashed border-slate-100 hover:border-orange-600 hover:bg-orange-50/50 transition-all duration-300">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <Bell className="w-8 h-8 text-orange-600" />
                </div>
                <span className="text-xs font-black text-slate-900 uppercase tracking-widest text-center">Broadcast Alert</span>
              </button>
            </div>
          </Card>

          <Card className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden relative">
            <div className="flex items-center justify-between mb-8">
              <CardTitle className="text-xl font-black text-slate-900">Current Unit Deployment</CardTitle>
              <button onClick={() => navigate('/teacher/dashboard/classes')} className="text-sm font-black text-blue-600 hover:underline flex items-center gap-2 uppercase tracking-widest">
                Expand View <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            {!classes || classes.length === 0 ? (
              <div className="text-center py-20 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-bold">No academic units detected in current sync cycle.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {classes.slice(0, 4).map((cls, idx) => (
                  <div key={idx} className="group p-6 rounded-[2rem] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Users className="w-6 h-6" />
                      </div>
                      <Badge variant="primary" className="px-3 py-1 rounded-lg text-[10px] font-black uppercase shadow-sm">{cls.section}</Badge>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-1">Class {cls.name}</h3>
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs mt-4">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{cls.roomNumber || "TBD"} • {cls.academicYear || "Active"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60">
            <CardTitle className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Neural Pulse
            </CardTitle>
            <div className="space-y-6">
              {stats?.activities?.map((activity, idx) => (
                <div key={idx} className="flex gap-4 group cursor-default">
                  <div className={`w-12 h-12 rounded-2xl ${activity.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                    <Activity className={`w-6 h-6 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 font-bold leading-tight group-hover:text-blue-600 transition-colors">{activity.msg}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                      {format(new Date(activity.time), "MMM dd, HH:mm")}
                    </p>
                  </div>
                </div>
              ))}
              {(!stats?.activities || stats.activities.length === 0) && (
                <div className="text-center py-10 italic text-slate-400 font-medium">No recent logs detected.</div>
              )}
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-20" />
            <div className="relative z-10 text-center">
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4 animate-bounce" />
              <h3 className="text-xl font-black mb-2">Academic Performance</h3>
              <p className="text-indigo-100 text-sm font-medium mb-6">Unit performance metrics are trending upwards this session.</p>
              <button className="w-full py-4 bg-white/10 backdrop-blur-md rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all">
                Generate Unit Report
              </button>
            </div>
          </Card>
        </div>
      </div>

      <TimetableUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </div>
  );
};
