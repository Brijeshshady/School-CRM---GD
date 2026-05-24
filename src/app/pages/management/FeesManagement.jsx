import {
  DollarSign,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Send,
  Filter
} from "lucide-react";
export function FeesManagement() {
  const stats = [
    { label: "Total Revenue", value: "\u20B91.24 Cr", icon: DollarSign, color: "bg-green-500", change: "+8.2% this term" },
    { label: "Collected", value: "\u20B998.5 L", icon: CheckCircle, color: "bg-blue-500", change: "79.4% of total" },
    { label: "Pending", value: "\u20B925.5 L", icon: Clock, color: "bg-yellow-500", change: "20.6% of total" },
    { label: "Overdue", value: "\u20B98.2 L", icon: AlertCircle, color: "bg-red-500", change: "42 students" }
  ];
  const feeRecords = [
    { id: 1, studentName: "Aarav Kumar", studentId: "STU-2026-0142", class: "10-A", totalFees: 85e3, paid: 85e3, pending: 0, status: "paid", lastPayment: "2026-02-01" },
    { id: 2, studentName: "Priya Patel", studentId: "STU-2026-0087", class: "10-B", totalFees: 85e3, paid: 85e3, pending: 0, status: "paid", lastPayment: "2026-01-28" },
    { id: 3, studentName: "Rohan Sharma", studentId: "STU-2026-0201", class: "11-A", totalFees: 92e3, paid: 46e3, pending: 46e3, status: "partial", lastPayment: "2026-01-15" },
    { id: 4, studentName: "Ananya Singh", studentId: "STU-2026-0155", class: "10-A", totalFees: 85e3, paid: 0, pending: 85e3, status: "pending", lastPayment: null },
    { id: 5, studentName: "Arjun Reddy", studentId: "STU-2026-0178", class: "11-B", totalFees: 92e3, paid: 92e3, pending: 0, status: "paid", lastPayment: "2026-02-03" },
    { id: 6, studentName: "Kavya Iyer", studentId: "STU-2026-0234", class: "11-B", totalFees: 92e3, paid: 3e4, pending: 62e3, status: "overdue", lastPayment: "2025-12-10" }
  ];
  const recentPayments = [
    { date: "2026-02-07", studentName: "Vikram Gupta", amount: 85e3, mode: "Online", receipt: "RCP-2026-0234" },
    { date: "2026-02-06", studentName: "Sneha Malhotra", amount: 46e3, mode: "Cheque", receipt: "RCP-2026-0233" },
    { date: "2026-02-05", studentName: "Aditya Singh", amount: 92e3, mode: "Cash", receipt: "RCP-2026-0232" },
    { date: "2026-02-04", studentName: "Myra Patel", amount: 85e3, mode: "Online", receipt: "RCP-2026-0231" }
  ];
  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "partial":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };
  return <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Fees & Payments</h1>
          <p className="text-slate-600 mt-1">Manage student fees and payment records</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-5 h-5" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {
    /* Stats */
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
    /* Fee Collection Progress */
  }
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Fee Collection Progress (2025-26)</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-600">Annual Target: ₹1.24 Crore</span>
            <span className="font-semibold text-slate-900">₹98.5 Lakh collected (79.4%)</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div className="bg-green-500 h-3 rounded-full" style={{ width: "79.4%" }} />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>₹0</span>
            <span>₹62 L</span>
            <span>₹1.24 Cr</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {
    /* Fee Records */
  }
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Fee Records</h2>
          </div>
          <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
            {feeRecords.map((record) => <div key={record.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-slate-900">{record.studentName}</h3>
                    <p className="text-sm text-slate-500">{record.studentId} • Class {record.class}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Fees:</span>
                    <span className="font-medium text-slate-900">₹{record.totalFees.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Paid:</span>
                    <span className="font-medium text-green-600">₹{record.paid.toLocaleString("en-IN")}</span>
                  </div>
                  {record.pending > 0 && <div className="flex justify-between">
                      <span className="text-slate-600">Pending:</span>
                      <span className="font-medium text-red-600">₹{record.pending.toLocaleString("en-IN")}</span>
                    </div>}
                  {record.lastPayment && <div className="flex justify-between">
                      <span className="text-slate-600">Last Payment:</span>
                      <span className="text-slate-900">{new Date(record.lastPayment).toLocaleDateString("en-IN")}</span>
                    </div>}
                </div>
                {record.pending > 0 && <button className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    <Send className="w-4 h-4" />
                    Send Reminder
                  </button>}
              </div>)}
          </div>
        </div>

        {
    /* Recent Payments */
  }
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Recent Payments</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {recentPayments.map((payment, idx) => <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{payment.studentName}</h3>
                      <p className="text-sm text-slate-500">{new Date(payment.date).toLocaleDateString("en-IN")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">₹{payment.amount.toLocaleString("en-IN")}</p>
                    <p className="text-xs text-slate-500">{payment.mode}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Receipt: {payment.receipt}</span>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Download
                  </button>
                </div>
              </div>)}
          </div>
          <div className="p-4 border-t border-slate-200">
            <button className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All Payments →
            </button>
          </div>
        </div>
      </div>

      {
    /* Payment Methods */
  }
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Payment Methods Distribution</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-slate-900">Online</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">62%</p>
            <p className="text-sm text-slate-600">₹61 Lakh</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              <span className="font-semibold text-slate-900">Cash</span>
            </div>
            <p className="text-2xl font-bold text-green-600">23%</p>
            <p className="text-sm text-slate-600">₹22.5 Lakh</p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-purple-600" />
              <span className="font-semibold text-slate-900">Cheque</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">15%</p>
            <p className="text-sm text-slate-600">₹15 Lakh</p>
          </div>
        </div>
      </div>
    </div>;
}
