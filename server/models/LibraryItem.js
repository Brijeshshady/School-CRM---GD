const mongoose = require('mongoose');

const libraryItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      trim: true,
    },
    isbn: {
      type: String,
      trim: true,
    },
    category: String,
    status: {
      type: String,
      enum: ['Available', 'Issued', 'Lost'],
      default: 'Available',
    },
    issuedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    dueDate: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('LibraryItem', libraryItemSchema);
