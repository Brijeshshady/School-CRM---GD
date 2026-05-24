const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['MCQ', 'Descriptive'],
      required: true,
      default: 'MCQ',
    },
    options: [
      {
        type: String,
        trim: true,
      },
    ],
    correctOption: {
      type: Number, // index of options (0-based) for MCQ
    },
    points: {
      type: Number,
      default: 5,
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

questionSchema.index({ subject: 1 });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
