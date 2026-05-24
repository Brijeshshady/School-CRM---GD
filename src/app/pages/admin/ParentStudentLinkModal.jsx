import { useState } from "react";
import { Search, X, Link as LinkIcon, UserMinus, Loader2, UserPlus, GraduationCap, Users } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import { useNotifications } from "../../context/NotificationContext";

export const ParentStudentLinkModal = ({ user, onClose }) => {
  const { showToast } = useNotifications();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const isParent = user.role === "Parent";
  const targetRole = isParent ? "Student" : "Parent";

  // Fetch all users to search from
  const { data: allUsers = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get("/admin/users");
      return response.data.data;
    }
  });

  const filteredTargets = allUsers.filter(u => 
    u.role === targetRole && 
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const linkMutation = useMutation({
    mutationFn: async (targetId) => {
      const payload = isParent 
        ? { parentId: user.profileId, studentId: targetId }
        : { parentId: targetId, studentId: user.profileId };
      return api.post("/admin/link-parent-student", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["linkedStudents"]);
      showToast("success", "Linked Successfully", "Relationship has been established.");
    },
    onError: (error) => {
      showToast("error", "Error", error.response?.data?.message || "Failed to link users.");
    }
  });

  const unlinkMutation = useMutation({
    mutationFn: async (targetId) => {
      const payload = isParent 
        ? { parentId: user.profileId, studentId: targetId }
        : { parentId: targetId, studentId: user.profileId };
      return api.delete("/admin/unlink-parent-student", { data: payload });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["linkedStudents"]);
      showToast("info", "Unlinked Successfully", "Relationship has been removed.");
    },
    onError: (error) => {
      showToast("error", "Error", error.response?.data?.message || "Failed to unlink users.");
    }
  });

  const linkedItems = isParent ? user.linkedStudents : user.linkedParents;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Manage Relationships</h2>
              <p className="text-xs text-slate-500">{user.name} ({user.role})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Current Links */}
          <section>
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              {isParent ? <GraduationCap className="w-4 h-4" /> : <Users className="w-4 h-4" />}
              Currently Linked {targetRole}s
            </h3>
            <div className="grid gap-3">
              {linkedItems && linkedItems.length > 0 ? (
                linkedItems.map(item => (
                  <div key={item._id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.user?.name)}&background=random`} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.user?.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{targetRole}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => unlinkMutation.mutate(item._id)}
                      disabled={unlinkMutation.isPending}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Unlink"
                    >
                      {unlinkMutation.isPending ? <Loader2 className="animate-spin w-4 h-4" /> : <UserMinus className="w-4 h-4" />}
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-2xl">
                  <p className="text-sm text-slate-400">No {targetRole.toLowerCase()}s linked yet.</p>
                </div>
              )}
            </div>
          </section>

          {/* Add New Links */}
          <section>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Link New {targetRole}</h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder={`Search ${targetRole.toLowerCase()}s by name or email...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
              />
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {searchQuery.length > 0 && filteredTargets.map(target => {
                const isAlreadyLinked = linkedItems?.some(li => li._id === target.profileId);
                if (isAlreadyLinked) return null;

                return (
                  <div key={target._id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-3">
                       <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(target.name)}&background=random`} className="w-8 h-8 rounded-full" alt="" />
                       <div>
                         <p className="text-sm font-medium text-slate-900">{target.name}</p>
                         <p className="text-xs text-slate-500">{target.email}</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => linkMutation.mutate(target.profileId)}
                      disabled={linkMutation.isPending}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      {linkMutation.isPending ? <Loader2 className="animate-spin w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    </button>
                  </div>
                );
              })}
              {searchQuery.length > 0 && filteredTargets.length === 0 && (
                <p className="text-center text-slate-400 text-sm py-4">No {targetRole.toLowerCase()}s found.</p>
              )}
              {searchQuery.length === 0 && (
                <p className="text-center text-slate-400 text-xs py-4 italic">Type to search for {targetRole.toLowerCase()}s to link.</p>
              )}
            </div>
          </section>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
