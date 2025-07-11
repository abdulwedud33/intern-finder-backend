const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['free', 'paid'],
      required: true,
    },
    skills: [
      {
        type: String,
        trim: true,
      }
    ],
    location: {
      type: String,
      trim: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for search performance
listingSchema.index({ type: 1, location: 1, skills: 1 });

module.exports = mongoose.model('Listing', listingSchema);
