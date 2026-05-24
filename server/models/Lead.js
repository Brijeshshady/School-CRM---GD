const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    gradeInterested: String,
    source: String,
    stage: {
      type: String,
      enum: ['Inquiry', 'Test', 'Interview', 'Approval', 'Enrolled'],
      default: 'Inquiry',
    },
    entranceTestDate: Date,
    entranceTestScore: Number,
    interviewNotes: String,
    documentsVerified: {
      type: Boolean,
      default: false,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lead', leadSchema);
