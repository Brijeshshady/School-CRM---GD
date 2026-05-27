const mongoose = require('mongoose');

const busAttendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VehicleRoute',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    tripType: {
      type: String,
      enum: ['Pickup', 'Dropoff'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Boarded', 'Absent', 'Left'],
      required: true,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    markedAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);

// Compound index to avoid duplicate markings for the same student on the same day/trip
busAttendanceSchema.index({ student: 1, date: 1, tripType: 1 }, { unique: true });

module.exports = mongoose.model('BusAttendance', busAttendanceSchema);
