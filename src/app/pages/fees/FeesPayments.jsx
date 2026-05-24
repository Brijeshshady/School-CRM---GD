import { useState } from "react";
import { DollarSign, CreditCard, CheckCircle, Clock, AlertCircle, X } from "lucide-react";
import { useApp } from "@/app/context/AppContext";
import { toast } from "sonner";
export function FeesPayments() {
  const { feeRecords, addPayment } = useApp();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const totalFees = feeRecords.reduce((sum, record) => sum + record.totalFee, 0);
  const totalPaid = feeRecords.reduce((sum, record) => sum + record.paid, 0);
  const totalPending = feeRecords.reduce((sum, record) => sum + record.pending, 0);
  const handleCollectPayment = (record) => {
    setSelectedRecord(record);
    setShowPaymentModal(true);
  };
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Fees & Payments</h1>
        <p className="text-muted-foreground">Manage and track fee collection</p>
      </div>

      {
    /* Stats */
  }
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <span className="font-medium">Total Fees</span>
          </div>
          <div className="text-2xl font-bold">${totalFees.toLocaleString()}</div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-accent" />
            </div>
            <span className="font-medium">Collected</span>
          </div>
          <div className="text-2xl font-bold text-accent">${totalPaid.toLocaleString()}</div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-chart-5/10 rounded-lg">
              <Clock className="w-5 h-5 text-chart-5" />
            </div>
            <span className="font-medium">Pending</span>
          </div>
          <div className="text-2xl font-bold text-chart-5">${totalPending.toLocaleString()}</div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <span className="font-medium">Overdue</span>
          </div>
          <div className="text-2xl font-bold text-destructive">
            ${feeRecords.filter((r) => r.status === "overdue").reduce((sum, r) => sum + r.pending, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {
    /* Table */
  }
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-sm">Student Name</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Class</th>
                <th className="text-right py-3 px-4 font-medium text-sm">Total Fee</th>
                <th className="text-right py-3 px-4 font-medium text-sm">Paid</th>
                <th className="text-right py-3 px-4 font-medium text-sm">Pending</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Due Date</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feeRecords.map((record) => <tr key={record.id} className="border-b border-border hover:bg-muted/30">
                  <td className="py-3 px-4 font-medium">{record.studentName}</td>
                  <td className="py-3 px-4">{record.class}</td>
                  <td className="py-3 px-4 text-right">${record.totalFee.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-accent">${record.paid.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-medium">${record.pending.toLocaleString()}</td>
                  <td className="py-3 px-4">{record.dueDate}</td>
                  <td className="py-3 px-4">
                    <span
    className={`inline-block px-2 py-1 text-xs rounded-full ${record.status === "paid" ? "bg-accent/10 text-accent" : record.status === "partial" ? "bg-primary/10 text-primary" : record.status === "overdue" ? "bg-destructive/10 text-destructive" : "bg-chart-5/10 text-chart-5"}`}
  >
                      {record.status === "paid" ? "Paid" : record.status === "partial" ? "Partial" : record.status === "overdue" ? "Overdue" : "Pending"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {record.pending > 0 && <button
    onClick={() => handleCollectPayment(record)}
    className="flex items-center gap-2 px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
  >
                        <CreditCard className="w-4 h-4" />
                        Collect
                      </button>}
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {
    /* Payment Modal */
  }
      {showPaymentModal && selectedRecord && <PaymentModal
    record={selectedRecord}
    onClose={() => {
      setShowPaymentModal(false);
      setSelectedRecord(null);
    }}
    onSubmit={(payment) => {
      addPayment(selectedRecord.id, payment);
      setShowPaymentModal(false);
      setSelectedRecord(null);
      toast.success("Payment recorded successfully");
    }}
  />}
    </div>;
}
function PaymentModal({ record, onClose, onSubmit }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [receiptNo, setReceiptNo] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    const paymentAmount = parseFloat(amount);
    if (paymentAmount <= 0 || paymentAmount > record.pending) {
      toast.error("Invalid payment amount");
      return;
    }
    onSubmit({
      amount: paymentAmount,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      method,
      receiptNo
    });
  };
  return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl max-w-md w-full shadow-2xl">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-2xl font-bold">Collect Payment</h2>
          <button
    onClick={onClose}
    className="p-2 hover:bg-muted rounded-lg transition-colors"
  >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Student</span>
              <span className="font-medium">{record.studentName}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Fee</span>
              <span className="font-medium">${record.totalFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Already Paid</span>
              <span className="font-medium text-accent">${record.paid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="font-semibold">Pending Amount</span>
              <span className="font-bold text-destructive">${record.pending.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Payment Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <input
    type="number"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
    className="w-full pl-8 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
    placeholder="0.00"
    step="0.01"
    max={record.pending}
    required
  />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Payment Method</label>
            <select
    value={method}
    onChange={(e) => setMethod(e.target.value)}
    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
    required
  >
              <option>Cash</option>
              <option>Credit Card</option>
              <option>Debit Card</option>
              <option>Bank Transfer</option>
              <option>Check</option>
              <option>Online Payment</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Receipt Number</label>
            <input
    type="text"
    value={receiptNo}
    onChange={(e) => setReceiptNo(e.target.value)}
    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
    placeholder="RCP-001"
    required
  />
          </div>

          <div className="flex gap-3 pt-4">
            <button
    type="submit"
    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
  >
              Record Payment
            </button>
            <button
    type="button"
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
