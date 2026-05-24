const mongoose = require('mongoose');
const { ATTENDANCE_STATUS } = require('../constants');

/**
 * Attendance Model
 * Purpose: Stores high-volume daily operational records for student presence.
 */
const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ATTENDANCE_STATUS),
      default: ATTENDANCE_STATUS.PRESENT,
    },
    period: {
      type: String,
      default: 'Daily',
    },
    type: {
      type: String,
      enum: ['Daily', 'Period'],
      default: 'Daily',
    },
    mode: {
      type: String,
      enum: ['Online', 'Offline'],
      default: 'Offline',
    },
    remarks: String,
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate attendance for the same student, day, and period
attendanceSchema.index({ student: 1, date: 1, period: 1 }, { unique: true });
attendanceSchema.index({ class: 1, date: 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
