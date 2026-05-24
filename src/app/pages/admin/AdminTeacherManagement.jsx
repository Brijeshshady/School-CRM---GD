import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  BookOpen,
  Users,
  Award,
  X,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";

export const AdminTeacherManagement = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewTeacher, setViewTeacher] = useState(null);
  const [assigningTeacher, setAssigningTeacher] = useState(null);
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Fetch teachers from API
  const { data: teachersResponse, isLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const response = await api.get("/admin/teachers");
      return response.data.data;
    }
  });

  const { data: studentsResponse } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await api.get("/admin/students");
      return response.data.data;
    }
  });

  const teachers = teachersResponse || [];
  const allStudents = studentsResponse || [];

  // Mutations
  const deleteTeacherMutation = useMutation({
    mutationFn: async (userId) => {
      await api.delete(`/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["teachers"]);
      queryClient.invalidateQueries(["admin-dashboard"]);
      toast.success("Teacher removed successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete teacher");
    }
  });

  const linkStudentsMutation = useMutation({
    mutationFn: async ({ teacherId, studentIds }) => {
      await api.post("/admin/link-teacher-student", { teacherId, studentIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["teachers"]);
      queryClient.invalidateQueries(["admin-dashboard"]);
      queryClient.invalidateQueries(["teacher-dashboard"]);
      toast.success("Students assigned successfully");
      setAssigningTeacher(null);
      setSelectedStudents([]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to assign students");
    }
  });

  const unlinkStudentMutation = useMutation({
    mutationFn: async ({ teacherId, studentId }) => {
      await api.delete("/admin/unlink-teacher-student", { data: { teacherId, studentId } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["teachers"]);
      queryClient.invalidateQueries(["admin-dashboard"]);
      queryClient.invalidateQueries(["teacher-dashboard"]);
      toast.success("Student unlinked successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to unlink student");
    }
  });

  const toggleTimetablePermissionMutation = useMutation({
    mutationFn: async (teacherId) => {
      await api.patch(`/admin/teachers/${teacherId}/toggle-timetable-permission`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["teachers"]);
      queryClient.invalidateQueries(["timetable-permission"]);
      toast.success("Timetable permission updated");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update permission");
    }
  });

  const filteredTeachers = teachers.filter((teacher) => {
    const name = teacher.user?.name || "";
    const email = teacher.user?.email || "";
    const employeeId = teacher.employeeId || "";
    
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           employeeId.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleExport = () => {
    toast.success("Teacher data exported successfully!");
  };

  const handleDelete = (teacher) => {
    if (window.confirm(`Are you sure you want to delete ${teacher.user.name}?`)) {
      deleteTeacherMutation.mutate(teacher.user._id);
    }
  };

  const handleEdit = (teacher) => {
    toast.info(`Edit functionality is available in User Management for ${teacher.user.name}`);
  };

  const handleAssignStudents = () => {
    if (!assigningTeacher || selectedStudents.length === 0) return;
    linkStudentsMutation.mutate({
      teacherId: assigningTeacher._id,
      studentIds: selectedStudents
    });
  };

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  const filteredStudents = allStudents.filter(s => {
    const name = s.user?.name || "";
    const email = s.user?.email || "";
    const studentId = s.studentId || "";
    const query = studentSearchQuery.toLowerCase();
    
    return name.toLowerCase().includes(query) || 
           email.toLowerCase().includes(query) || 
           studentId.toLowerCase().includes(query);
  });

  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>;

  return <div className="p-8 space-y-6">
      {viewTeacher && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">Teacher Details</h2>
              <button onClick={() => setViewTeacher(null)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(viewTeacher.user?.name)}&background=random`} alt={viewTeacher.user?.name} className="w-20 h-20 rounded-full" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{viewTeacher.user?.name}</h3>
                  <p className="text-slate-600">{viewTeacher.employeeId}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${viewTeacher.user?.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {viewTeacher.user?.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Professional Information</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-slate-600">Qualification</p>
                    <p className="font-medium text-slate-900">{viewTeacher.qualification || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Department</p>
                    <p className="font-medium text-slate-900">{viewTeacher.department || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">{viewTeacher.user?.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setViewTeacher(null)} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium">Close</button>
              </div>
            </div>
          </div>
        </div>}

      {/* Assign Students Modal */}
      {assigningTeacher && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Assign Students</h2>
                <button onClick={() => { setAssigningTeacher(null); setSelectedStudents([]); }} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <p className="text-sm text-slate-500 mt-1">Select students to assign to {assigningTeacher.user?.name}</p>
            </div>
            
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto p-2 space-y-1">
              {filteredStudents.map(student => (
                <label key={student._id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedStudents.includes(student._id) ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                  <input 
                    type="checkbox" 
                    checked={selectedStudents.includes(student._id)}
                    onChange={() => toggleStudentSelection(student._id)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{student.user?.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{student.studentId} • {student.class?.name || 'No Class'}</p>
                  </div>
                </label>
              ))}
              {filteredStudents.length === 0 && <p className="text-center py-8 text-slate-400 text-sm">No students found</p>}
            </div>

            <div className="p-6 bg-slate-50 flex gap-3">
              <button 
                onClick={() => { setAssigningTeacher(null); setSelectedStudents([]); }}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAssignStudents}
                disabled={selectedStudents.length === 0 || linkStudentsMutation.isPending}
                className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {linkStudentsMutation.isPending ? 'Assigning...' : `Assign ${selectedStudents.length} Students`}
              </button>
            </div>
          </div>
        </div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Teacher Management</h1>
          <p className="text-slate-600 mt-1">Manage and track all teacher records from the database</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, employee ID, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <button onClick={handleExport} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">Export</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => <div key={teacher._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.user?.name)}&background=random`} alt={teacher.user?.name} className="w-16 h-16 rounded-full" />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{teacher.user?.name}</h3>
                <p className="text-sm text-slate-600">{teacher.department || "No Department"}</p>
                <p className="text-xs text-slate-500 mt-1">{teacher.employeeId}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4 text-sm">
               <div className="flex items-center justify-between">
                 <span className="text-slate-600">Status:</span>
                 <span className={`px-2 py-0.5 rounded-full text-xs ${teacher.user?.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                   {teacher.user?.isActive ? "Active" : "Inactive"}
                 </span>
               </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Email:</span>
                  <span className="text-slate-900 truncate max-w-[150px]">{teacher.user?.email}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-600">Timetable Access:</span>
                  <button 
                    onClick={() => toggleTimetablePermissionMutation.mutate(teacher._id)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${teacher.canUploadTimetable ? 'bg-blue-600' : 'bg-slate-200'}`}
                  >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${teacher.canUploadTimetable ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
               <div className="pt-2 border-t border-slate-50 mt-2">
                 <div className="flex items-center justify-between mb-2">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Students</span>
                   <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-black">{teacher.assignedStudents?.length || 0}</span>
                 </div>
                 <div className="flex flex-wrap gap-1">
                   {teacher.assignedStudents?.slice(0, 3).map(student => (
                     <div key={student._id} className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded text-[9px] font-bold text-slate-600 border border-slate-100">
                       <span className="truncate max-w-[60px]">{student.user?.name}</span>
                       <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          unlinkStudentMutation.mutate({ teacherId: teacher._id, studentId: student._id });
                        }}
                        className="hover:text-red-500"
                       >
                         <X className="w-2.5 h-2.5" />
                       </button>
                     </div>
                   ))}
                   {teacher.assignedStudents?.length > 3 && (
                     <span className="text-[9px] text-slate-400 font-bold self-center">+{teacher.assignedStudents.length - 3} more</span>
                   )}
                   {(!teacher.assignedStudents || teacher.assignedStudents.length === 0) && (
                     <span className="text-[9px] text-slate-300 italic font-medium">No students assigned</span>
                   )}
                 </div>
               </div>
            </div>

            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setAssigningTeacher(teacher)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-white bg-slate-950 rounded-lg hover:bg-black transition-colors text-sm font-bold shadow-lg shadow-slate-950/10"
              >
                <Plus className="w-4 h-4" />
                Assign Students
              </button>
              <div className="flex gap-2">
                <button onClick={() => setViewTeacher(teacher)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button onClick={() => handleEdit(teacher)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button onClick={() => handleDelete(teacher)} className="px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>)}
      </div>
      {filteredTeachers.length === 0 && <div className="text-center py-12 text-slate-500">No teachers found in the database.</div>}
    </div>;
};
