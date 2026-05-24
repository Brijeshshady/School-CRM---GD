const mongoose = require('mongoose');

/**
 * Parent Model
 * Purpose: Stores role-specific business data for parents.
 */
const parentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    occupation: String,
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
parentSchema.index({ user: 1 });

const Parent = mongoose.model('Parent', parentSchema);

module.exports = Parent;
