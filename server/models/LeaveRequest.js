const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast date range checks
leaveRequestSchema.index({ teacher: 1, startDate: 1, endDate: 1 });
leaveRequestSchema.index({ status: 1 });

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);

module.exports = LeaveRequest;
