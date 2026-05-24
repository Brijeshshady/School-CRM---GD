const mongoose = require('mongoose');

/**
 * Grade Model
 * Purpose: Stores high-volume daily operational records for student assessments.
 */
const gradeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
    },
    marksObtained: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    grade: String,
    remarks: String,
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
gradeSchema.index({ student: 1, subject: 1 });
gradeSchema.index({ assignment: 1 });

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;
