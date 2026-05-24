import { useState } from "react";
import { Search, Plus, Edit, Trash2, UserCheck, UserX, X, Loader2, Link as LinkIcon, UserMinus } from "lucide-react";
import { ParentStudentLinkModal } from "./ParentStudentLinkModal";
import { BulkImportModal } from "./BulkImportModal";
import { AvatarUpload } from "../../components/ui/AvatarUpload";
import { useNotifications } from "../../context/NotificationContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import { SearchableSelect } from "../../components/ui/SearchableSelect";
import { Download } from "lucide-react";

export const UserManagement = () => {
  const { showToast } = useNotifications();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("Teacher");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkingUser, setLinkingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "Teacher",
    department: "",
    employeeId: "",
    studentId: "",
    class: "",
    rollNumber: "",
    phoneNumber: ""
  });
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Fetch users from API
  const { data: usersResponse, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get("/admin/users");
      return response.data.data;
    }
  });

  // Fetch classes for dropdown
  const { data: classesData } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const response = await api.get("/classes");
      return response.data.data;
    }
  });

  const classOptions = (classesData || []).map(cls => ({
    label: `${cls.name} (${cls.section})`,
    value: cls._id
  }));

  const users = usersResponse || [];

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: async (newUser) => {
      const response = await api.post("/admin/users", newUser);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      showToast("success", "User Created", "New user has been added successfully.");
      handleCloseModal();
    },
    onError: (error) => {
      showToast("error", "Error", error.response?.data?.message || "Failed to create user.");
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await api.put(`/admin/users/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      showToast("success", "User Updated", "User details have been updated.");
      handleCloseModal();
    },
    onError: (error) => {
      showToast("error", "Error", error.response?.data?.message || "Failed to update user.");
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/admin/users/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      showToast("success", "User Deleted", "User has been removed from the system.");
    },
    onError: (error) => {
      showToast("error", "Error", error.response?.data?.message || "Failed to delete user.");
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }) => {
      const response = await api.put(`/admin/users/${id}`, { isActive });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      showToast("info", "Status Updated", "User status changed successfully.");
    }
  });

  const filteredUsers = users.filter(
    (user) => 
      user.role === activeTab &&
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenModal = (user) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: "", // Don't show existing password
        phone: user.phone || "",
        role: user.role,
        subject: user.subject,
        class: user.class,
        rollNumber: user.rollNumber,
        employeeId: user.employeeId,
        department: user.department,
        phoneNumber: user.phoneNumber || ""
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: activeTab,
        department: "",
        employeeId: "",
        studentId: "",
        class: "",
        rollNumber: "",
        phoneNumber: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      updateUserMutation.mutate({ id: editingUser._id, ...formData });
    } else {
      createUserMutation.mutate(formData);
    }
  };

  const handleDelete = (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleToggleStatus = (user) => {
    toggleStatusMutation.mutate({ id: user._id, isActive: !user.isActive });
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin w-8 h-8 text-indigo-600" /></div>;

  return <div className="min-h-screen bg-slate-50">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            User Management
          </h2>
          <p className="text-slate-500 font-medium">Add and manage school accounts</p>
        </div>
      </div>

      <div className="p-8">
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 mb-8 overflow-hidden">
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            {["Teacher", "Student", "Staff", "Parent"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-5 font-black text-xs uppercase tracking-widest transition-all relative ${activeTab === tab ? "text-indigo-600 bg-white" : "text-slate-400 hover:text-slate-600 hover:bg-white/50"}`}
              >
                {tab}s <span className="ml-2 px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px]">{users.filter(u => u.role === tab).length}</span>
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600" />}
              </button>
            ))}
          </div>

          <div className="p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 w-full relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors w-5 h-5" />
              <input
                type="text"
                placeholder={`Search ${activeTab.toLowerCase()} records...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all font-bold text-slate-900 placeholder:text-slate-300"
              />
            </div>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="w-full md:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest shadow-sm"
            >
              <Download className="w-5 h-5 text-indigo-600" />
              Bulk Import
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="w-full md:w-auto px-8 py-4 bg-slate-950 text-white rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-950/20"
            >
              <Plus className="w-5 h-5" />
              Add {activeTab}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((user) => <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative group">
                          <img
                            src={user.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${api.defaults.baseURL}${user.avatar}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                            alt={user.name}
                            className="w-12 h-12 rounded-2xl shadow-sm object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-[8px] text-white font-black uppercase">LIVE</span>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{user.name}</div>
                          <div className="text-sm text-slate-500">{user.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        {(user.role === "Student" || user.role === "Parent") && (
                          <button
                            onClick={() => {
                              setLinkingUser(user);
                              setIsLinkModalOpen(true);
                            }}
                            className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Manage Links"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenModal(user)}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id, user.name)}
                          className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {editingUser ? `Edit User` : `Add New User`}
                </h2>
                <p className="text-slate-500 font-medium text-xs mt-1">Details for {formData.name || activeTab}</p>
              </div>
              <button onClick={handleCloseModal} className="p-3 hover:bg-slate-100 rounded-2xl transition-all"><X className="w-6 h-6 text-slate-400" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              {editingUser && (
                <div className="flex justify-center mb-8">
                  <AvatarUpload 
                    userId={editingUser._id} 
                    currentAvatar={editingUser.avatar} 
                    name={editingUser.name} 
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="email@school.edu.in"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password {editingUser ? "(leave blank to keep current)" : "*"}</label>
                  <input
                    type="password"
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>

              {activeTab === "Teacher" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department || ""}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="e.g. Science"
                  />
                </div>
              )}

              {activeTab === "Student" && (
                <>
                  <div>
                    <SearchableSelect
                      label="Class Allocation"
                      options={classOptions}
                      value={formData.class}
                      onChange={(val) => setFormData({ ...formData, class: val })}
                      placeholder="Assign to academic unit..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Roll Number</label>
                    <input
                      type="text"
                      value={formData.rollNumber || ""}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg">Cancel</button>
                <button
                  type="submit"
                  disabled={createUserMutation.isPending || updateUserMutation.isPending}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {(createUserMutation.isPending || updateUserMutation.isPending) ? <Loader2 className="animate-spin w-4 h-4" /> : (editingUser ? "Update" : "Add")} {activeTab}
                </button>
              </div>
            </form>
          </div>
        </div>}
      {isImportModalOpen && (
        <BulkImportModal 
          isOpen={isImportModalOpen} 
          onClose={() => setIsImportModalOpen(false)} 
        />
      )}
      {isLinkModalOpen && (
        <ParentStudentLinkModal 
          user={linkingUser} 
          onClose={() => setIsLinkModalOpen(false)} 
        />
      )}
    </div>;
};
