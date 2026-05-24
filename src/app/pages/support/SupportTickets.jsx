import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Calendar,
  Tag,
  ChevronRight,
  Send,
  Sparkles,
  ArrowRight,
  LifeBuoy,
  HelpCircle,
  Activity
} from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { useData } from "../../context/DataContext";
import { format } from "date-fns";

export const SupportTickets = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

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
  const { tickets, addTicket, addTicketMessage } = useData();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    category: "Technical",
    priority: "Medium"
  });

  const userTickets = (tickets || []).filter((ticket) => 
    ticket.createdBy?._id === user?.id || 
    ticket.createdBy === user?.id || 
    ticket.createdBy?._id === user?._id ||
    ticket.createdBy === user?._id
  );

  const filteredTickets = userTickets.filter((ticket) => {
    const matchesSearch = (ticket.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (ticket.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateTicket = async () => {
    if (!newTicket.title || !newTicket.description) {
      showToast("error", "Information Missing", "Please provide both a title and description.");
      return;
    }

    try {
      await addTicket(newTicket);
      showToast("success", "Ticket Submitted", "Our support team has received your request.");
      setIsCreateDialogOpen(false);
      setNewTicket({
        title: "",
        description: "",
        category: "Technical",
        priority: "Medium"
      });
    } catch (error) {
      showToast("error", "Submission Failed", "There was an error creating your ticket.");
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;
    
    try {
      await addTicketMessage(selectedTicket._id || selectedTicket.id, replyMessage);
      
      const newMessage = {
        _id: `msg-${Date.now()}`,
        senderId: user?.id || user?._id,
        senderName: user?.name,
        senderRole: user?.role,
        message: replyMessage,
        timestamp: new Date().toISOString()
      };
      
      setSelectedTicket(prev => ({
        ...prev,
        messages: [...(prev.messages || []), newMessage]
      }));
      
      setReplyMessage("");
      showToast("success", "Message Sent", "Your reply has been added successfully.");
    } catch (error) {
      showToast("error", "Failed to Send", "Could not add your reply.");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Open": return <Clock className="w-4 h-4" />;
      case "In Progress": return <AlertCircle className="w-4 h-4" />;
      case "Resolved": return <CheckCircle2 className="w-4 h-4" />;
      case "Closed": return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open": return "bg-blue-500/10 text-blue-600 border-blue-100";
      case "In Progress": return "bg-indigo-500/10 text-indigo-600 border-indigo-100";
      case "Resolved": return "bg-emerald-500/10 text-emerald-600 border-emerald-100";
      case "Closed": return "bg-slate-500/10 text-slate-600 border-slate-100";
      default: return "";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low": return "bg-slate-100 text-slate-600";
      case "Medium": return "bg-blue-50 text-blue-600";
      case "High": return "bg-orange-50 text-orange-600";
      case "Urgent": return "bg-rose-50 text-rose-600 font-bold shadow-sm shadow-rose-100";
      default: return "";
    }
  };

  const dashboardStats = [
    { label: "Total Requests", value: userTickets.length, icon: LifeBuoy, color: "from-blue-600 to-indigo-600" },
    { label: "Currently Active", value: userTickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length, icon: Activity, color: "from-indigo-600 to-purple-600" },
    { label: "Successfully Resolved", value: userTickets.filter(t => t.status === 'Resolved').length, icon: CheckCircle2, color: "from-emerald-500 to-teal-600" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-1000">
      {/* Premium Hero Header */}
      <div className="relative overflow-hidden bg-slate-950 rounded-3xl p-8 lg:p-10 text-white shadow-xl shadow-slate-900/40">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-emerald-500/10 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 backdrop-blur-xl px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[9px]">
              Support Experience Center
            </Badge>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              How can we <br /> help you today?
            </h1>
            <p className="text-slate-400 font-medium text-sm lg:text-base leading-relaxed max-w-lg">
              Our dedicated support team is here to ensure your educational journey remains smooth and uninterrupted.
            </p>
            
            <div className="flex flex-wrap gap-8 pt-2">
               {dashboardStats.map(stat => (
                 <div key={stat.label} className="group">
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-wider mb-1 group-hover:text-blue-400 transition-colors">{stat.label}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-black text-white tracking-tight">{stat.value}</p>
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${stat.color} shadow-lg`} />
                    </div>
                 </div>
               ))}
            </div>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-white hover:bg-slate-100 text-slate-950 rounded-2xl font-black px-8 h-14 shadow-xl shadow-white/5 group transition-all transform hover:-translate-y-0.5">
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-500 text-blue-600" />
                NEW REQUEST
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl bg-white rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
              <div className="bg-slate-950 p-8 text-white relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-50" />
                <DialogHeader className="relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20">
                      <Sparkles className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-black tracking-tight">Create Request</DialogTitle>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-0.5">Ref: {format(new Date(), 'yyyy-MM-dd')}</p>
                    </div>
                  </div>
                </DialogHeader>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider ml-1">Request Headline</label>
                  <Input 
                    placeholder="Briefly summarize your issue..." 
                    className="h-11 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-slate-900 shadow-sm px-4 text-sm placeholder:text-slate-300" 
                    value={newTicket.title} 
                    onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })} 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider ml-1">Full Context</label>
                  <Textarea 
                    placeholder="Provide as much detail as possible..." 
                    rows={4} 
                    className="rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-500/5 transition-all font-semibold text-slate-900 shadow-sm resize-none p-4 leading-relaxed text-sm placeholder:text-slate-300" 
                    value={newTicket.description} 
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })} 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider ml-1">Category</label>
                    <Select value={newTicket.category} onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}>
                      <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all font-bold text-slate-700 px-4 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border border-slate-200 bg-white shadow-xl p-1 z-[10001]">
                        <SelectItem value="Technical" className="rounded-lg font-bold py-2 cursor-pointer hover:bg-slate-50">Technical</SelectItem>
                        <SelectItem value="Academic" className="rounded-lg font-bold py-2 cursor-pointer hover:bg-slate-50">Academic</SelectItem>
                        <SelectItem value="Financial" className="rounded-lg font-bold py-2 cursor-pointer hover:bg-slate-50">Financial</SelectItem>
                        <SelectItem value="Administrative" className="rounded-lg font-bold py-2 cursor-pointer hover:bg-slate-50">Administrative</SelectItem>
                        <SelectItem value="Other" className="rounded-lg font-bold py-2 cursor-pointer hover:bg-slate-50">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider ml-1">Urgency Level</label>
                    <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}>
                      <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all font-bold text-slate-700 px-4 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border border-slate-200 bg-white shadow-xl p-1 z-[10001]">
                        <SelectItem value="Low" className="rounded-lg font-bold py-2 cursor-pointer hover:bg-slate-50">Low</SelectItem>
                        <SelectItem value="Medium" className="rounded-lg font-bold py-2 cursor-pointer hover:bg-slate-50">Medium</SelectItem>
                        <SelectItem value="High" className="rounded-lg font-bold py-2 cursor-pointer hover:bg-slate-50">High</SelectItem>
                        <SelectItem value="Urgent" className="rounded-lg font-bold py-2 cursor-pointer hover:bg-slate-50 text-rose-600">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end items-center gap-4">
                <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)} className="rounded-lg font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest text-[10px]">Discard</Button>
                <Button onClick={handleCreateTicket} className="bg-slate-900 hover:bg-black text-white rounded-xl font-black h-11 px-8 shadow-lg shadow-slate-900/20 transform hover:-translate-y-0.5 transition-all">
                  SEND REQUEST
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filter and Search Hub */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-all duration-500" />
          <Input 
            placeholder="Search through your request history..." 
            className="h-12 pl-12 pr-6 border-none bg-white shadow-xl shadow-slate-200/40 rounded-xl font-bold text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="w-full md:w-auto bg-white p-1 rounded-xl shadow-xl shadow-slate-200/40 border border-slate-50">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[200px] h-10 border-none bg-transparent font-bold text-slate-600 px-4 text-sm">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-300" />
                <SelectValue placeholder="All Requests" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-xl p-1 z-[10001]">
              <SelectItem value="all" className="rounded-lg font-bold py-2 text-sm">All Requests</SelectItem>
              <SelectItem value="Open" className="rounded-lg font-bold py-2 text-sm">Pending Action</SelectItem>
              <SelectItem value="In Progress" className="rounded-lg font-bold py-2 text-sm">Actively Processing</SelectItem>
              <SelectItem value="Resolved" className="rounded-lg font-bold py-2 text-sm text-emerald-600">Resolved</SelectItem>
              <SelectItem value="Closed" className="rounded-lg font-bold py-2 text-sm">Closed Archive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredTickets.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-20 text-center shadow-xl shadow-slate-200/20 border border-slate-50 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/20 to-transparent" />
              <div className="relative z-10">
                <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner group">
                  <HelpCircle className="w-10 h-10 text-slate-100 group-hover:text-blue-200 transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Quiet on our end</h3>
                <p className="text-slate-400 font-semibold max-w-xs mx-auto text-sm mb-8 leading-relaxed">
                  {searchQuery || filterStatus !== "all" ? "No matches found for your current filters." : "Looks like everything is running smoothly. But if you need us, we're right here."}
                </p>
                {!searchQuery && filterStatus === "all" && (
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-slate-950 hover:bg-black text-white rounded-xl font-black h-12 px-10 shadow-xl shadow-slate-950/20 group">
                    <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-500" />
                    SUBMIT YOUR FIRST REQUEST
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            filteredTickets.map((ticket, index) => (
              <motion.div 
                key={ticket._id || ticket.id} 
                layout 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="p-6 hover:shadow-xl transition-all duration-500 cursor-pointer border-none shadow-xl shadow-slate-200/40 bg-white group rounded-2xl relative overflow-hidden active:scale-[0.99]" 
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1 min-w-0 space-y-4">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-slate-900 text-white font-mono text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-lg shadow-slate-900/20">
                          #{ticket.ticketNumber}
                        </Badge>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-100" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{ticket.category}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight tracking-tight">{ticket.title}</h3>
                        <p className="text-slate-400 font-semibold line-clamp-1 text-sm">{ticket.description}</p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 pt-1">
                        <Badge className={`${getStatusColor(ticket.status)} border-none px-4 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-xl shadow-sm`}>
                          <div className="flex items-center gap-2">
                             {getStatusIcon(ticket.status)}
                             {ticket.status}
                          </div>
                        </Badge>
                        <Badge className={`${getPriorityColor(ticket.priority)} border-none px-4 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-xl shadow-sm`}>
                          {ticket.priority}
                        </Badge>
                        <div className="flex items-center gap-2 text-[10px] text-slate-300 font-black uppercase tracking-widest ml-auto lg:ml-0">
                          <Calendar className="w-4 h-4 opacity-40" />
                          {formatSafeDate(ticket.createdAt, "MMM d, yyyy")}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 self-end lg:self-center bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all duration-500">
                      <div className="text-center px-2">
                        <div className="flex items-center justify-center gap-2 text-slate-300 group-hover:text-indigo-600 mb-0.5 transition-colors">
                          <MessageSquare className="w-5 h-5" />
                          <span className="text-xl font-black tracking-tighter">{ticket.messages?.length || 0}</span>
                        </div>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-wider">Messages</p>
                      </div>
                      <div className="h-10 w-[1px] bg-slate-200" />
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-black/5 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                        <ChevronRight className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="max-w-4xl max-h-[92vh] overflow-hidden flex flex-col bg-white rounded-2xl border-none shadow-2xl p-0">
          {selectedTicket && (
            <>
              <div className="bg-slate-950 p-8 lg:p-10 text-white relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-transparent to-emerald-500/20 opacity-60" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
                
                <div className="relative z-10 space-y-4">
                   <div className="flex items-center justify-between">
                     <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-xl px-3 py-1 font-mono tracking-widest font-bold text-[10px]">
                       REFERENCE #{selectedTicket.ticketNumber}
                     </Badge>
                     <Badge className={`${getStatusColor(selectedTicket.status)} border-none px-4 py-1.5 rounded-xl font-black uppercase text-[10px] shadow-xl shadow-black/20`}>
                       <div className="flex items-center gap-2">
                          {getStatusIcon(selectedTicket.status)}
                          {selectedTicket.status}
                       </div>
                     </Badge>
                   </div>
                   <DialogTitle className="text-2xl lg:text-3xl font-black tracking-tight leading-tight text-white">{selectedTicket.title}</DialogTitle>
                   <div className="flex flex-wrap items-center gap-6 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                      <span className="flex items-center gap-2 text-indigo-400"><Tag className="w-4 h-4" /> {selectedTicket.category}</span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" /> 
                        {selectedTicket.createdAt ? `Submitted on ${formatSafeDate(selectedTicket.createdAt, "MMM d, yyyy 'at' h:mm a")}` : "Date N/A"}
                      </span>
                   </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-10 bg-white custom-scrollbar">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Request Origin & Context</h4>
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-sm relative">
                    <p className="text-base font-medium text-slate-800 leading-relaxed italic pr-10">"{selectedTicket.description}"</p>
                    <div className="absolute top-6 right-8 text-blue-100">
                      <Sparkles className="w-8 h-8 rotate-12" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between ml-1">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Communication Timeline</h4>
                    <Badge variant="outline" className="border-slate-100 text-slate-400 font-black rounded-full px-3 text-[10px]">{selectedTicket.messages?.length || 0} Events</Badge>
                  </div>
                  
                  <div className="space-y-8 relative before:absolute before:left-5 before:top-1 before:bottom-1 before:w-[1px] before:bg-slate-50">
                    {selectedTicket.messages?.map((message, idx) => (
                      <motion.div 
                        key={message._id || message.id} 
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex gap-8 relative group"
                      >
                        <div className={`w-10 h-10 rounded-xl z-10 flex items-center justify-center font-black text-xs text-white shadow-lg transition-transform duration-300 group-hover:scale-105 ${
                          message.senderId === user?.id || message.senderId === user?._id ? "bg-indigo-600" : "bg-slate-900"
                        }`}>
                          {message.senderName?.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className={`rounded-2xl p-6 shadow-sm border transition-all duration-300 ${
                            message.senderId === user?.id || message.senderId === user?._id 
                            ? "bg-white border-indigo-50" 
                            : "bg-slate-50 border-slate-100"
                          }`}>
                            <div className="flex items-center justify-between mb-2">
                               <span className="text-sm font-black text-slate-900 tracking-tight">{message.senderName}</span>
                               <span className="text-[9px] font-black text-slate-300 uppercase tracking-wider">
                                 {formatSafeDate(message.timestamp, "MMM d, h:mm a")}
                               </span>
                            </div>
                            <p className="text-slate-600 leading-relaxed font-semibold text-sm">{message.message}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedTicket.status !== "Closed" && selectedTicket.status !== "Resolved" && (
                <div className="p-8 bg-slate-50 border-t border-slate-100 flex-shrink-0">
                  <div className="bg-white rounded-2xl p-3 shadow-xl border border-slate-100 flex items-center gap-4 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all">
                    <Textarea 
                      placeholder="Type your follow-up message..." 
                      rows={1} 
                      value={replyMessage} 
                      onChange={(e) => setReplyMessage(e.target.value)} 
                      className="flex-1 border-none bg-transparent focus:ring-0 text-slate-900 placeholder:text-slate-300 py-2 resize-none text-sm font-semibold px-4"
                    />
                    <Button 
                      onClick={handleSendReply} 
                      disabled={!replyMessage.trim()} 
                      className="bg-slate-950 hover:bg-black h-12 w-12 rounded-xl flex-shrink-0 shadow-lg shadow-slate-900/20 active:scale-95 transition-all group p-0"
                    >
                      <Send className="w-5 h-5 text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
