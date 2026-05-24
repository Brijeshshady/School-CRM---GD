import { Users, BookOpen, UserCheck, TrendingUp, Plus, Edit, Eye, Loader2, X, Trash2, GraduationCap, Calendar, MapPin, Hash, Activity } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import { SearchableSelect } from "../../components/ui/SearchableSelect";
import { useState } from "react";
import { Card, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useNavigate } from "react-router-dom";

export const AdminClassManagement = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    section: "", 
    classTeacherId: "",
    roomNumber: "",
    academicYear: new Date().getFullYear().toString(),
    capacity: 40,
    isActive: true
  });

  // Fetch classes from API
  const { data: classesResponse, isLoading: isLoadingClasses, isError: isErrorClasses } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const response = await api.get("/classes");
      return response.data.data;
    }
  });

  // Fetch teachers for selection
  const { data: teachersResponse, isLoading: isLoadingTeachers } = useQuery({
    queryKey: ["teachers-minimal"],
    queryFn: async () => {
      const response = await api.get("/admin/teachers");
      return response.data.data;
    }
  });

  const classes = classesResponse || [];
  const teachers = teachersResponse || [];

  // Mutations
  const createClassMutation = useMutation({
    mutationFn: async (newClass) => {
      const response = await api.post("/admin/classes", newClass);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["classes"]);
      queryClient.invalidateQueries(["admin-dashboard"]);
      queryClient.invalidateQueries(["teacher-classes"]);
      queryClient.invalidateQueries(["teacher-dashboard"]);
      queryClient.invalidateQueries(["students"]);
      toast.success("Class created successfully");
      handleCloseModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create class");
    }
  });

  const updateClassMutation = useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await api.put(`/admin/classes/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["classes"]);
      queryClient.invalidateQueries(["admin-dashboard"]);
      queryClient.invalidateQueries(["teacher-classes"]);
      queryClient.invalidateQueries(["teacher-dashboard"]);
      queryClient.invalidateQueries(["student-dashboard"]);
      toast.success("Class updated successfully");
      handleCloseModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update class");
    }
  });

  const deleteClassMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admin/classes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["classes"]);
      queryClient.invalidateQueries(["admin-dashboard"]);
      queryClient.invalidateQueries(["teacher-classes"]);
      toast.success("Class deleted successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete class");
    }
  });

  const handleOpenModal = (cls = null) => {
    if (cls) {
      setEditingClass(cls);
      setFormData({ 
        name: cls.name || "", 
        section: cls.section || "", 
        classTeacherId: cls.classTeacher?._id || cls.classTeacher || "",
        roomNumber: cls.roomNumber || "",
        academicYear: cls.academicYear || new Date().getFullYear().toString(),
        capacity: cls.capacity || 40,
        isActive: cls.isActive !== undefined ? cls.isActive : true
      });
    } else {
      setEditingClass(null);
      setFormData({ 
        name: "", 
        section: "", 
        classTeacherId: "",
        roomNumber: "",
        academicYear: new Date().getFullYear().toString(),
        capacity: 40,
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingClass) {
      updateClassMutation.mutate({ id: editingClass._id, ...formData });
    } else {
      createClassMutation.mutate(formData);
    }
  };

  if (isLoadingClasses) return <div className="flex items-center justify-center min-h-screen bg-slate-50"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>;

  return (
    <div className="p-8 space-y-8 min-h-screen bg-slate-50/50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Academic Units</h1>
          <p className="text-slate-500 mt-1 font-medium text-lg">Manage school classes, assignments and occupancy</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-950/20 font-black text-sm">
          <Plus className="w-5 h-5" />
          Initialize New Class
        </button>
      </div>

      {isErrorClasses && (
        <div className="bg-red-50 border-2 border-red-100 text-red-600 p-6 rounded-2xl flex items-center gap-4 font-bold">
          <Activity className="w-6 h-6" />
          Neural Link Interrupted: Failed to synchronize with class database.
        </div>
      )}

      {classes.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-24 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <BookOpen className="w-12 h-12 text-slate-300" />
          </div>
          <h3 className="text-3xl font-black text-slate-900">Void Academic Space</h3>
          <p className="text-slate-500 mt-3 max-w-sm mx-auto font-medium text-lg">Your institution has no defined academic units. Create the first class to begin enrollment.</p>
          <button onClick={() => handleOpenModal()} className="mt-10 px-10 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30">
            Establish First Class
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes.map((cls) => (
            <div key={cls._id} className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
              
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-600/30 group-hover:rotate-6 transition-transform">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  <button onClick={() => handleOpenModal(cls)} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => { if(window.confirm("Permanent deletion of this academic unit?")) deleteClassMutation.mutate(cls._id); }} className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mb-8 relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-3xl font-black text-slate-900 leading-tight">Class {cls.name}</h3>
                  <Badge variant="primary" className="px-4 py-1.5 rounded-xl font-black text-xs uppercase tracking-tighter shadow-sm">{cls.section}</Badge>
                </div>
                <div className="flex items-center gap-3 text-slate-500 font-bold">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200/50">
                    <UserCheck className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest leading-none mb-1">Assigned Custodian</span>
                    <span className="text-slate-800 text-sm">{cls.classTeacher?.user?.name || cls.classTeacher?.name || "Unassigned"}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                <div className="bg-slate-50/50 rounded-3xl p-4 border border-slate-100/50 backdrop-blur-sm group-hover:bg-white transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                  </div>
                  <p className="text-xl font-black text-slate-900">{cls.roomNumber || "N/A"}</p>
                </div>
                <div className="bg-slate-50/50 rounded-3xl p-4 border border-slate-100/50 backdrop-blur-sm group-hover:bg-white transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacity</p>
                  </div>
                  <p className="text-xl font-black text-slate-900">{cls.capacity || "40"}</p>
                </div>
              </div>

              <button 
                onClick={() => navigate('/admin/dashboard/timetable-approvals')}
                className="w-full py-4 bg-slate-950 text-white rounded-[1.5rem] text-sm font-black hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-950/10 group/btn relative z-10"
              >
                <Calendar className="w-5 h-5 text-blue-400 group-hover/btn:text-white transition-colors" />
                Academic Schedule
              </button>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-in fade-in duration-500">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in duration-300 border border-white/20">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <div>
                <h2 className="text-3xl font-black text-slate-900">{editingClass ? "Reconfigure Unit" : "Initialize Unit"}</h2>
                <p className="text-slate-500 mt-2 font-bold text-lg">Setting academic parameters for {formData.name || "new unit"}</p>
              </div>
              <button onClick={handleCloseModal} className="w-14 h-14 flex items-center justify-center hover:bg-slate-200 rounded-[1.5rem] transition-all group">
                <X className="w-8 h-8 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Class Identifier</label>
                  <div className="relative">
                    <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      required 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                      className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-14 pr-6 outline-none focus:bg-white focus:border-blue-500 transition-all font-black text-slate-900 placeholder:text-slate-300" 
                      placeholder="e.g. 10" 
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Section</label>
                  <div className="relative">
                    <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      required 
                      value={formData.section} 
                      onChange={e => setFormData({...formData, section: e.target.value})} 
                      className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-14 pr-6 outline-none focus:bg-white focus:border-blue-500 transition-all font-black text-slate-900 placeholder:text-slate-300" 
                      placeholder="e.g. A" 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Assigned Room</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      value={formData.roomNumber} 
                      onChange={e => setFormData({...formData, roomNumber: e.target.value})} 
                      className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-14 pr-6 outline-none focus:bg-white focus:border-blue-500 transition-all font-black text-slate-900 placeholder:text-slate-300" 
                      placeholder="Room 301" 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Academic Year</label>
                  <div className="relative">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      value={formData.academicYear} 
                      onChange={e => setFormData({...formData, academicYear: e.target.value})} 
                      className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-14 pr-6 outline-none focus:bg-white focus:border-blue-500 transition-all font-black text-slate-900 placeholder:text-slate-300" 
                      placeholder="2025-26" 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Max Occupancy</label>
                  <div className="relative">
                    <Users className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="number" 
                      value={formData.capacity} 
                      onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} 
                      className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-14 pr-6 outline-none focus:bg-white focus:border-blue-500 transition-all font-black text-slate-900 placeholder:text-slate-300" 
                      placeholder="40" 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <SearchableSelect
                    label="Lead Custodian"
                    options={teachers.map(t => ({ 
                      label: `${t.user?.name || "Unknown"} — ${t.department || "General"}`, 
                      value: t._id 
                    }))}
                    value={formData.classTeacherId}
                    onChange={(val) => setFormData({...formData, classTeacherId: val})}
                    placeholder="Assign Faculty Member..."
                  />
                </div>
              </div>

              <div className="pt-8 flex gap-6">
                <button 
                  type="button" 
                  onClick={handleCloseModal} 
                  className="flex-1 px-8 py-5 rounded-2xl text-sm font-black text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit" 
                  disabled={createClassMutation.isPending || updateClassMutation.isPending} 
                  className="flex-[2] bg-slate-950 text-white p-5 rounded-[1.5rem] hover:bg-blue-600 font-black text-sm shadow-2xl shadow-slate-950/20 disabled:opacity-50 transition-all flex items-center justify-center gap-4"
                >
                  {(createClassMutation.isPending || updateClassMutation.isPending) ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-6 h-6" />
                      {editingClass ? "Commit Reconfiguration" : "Establish Unit"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
