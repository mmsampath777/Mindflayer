const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamId: {
    type: String,
    unique: true,
    required: true
  },
  teamName: {
    type: String,
    required: true
  },
  teamLeader: {
    type: String,
    required: true
  },
  teamCount: {
    type: Number,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  registrationTime: {
    type: Date,
    default: Date.now
  },
  hasStarted: {
    type: Boolean,
    default: false
  },
  eventStartTime: {
    type: Date
  },
  round1CompletedTime: {
    type: Date
  },
  round2CompletedTime: {
    type: Date
  },
  round3CompletedTime: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals for dynamic time calculations - will be handled in controller for sorting if needed
// but virtuals are good for API responses

teamSchema.virtual('round1Time').get(function () {
  if (this.round1CompletedTime && this.eventStartTime) {
    return ((this.round1CompletedTime - this.eventStartTime) / 60000).toFixed(2); // in minutes
  }
  return null;
});

teamSchema.virtual('round2Time').get(function () {
  if (this.round2CompletedTime && this.round1CompletedTime) {
    return ((this.round2CompletedTime - this.round1CompletedTime) / 60000).toFixed(2);
  }
  return null;
});

teamSchema.virtual('round3Time').get(function () {
  if (this.round3CompletedTime && this.round2CompletedTime) {
    return ((this.round3CompletedTime - this.round2CompletedTime) / 60000).toFixed(2);
  }
  return null;
});

teamSchema.virtual('totalTime').get(function () {
  if (this.round3CompletedTime && this.eventStartTime) {
    return ((this.round3CompletedTime - this.eventStartTime) / 60000).toFixed(2);
  }
  return null;
});

module.exports = mongoose.model('Team', teamSchema);
