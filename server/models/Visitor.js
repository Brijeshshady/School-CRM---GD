const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    purpose: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    checkInTime: {
      type: Date,
      default: Date.now,
    },
    checkOutTime: Date,
    status: {
      type: String,
      enum: ['Checked-In', 'Checked-Out'],
      default: 'Checked-In',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Visitor', visitorSchema);
