const mongoose = require('mongoose');

/**
 * Student Model
 * Purpose: Stores role-specific business data for students.
 */
const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
    parentIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parent',
      },
    ],
    rollNumber: {
      type: String,
      trim: true,
    },
    dateOfBirth: Date,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    status: {
      type: String,
      enum: ['Active', 'Suspended', 'Transferred', 'Alumni'],
      default: 'Active',
    },
    medicalRecords: [
      {
        condition: String,
        severity: {
          type: String,
          enum: ['Low', 'Medium', 'High'],
        },
        notes: String,
      },
    ],
    certificates: [
      {
        name: String,
        fileUrl: String,
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    academicHistory: [
      {
        schoolName: String,
        classPassed: String,
        marksPercentage: Number,
        passingYear: String,
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

// Indexes
studentSchema.index({ user: 1 });
studentSchema.index({ class: 1 });

// Auto-generate roll number if missing
studentSchema.pre('save', async function () {
  if (this.isNew && !this.rollNumber && this.class) {
    const Student = this.constructor;
    const lastStudent = await Student.findOne({ class: this.class })
      .sort({ rollNumber: -1 })
      .collation({ locale: 'en', numericOrdering: true });
    
    if (lastStudent && lastStudent.rollNumber) {
      const nextRoll = parseInt(lastStudent.rollNumber) + 1;
      this.rollNumber = nextRoll.toString();
    } else {
      this.rollNumber = '1';
    }
  }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
