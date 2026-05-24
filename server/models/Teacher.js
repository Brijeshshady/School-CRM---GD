const mongoose = require('mongoose');

/**
 * Teacher Model
 * Purpose: Stores role-specific business data for teachers.
 */
const teacherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    assignedClasses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
      },
    ],
    assignedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    canUploadTimetable: {
      type: Boolean,
      default: false,
    },
    department: {
      type: String,
      trim: true,
    },
    qualification: String,
    joiningDate: Date,
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
teacherSchema.index({ user: 1 });

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
