const mongoose = require('mongoose');

/**
 * ExamType Model
 * Purpose: Allows administrators to dynamically configure different assessment types (e.g. Unit Test, Midterm, Annual).
 */
const examTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide an exam type name'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Please provide an exam type code'],
      unique: true,
      trim: true,
    },
    description: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const ExamType = mongoose.model('ExamType', examTypeSchema);

module.exports = ExamType;
