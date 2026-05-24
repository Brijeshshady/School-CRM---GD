import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, AlertCircle, Clock, CheckCircle, XCircle, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../../lib/api";

export default function LeaveRequestForm() {
  const queryClient = useQueryClient();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  // Fetch teacher's own leave requests
  const { data: leavesResponse, isLoading } = useQuery({
    queryKey: ["leaves"],
    queryFn: async () => {
      const response = await api.get("/leaves");
      return response.data.data;
    }
  });

  const leaves = leavesResponse || [];

  // Apply leave mutation
  const applyLeaveMutation = useMutation({
    mutationFn: async (leaveData) => {
      const response = await api.post("/leaves", leaveData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["leaves"]);
      toast.success("Leave application submitted successfully!");
      setStartDate("");
      setEndDate("");
      setReason("");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to submit leave application");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!startDate || !endDate || !reason) {
      toast.error("All fields are required");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      toast.error("Start date cannot be in the past");
      return;
    }

    if (end < start) {
      toast.error("End date must be on or after start date");
      return;
    }

    applyLeaveMutation.mutate({
      startDate,
      endDate,
      reason
    });
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Leave Applications</h1>
        <p className="text-slate-500 font-medium mt-1">Submit new leave requests and track approval statuses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Application Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">Apply for Leave</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Submit a request to school administration</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Reason / Description</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="Brief description of the leave reason..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={applyLeaveMutation.isPending}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
            >
              {applyLeaveMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Calendar className="w-4 h-4" />
              )}
              Submit Application
            </button>
          </form>
        </div>

        {/* Request History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-4">Request History</h2>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            ) : leaves.length > 0 ? (
              <div className="space-y-4">
                {leaves.map((leave) => (
                  <div key={leave._id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>
                          {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                        </span>
                        <span className="text-slate-400 font-medium">
                          ({Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1} days)
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 font-semibold">{leave.reason}</p>
                      {leave.rejectionReason && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs font-semibold flex items-start gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>Rejection Reason: {leave.rejectionReason}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-center">
                      {leave.status === "Pending" && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-xs font-black uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5" />
                          Pending
                        </span>
                      )}
                      {leave.status === "Approved" && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-green-50 border border-green-200 text-green-700 rounded-full text-xs font-black uppercase tracking-wider">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Approved
                        </span>
                      )}
                      {leave.status === "Rejected" && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-red-50 border border-red-200 text-red-700 rounded-full text-xs font-black uppercase tracking-wider">
                          <XCircle className="w-3.5 h-3.5" />
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500 font-bold">No leave applications on file</p>
                <p className="text-xs text-slate-400 mt-1">Use the form to apply for your first leave request.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
