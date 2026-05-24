import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Clock, Loader2, X, AlertCircle } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { useTeacherAssignments, useTeacherClasses, useCreateAssignment, useTeacherSubjects } from "./hooks/useTeacherData";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";
import { format } from "date-fns";
import { toast } from "sonner";
import { AsyncWrapper } from "../../components/ui/AsyncWrapper";

export const TeacherAssignments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    class: "",
    subject: "",
    totalMarks: 100,
    dueDate: ""
  });

  const { data: assignments, isLoading: assignmentsLoading, isError: assignmentsError } = useTeacherAssignments();
  const { data: classes } = useTeacherClasses();
  const { data: subjects } = useTeacherSubjects();
  const createAssignment = useCreateAssignment();

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createAssignment.mutateAsync(formData);
      toast.success("Assignment created!");
      setIsModalOpen(false);
      setFormData({ title: "", description: "", class: "", subject: "", totalMarks: 100, dueDate: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create assignment");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Assignments</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          <Plus className="w-5 h-5" />
          Create Assignment
        </button>
      </div>

      <AsyncWrapper isLoading={assignmentsLoading} isError={assignmentsError}>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {assignments?.map((assignment) => {
              const isOverdue = new Date(assignment.dueDate) < new Date() && assignment.status !== 'graded';
              return (
                <div key={assignment._id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">{assignment.title}</h3>
                      <p className="text-sm text-slate-600">
                        {assignment.class?.name}-{assignment.class?.section} • {assignment.subject?.name}
                      </p>
                    </div>
                    <Badge variant={assignment.status === "graded" ? "success" : isOverdue ? "danger" : "primary"}>
                      {assignment.status === "graded" ? "Graded" : isOverdue ? "Overdue" : (assignment.status || 'Active')}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm">
                      <div className={`flex items-center gap-2 ${isOverdue ? 'text-red-600' : 'text-slate-600'}`}>
                        <Clock className="w-4 h-4" />
                        Due: {format(new Date(assignment.dueDate), "MMM dd, yyyy")}
                      </div>
                      <div className="text-slate-600">
                        Marks: <span className="font-semibold text-slate-900">{assignment.totalMarks}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {(!assignments || assignments.length === 0) && (
              <div className="p-12 text-center text-slate-500">
                No assignments found. Click "Create Assignment" to start.
              </div>
            )}
          </div>
        </div>
      </AsyncWrapper>

      {/* Create Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Create New Assignment</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Title</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. Lab Report: Newtonian Laws"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Class</label>
                  <select 
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                    value={formData.class}
                    onChange={e => setFormData({...formData, class: e.target.value})}
                  >
                    <option value="">Select Class</option>
                    {classes?.map(c => <option key={c._id} value={c._id}>{c.name}-{c.section}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</label>
                  <select 
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                  >
                    <option value="">Select Subject</option>
                    {subjects?.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</label>
                  <input 
                    required
                    type="date"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    value={formData.dueDate}
                    onChange={e => setFormData({...formData, dueDate: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Marks</label>
                  <input 
                    required
                    type="number"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    value={formData.totalMarks}
                    onChange={e => setFormData({...formData, totalMarks: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                <textarea 
                  required
                  rows="3"
                  placeholder="Describe the assignment objectives..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={createAssignment.isPending}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {createAssignment.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Assignment
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
