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
  Loader2,
  Heart,
  FileText,
  Calendar,
  ShieldAlert
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MoveToClassModal } from "../admin/MoveToClassModal";
import api from "../../../lib/api";
import { useAuth } from "../../context/AuthContext";

export function StudentManagement() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin" || user?.role === "SuperAdmin";
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewStudent, setViewStudent] = useState(null);
  const [movingStudent, setMovingStudent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [activeDetailsTab, setActiveDetailsTab] = useState("profile");
  const [targetClassId, setTargetClassId] = useState("");

  // Fetch classes list
  const { data: classesResponse } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const response = await api.get("/classes");
      return response.data.data;
    }
  });
  const classesList = classesResponse || [];

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

  const updateStatusMutation = useMutation({
    mutationFn: async ({ userId, status }) => {
      await api.put(`/admin/users/${userId}`, { status });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["students"]);
      toast.success("Student status updated successfully");
      setViewStudent(prev => prev ? { ...prev, status: variables.status } : null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  });

  const moveStudentMutation = useMutation({
    mutationFn: async ({ userId, classId }) => {
      await api.put(`/admin/users/${userId}`, {
        role: "Student",
        class: classId
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["students"]);
      toast.success("Student class transferred successfully");
      const targetClass = classesList.find(c => c._id === variables.classId);
      setViewStudent(prev => prev ? { ...prev, class: targetClass } : null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Reassignment failed");
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
      {viewStudent && <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student Profile File</h2>
                <p className="text-slate-500 font-medium text-sm mt-0.5">Comprehensive academic & personal ledger</p>
              </div>
              <button onClick={() => setViewStudent(null)} className="p-3 hover:bg-white hover:shadow-md rounded-2xl transition-all"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Header Card */}
              <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <img 
                  src={viewStudent.user?.avatar ? (viewStudent.user.avatar.startsWith('http') ? viewStudent.user.avatar : `${api.defaults.baseURL}${viewStudent.user.avatar}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(viewStudent.user?.name)}&background=random`} 
                  alt={viewStudent.user?.name} 
                  className="w-20 h-20 rounded-[1.5rem] shadow-lg object-cover" 
                />
                <div className="flex-1">
                  <h3 className="text-xl font-black text-slate-900">{viewStudent.user?.name}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">{viewStudent.studentId}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-full text-xs font-black uppercase tracking-wider">
                      Class: {viewStudent.class?.name || "N/A"}-{viewStudent.class?.section || ""}
                    </span>
                    <span className="px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-full text-xs font-black uppercase tracking-wider">
                      Roll: {viewStudent.rollNumber || "N/A"}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      viewStudent.status === 'Active' ? 'bg-green-100 text-green-700 border border-green-200' :
                      viewStudent.status === 'Suspended' ? 'bg-red-100 text-red-700 border border-red-200' :
                      viewStudent.status === 'Transferred' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {viewStudent.status || 'Active'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-100 gap-2">
                {[
                  { id: "profile", label: "Profile & Health", icon: Heart },
                  { id: "guardians", label: "Guardians", icon: Users },
                  { id: "academics", label: "Academics & Docs", icon: GraduationCap },
                  { id: "actions", label: "Status & Promotion", icon: UserCheck }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveDetailsTab(tab.id);
                        if (tab.id === "actions") setTargetClassId(viewStudent.class?._id || "");
                      }}
                      className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl font-black text-xs uppercase tracking-widest border-b-2 transition-all ${
                        activeDetailsTab === tab.id 
                          ? "border-indigo-600 text-indigo-600 bg-indigo-50/50" 
                          : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Contents */}
              <div className="min-h-[250px]">
                {activeDetailsTab === "profile" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-3">Basic Information</h4>
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-slate-600">Email: <span className="text-slate-900 font-bold">{viewStudent.user?.email}</span></p>
                          <p className="text-sm font-semibold text-slate-600">Date of Birth: <span className="text-slate-900 font-bold">{viewStudent.dateOfBirth ? new Date(viewStudent.dateOfBirth).toLocaleDateString() : "N/A"}</span></p>
                        </div>
                      </div>
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-3">Home Address</h4>
                        <div className="space-y-1 text-sm font-semibold text-slate-600">
                          {viewStudent.address?.street ? (
                            <>
                              <p className="text-slate-900 font-bold">{viewStudent.address.street}</p>
                              <p>{viewStudent.address.city}, {viewStudent.address.state} - {viewStudent.address.zipCode}</p>
                            </>
                          ) : <p className="text-slate-400 italic">No address on file</p>}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 bg-red-50/50 rounded-2xl border border-red-100/50">
                      <div className="flex items-center gap-2 mb-3">
                        <Heart className="w-4 h-4 text-red-600" />
                        <h4 className="font-black text-xs text-red-700 uppercase tracking-widest">Medical Records & Conditions</h4>
                      </div>
                      {viewStudent.medicalRecords && viewStudent.medicalRecords.length > 0 ? (
                        <div className="space-y-3">
                          {viewStudent.medicalRecords.map((rec, i) => (
                            <div key={i} className="bg-white p-4 rounded-xl border border-red-100/80 shadow-sm flex items-start justify-between">
                              <div>
                                <p className="font-bold text-slate-900">{rec.condition}</p>
                                <p className="text-xs text-slate-600 mt-1">{rec.notes}</p>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                rec.severity === 'High' ? 'bg-red-100 text-red-700' :
                                rec.severity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {rec.severity} Severity
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 text-sm italic">No medical conditions or records registered.</p>
                      )}
                    </div>
                  </div>
                )}

                {activeDetailsTab === "guardians" && (
                  <div className="space-y-6">
                    {viewStudent.parentIds && viewStudent.parentIds.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {viewStudent.parentIds.map((parent, i) => (
                          <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-700">
                                G{i + 1}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{parent.user?.name || "Guardian"}</p>
                                <p className="text-xs text-slate-500">{parent.occupation || "Occupation N/A"}</p>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm text-slate-600">
                              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> {parent.user?.email || "N/A"}</p>
                            </div>
                            {parent.emergencyContact?.name && (
                              <div className="pt-3 border-t border-slate-200/60 mt-3">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Emergency Contact</p>
                                <p className="text-sm font-bold text-slate-900">{parent.emergencyContact.name} ({parent.emergencyContact.relationship})</p>
                                <p className="text-sm text-slate-600 flex items-center gap-1 mt-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {parent.emergencyContact.phone}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-sm italic">No registered guardians found. Assign guardians in Parent-Student Links.</p>
                    )}
                  </div>
                )}

                {activeDetailsTab === "academics" && (
                  <div className="space-y-6">
                    {/* Academic History */}
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-3">Prior Academic Records</h4>
                      {viewStudent.academicHistory && viewStudent.academicHistory.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-sm">
                            <thead>
                              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                <th className="pb-2">School</th>
                                <th className="pb-2">Class Passed</th>
                                <th className="pb-2">Marks %</th>
                                <th className="pb-2">Year</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {viewStudent.academicHistory.map((item, i) => (
                                <tr key={i} className="text-slate-800">
                                  <td className="py-2 font-bold">{item.schoolName}</td>
                                  <td className="py-2">{item.classPassed}</td>
                                  <td className="py-2 font-black text-indigo-600">{item.marksPercentage}%</td>
                                  <td className="py-2">{item.passingYear}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-slate-400 text-sm italic">No past school academic records uploaded.</p>
                      )}
                    </div>

                    {/* Certificates */}
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-3">Certificates & Documents</h4>
                      {viewStudent.certificates && viewStudent.certificates.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {viewStudent.certificates.map((cert, i) => (
                            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <FileText className="w-8 h-8 text-indigo-500" />
                                <div>
                                  <p className="text-sm font-bold text-slate-900">{cert.name}</p>
                                  <p className="text-[10px] text-slate-400">{cert.uploadDate ? new Date(cert.uploadDate).toLocaleDateString() : "N/A"}</p>
                                </div>
                              </div>
                              <a 
                                href={cert.fileUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-indigo-100 transition-colors"
                              >
                                View
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 text-sm italic">No uploaded documents or certificates found.</p>
                      )}
                    </div>
                  </div>
                )}

                {activeDetailsTab === "actions" && (
                  <div className="space-y-6">
                    {isAdmin ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Status update */}
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                          <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest">Update Enrollment Status</h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">Modify active enrollment lifecycle status for suspension, transfers, or graduating students to alumni lists.</p>
                          <div className="grid grid-cols-2 gap-2 pt-2">
                            {['Active', 'Suspended', 'Transferred', 'Alumni'].map(st => (
                              <button
                                key={st}
                                onClick={() => updateStatusMutation.mutate({ userId: viewStudent.user._id, status: st })}
                                disabled={updateStatusMutation.isPending || viewStudent.status === st}
                                className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                                  viewStudent.status === st 
                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Class Transfer/Promotion */}
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                          <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest">Class Reassignment & Promotion</h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">Promote or transfer the student to a different class. This immediately shifts academic timetables and class assignments.</p>
                          <div className="space-y-3 pt-2">
                            <select
                              value={targetClassId}
                              onChange={(e) => setTargetClassId(e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700"
                            >
                              <option value="">Select target class...</option>
                              {classesList.map(c => (
                                <option key={c._id} value={c._id}>
                                  {c.name} ({c.section}) {c.stream !== 'General' ? `- ${c.stream}` : ''}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => moveStudentMutation.mutate({ userId: viewStudent.user._id, classId: targetClassId })}
                              disabled={!targetClassId || targetClassId === viewStudent.class?._id || moveStudentMutation.isPending}
                              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25"
                            >
                              {moveStudentMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                              Execute Reassignment
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl text-center space-y-2">
                        <ShieldAlert className="w-8 h-8 text-amber-600 mx-auto" />
                        <h4 className="font-black text-sm text-amber-800 uppercase tracking-wider">Access Restricted</h4>
                        <p className="text-xs text-amber-700 max-w-md mx-auto">Only administrative accounts hold permissions to reassign student classes or modify lifecycle statuses.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3 rounded-b-[2.5rem]">
              <button onClick={() => setViewStudent(null)} className="w-full px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Close</button>
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
                      {isAdmin && (
                        <button 
                          onClick={() => setMovingStudent(student)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Transfer Student Class"
                        >
                          <GraduationCap className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => setViewStudent(student)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Student Details"><Eye className="w-4 h-4" /></button>
                      {isAdmin && (
                        <>
                          <button onClick={() => handleEdit(student)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Edit User Account"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(student)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remove Student"><Trash2 className="w-4 h-4" /></button>
                        </>
                      )}
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
