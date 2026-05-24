const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
        },
        selectedOption: Number, // index for MCQs
        descriptiveAnswer: String,
        isCorrect: Boolean,
        score: Number,
      },
    ],
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPoints: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

quizAttemptSchema.index({ quiz: 1, student: 1 });

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

module.exports = QuizAttempt;
