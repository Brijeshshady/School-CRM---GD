const mongoose = require('mongoose');

const examScheduleSchema = new mongoose.Schema(
  {
    examType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExamType',
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    academicYear: {
      type: String,
      default: '2025-2026',
    },
    timetable: [
      {
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject',
          required: true,
        },
        date: {
          type: Date,
          required: true,
        },
        startTime: {
          type: String,
          required: true, // e.g. "09:00 AM"
        },
        endTime: {
          type: String,
          required: true, // e.g. "12:00 PM"
        },
        room: {
          type: String,
          trim: true,
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ExamSchedule', examScheduleSchema);
