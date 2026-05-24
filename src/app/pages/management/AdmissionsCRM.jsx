import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Users, UserPlus, CheckCircle, Clock, Phone, Mail, Calendar, 
  FileText, TrendingUp, AlertCircle, Eye, Edit, Send, Loader2, ArrowRight, Check, X, ShieldAlert 
} from "lucide-react";
import { toast } from "sonner";
import api from "../../../lib/api";

export function AdmissionsCRM() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("All");
  const [activeLead, setActiveLead] = useState(null);
  const [showAddLead, setShowAddLead] = useState(false);

  // New Lead fields
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadEmail, setNewLeadEmail] = useState("");
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadGrade, setNewLeadGrade] = useState("Grade 10");
  const [newLeadSource, setNewLeadSource] = useState("Website");
  const [newLeadNotes, setNewLeadNotes] = useState("");

  // Edit Lead fields
  const [editStage, setEditStage] = useState("");
  const [editTestDate, setEditTestDate] = useState("");
  const [editTestScore, setEditTestScore] = useState("");
  const [editInterview, setEditInterview] = useState("");
  const [editDocVerify, setEditDocVerify] = useState(false);

  // Fetch leads
  const { data: leadsResponse, isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const response = await api.get("/leads");
      return response.data.data;
    }
  });
  const leads = leadsResponse || [];

  // Mutations
  const createLeadMutation = useMutation({
    mutationFn: async (leadData) => {
      const response = await api.post("/leads", leadData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["leads"]);
      toast.success("Prospective lead registered successfully!");
      setNewLeadName("");
      setNewLeadEmail("");
      setNewLeadPhone("");
      setNewLeadNotes("");
      setShowAddLead(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create lead");
    }
  });

  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/leads/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["leads"]);
      toast.success("Lead pipeline status updated!");
      setActiveLead(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update lead");
    }
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/leads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["leads"]);
      toast.success("Lead deleted from pipeline.");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete lead");
    }
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newLeadName) return;
    createLeadMutation.mutate({
      name: newLeadName,
      email: newLeadEmail,
      phone: newLeadPhone,
      gradeInterested: newLeadGrade,
      source: newLeadSource,
      notes: newLeadNotes
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    updateLeadMutation.mutate({
      id: activeLead._id,
      data: {
        stage: editStage,
        entranceTestDate: editTestDate ? new Date(editTestDate) : null,
        entranceTestScore: editTestScore ? Number(editTestScore) : null,
        interviewNotes: editInterview,
        documentsVerified: editDocVerify
      }
    });
  };

  const filteredLeads = leads.filter(lead => {
    const name = lead.name || "";
    const email = lead.email || "";
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = selectedStage === "All" || lead.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  // Calculate funnel metrics
  const totalLeads = leads.length;
  const inquiryCount = leads.filter(l => l.stage === 'Inquiry').length;
  const testCount = leads.filter(l => l.stage === 'Test').length;
  const interviewCount = leads.filter(l => l.stage === 'Interview').length;
  const approvedCount = leads.filter(l => l.stage === 'Approval').length;
  const enrolledCount = leads.filter(l => l.stage === 'Enrolled').length;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admissions Pipeline</h1>
          <p className="text-slate-500 font-medium mt-1">Lead management CRM and prospective student registrations</p>
        </div>
        <button 
          onClick={() => setShowAddLead(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/25"
        >
          <UserPlus className="w-5 h-5" />
          Register Lead
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Active Leads", value: totalLeads, icon: Users, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
          { label: "Tests Scheduled", value: testCount, icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-100" },
          { label: "Interviews Booked", value: interviewCount, icon: Calendar, color: "text-purple-600 bg-purple-50 border-purple-100" },
          { label: "Confirmed Seats", value: enrolledCount, icon: CheckCircle, color: "text-emerald-600 bg-emerald-50 border-emerald-100" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-black uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900 mt-2">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Funnel Pipeline Visualization */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-black text-slate-900">Conversion Funnel Stages</h2>
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: "Inquiries", count: inquiryCount, color: "bg-indigo-50 border-indigo-100 text-indigo-700" },
            { label: "Entrance Test", count: testCount, color: "bg-amber-50 border-amber-100 text-amber-700" },
            { label: "Interviews", count: interviewCount, color: "bg-purple-50 border-purple-100 text-purple-700" },
            { label: "Approvals", count: approvedCount, color: "bg-blue-50 border-blue-100 text-blue-700" },
            { label: "Enrolled", count: enrolledCount, color: "bg-emerald-50 border-emerald-100 text-emerald-700" }
          ].map((stage, i) => (
            <div key={i} className={`p-4 rounded-2xl border text-center space-y-1 ${stage.color}`}>
              <p className="text-2xl font-black">{stage.count}</p>
              <p className="text-xs font-black uppercase tracking-wider">{stage.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {["All", "Inquiry", "Test", "Interview", "Approval", "Enrolled"].map(stage => (
            <button
              key={stage}
              onClick={() => setSelectedStage(stage)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                selectedStage === stage
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {stage}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search prospective leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
        ) : filteredLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200/80">
                <tr className="text-xs text-slate-400 font-black uppercase tracking-widest">
                  <th className="px-6 py-4">Prospective Student</th>
                  <th className="px-6 py-4">Target Grade</th>
                  <th className="px-6 py-4">Phone / Contact</th>
                  <th className="px-6 py-4">Verification</th>
                  <th className="px-6 py-4">Lead Stage</th>
                  <th className="px-6 py-4">Entrance Test Details</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700 font-semibold">
                {filteredLeads.map(lead => (
                  <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900">{lead.name}</p>
                        <p className="text-xs text-slate-400 font-medium">{lead.email || "No email"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-black uppercase tracking-wider">
                        {lead.gradeInterested || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <p className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {lead.phone || "N/A"}</p>
                    </td>
                    <td className="px-6 py-4">
                      {lead.documentsVerified ? (
                        <span className="flex items-center gap-1 text-green-600 text-xs font-black uppercase tracking-wider">
                          <Check className="w-4 h-4" /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-400 text-xs font-black uppercase tracking-wider">
                          <X className="w-4 h-4" /> Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        lead.stage === 'Enrolled' ? 'bg-green-100 border-green-200 text-green-700' :
                        lead.stage === 'Approval' ? 'bg-blue-100 border-blue-200 text-blue-700' :
                        lead.stage === 'Interview' ? 'bg-purple-100 border-purple-200 text-purple-700' :
                        lead.stage === 'Test' ? 'bg-amber-100 border-amber-200 text-amber-700' :
                        'bg-slate-100 border-slate-200 text-slate-700'
                      }`}>
                        {lead.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold">
                      {lead.entranceTestDate ? (
                        <div>
                          <p className="font-bold text-slate-800">Date: {new Date(lead.entranceTestDate).toLocaleDateString()}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Score: <span className="font-black text-indigo-600">{lead.entranceTestScore !== null ? `${lead.entranceTestScore}%` : "Not graded"}</span></p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Not scheduled</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveLead(lead);
                            setEditStage(lead.stage || "Inquiry");
                            setEditTestDate(lead.entranceTestDate ? new Date(lead.entranceTestDate).toISOString().split("T")[0] : "");
                            setEditTestScore(lead.entranceTestScore || "");
                            setEditInterview(lead.interviewNotes || "");
                            setEditDocVerify(lead.documentsVerified || false);
                          }}
                          className="p-2.5 text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-xl transition-all"
                          title="Manage Stage"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Remove this lead?")) {
                              deleteLeadMutation.mutate(lead._id);
                            }
                          }}
                          className="p-2.5 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition-all"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-black">No leads found in this stage</p>
          </div>
        )}
      </div>

      {/* Add Lead Dialog */}
      {showAddLead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <form onSubmit={handleAddSubmit}>
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Register Prospective Lead</h3>
                  <p className="text-slate-500 font-medium text-xs mt-0.5">Create pipeline index for inquiries</p>
                </div>
                <button type="button" onClick={() => setShowAddLead(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-8 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Name</label>
                  <input
                    type="text"
                    value={newLeadName}
                    onChange={(e) => setNewLeadName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                    <input
                      type="email"
                      value={newLeadEmail}
                      onChange={(e) => setNewLeadEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                    <input
                      type="text"
                      value={newLeadPhone}
                      onChange={(e) => setNewLeadPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade Interested</label>
                    <select
                      value={newLeadGrade}
                      onChange={(e) => setNewLeadGrade(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                    >
                      <option>Grade 9</option>
                      <option>Grade 10</option>
                      <option>Grade 11</option>
                      <option>Grade 12</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead Source</label>
                    <select
                      value={newLeadSource}
                      onChange={(e) => setNewLeadSource(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                    >
                      <option>Website</option>
                      <option>Referral</option>
                      <option>Walk-In</option>
                      <option>Social Media</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initial Notes</label>
                  <textarea
                    value={newLeadNotes}
                    onChange={(e) => setNewLeadNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
                <button type="button" onClick={() => setShowAddLead(false)} className="w-full py-3 bg-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest">Cancel</button>
                <button type="submit" disabled={createLeadMutation.isPending} className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1">
                  {createLeadMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Register Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Pipeline Stage Dialog */}
      {activeLead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
            <form onSubmit={handleSaveEdit}>
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Manage Pipeline Stage</h3>
                  <p className="text-slate-500 font-medium text-xs mt-0.5">For {activeLead.name}</p>
                </div>
                <button type="button" onClick={() => setActiveLead(null)} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pipeline Phase</label>
                  <select
                    value={editStage}
                    onChange={(e) => setEditStage(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                  >
                    <option value="Inquiry">Inquiry Stage</option>
                    <option value="Test">Entrance Test scheduling</option>
                    <option value="Interview">Interview evaluation</option>
                    <option value="Approval">Awaiting Final Approval</option>
                    <option value="Enrolled">Seat Confirmed & Enrolled</option>
                  </select>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Entrance Test details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500">Test Date</label>
                      <input
                        type="date"
                        value={editTestDate}
                        onChange={(e) => setEditTestDate(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500">Marks Score (%)</label>
                      <input
                        type="number"
                        placeholder="e.g. 85"
                        value={editTestScore}
                        onChange={(e) => setEditTestScore(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interview Notes</label>
                  <textarea
                    placeholder="Provide notes from principal/panel interview..."
                    value={editInterview}
                    onChange={(e) => setEditInterview(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="docVerify"
                    checked={editDocVerify}
                    onChange={(e) => setEditDocVerify(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="docVerify" className="text-sm font-bold text-slate-700 cursor-pointer">
                    Academic Documents Verified (Mark Sheet, TC, Birth Certificate)
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
                <button type="button" onClick={() => setActiveLead(null)} className="w-full py-3 bg-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest">Cancel</button>
                <button type="submit" disabled={updateLeadMutation.isPending} className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1">
                  {updateLeadMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Stage Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
