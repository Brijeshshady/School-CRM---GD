import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Calendar,
  Tag,
  User,
  Send,
  ArrowLeft,
  Trash2,
  UserPlus,
  Filter,
  MoreVertical,
  Activity,
  BarChart3,
  ShieldCheck,
  Zap,
  Target
} from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { useData } from "../../context/DataContext";
import { format } from "date-fns";

export const AdminTicketManagement = () => {
  const { user } = useAuth();
  const { showToast, addNotification } = useNotifications();

  const formatSafeDate = (dateVal, formatStr) => {
    if (!dateVal) return "N/A";
    try {
      const d = new Date(dateVal);
      if (d.getFullYear() > 2026) {
        d.setFullYear(2026);
      }
      return format(d, formatStr);
    } catch (e) {
      return "N/A";
    }
  };
  const { tickets, updateTicket, addTicketMessage, users, deleteTicket } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  const filteredTickets = tickets.filter((ticket) => {
    const creatorName = ticket.createdBy?.name || "";
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
      creatorName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;
    
    try {
      await addTicketMessage(selectedTicket._id || selectedTicket.id, replyMessage);
      
      const newMessage = {
        _id: `msg-${Date.now()}`,
        senderId: user?.id || user?._id || "",
        senderName: user?.name || "",
        senderRole: user?.role || "",
        message: replyMessage,
        timestamp: new Date().toISOString()
      };

      setSelectedTicket(prev => ({
        ...prev,
        messages: [...(prev.messages || []), newMessage],
        updatedAt: new Date().toISOString()
      }));

      showToast("success", "Reply Published", "Your message has been added to the ticket thread.");
      setReplyMessage("");
    } catch (error) {
      showToast("error", "Error", "Failed to publish reply.");
    }
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedTicket) return;
    const ticketId = selectedTicket._id || selectedTicket.id;
    
    try {
      await updateTicket(ticketId, { 
        status,
        ...status === "Resolved" && { resolvedAt: new Date().toISOString() }
      });
      
      setSelectedTicket(prev => ({ ...prev, status }));
      showToast("success", "Lifecycle Updated", `Ticket is now marked as ${status}`);
      
      if (status === "Resolved") {
        addNotification({
          userId: selectedTicket.createdBy?._id || selectedTicket.createdBy,
          type: "ticket",
          title: "Resolution Achieved",
          message: `Administrative action on ${selectedTicket.ticketNumber} is complete.`
        });
      }
    } catch (error) {
      showToast("error", "Error", "Transition failed.");
    }
  };

  const handleAssignTicket = async (userId) => {
    if (!selectedTicket) return;
    const ticketId = selectedTicket._id || selectedTicket.id;
    
    try {
      await updateTicket(ticketId, { assignedTo: userId });
      const assignedStaff = users.find(u => u._id === userId || u.id === userId);
      
      setSelectedTicket(prev => ({ ...prev, assignedTo: assignedStaff }));
      showToast("success", "Ownership Transferred", `Assigned to ${assignedStaff?.name || "Support Staff"}`);
    } catch (error) {
      showToast("error", "Error", "Assignment failed.");
    }
  };

  const handleDeleteTicket = async (id) => {
    if (window.confirm("CRITICAL: Permanent deletion of this record is irreversible. Proceed?")) {
      try {
        await deleteTicket(id);
        setSelectedTicket(null);
        showToast("success", "Record Purged", "The ticket has been permanently removed.");
      } catch (error) {
        showToast("error", "Error", "Purge failed.");
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Open": return <Clock className="w-5 h-5" />;
      case "In Progress": return <Zap className="w-5 h-5" />;
      case "Resolved": return <ShieldCheck className="w-5 h-5" />;
      case "Closed": return <XCircle className="w-5 h-5" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open": return "bg-blue-600 text-white shadow-lg shadow-blue-500/20";
      case "In Progress": return "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20";
      case "Resolved": return "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20";
      case "Closed": return "bg-slate-700 text-white shadow-lg shadow-slate-500/20";
      default: return "";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low": return "bg-slate-100 text-slate-500 border-slate-200";
      case "Medium": return "bg-blue-50 text-blue-600 border-blue-100";
      case "High": return "bg-orange-50 text-orange-600 border-orange-100";
      case "Urgent": return "bg-rose-50 text-rose-600 border-rose-100 font-black shadow-xl shadow-rose-500/5";
      default: return "";
    }
  };

  const dashboardStats = [
    { label: "Active Queue", value: tickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length, icon: Activity, gradient: "from-blue-600 to-indigo-600" },
    { label: "Avg Resolution", value: "4.2h", icon: Target, gradient: "from-indigo-600 to-purple-600" },
    { label: "System Health", value: "98%", icon: BarChart3, gradient: "from-emerald-500 to-teal-600" },
    { label: "Resolved Total", value: tickets.filter(t => t.status === 'Resolved').length, icon: ShieldCheck, gradient: "from-slate-800 to-slate-950" }
  ];

  const staffMembers = users.filter(u => u.role === "Admin" || u.role === "Staff" || u.role === "Teacher");

  if (selectedTicket) {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 p-1">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
        <Button variant="ghost" onClick={() => setSelectedTicket(null)} className="group hover:bg-white rounded-xl h-11 px-4 text-slate-900 font-bold tracking-tight shrink-0">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          RETURN TO QUEUE
        </Button>
        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
           <Button variant="outline" className="rounded-xl border-slate-200 h-11 px-4 sm:px-6 font-bold text-[10px] tracking-wider hover:bg-white transition-all whitespace-nowrap">
             GENERATE PDF
           </Button>
           <Button 
             className="rounded-xl shadow-lg shadow-rose-500/10 h-11 px-4 sm:px-6 font-bold text-[10px] tracking-wider transform hover:-translate-y-0.5 transition-all whitespace-nowrap bg-red-600 hover:bg-red-700 text-white border-none" 
             onClick={() => handleDeleteTicket(selectedTicket._id || selectedTicket.id)}
           >
            <Trash2 className="w-4 h-4 mr-2 shrink-0" />
            <span className="truncate">PURGE RECORD</span>
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-xl rounded-2xl bg-white">
        <div className="bg-slate-950 p-8 lg:p-10 text-white relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-60" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center gap-3">
                <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-xl px-3 py-1 font-mono tracking-widest font-bold text-[10px]">
                  TICKET REF: {selectedTicket.ticketNumber}
                </Badge>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                <Badge className={`${getPriorityColor(selectedTicket.priority)} border-none px-4 py-1.5 rounded-lg font-black uppercase text-[9px]`}>
                  {selectedTicket.priority} URGENCY
                </Badge>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight">{selectedTicket.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  {formatSafeDate(selectedTicket.createdAt, "MMM d, yyyy")}
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-500" />
                  {selectedTicket.category}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-4">
              <Badge className={`${getStatusColor(selectedTicket.status)} border-none text-sm px-6 py-3 rounded-xl shadow-lg font-black uppercase tracking-wider`}>
                <div className="flex items-center gap-3">
                  {getStatusIcon(selectedTicket.status)}
                  {selectedTicket.status}
                </div>
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-t border-slate-50">
          <div className="lg:col-span-8 p-8 lg:p-10 space-y-12 border-r border-slate-50">
            <section>
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-1 h-6 bg-blue-600 rounded-full" />
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requester Insight</h3>
              </div>
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 shadow-sm group relative">
                <p className="text-lg font-medium text-slate-800 leading-relaxed italic pr-12">"{selectedTicket.description}"</p>
                <div className="absolute bottom-6 right-8 text-slate-200">
                  <MessageSquare className="w-12 h-12 rotate-12" />
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-indigo-600 rounded-full" />
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Communication Matrix</h3>
                </div>
                <Badge variant="secondary" className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-wider">
                  {selectedTicket.messages?.length || 0} PERSISTED ENTRIES
                </Badge>
              </div>
              
              <div className="space-y-8 relative before:absolute before:left-6 before:top-1 before:bottom-1 before:w-[1px] before:bg-slate-50">
                {selectedTicket.messages?.map((message, idx) => (
                  <motion.div 
                    key={message._id || message.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-8 relative group"
                  >
                    <div className={`w-12 h-12 rounded-xl z-10 flex items-center justify-center font-black text-xs text-white shadow-lg transition-all duration-500 group-hover:scale-105 ${
                      message.senderRole === "Admin" ? "bg-slate-950" : "bg-indigo-600"
                    }`}>
                      {message.senderName?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className={`rounded-2xl p-6 border transition-all duration-500 ${
                        message.senderRole === "Admin" 
                        ? "bg-slate-50 border-slate-100 shadow-sm" 
                        : "bg-white border-indigo-50 shadow-sm"
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 text-base tracking-tight">{message.senderName}</span>
                            <Badge className="bg-slate-100 text-slate-400 text-[8px] font-black uppercase tracking-tighter border-none">{message.senderRole}</Badge>
                          </div>
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-wider">{formatSafeDate(message.timestamp, "h:mm a")}</span>
                        </div>
                        <p className="text-slate-600 text-sm font-semibold leading-relaxed">{message.message}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {selectedTicket.status !== "Closed" && (
                <div className="mt-12 pt-10 border-t border-slate-50">
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xl focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
                    <Textarea 
                      placeholder="Construct a professional response..." 
                      rows={3} 
                      value={replyMessage} 
                      onChange={(e) => setReplyMessage(e.target.value)} 
                      className="resize-none border-none bg-transparent focus:ring-0 text-slate-900 font-bold text-base placeholder:text-slate-200 p-3 mb-4 leading-relaxed"
                    />
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white text-sm font-black shadow-lg">
                           {user?.name?.charAt(0)}
                         </div>
                         <div>
                           <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Active Operator</p>
                           <p className="text-sm font-black text-slate-900">{user?.name}</p>
                         </div>
                      </div>
                      <Button onClick={handleSendReply} disabled={!replyMessage.trim()} className="bg-slate-950 hover:bg-black text-white rounded-xl h-11 px-8 font-black tracking-widest text-[10px] shadow-lg transform hover:-translate-y-0.5 transition-all">
                        <Send className="w-4 h-4 mr-2" />
                        PUBLISH RESPONSE
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          <div className="lg:col-span-4 bg-slate-50/30 p-8 lg:p-10 space-y-10">
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-1 h-6 bg-slate-950 rounded-full" />
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Management Console</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-2">Lifecycle Phase</label>
                  <Select value={selectedTicket.status} onValueChange={handleUpdateStatus}>
                    <SelectTrigger className="w-full rounded-xl bg-white border-slate-100 h-14 px-6 font-bold text-slate-900 shadow-sm text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-slate-200 bg-white shadow-xl p-1 z-50">
                      <SelectItem value="Open" className="rounded-lg py-2 font-bold text-sm">Open Queue</SelectItem>
                      <SelectItem value="In Progress" className="rounded-lg py-2 font-bold text-sm">In Processing</SelectItem>
                      <SelectItem value="Resolved" className="rounded-lg py-2 font-bold text-sm text-emerald-600">Resolved</SelectItem>
                      <SelectItem value="Closed" className="rounded-lg py-2 font-bold text-sm">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-2">Lead Support Agent</label>
                  <Select 
                    value={selectedTicket.assignedTo?._id || selectedTicket.assignedTo || "unassigned"} 
                    onValueChange={handleAssignTicket}
                  >
                    <SelectTrigger className="w-full rounded-xl bg-white border-slate-100 h-14 px-6 font-bold text-slate-900 shadow-sm text-sm">
                      <SelectValue placeholder="Delegate Action..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-slate-200 bg-white shadow-xl p-1 z-50">
                      <SelectItem value="unassigned" className="rounded-lg py-2 font-bold text-sm">Unassigned</SelectItem>
                      {staffMembers.map(staff => (
                        <SelectItem key={staff._id} value={staff._id} className="rounded-lg py-2 font-bold text-sm">{staff.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            <section className="space-y-6 pt-10 border-t border-slate-100">
              <div className="flex items-center gap-3">
                 <div className="w-1 h-6 bg-slate-900 rounded-full" />
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requester Profile</h3>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-700" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-slate-950 flex items-center justify-center font-black text-white text-xl shadow-lg">
                    {selectedTicket.createdBy?.name?.charAt(0) || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-black text-slate-900 truncate tracking-tight">{selectedTicket.createdBy?.name || "Anonymous User"}</p>
                    <Badge className="bg-indigo-50 text-indigo-600 border-none font-black text-[9px] px-2 py-0.5 mt-1">{selectedTicket.createdBy?.role || "Global Identity"}</Badge>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-50 space-y-3">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-black uppercase tracking-widest">Global ID</span>
                    <span className="text-slate-900 font-mono font-bold tracking-tighter">#{(selectedTicket.createdBy?._id || selectedTicket.createdBy || "00000000").slice(-12).toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-black uppercase tracking-widest">Trust Status</span>
                    <span className="text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-1000 p-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Support Queue
          </h2>
          <p className="text-slate-500 font-medium text-sm">Manage and resolve system-wide support requests</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl h-11 px-6 font-bold text-slate-600 hover:text-slate-900 transition-colors border-slate-200 text-xs">System Logs</Button>
           <Button className="bg-slate-950 hover:bg-black text-white rounded-xl h-11 px-8 font-bold shadow-lg shadow-slate-950/10 text-xs">
             GLOBAL ANALYTICS
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group overflow-hidden border-none shadow-sm rounded-2xl relative h-24 bg-white hover:shadow-md transition-all duration-300">
              <div className="p-4 h-full flex items-center gap-4 relative">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg shadow-slate-200`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{stat.label}</p>
                  <p className="text-xl font-black text-slate-950 tracking-tight">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-200 group-focus-within:text-blue-500 transition-all duration-500" />
            <Input 
              placeholder="Query system for tickets, identities, or status codes..." 
              className="h-14 pl-14 pr-6 border-none bg-white shadow-xl shadow-slate-950/5 rounded-2xl font-bold text-slate-950 placeholder:text-slate-200 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>
          <div className="flex gap-3 h-14 bg-white p-1 rounded-2xl shadow-xl shadow-slate-950/5 border border-slate-50">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[200px] h-full border-none bg-transparent rounded-xl font-bold text-slate-600 px-6 text-xs">
                <div className="flex items-center gap-3">
                  <Filter className="w-4 h-4 text-slate-200" />
                  <SelectValue placeholder="All Queue" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-slate-200 bg-white shadow-xl p-1 z-[10001]">
                <SelectItem value="all" className="rounded-lg py-2 font-bold text-xs cursor-pointer hover:bg-slate-50">All Requests</SelectItem>
                <SelectItem value="Open" className="rounded-lg py-2 font-bold text-xs cursor-pointer hover:bg-slate-50">Awaiting Action</SelectItem>
                <SelectItem value="In Progress" className="rounded-lg py-2 font-bold text-xs cursor-pointer hover:bg-slate-50">Active Processing</SelectItem>
                <SelectItem value="Resolved" className="rounded-lg py-2 font-bold text-xs cursor-pointer hover:bg-slate-50 text-emerald-600">Resolved</SelectItem>
                <SelectItem value="Closed" className="rounded-lg py-2 font-bold text-xs cursor-pointer hover:bg-slate-50 text-slate-400">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full md:w-[200px] h-full border-none bg-transparent rounded-xl font-bold text-slate-600 px-6 text-xs">
                <div className="flex items-center gap-3">
                  <Target className="w-4 h-4 text-slate-200" />
                  <SelectValue placeholder="All Priorities" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-slate-200 bg-white shadow-xl p-1 z-[10001]">
                <SelectItem value="all" className="rounded-lg py-2 font-bold text-xs cursor-pointer hover:bg-slate-50">All Urgency</SelectItem>
                <SelectItem value="Low" className="rounded-lg py-2 font-bold text-xs cursor-pointer hover:bg-slate-50">Low</SelectItem>
                <SelectItem value="Medium" className="rounded-lg py-2 font-bold text-xs cursor-pointer hover:bg-slate-50">Medium</SelectItem>
                <SelectItem value="High" className="rounded-lg py-2 font-bold text-xs cursor-pointer hover:bg-slate-50 text-orange-600">High</SelectItem>
                <SelectItem value="Urgent" className="rounded-lg py-2 font-bold text-xs cursor-pointer hover:bg-slate-50 text-rose-600">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredTickets.length === 0 ? (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-24 text-center shadow-xl shadow-slate-950/5 border border-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/10 to-transparent" />
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner group">
                    <MessageSquare className="w-10 h-10 text-slate-100 group-hover:text-blue-200 transition-all duration-700 group-hover:scale-105" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-950 mb-2 tracking-tight">Queue Clear</h3>
                  <p className="text-slate-400 font-bold text-sm max-w-sm mx-auto uppercase tracking-tighter leading-none">No administrative action required for current selection.</p>
                </div>
              </motion.div>
            ) : (
              filteredTickets.map((ticket, index) => (
                <motion.div 
                  key={ticket._id || ticket.id} 
                  layout 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className="p-6 hover:shadow-xl transition-all duration-500 cursor-pointer border-none shadow-sm bg-white group rounded-2xl relative overflow-hidden active:scale-[0.995]"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-500 group-hover:w-2 ${
                      ticket.priority === 'Urgent' ? 'bg-rose-600 shadow-[2px_0_10px_rgba(225,29,72,0.2)]' :
                      ticket.priority === 'High' ? 'bg-orange-600 shadow-[2px_0_10px_rgba(234,88,12,0.1)]' :
                      ticket.priority === 'Medium' ? 'bg-blue-600 shadow-[2px_0_10px_rgba(37,99,235,0.1)]' : 'bg-slate-200'
                    }`} />
                    
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                      <div className="flex-1 min-w-0 space-y-4">
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary" className="bg-slate-950 text-white font-mono text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-md shadow-slate-950/20">
                            #{ticket.ticketNumber}
                          </Badge>
                          <div className="w-1 h-1 rounded-full bg-slate-100" />
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{ticket.category}</span>
                        </div>
                        
                        <div className="space-y-1">
                          <h3 className="text-lg font-black text-slate-950 group-hover:text-blue-600 transition-colors mb-0.5 leading-tight tracking-tight">{ticket.title}</h3>
                          <p className="text-slate-400 font-bold line-clamp-1 text-sm tracking-tight leading-none">{ticket.description}</p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 pt-1">
                          <Badge className={`${getStatusColor(ticket.status)} border-none px-4 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-xl shadow-sm`}>
                            <div className="flex items-center gap-2">
                               {getStatusIcon(ticket.status)}
                               {ticket.status}
                            </div>
                          </Badge>
                          <Badge className={`${getPriorityColor(ticket.priority)} border-none px-4 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-xl`}>
                            {ticket.priority}
                          </Badge>
                          <div className="flex items-center gap-4 text-[10px] text-slate-300 font-black uppercase tracking-widest ml-auto lg:ml-0 border-l border-slate-100 pl-4">
                            <span className="flex items-center gap-2 text-slate-950 font-black">
                              <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                <User className="w-3.5 h-3.5" />
                              </div>
                              {ticket.createdBy?.name || "System"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 self-end lg:self-center lg:border-l lg:border-slate-50 lg:pl-8">
                        <div className="text-center group-hover:scale-105 transition-transform duration-500">
                          <div className="flex items-center justify-center gap-2 text-slate-200 group-hover:text-blue-600 mb-0.5 transition-colors">
                            <MessageSquare className="w-5 h-5 group-hover:fill-blue-50/100 transition-all duration-500" />
                            <span className="text-2xl font-black tracking-tighter text-slate-950">{ticket.messages?.length || 0}</span>
                          </div>
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Messages</p>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-xl h-10 w-10 text-slate-200 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-90" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTicket(ticket._id || ticket.id);
                            }}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
