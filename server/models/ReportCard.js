const mongoose = require('mongoose');

/**
 * ReportCard Model
 * Purpose: Stores compiled academic transcripts for students per academic year/term.
 */
const reportCardSchema = new mongoose.Schema(
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
    academicYear: {
      type: String,
      required: true,
      default: '2025-2026',
    },
    term: {
      type: String,
      required: true,
      default: 'Full Year',
    },
    subjectGrades: [
      {
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject',
          required: true,
        },
        examMarks: [
          {
            examType: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'ExamType',
              required: true,
            },
            marks: {
              theory: Number,
              practical: Number,
              assignment: Number,
              attendance: Number,
              viva: Number,
            },
            maxMarks: {
              theory: Number,
              practical: Number,
              assignment: Number,
              attendance: Number,
              viva: Number,
            },
            totalObtained: Number,
            totalMax: Number,
            percentage: Number,
            grade: String,
          }
        ],
        subjectPercentage: Number,
        subjectGrade: String,
        teacherRemarks: String,
      }
    ],
    attendancePercentage: {
      type: Number,
      default: 100,
    },
    overallPercentage: {
      type: Number,
      default: 0,
    },
    gpa: {
      type: Number,
      default: 0,
    },
    cgpa: {
      type: Number,
      default: 0,
    },
    classRank: {
      type: Number,
    },
    classPercentile: {
      type: Number,
    },
    teacherRemarks: {
      type: String,
      default: '',
    },
    principalRemarks: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    publishedAt: Date,
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

reportCardSchema.index({ student: 1, academicYear: 1, term: 1 }, { unique: true });

const ReportCard = mongoose.model('ReportCard', reportCardSchema);

module.exports = ReportCard;
