const mongoose = require('mongoose');

const hostelRoomSchema = new mongoose.Schema(
  {
    block: {
      type: String,
      required: true,
      trim: true,
    },
    roomNumber: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['AC', 'Non-AC'],
      default: 'Non-AC',
    },
    capacity: {
      type: Number,
      default: 3,
      min: 1,
    },
    occupants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('HostelRoom', hostelRoomSchema);
