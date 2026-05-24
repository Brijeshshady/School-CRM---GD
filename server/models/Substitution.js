const mongoose = require('mongoose');

const substitutionSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    period: {
      type: String,
      required: true,
    },
    originalTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    substituteTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Assigned', 'Completed'],
      default: 'Assigned',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate substitutions for the same class, date, and period
substitutionSchema.index({ class: 1, date: 1, period: 1 }, { unique: true });

const Substitution = mongoose.model('Substitution', substitutionSchema);

module.exports = Substitution;
