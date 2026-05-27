const mongoose = require('mongoose');

const vehicleRouteSchema = new mongoose.Schema(
  {
    routeName: {
      type: String,
      required: true,
      trim: true,
    },
    routeNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      trim: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
    },
    driverName: {
      type: String,
      trim: true,
    },
    driverPhone: {
      type: String,
      trim: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assistant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    stops: [
      {
        stopName: {
          type: String,
          required: true,
          trim: true,
        },
        latitude: {
          type: Number,
          required: true,
        },
        longitude: {
          type: Number,
          required: true,
        },
        scheduledTime: String,
      },
    ],
    studentsAllocated: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student',
        },
        stopName: {
          type: String,
          required: true,
        }
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('VehicleRoute', vehicleRouteSchema);
