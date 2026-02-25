const mongoose = require("mongoose")

const devoteeSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    spouseName: {
      type: String,
    },
    gotra: {
      type: String,
    },
    nakshatra: {
      type: String,
    },
    rashi: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Devotee", devoteeSchema)