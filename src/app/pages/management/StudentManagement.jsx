import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  UserCheck,
  UserX,
  TrendingUp,
  Award,
  X,
  Users,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MoveToClassModal } from "../admin/MoveToClassModal";
import api from "../../../lib/api";

export function StudentManagement() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewStudent, setViewStudent] = useState(null);
  const [movingStudent, setMovingStudent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch students from API
  const { data: studentsResponse, isLoading } = useQuery({
    queryKey: ["students", selectedClass],
    queryFn: async () => {
      const params = {};
      if (selectedClass !== "all") params.class = selectedClass;
      const response = await api.get("/students", { params });
      return response.data.data;
    }
  });

  const students = studentsResponse || [];

  // Mutations
  const deleteStudentMutation = useMutation({
    mutationFn: async (userId) => {
      // We delete the user which deletes the student profile (handled in adminController)
      await api.delete(`/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]);
      toast.success("Student removed successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete student");
    }
  });

  const filteredStudents = students.filter((student) => {
    const name = student.user?.name || "";
    const email = student.user?.email || "";
    const studentId = student.studentId || "";
    
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          studentId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || (selectedStatus === "active" ? student.isActive : !student.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    toast.success("Student data exported successfully!");
  };

  const handleDelete = (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.user.name}?`)) {
      deleteStudentMutation.mutate(student.user._id);
    }
  };

  const handleEdit = (student) => {
    toast.info(`Edit functionality is available in User Management for ${student.user.name}`);
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>;

  return <div className="p-8 space-y-6">
      {viewStudent && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">Student Details</h2>
              <button onClick={() => setViewStudent(null)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(viewStudent.user?.name)}&background=random`} alt={viewStudent.user?.name} className="w-20 h-20 rounded-full" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{viewStudent.user?.name}</h3>
                  <p className="text-slate-600">{viewStudent.studentId}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${viewStudent.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {viewStudent.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">Class</p>
                  <p className="text-lg font-semibold text-slate-900">{viewStudent.class?.name || "N/A"}-{viewStudent.class?.section || ""}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">Roll Number</p>
                  <p className="text-lg font-semibold text-slate-900">{viewStudent.rollNumber || "N/A"}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">{viewStudent.user?.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setViewStudent(null)} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium">Close</button>
              </div>
            </div>
          </div>
        </div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Student Management</h1>
          <p className="text-slate-500 font-medium mt-1">Holistic tracking of student enrollment and class assignments</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button onClick={handleExport} className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Student</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Class</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.map((student) => <tr key={student._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={student.user?.avatar ? (student.user.avatar.startsWith('http') ? student.user.avatar : `${api.defaults.baseURL}${student.user.avatar}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(student.user?.name)}&background=random`} 
                        alt={student.user?.name} 
                        className="w-12 h-12 rounded-2xl shadow-sm object-cover" 
                      />
                      <div>
                        <p className="font-black text-slate-900 leading-tight">{student.user?.name}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{student.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-900">{student.class?.name || "N/A"}-{student.class?.section || ""}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{student.user?.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${student.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {student.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setMovingStudent(student)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Transfer Student Class"
                      >
                        <GraduationCap className="w-4 h-4" />
                      </button>
                      <button onClick={() => setViewStudent(student)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleEdit(student)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(student)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-200">
          <p className="text-sm text-slate-600">Showing <span className="font-medium">{filteredStudents.length}</span> students from database</p>
        </div>
      </div>
      {movingStudent && (
        <MoveToClassModal 
          isOpen={!!movingStudent}
          onClose={() => setMovingStudent(null)}
          student={movingStudent}
        />
      )}
    </div>;
}
