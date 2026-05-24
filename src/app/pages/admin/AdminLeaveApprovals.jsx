import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, CheckCircle, XCircle, Clock, Users, User, ArrowRight, Loader2, BookOpen, AlertCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import api from "../../../lib/api";

export default function AdminLeaveApprovals() {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState("All");
  const [rejectingLeaveId, setRejectingLeaveId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  
  // Substitution assignment states
  const [substituteLeave, setSubstituteLeave] = useState(null);
  const [selectedSubDate, setSelectedSubDate] = useState("");
  const [substituteSelections, setSubstituteSelections] = useState({}); // { period: substituteTeacherId }

  // Fetch all leave requests
  const { data: leavesResponse, isLoading: leavesLoading } = useQuery({
    queryKey: ["admin-leaves"],
    queryFn: async () => {
      const response = await api.get("/leaves");
      return response.data.data;
    }
  });
  const leaves = leavesResponse || [];

  // Fetch all teachers (substitute options)
  const { data: teachersResponse } = useQuery({
    queryKey: ["admin-teachers"],
    queryFn: async () => {
      const response = await api.get("/admin/teachers");
      return response.data.data;
    }
  });
  const teachers = teachersResponse || [];

  // Fetch classes
  const { data: classesResponse } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const response = await api.get("/classes");
      return response.data.data;
    }
  });
  const classes = classesResponse || [];

  // Fetch class timetables to map teacher schedules
  const { data: classTimetables, isLoading: timetablesLoading } = useQuery({
    queryKey: ["class-timetables", classes],
    queryFn: async () => {
      if (!classes.length) return [];
      const results = await Promise.all(
        classes.map(async (c) => {
          try {
            const res = await api.get(`/timetables/class/${c._id}`);
            return { class: c, timetable: res.data.data };
          } catch (e) {
            return { class: c, timetable: null };
          }
        })
      );
      return results.filter(r => r.timetable);
    },
    enabled: classes.length > 0
  });

  // Approve leave mutation
  const approveLeaveMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.patch(`/leaves/${id}/status`, { status: "Approved" });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-leaves"]);
      toast.success("Leave request approved successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to approve leave");
    }
  });

  // Reject leave mutation
  const rejectLeaveMutation = useMutation({
    mutationFn: async ({ id, reason }) => {
      const response = await api.patch(`/leaves/${id}/status`, { status: "Rejected", rejectionReason: reason });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-leaves"]);
      setRejectingLeaveId(null);
      setRejectionReason("");
      toast.success("Leave request rejected.");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to reject leave");
    }
  });

  // Assign substitute mutation
  const assignSubstituteMutation = useMutation({
    mutationFn: async (subData) => {
      const response = await api.post("/timetables/substitute", subData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Substitute teacher assigned successfully!");
      // Reset selected substitute for that period
      queryClient.invalidateQueries(["date-schedule"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Substitution conflict occurred");
    }
  });

  const handleRejectSubmit = (e, id) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }
    rejectLeaveMutation.mutate({ id, reason: rejectionReason });
  };

  const getDaysInRange = (startDate, endDate) => {
    const dates = [];
    let curr = new Date(startDate);
    const end = new Date(endDate);
    while (curr <= end) {
      dates.push(new Date(curr).toISOString().split("T")[0]);
      curr.setDate(curr.getDate() + 1);
    }
    return dates;
  };

  const getAffectedSlots = (teacherId, dateString) => {
    if (!classTimetables || !dateString) return [];
    
    const queryDate = new Date(dateString);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = daysOfWeek[queryDate.getDay()];

    const slots = [];
    classTimetables.forEach(({ class: classObj, timetable }) => {
      const matchingRows = timetable.rows.filter(
        row => row.day.toLowerCase() === dayName.toLowerCase() && row.teacherId?.toString() === teacherId?.toString()
      );
      
      matchingRows.forEach(row => {
        slots.push({
          class: classObj,
          period: row.period,
          subject: row.subject,
          subjectName: row.subjectName,
          time: `${row.startTime} - ${row.endTime}`,
          originalTeacherId: teacherId
        });
      });
    });

    return slots.sort((a, b) => a.period - b.period);
  };

  const handleAssignSubstitute = (slot) => {
    const substituteTeacherId = substituteSelections[slot.period];
    if (!substituteTeacherId) {
      toast.error("Please select a substitute teacher");
      return;
    }

    assignSubstituteMutation.mutate({
      classId: slot.class._id,
      date: selectedSubDate,
      period: slot.period,
      originalTeacherId: slot.originalTeacherId,
      substituteTeacherId,
      subject: slot.subjectName
    });
  };

  const filteredLeaves = leaves.filter(leave => filterStatus === "All" || leave.status === filterStatus);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Staff Leave & Substitutions</h1>
        <p className="text-slate-500 font-medium mt-1">Review leave applications and coordinate timetable substitutions</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        {["All", "Pending", "Approved", "Rejected"].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-5 py-3 rounded-t-xl font-black text-xs uppercase tracking-widest border-b-2 transition-all ${
              filterStatus === status
                ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
                : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leaves List */}
        <div className="lg:col-span-2 space-y-4">
          {leavesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : filteredLeaves.length > 0 ? (
            filteredLeaves.map((leave) => (
              <div key={leave._id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center font-bold text-indigo-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900">{leave.teacher?.user?.name || "Teacher"}</h3>
                      <p className="text-xs text-slate-500 font-semibold">{leave.teacher?.user?.email}</p>
                    </div>
                  </div>
                  <div>
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

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/80 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <span>
                      {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                    </span>
                    <span className="text-slate-400 font-medium">
                      ({Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1} days)
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 font-semibold">{leave.reason}</p>
                </div>

                {leave.rejectionReason && (
                  <div className="p-4 bg-red-50/50 border border-red-100 rounded-2xl text-xs text-red-700 font-semibold flex gap-1">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Rejection Reason: {leave.rejectionReason}</span>
                  </div>
                )}

                {/* Actions */}
                {leave.status === "Pending" && (
                  <div className="flex gap-3">
                    {rejectingLeaveId === leave._id ? (
                      <form onSubmit={(e) => handleRejectSubmit(e, leave._id)} className="w-full flex gap-2">
                        <input
                          type="text"
                          placeholder="Provide rejection reason..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-red-500"
                        />
                        <button
                          type="submit"
                          disabled={rejectLeaveMutation.isPending}
                          className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 disabled:opacity-50"
                        >
                          Submit
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectingLeaveId(null)}
                          className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200"
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <>
                        <button
                          onClick={() => approveLeaveMutation.mutate(leave._id)}
                          disabled={approveLeaveMutation.isPending}
                          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve Leave
                        </button>
                        <button
                          onClick={() => setRejectingLeaveId(leave._id)}
                          className="flex-1 py-3 border border-red-200 text-red-600 hover:bg-red-50 font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject Leave
                        </button>
                      </>
                    )}
                  </div>
                )}

                {leave.status === "Approved" && (
                  <button
                    onClick={() => {
                      setSubstituteLeave(leave);
                      const dates = getDaysInRange(leave.startDate, leave.endDate);
                      setSelectedSubDate(dates[0] || "");
                      setSubstituteSelections({});
                    }}
                    className="w-full py-3 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Coordinate Substitutions
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-[2rem]">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-black">No leave requests found</p>
              <p className="text-xs text-slate-400 mt-1">There are no leave requests matching this filter.</p>
            </div>
          )}
        </div>

        {/* Substitution Coordinator Panel */}
        <div className="lg:col-span-1">
          {substituteLeave ? (
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-6 sticky top-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Substitution Desk</h2>
                  <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mt-0.5">
                    For {substituteLeave.teacher?.user?.name}
                  </p>
                </div>
                <button
                  onClick={() => setSubstituteLeave(null)}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-black uppercase tracking-wider"
                >
                  Close
                </button>
              </div>

              {/* Date Selector */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Date</label>
                <select
                  value={selectedSubDate}
                  onChange={(e) => {
                    setSelectedSubDate(e.target.value);
                    setSubstituteSelections({});
                  }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none"
                >
                  {getDaysInRange(substituteLeave.startDate, substituteLeave.endDate).map((d) => (
                    <option key={d} value={d}>
                      {new Date(d).toLocaleDateString("en-US", { weekday: 'long', month: 'short', day: 'numeric' })}
                    </option>
                  ))}
                </select>
              </div>

              {/* Affected slots */}
              <div className="space-y-4">
                <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest">Affected Timetable Slots</h4>
                
                {getAffectedSlots(substituteLeave.teacher?._id, selectedSubDate).length > 0 ? (
                  <div className="space-y-4">
                    {getAffectedSlots(substituteLeave.teacher?._id, selectedSubDate).map((slot, i) => (
                      <div key={i} className="p-4 border border-slate-100 rounded-2xl bg-slate-50 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded text-[9px] font-black uppercase tracking-wider">
                              Class {slot.class.name}-{slot.class.section}
                            </span>
                            <p className="font-bold text-slate-900 mt-1 text-sm">{slot.subjectName}</p>
                            <p className="text-xs text-slate-500 font-semibold">Period {slot.period} ({slot.time})</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <select
                            value={substituteSelections[slot.period] || ""}
                            onChange={(e) => setSubstituteSelections(prev => ({
                              ...prev,
                              [slot.period]: e.target.value
                            }))}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
                          >
                            <option value="">Select Substitute Teacher...</option>
                            {teachers
                              .filter(t => t._id.toString() !== substituteLeave.teacher?._id?.toString())
                              .map(t => (
                                <option key={t._id} value={t._id}>
                                  {t.user?.name} ({t.department})
                                </option>
                              ))}
                          </select>

                          <button
                            onClick={() => handleAssignSubstitute(slot)}
                            disabled={!substituteSelections[slot.period] || assignSubstituteMutation.isPending}
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            Assign Substitute
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl">
                    <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 font-bold">No slots scheduled on this day</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-dashed border-slate-200 text-center py-16">
              <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="font-black text-sm text-slate-500 uppercase tracking-wider">Substitution Coordinator</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Select "Coordinate Substitutions" on an approved leave card to coordinate cover schedules for dates and classes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
