const mongoose = require('mongoose');

const bridgeDataSchema = new mongoose.Schema(
  {
    bridgeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bridge',
      required: true,
    },
    vibration: {
      type: Number,
      default: 0,
    },
    load: {
      type: Number,
      default: 0,
    },
    crack: {
      type: Number,
      default: 0,
    },
    temperature: {
      type: Number,
      default: 0,
    },
    riskScore: {
      type: Number,
      default: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

// Automatically delete data older than 30 days
bridgeDataSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model('BridgeData', bridgeDataSchema);
