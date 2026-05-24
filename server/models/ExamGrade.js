const mongoose = require('mongoose');

/**
 * ExamGrade Model
 * Purpose: Stores gradebook entries including theory, practical, assignment, attendance, and viva components.
 */
const examGradeSchema = new mongoose.Schema(
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
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    examType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExamType',
      required: true,
    },
    marks: {
      theory: { type: Number, default: 0 },
      practical: { type: Number, default: 0 },
      assignment: { type: Number, default: 0 },
      attendance: { type: Number, default: 0 },
      viva: { type: Number, default: 0 },
    },
    maxMarks: {
      theory: { type: Number, default: 0 },
      practical: { type: Number, default: 0 },
      assignment: { type: Number, default: 0 },
      attendance: { type: Number, default: 0 },
      viva: { type: Number, default: 0 },
    },
    totalObtained: {
      type: Number,
      default: 0,
    },
    totalMax: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    grade: {
      type: String,
      default: '',
    },
    remarks: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    academicYear: {
      type: String,
      default: '2025-2026',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
examGradeSchema.index({ student: 1, class: 1, subject: 1, examType: 1 }, { unique: true });
examGradeSchema.index({ class: 1, subject: 1, examType: 1 });

// Helper function to calculate GPA from percentage
examGradeSchema.statics.calculateGPA = function (percentage) {
  if (percentage >= 90) return 4.0;
  if (percentage >= 80) return 3.5;
  if (percentage >= 70) return 3.0;
  if (percentage >= 60) return 2.5;
  if (percentage >= 50) return 2.0;
  if (percentage >= 40) return 1.5;
  return 0.0;
};

// Calculate totals, percentage, grade before saving
examGradeSchema.pre('save', function () {
  const m = this.marks;
  const mx = this.maxMarks;
  
  let totalObtained = 0;
  let totalMax = 0;
  
  const components = ['theory', 'practical', 'assignment', 'attendance', 'viva'];
  components.forEach(comp => {
    if (mx[comp] > 0) {
      totalObtained += m[comp] || 0;
      totalMax += mx[comp];
    }
  });
  
  this.totalObtained = totalObtained;
  this.totalMax = totalMax;
  
  if (totalMax > 0) {
    this.percentage = parseFloat(((totalObtained / totalMax) * 100).toFixed(2));
  } else {
    this.percentage = 0;
  }
  
  const p = this.percentage;
  if (p >= 90) this.grade = 'A+';
  else if (p >= 80) this.grade = 'A';
  else if (p >= 70) this.grade = 'B';
  else if (p >= 60) this.grade = 'C';
  else if (p >= 50) this.grade = 'D';
  else if (p >= 40) this.grade = 'E';
  else this.grade = 'F';
});

const ExamGrade = mongoose.model('ExamGrade', examGradeSchema);

module.exports = ExamGrade;
