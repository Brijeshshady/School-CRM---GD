import { useState, useDeferredValue } from "react";
import {
  Users,
  UserPlus,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  Calendar,
  FileText,
  TrendingUp,
  AlertCircle,
  Eye,
  Edit,
  Send
} from "lucide-react";
export function AdmissionsCRM() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const admissions = [
    {
      id: "ADM-2026-001",
      studentName: "Aryan Kapoor",
      class: "11",
      parentName: "Neha Kapoor",
      phone: "+91 98123 45678",
      email: "neha.kapoor@gmail.com",
      appliedDate: "2026-01-15",
      status: "pending",
      lastContact: "2026-02-05",
      source: "Website",
      interviewDate: "2026-02-10",
      priority: "high"
    },
    {
      id: "ADM-2026-002",
      studentName: "Diya Mehta",
      class: "10",
      parentName: "Rajiv Mehta",
      phone: "+91 97654 32109",
      email: "rajiv.mehta@gmail.com",
      appliedDate: "2026-01-18",
      status: "approved",
      lastContact: "2026-02-06",
      source: "Referral",
      interviewDate: "2026-02-08",
      priority: "medium"
    },
    {
      id: "ADM-2026-003",
      studentName: "Ishaan Verma",
      class: "12",
      parentName: "Priya Verma",
      phone: "+91 99887 76655",
      email: "priya.verma@gmail.com",
      appliedDate: "2026-01-20",
      status: "interview",
      lastContact: "2026-02-04",
      source: "Walk-in",
      interviewDate: "2026-02-09",
      priority: "high"
    },
    {
      id: "ADM-2026-004",
      studentName: "Saanvi Sharma",
      class: "10",
      parentName: "Karan Sharma",
      phone: "+91 98234 56789",
      email: "karan.sharma@gmail.com",
      appliedDate: "2026-01-22",
      status: "rejected",
      lastContact: "2026-02-03",
      source: "Website",
      interviewDate: null,
      priority: "low"
    },
    {
      id: "ADM-2026-005",
      studentName: "Aditya Singh",
      class: "11",
      parentName: "Sunita Singh",
      phone: "+91 96543 21098",
      email: "sunita.singh@gmail.com",
      appliedDate: "2026-01-25",
      status: "pending",
      lastContact: "2026-02-06",
      source: "Social Media",
      interviewDate: "2026-02-11",
      priority: "medium"
    },
    {
      id: "ADM-2026-006",
      studentName: "Myra Reddy",
      class: "10",
      parentName: "Suresh Reddy",
      phone: "+91 98876 54321",
      email: "suresh.reddy@gmail.com",
      appliedDate: "2026-01-28",
      status: "interview",
      lastContact: "2026-02-07",
      source: "Referral",
      interviewDate: "2026-02-12",
      priority: "high"
    },
    {
      id: "ADM-2026-007",
      studentName: "Vihaan Gupta",
      class: "11",
      parentName: "Anjali Gupta",
      phone: "+91 99123 87654",
      email: "anjali.gupta@gmail.com",
      appliedDate: "2026-02-01",
      status: "approved",
      lastContact: "2026-02-07",
      source: "Website",
      interviewDate: "2026-02-09",
      priority: "medium"
    },
    {
      id: "ADM-2026-008",
      studentName: "Aadhya Patel",
      class: "12",
      parentName: "Amit Patel",
      phone: "+91 97654 32109",
      email: "amit.patel@gmail.com",
      appliedDate: "2026-02-03",
      status: "pending",
      lastContact: "2026-02-05",
      source: "Walk-in",
      interviewDate: "2026-02-13",
      priority: "high"
    }
  ];
  const stats = [
    {
      label: "Total Applications",
      value: "156",
      icon: Users,
      color: "bg-blue-500",
      change: "+23 this month"
    },
    {
      label: "Pending Review",
      value: "42",
      icon: Clock,
      color: "bg-yellow-500",
      change: "27% of total"
    },
    {
      label: "Approved",
      value: "89",
      icon: CheckCircle,
      color: "bg-green-500",
      change: "57% approval rate"
    },
    {
      label: "Interviews Scheduled",
      value: "18",
      icon: Calendar,
      color: "bg-purple-500",
      change: "Next 7 days"
    }
  ];
  const filteredAdmissions = admissions.filter((adm) => {
    const matchesStatus = selectedStatus === "all" || adm.status === selectedStatus;
    const matchesSearch = !deferredSearchQuery || 
      adm.studentName.toLowerCase().includes(deferredSearchQuery.toLowerCase()) ||
      adm.parentName.toLowerCase().includes(deferredSearchQuery.toLowerCase()) ||
      adm.id.toLowerCase().includes(deferredSearchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "interview":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };
  return <div className="p-8 space-y-6">
      {
    /* Header */
  }
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admissions CRM</h1>
          <p className="text-slate-600 mt-1">Manage admission applications and track enrollment pipeline</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <UserPlus className="w-5 h-5" />
          New Application
        </button>
      </div>

      {
    /* Statistics Cards */
  }
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">{stat.change}</p>
          </div>)}
      </div>

      {
    /* Conversion Funnel */
  }
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Admission Funnel</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="bg-blue-100 text-blue-700 rounded-lg p-4 mb-2">
              <p className="text-3xl font-bold">156</p>
            </div>
            <p className="text-sm font-medium text-slate-900">Applied</p>
            <p className="text-xs text-slate-500">100%</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 text-purple-700 rounded-lg p-4 mb-2">
              <p className="text-3xl font-bold">78</p>
            </div>
            <p className="text-sm font-medium text-slate-900">Interviewed</p>
            <p className="text-xs text-slate-500">50%</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 text-green-700 rounded-lg p-4 mb-2">
              <p className="text-3xl font-bold">89</p>
            </div>
            <p className="text-sm font-medium text-slate-900">Approved</p>
            <p className="text-xs text-slate-500">57%</p>
          </div>
          <div className="text-center">
            <div className="bg-emerald-100 text-emerald-700 rounded-lg p-4 mb-2">
              <p className="text-3xl font-bold">67</p>
            </div>
            <p className="text-sm font-medium text-slate-900">Enrolled</p>
            <p className="text-xs text-slate-500">43%</p>
          </div>
        </div>
      </div>

      {
    /* Filters */
  }
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-700">Filter by status:</span>
          <div className="flex gap-2">
            {[
              { value: "all", label: "All" },
              { value: "pending", label: "Pending" },
              { value: "interview", label: "Interview" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" }
            ].map((filter) => <button
              key={filter.value}
              onClick={() => setSelectedStatus(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedStatus === filter.value ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            >
              {filter.label}
            </button>)}
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 hover:bg-slate-100/50 focus:bg-white transition-all"
          />
        </div>
      </div>

      {
    /* Applications Table */
  }
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Application ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Student</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Class</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Parent Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Applied Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Interview</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Priority</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredAdmissions.map((admission) => <tr key={admission.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900">{admission.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">{admission.studentName}</p>
                      <p className="text-sm text-slate-500">Parent: {admission.parentName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-900">Class {admission.class}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="w-4 h-4" />
                        {admission.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-4 h-4" />
                        <span className="truncate max-w-[150px]">{admission.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(admission.appliedDate).toLocaleDateString("en-IN")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {admission.interviewDate ? <div className="text-sm">
                        <p className="font-medium text-slate-900">
                          {new Date(admission.interviewDate).toLocaleDateString("en-IN")}
                        </p>
                        <p className="text-slate-500">Scheduled</p>
                      </div> : <span className="text-sm text-slate-400">Not scheduled</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(admission.status)}`}>
                      {admission.status.charAt(0).toUpperCase() + admission.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(admission.priority)}`}>
                      {admission.priority.charAt(0).toUpperCase() + admission.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Contact">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>

        {
    /* Footer */
  }
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            Showing <span className="font-medium">{filteredAdmissions.length}</span> of <span className="font-medium">{admissions.length}</span> applications
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              1
            </button>
            <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              2
            </button>
            <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {
    /* Quick Actions */
  }
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Follow-up Required</h3>
              <p className="text-sm text-slate-600 mb-3">8 applications need follow-up call within 48 hours</p>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                View List →
              </button>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">This Week's Interviews</h3>
              <p className="text-sm text-slate-600 mb-3">18 interviews scheduled between Feb 8-14</p>
              <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
                View Schedule →
              </button>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Conversion Rate</h3>
              <p className="text-sm text-slate-600 mb-3">57% approval rate, +12% from last month</p>
              <button className="text-sm font-medium text-green-600 hover:text-green-700">
                View Analytics →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
