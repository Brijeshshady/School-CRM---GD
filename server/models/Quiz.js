const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    timeLimit: {
      type: Number, // in minutes
      default: 30,
    },
    allowMultipleAttempts: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

quizSchema.index({ subject: 1 });
quizSchema.index({ class: 1 });

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
