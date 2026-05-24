const mongoose = require('mongoose');

/**
 * Class Model
 * Purpose: Defines school structure and academic organization.
 */
const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a class name'],
      trim: true,
    },
    section: {
      type: String,
      required: [true, 'Please provide a section'],
      trim: true,
    },
    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
    },
    roomNumber: String,
    academicYear: String,
    capacity: {
      type: Number,
      default: 40,
    },
    stream: {
      type: String,
      enum: ['Science', 'Commerce', 'Arts', 'General'],
      default: 'General',
    },
    batch: {
      type: String,
      default: '2026-2027',
    },
    subjects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    }],
    subjectTeachers: [
      {
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject',
        },
        teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Teacher',
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for name and section
classSchema.index({ name: 1, section: 1 }, { unique: true });

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
