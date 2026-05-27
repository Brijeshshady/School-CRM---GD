const mongoose = require('mongoose');

/**
 * AssignmentSubmission Model
 * Purpose: Tracks individual student assignment/homework submissions with grading status.
 */
const assignmentSubmissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: [true, 'Assignment reference is required'],
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required'],
    },
    submissionText: {
      type: String,
      trim: true,
    },
    attachments: [String], // URLs or file paths
    status: {
      type: String,
      enum: ['submitted', 'graded'],
      default: 'submitted',
    },
    grade: {
      type: String,
      default: '',
    },
    score: {
      type: Number,
      default: null,
    },
    feedback: {
      type: String,
      default: '',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
assignmentSubmissionSchema.index({ assignment: 1, student: 1 });
assignmentSubmissionSchema.index({ student: 1 });
assignmentSubmissionSchema.index({ assignment: 1 });

const AssignmentSubmission = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);

module.exports = AssignmentSubmission;
