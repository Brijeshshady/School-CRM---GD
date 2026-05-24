const mongoose = require('mongoose');

/**
 * Subject Model
 * Purpose: Defines subjects taught in the school.
 */
const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a subject name'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Please provide a subject code'],
      unique: true,
      trim: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
    department: {
      type: String,
      trim: true,
    },
    credits: {
      type: Number,
      default: 3,
    },
    weeklyHours: {
      type: Number,
      default: 4,
    },
    semester: {
      type: String,
      trim: true,
    },
    year: {
      type: String,
      trim: true,
    },
    subjectType: {
      type: String,
      enum: ['Core', 'Elective', 'Practical', 'Lab', 'Extracurricular'],
      default: 'Core',
    },
    description: String,
    studyMaterials: [
      {
        title: { type: String, required: true },
        type: {
          type: String,
          enum: ['PDF', 'Video', 'Link'],
          required: true,
        },
        url: { type: String, required: true },
        uploadedAt: {
          type: Date,
          default: Date.now,
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

// Indexes
subjectSchema.index({ teacher: 1 });
subjectSchema.index({ class: 1 });

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
