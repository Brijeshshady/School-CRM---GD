import { useState } from "react";
import { 
  Plus, Search, Edit, Trash2, BookOpen, User, Hash, Clock, 
  Award, Layers, X, Loader2, AlertCircle, Filter, CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { SearchableSelect } from "../../components/ui/SearchableSelect";

export const AdminSubjectManagement = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    teacher: "",
    class: "",
    department: "",
    credits: 3,
    weeklyHours: 4,
    semester: "",
    year: "2025-26",
    subjectType: "Core",
    description: "",
    isActive: true
  });

  // Fetch subjects
  const { data: subjects, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const response = await api.get("/subjects");
      return response.data.data;
    }
  });

  // Fetch teachers for assignment
  const { data: teachers } = useQuery({
    queryKey: ["teachers-minimal"],
    queryFn: async () => {
      const response = await api.get("/admin/teachers");
      return response.data.data;
    }
  });

  // Fetch classes for assignment
  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const response = await api.get("/classes");
      return response.data.data;
    }
  });

  // Mutations
  const createSubjectMutation = useMutation({
    mutationFn: async (newSubject) => {
      const response = await api.post("/subjects", newSubject);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["subjects"]);
      queryClient.invalidateQueries(["classes"]);
      toast.success("Subject created and synced successfully");
      handleCloseModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create subject");
    }
  });

  const updateSubjectMutation = useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await api.put(`/subjects/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["subjects"]);
      queryClient.invalidateQueries(["classes"]);
      toast.success("Subject updated and synced everywhere");
      handleCloseModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update subject");
    }
  });

  const deleteSubjectMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/subjects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["subjects"]);
      queryClient.invalidateQueries(["classes"]);
      toast.success("Subject removed from database");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete subject");
    }
  });

  const handleOpenModal = (subject = null) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({
        name: subject.name || "",
        code: subject.code || "",
        teacher: subject.teacher?._id || subject.teacher || "",
        class: subject.class?._id || subject.class || "",
        department: subject.department || "",
        credits: subject.credits || 3,
        weeklyHours: subject.weeklyHours || 4,
        semester: subject.semester || "",
        year: subject.year || "2025-26",
        subjectType: subject.subjectType || "Core",
        description: subject.description || "",
        isActive: subject.isActive !== undefined ? subject.isActive : true
      });
    } else {
      setEditingSubject(null);
      setFormData({
        name: "",
        code: "",
        teacher: "",
        class: "",
        department: "",
        credits: 3,
        weeklyHours: 4,
        semester: "",
        year: "2025-26",
        subjectType: "Core",
        description: "",
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSubject) {
      updateSubjectMutation.mutate({ id: editingSubject._id, ...formData });
    } else {
      createSubjectMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this subject? This will affect all linked classes and timetables.")) {
      deleteSubjectMutation.mutate(id);
    }
  };

  const filteredSubjects = (subjects || []).filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <BookOpen className="w-10 h-10 text-blue-600" />
            Subject Management
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage academic curriculum and faculty course assignments</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-slate-900/10"
        >
          <Plus className="w-5 h-5" />
          Add New Subject
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 md:col-span-3 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, code or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700"
            />
          </div>
          <button className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </Card>
        
        <Card className="p-6 flex items-center justify-between bg-blue-600 text-white">
          <div>
            <p className="text-blue-100 text-xs font-black uppercase tracking-widest">Total Courses</p>
            <h3 className="text-3xl font-black">{subjects?.length || 0}</h3>
          </div>
          <Layers className="w-10 h-10 text-blue-400/50" />
        </Card>
      </div>

      {isLoadingSubjects ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-bold animate-pulse">Synchronizing course catalog...</p>
        </div>
      ) : filteredSubjects.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-20 text-center">
          <BookOpen className="w-20 h-20 text-slate-200 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-slate-900">No Subjects Found</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto font-medium">Your academic catalog is currently empty. Start by adding your first core or elective subject.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredSubjects.map((subject) => (
            <div key={subject._id} className="group bg-white rounded-[2rem] border border-slate-200/60 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
              
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                  <Award className="w-7 h-7" />
                </div>
                <Badge variant={subject.isActive ? "success" : "danger"} className="rounded-full px-4 py-1 font-black text-[10px] tracking-widest uppercase">
                  {subject.isActive ? "Active" : "Archived"}
                </Badge>
              </div>

              <div className="mb-6 relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{subject.code || "SUB-XXX"}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{subject.subjectType || "Core"}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{subject.name}</h3>
                <p className="text-slate-500 text-sm font-medium mt-2 line-clamp-2">{subject.description || "No description provided for this academic module."}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-slate-400"><Clock className="w-4 h-4" /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Credits</p>
                    <p className="text-sm font-black text-slate-900">{subject.credits || 0}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-slate-400"><Layers className="w-4 h-4" /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Weekly</p>
                    <p className="text-sm font-black text-slate-900">{subject.weeklyHours || 0} hrs</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-8 relative z-10">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><User className="w-4 h-4" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Faculty Lead</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{subject.teacher?.user?.name || "Unassigned"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600"><Hash className="w-4 h-4" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Linked Class</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{subject.class ? `${subject.class.name}-${subject.class.section}` : "No Class Linked"}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 relative z-10 pt-4 border-t border-slate-50">
                <button 
                  onClick={() => handleOpenModal(subject)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-blue-600 transition-all group/btn shadow-lg shadow-slate-900/5"
                >
                  <Edit className="w-4 h-4" />
                  Manage Module
                </button>
                <button 
                  onClick={() => handleDelete(subject._id)}
                  className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subject Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={handleCloseModal} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{editingSubject ? "Edit Academic Subject" : "Create New Subject"}</h2>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Database Sync Active</p>
                </div>
              </div>
              <button onClick={handleCloseModal} className="p-3 hover:bg-slate-200 rounded-2xl transition-all">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[calc(90vh-160px)] space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Advanced Mathematics"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800 placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject Code</label>
                  <input
                    required
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="e.g. MATH-402"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <SearchableSelect
                    label="Faculty Assignment"
                    options={teachers?.map(t => ({ label: `${t.user?.name} — ${t.department}`, value: t._id })) || []}
                    value={formData.teacher}
                    onChange={(val) => setFormData({...formData, teacher: val})}
                    placeholder="Select Lead Teacher..."
                  />
                </div>
                <div className="space-y-2">
                  <SearchableSelect
                    label="Class Assignment"
                    options={classes?.map(c => ({ label: `${c.name}-${c.section} (${c.academicYear})`, value: c._id })) || []}
                    value={formData.class}
                    onChange={(val) => setFormData({...formData, class: val})}
                    placeholder="Link to Academic Unit..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Credits</label>
                  <input
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData({...formData, credits: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Weekly Hours</label>
                  <input
                    type="number"
                    value={formData.weeklyHours}
                    onChange={(e) => setFormData({...formData, weeklyHours: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject Type</label>
                  <select
                    value={formData.subjectType}
                    onChange={(e) => setFormData({...formData, subjectType: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                  >
                    <option value="Core">Core</option>
                    <option value="Elective">Elective</option>
                    <option value="Practical">Practical</option>
                    <option value="Lab">Lab</option>
                    <option value="Extracurricular">Extracurricular</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Course Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Outline the course objectives and curriculum details..."
                  rows="3"
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800 resize-none"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <p className="text-xs font-bold text-blue-700">Subject changes will instantly reflect across Teacher and Student portals.</p>
              </div>

              <div className="flex gap-4 pt-4 pb-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  disabled={createSubjectMutation.isPending || updateSubjectMutation.isPending}
                  className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {(createSubjectMutation.isPending || updateSubjectMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingSubject ? "Save Subject Updates" : "Create Academic Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
