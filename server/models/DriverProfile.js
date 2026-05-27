const mongoose = require('mongoose');

const driverProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['Driver', 'Assistant'],
      required: true,
    },
    licenseNumber: {
      type: String,
      trim: true,
    },
    licenseExpiry: Date,
    contactNumber: {
      type: String,
      trim: true,
    },
    assignedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DriverProfile', driverProfileSchema);
