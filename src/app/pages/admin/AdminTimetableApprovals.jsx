import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle, Eye, Clock, Calendar, User, BookOpen, MapPin, Loader2, MessageSquare } from "lucide-react";
import api from "../../../lib/api";
import { toast } from "sonner";
import { Card, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

export const AdminTimetableApprovals = () => {
  const queryClient = useQueryClient();
  const [selectedTimetable, setSelectedTimetable] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const { data: approvals, isLoading } = useQuery({
    queryKey: ["timetable-approvals"],
    queryFn: async () => {
      const response = await api.get("/admin/timetable-approvals");
      return response.data.data;
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (id) => {
      await api.patch(`/admin/timetable-approvals/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["timetable-approvals"]);
      toast.success("Timetable approved successfully");
      setSelectedTimetable(null);
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }) => {
      await api.patch(`/admin/timetable-approvals/${id}/reject`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["timetable-approvals"]);
      toast.success("Timetable rejected");
      setSelectedTimetable(null);
      setIsRejecting(false);
      setRejectionReason("");
    }
  });

  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Timetable Approvals</h1>
          <p className="text-slate-600 mt-1">Review and publish class schedules submitted by teachers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Pending Submissions</h2>
          {approvals?.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500">No pending approvals at the moment</p>
            </Card>
          ) : (
            approvals?.map((item) => (
              <div 
                key={item._id} 
                className={`p-4 bg-white rounded-xl border-2 transition-all cursor-pointer ${selectedTimetable?._id === item._id ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-slate-100 hover:border-slate-200'}`}
                onClick={() => setSelectedTimetable(item)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{item.class?.name} - {item.section}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <User className="w-3 h-3 text-slate-400" />
                        <p className="text-xs text-slate-500">Uploaded by {item.uploadedBy?.name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="warning">Pending</Badge>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Details & Action</h2>
          {selectedTimetable ? (
            <Card className="p-0 overflow-hidden sticky top-8">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Preview: {selectedTimetable.class?.name} - {selectedTimetable.section}</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => approveMutation.mutate(selectedTimetable._id)}
                      disabled={approveMutation.isPending}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-all shadow-md shadow-green-600/10"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </button>
                    <button 
                      onClick={() => setIsRejecting(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>

                {isRejecting && (
                  <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100 space-y-3 animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                      <MessageSquare className="w-4 h-4" />
                      Reason for Rejection
                    </div>
                    <textarea 
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="e.g. Invalid room number for period 3..."
                      className="w-full p-3 text-sm border border-red-100 rounded-lg outline-none focus:ring-2 focus:ring-red-500/20 bg-white"
                      rows={3}
                    />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setIsRejecting(false)} className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                      <button 
                        onClick={() => rejectMutation.mutate({ id: selectedTimetable._id, reason: rejectionReason })}
                        disabled={!rejectionReason || rejectMutation.isPending}
                        className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 disabled:opacity-50"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Total Periods</p>
                    <p className="text-lg font-black text-slate-900">{selectedTimetable.rows?.length}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Submission Date</p>
                    <p className="text-lg font-black text-slate-900">{new Date(selectedTimetable.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100 sticky top-0 z-10">
                    <tr>
                      <th className="p-4">Day</th>
                      <th className="p-4">Period</th>
                      <th className="p-4">Schedule</th>
                      <th className="p-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedTimetable.rows?.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-bold text-slate-900">{row.day}</td>
                        <td className="p-4">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-black">{row.period}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Clock className="w-3 h-3" />
                            <span className="font-medium">{row.startTime} - {row.endTime}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-blue-600">
                              <BookOpen className="w-3 h-3" />
                              {row.subject}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                              <MapPin className="w-3 h-3" />
                              Room {row.room} • {row.teacher}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <div className="h-[400px] border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-300 gap-3">
              <Eye className="w-12 h-12" />
              <p className="font-bold">Select a timetable to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
