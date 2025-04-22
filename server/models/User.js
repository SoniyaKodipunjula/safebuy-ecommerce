const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  mfaEnabled: {
    type: Boolean,
    default: false,
  },

  mfaCode: {
    type: String,
  },

  mfaExpiry: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
