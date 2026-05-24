const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Partial', 'Paid', 'Overdue'],
      default: 'Pending',
    },
    category: {
      type: String,
      enum: ['Tuition', 'Transport', 'Lab', 'Library', 'Exam', 'Other'],
      default: 'Tuition',
    },
    paymentHistory: [
      {
        amount: Number,
        date: { type: Date, default: Date.now },
        method: String,
        transactionId: String,
        receiptNo: String,
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Fee', feeSchema);
