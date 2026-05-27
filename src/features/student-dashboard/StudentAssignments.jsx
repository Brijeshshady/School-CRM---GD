import { useState } from "react";
import { BookOpen, Send, CheckCircle2, Clock, AlertCircle, Loader2, X, FileText, Link as LinkIcon } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useStudentAssignments } from "./hooks/useStudentData";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AsyncWrapper } from "../../components/ui/AsyncWrapper";
import { toast } from "sonner";
import api from "../../lib/api";

export const StudentAssignments = () => {
  const queryClient = useQueryClient();
  const { data: assignments, isLoading, isError } = useStudentAssignments();
  const [submitModal, setSubmitModal] = useState(null); // assignment object or null
  const [submissionText, setSubmissionText] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");

  // Submit assignment mutation
  const submitMutation = useMutation({
    mutationFn: async ({ assignmentId, payload }) => {
      const { data } = await api.post(`/assignments/${assignmentId}/submit`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-assignments"] });
      toast.success("Assignment submitted successfully!");
      setSubmitModal(null);
      setSubmissionText("");
      setAttachmentUrl("");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to submit assignment");
    },
  });

  // Fetch submission status for the modal assignment
  const { data: mySubmission } = useQuery({
    queryKey: ["my-submission", submitModal?._id],
    queryFn: async () => {
      const { data } = await api.get(`/assignments/${submitModal._id}/my-submission`);
      return data.data;
    },
    enabled: !!submitModal,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!submissionText.trim() && !attachmentUrl.trim()) {
      toast.error("Please provide a response or an attachment link");
      return;
    }
    submitMutation.mutate({
      assignmentId: submitModal._id,
      payload: {
        submissionText: submissionText.trim(),
        attachments: attachmentUrl.trim() ? [attachmentUrl.trim()] : [],
      },
    });
  };

  const getStatusInfo = (assignment, submission) => {
    if (submission?.status === "graded") {
      return {
        label: `Graded: ${submission.score}/${assignment.totalMarks || "—"}`,
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: CheckCircle2,
        iconColor: "text-emerald-600",
      };
    }
    if (submission?.status === "submitted") {
      return {
        label: "Submitted",
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        icon: CheckCircle2,
        iconColor: "text-blue-600",
      };
    }
    const daysLeft = differenceInDays(new Date(assignment.dueDate), new Date());
    if (daysLeft < 0) {
      return {
        label: "Overdue",
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        icon: AlertCircle,
        iconColor: "text-red-600",
      };
    }
    if (daysLeft <= 2) {
      return {
        label: `Due Soon (${daysLeft}d)`,
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: Clock,
        iconColor: "text-amber-600",
      };
    }
    return {
      label: "Pending",
      bg: "bg-slate-50",
      text: "text-slate-700",
      border: "border-slate-200",
      icon: Clock,
      iconColor: "text-slate-500",
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-600/10">
        <h1 className="text-3xl font-black tracking-tight">My Assignments</h1>
        <p className="text-indigo-100 font-medium mt-1">
          Track homework, submit responses, and view grading feedback
        </p>
        {assignments && (
          <div className="flex gap-4 mt-5">
            <div className="bg-white/15 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/20">
              <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest">Total</p>
              <p className="text-xl font-black">{assignments.length}</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/20">
              <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest">Pending</p>
              <p className="text-xl font-black">
                {assignments.filter(a => a.status !== 'graded' && a.status !== 'submitted').length}
              </p>
            </div>
          </div>
        )}
      </div>

      <AsyncWrapper isLoading={isLoading} isError={isError}>
        <div className="grid grid-cols-1 gap-4">
          {assignments?.map((assignment) => {
            const daysLeft = differenceInDays(new Date(assignment.dueDate), new Date());
            const isOverdue = daysLeft < 0 && assignment.status !== 'graded' && assignment.status !== 'submitted';
            const isDueSoon = daysLeft <= 2 && daysLeft >= 0;
            const statusInfo = getStatusInfo(assignment, null);
            const StatusIcon = statusInfo.icon;
            return (
              <div
                key={assignment._id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      assignment.status === "graded" ? "bg-emerald-100" : 
                      assignment.status === "submitted" ? "bg-blue-100" : 
                      isOverdue ? "bg-red-100" : 
                      isDueSoon ? "bg-amber-100" : "bg-slate-100"
                    }`}>
                      <BookOpen className={`w-6 h-6 ${
                        assignment.status === "graded" ? "text-emerald-600" : 
                        assignment.status === "submitted" ? "text-blue-600" : 
                        isOverdue ? "text-red-600" : 
                        isDueSoon ? "text-amber-600" : "text-slate-600"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-1">{assignment.title}</h3>
                      <p className="text-sm text-slate-500 mb-1">{assignment.subject?.name}</p>
                      <p className="text-sm text-slate-600 line-clamp-2">{assignment.description}</p>
                      {assignment.totalMarks && (
                        <p className="text-xs text-slate-400 mt-1 font-semibold">Total Marks: {assignment.totalMarks}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 space-y-2">
                    <p className={`text-sm font-medium ${
                      isOverdue ? "text-red-600" : 
                      isDueSoon ? "text-amber-600" : "text-slate-500"
                    }`}>
                      {isOverdue ? "Overdue" : `Due ${format(new Date(assignment.dueDate), "MMM dd, yyyy")}`}
                    </p>
                    <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-bold ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border} border`}>
                      <StatusIcon className={`w-3.5 h-3.5 ${statusInfo.iconColor}`} />
                      {assignment.status === "graded" ? `Grade: ${assignment.grade || 'A'}` : (assignment.status || 'Pending').charAt(0).toUpperCase() + (assignment.status || 'Pending').slice(1)}
                    </span>
                    {/* Submit Button */}
                    {assignment.status !== 'graded' && (
                      <button
                        onClick={() => {
                          setSubmitModal(assignment);
                          setSubmissionText("");
                          setAttachmentUrl("");
                        }}
                        className="mt-2 flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-indigo-600/20 ml-auto"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {assignment.status === 'submitted' ? 'Re-submit' : 'Submit'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {(!assignments || assignments.length === 0) && (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-500">No assignments found for your class.</p>
              <p className="text-xs text-slate-400 mt-1">Check back when your teachers publish new homework.</p>
            </div>
          )}
        </div>
      </AsyncWrapper>

      {/* Submit Assignment Modal */}
      {submitModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <Send className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Submit Assignment</h2>
                  <p className="text-xs text-slate-500 font-semibold">{submitModal.title}</p>
                </div>
              </div>
              <button
                onClick={() => setSubmitModal(null)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Existing Submission Info */}
            {mySubmission && (
              <div className="mx-6 mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  You've already submitted on {format(new Date(mySubmission.submittedAt), "MMM dd, yyyy 'at' hh:mm a")}
                </p>
                {mySubmission.status === 'graded' && (
                  <p className="text-xs text-blue-600 mt-1 font-semibold">
                    Score: {mySubmission.score}/{submitModal.totalMarks || '—'} — {mySubmission.feedback || 'No feedback'}
                  </p>
                )}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Your Response</label>
                <textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  rows={5}
                  placeholder="Type your homework answer or description here..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5" />
                  Attachment URL (Optional)
                </label>
                <input
                  type="url"
                  value={attachmentUrl}
                  onChange={(e) => setAttachmentUrl(e.target.value)}
                  placeholder="https://docs.google.com/your-file..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitModal(null)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/25 disabled:opacity-50"
                >
                  {submitMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {mySubmission ? "Re-Submit" : "Submit Work"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
