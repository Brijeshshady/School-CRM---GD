const mongoose = require('mongoose');

const vehicleRouteSchema = new mongoose.Schema(
  {
    routeName: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      trim: true,
    },
    driverName: {
      type: String,
      trim: true,
    },
    driverPhone: {
      type: String,
      trim: true,
    },
    stops: [
      {
        type: String,
        trim: true,
      },
    ],
    studentsAllocated: [
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

module.exports = mongoose.model('VehicleRoute', vehicleRouteSchema);
