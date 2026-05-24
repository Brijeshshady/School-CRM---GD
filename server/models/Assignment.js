const mongoose = require('mongoose');
const { ASSIGNMENT_STATUS } = require('../constants');

/**
 * Assignment Model
 * Purpose: Stores high-volume daily operational records for academic tasks.
 */
const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an assignment title'],
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ASSIGNMENT_STATUS),
      default: ASSIGNMENT_STATUS.PUBLISHED,
    },
    attachments: [String],
    totalMarks: Number,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
assignmentSchema.index({ subject: 1 });
assignmentSchema.index({ class: 1 });
assignmentSchema.index({ teacher: 1 });

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
