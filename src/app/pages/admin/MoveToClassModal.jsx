import { useState } from "react";
import { X, GraduationCap, ArrowRight, Loader2, BookOpen } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import api from "../../../lib/api";
import { SearchableSelect } from "../../components/ui/SearchableSelect";
import { toast } from "sonner";

export const MoveToClassModal = ({ isOpen, onClose, student }) => {
  const queryClient = useQueryClient();
  const [selectedClassId, setSelectedClassId] = useState(student?.class?._id || "");

  // Fetch all classes
  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const response = await api.get("/classes");
      return response.data.data;
    }
  });

  const moveMutation = useMutation({
    mutationFn: async () => {
      const response = await api.put(`/admin/users/${student.user._id}`, {
        role: "Student",
        class: selectedClassId
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]);
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["admin-dashboard"]);
      toast.success(`${student.user.name} reassigned successfully`);
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Reassignment failed");
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Transfer Student</h2>
            <p className="text-slate-500 font-medium text-sm mt-1">Reassign student to a different class</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white hover:shadow-md rounded-2xl transition-all">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-10 space-y-8">
          <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.user.name)}&background=random`} 
              className="w-16 h-16 rounded-2xl shadow-lg"
              alt="" 
            />
            <div>
              <p className="text-lg font-black text-slate-900">{student.user.name}</p>
              <p className="text-xs text-indigo-600 font-black uppercase tracking-widest mt-1">
                Current: {student.class?.name || "Unassigned"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <SearchableSelect
              label="Select Target Class"
              options={classes?.map(c => ({ label: `${c.name} (${c.section})`, value: c._id })) || []}
              value={selectedClassId}
              onChange={(val) => setSelectedClassId(val)}
              placeholder="Select target class..."
            />
          </div>

          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={() => moveMutation.mutate()}
              disabled={!selectedClassId || moveMutation.isPending}
              className="flex-[2] px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20"
            >
              {moveMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              Transfer Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
