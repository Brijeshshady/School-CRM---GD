import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Phone, Mail, Calendar, User, GraduationCap, X, Plus } from "lucide-react";
import { useApp } from "@/app/context/AppContext";
import { toast } from "sonner";
export function AdmissionsCRM() {
  const { leads, addLead, deleteLead, moveLeadStatus } = useApp();
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const columns = [
    { id: "enquiry", title: "New Enquiry", color: "bg-primary" },
    { id: "followup", title: "Follow-up", color: "bg-secondary" },
    { id: "test", title: "Test Scheduled", color: "bg-accent" },
    { id: "interview", title: "Interview", color: "bg-chart-4" },
    { id: "confirmed", title: "Confirmed", color: "bg-chart-5" }
  ].map((col) => ({
    ...col,
    leads: leads.filter((lead) => lead.status === col.id)
  }));
  const moveLead = (leadId, sourceColumnId, targetColumnId) => {
    if (sourceColumnId !== targetColumnId) {
      moveLeadStatus(leadId, targetColumnId);
      toast.success("Lead moved successfully");
    }
  };
  return <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admissions CRM</h1>
            <p className="text-muted-foreground">Track and manage admission leads through the pipeline</p>
          </div>
          <button
    onClick={() => setShowAddForm(true)}
    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
  >
            <Plus className="w-5 h-5" />
            Add Lead
          </button>
        </div>

        {
    /* Stats */
  }
        <div className="grid grid-cols-5 gap-4">
          {columns.map((col) => <div key={col.id} className="bg-card rounded-lg border border-border p-4">
              <div className="text-sm text-muted-foreground mb-1">{col.title}</div>
              <div className="text-2xl font-bold">{col.leads.length}</div>
            </div>)}
        </div>

        {
    /* Kanban Board */
  }
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => <KanbanColumn
    key={column.id}
    column={column}
    onMoveLead={moveLead}
    onSelectLead={setSelectedLead}
  />)}
        </div>

        {
    /* Lead Detail Modal */
  }
        {selectedLead && <LeadDetailModal
    lead={selectedLead}
    onClose={() => setSelectedLead(null)}
  />}

        {
    /* Add Lead Form */
  }
        {showAddForm && <AddLeadModal
    onClose={() => setShowAddForm(false)}
    onAdd={(lead) => {
      addLead(lead);
      setShowAddForm(false);
      toast.success("Lead added successfully");
    }}
  />}
      </div>
    </DndProvider>;
}
function KanbanColumn({ column, onMoveLead, onSelectLead }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "LEAD",
    drop: (item) => {
      onMoveLead(item.id, item.columnId, column.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));
  return <div
    ref={drop}
    className={`flex-shrink-0 w-80 bg-card rounded-lg border border-border transition-colors ${isOver ? "ring-2 ring-primary" : ""}`}
  >
      <div className={`${column.color} bg-opacity-10 p-4 rounded-t-lg border-b border-border`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{column.title}</h3>
          <span className={`${column.color} text-white text-xs px-2 py-1 rounded-full`}>
            {column.leads.length}
          </span>
        </div>
      </div>
      <div className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
        {column.leads.map((lead) => <LeadCard
    key={lead.id}
    lead={lead}
    columnId={column.id}
    onClick={() => onSelectLead(lead)}
  />)}
      </div>
    </div>;
}
function LeadCard({ lead, columnId, onClick }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "LEAD",
    item: { id: lead.id, columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));
  const priorityColors = {
    high: "bg-destructive",
    medium: "bg-chart-5",
    low: "bg-muted-foreground"
  };
  return <div
    ref={drag}
    onClick={onClick}
    className={`bg-card border border-border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all ${isDragging ? "opacity-50" : ""}`}
  >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{lead.studentName}</h4>
          <p className="text-sm text-muted-foreground">{lead.grade}</p>
        </div>
        <span className={`${priorityColors[lead.priority]} w-2 h-2 rounded-full mt-1`} />
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="w-4 h-4" />
          <span className="truncate">{lead.parentName}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="w-4 h-4" />
          <span>{lead.phone}</span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
        <span className="px-2 py-1 bg-muted rounded text-muted-foreground">{lead.source}</span>
        <span className="text-muted-foreground">{lead.date}</span>
      </div>
    </div>;
}
function LeadDetailModal({ lead, onClose }) {
  return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-2xl font-bold">Lead Details</h2>
          <button
    onClick={onClose}
    className="p-2 hover:bg-muted rounded-lg transition-colors"
  >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Student Name</label>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <span className="font-medium">{lead.studentName}</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Grade</label>
              <div className="font-medium">{lead.grade}</div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Parent Name</label>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-secondary" />
                <span className="font-medium">{lead.parentName}</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Phone</label>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-accent" />
                <span className="font-medium">{lead.phone}</span>
              </div>
            </div>
            <div className="col-span-2">
              <label className="text-sm text-muted-foreground mb-1 block">Email</label>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-chart-4" />
                <span className="font-medium">{lead.email}</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Source</label>
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                {lead.source}
              </span>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Date</label>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">{lead.date}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Activity Timeline</h3>
            <div className="space-y-3">
              {[
    { action: "Lead created", date: "2024-01-25 10:30 AM", user: "Admin" },
    { action: "Follow-up call made", date: "2024-01-25 02:15 PM", user: "Sarah" },
    { action: "Email sent", date: "2024-01-26 09:00 AM", user: "Admin" }
  ].map((activity, idx) => <div key={idx} className="flex gap-3 pb-3 border-b border-border last:border-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.date} • by {activity.user}
                    </p>
                  </div>
                </div>)}
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Convert to Student
            </button>
            <button className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
              Schedule Call
            </button>
          </div>
        </div>
      </div>
    </div>;
}
function AddLeadModal({ onClose, onAdd }) {
  const [studentName, setStudentName] = useState("");
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [grade, setGrade] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const handleSubmit = (e) => {
    e.preventDefault();
    const newLead = {
      id: Date.now().toString(),
      studentName,
      parentName,
      email,
      phone,
      grade,
      source,
      date,
      priority,
      status: "enquiry"
    };
    onAdd(newLead);
  };
  return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-2xl font-bold">Add New Lead</h2>
          <button
    onClick={onClose}
    className="p-2 hover:bg-muted rounded-lg transition-colors"
  >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Student Name</label>
              <input
    type="text"
    value={studentName}
    onChange={(e) => setStudentName(e.target.value)}
    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
    required
  />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Grade</label>
              <input
    type="text"
    value={grade}
    onChange={(e) => setGrade(e.target.value)}
    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
    required
  />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Parent Name</label>
              <input
    type="text"
    value={parentName}
    onChange={(e) => setParentName(e.target.value)}
    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
    required
  />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Phone</label>
              <input
    type="tel"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
    required
  />
            </div>
            <div className="col-span-2">
              <label className="text-sm text-muted-foreground mb-1 block">Email</label>
              <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
    required
  />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Source</label>
              <input
    type="text"
    value={source}
    onChange={(e) => setSource(e.target.value)}
    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
    required
  />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Date</label>
              <input
    type="date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
    required
  />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Priority</label>
              <select
    value={priority}
    onChange={(e) => setPriority(e.target.value)}
    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
    required
  >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Add Lead
            </button>
            <button
    onClick={onClose}
    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
  >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>;
}
