import { motion } from "motion/react";
import { Download } from "lucide-react";
import { Card, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { useParentStudentData } from "./hooks/useParentData";

import { AlertCircle } from "lucide-react";

export const ParentFees = () => {
  const { linkedStudents, selectedStudentId, setSelectedStudentId, studentData, isLoading } = useParentStudentData();

  if (isLoading) return <div className="py-20 text-center text-slate-400">Loading student data...</div>;

  if (linkedStudents.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-slate-200 max-w-lg mx-auto mt-20">
        <AlertCircle className="w-12 h-12 text-indigo-500 mx-auto mb-4 animate-pulse" />
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-wider">No Student Linked</h3>
        <p className="text-slate-500 mt-2 font-medium">Please contact administration to link your child's account to this portal.</p>
      </div>
    );
  }

  const fees = studentData.fees || [];
  
  const totalFees = fees.reduce((acc, f) => acc + (f.amount || 0), 0);
  const paidFees = fees.filter(f => f.status === "Paid").reduce((acc, f) => acc + (f.amount || 0), 0);
  const pendingFees = fees.filter(f => f.status !== "Paid").reduce((acc, f) => acc + (f.amount || 0), 0);

  return (
    <motion.div
      key="fees"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Fee Payments</h1>
          <p className="text-slate-500 mt-1">Manage and track fee payments</p>
        </div>
        
        {linkedStudents.length > 1 && (
          <select 
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
          >
            {linkedStudents.map(student => (
              <option key={student._id} value={student._id}>
                {student.user?.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-slate-500 font-medium mb-2">Total Fees</p>
          <p className="text-3xl font-bold text-slate-900">₹{totalFees.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500 font-medium mb-2">Paid</p>
          <p className="text-3xl font-bold text-green-600">₹{paidFees.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500 font-medium mb-2">Pending</p>
          <p className="text-3xl font-bold text-orange-600">₹{pendingFees.toLocaleString()}</p>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <CardTitle>Payment History</CardTitle>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            <Download className="w-4 h-4" />
            Print Receipt
          </button>
        </div>
        <div className="space-y-3">
          {fees.length > 0 ? fees.map((fee) => (
            <div key={fee._id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{fee.title || fee.type}</p>
                <p className="text-sm text-slate-500 mt-1">Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-6">
                <p className="text-lg font-bold text-slate-900">₹{fee.amount.toLocaleString()}</p>
                <Badge variant={fee.status === "Paid" ? "success" : "warning"} className="min-w-[80px] justify-center px-4 py-2 text-sm">
                  {fee.status}
                </Badge>
                {fee.status !== "Paid" && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          )) : (
            <div className="py-10 text-center text-slate-400 italic">No fee records found</div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
