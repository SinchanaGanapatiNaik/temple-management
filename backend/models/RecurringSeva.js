const mongoose = require("mongoose")

const recurringSevaSchema = new mongoose.Schema(
  {
    devotee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Devotee",
      required: true,
    },

    type: {
      type: String,
      enum: ["BIRTHDAY", "ANNIVERSARY"],
      required: true,
    },

    month: {
      type: Number,
      required: true,
    },

    day: {
      type: Number,
      required: true,
    },

    lifetime: {
      type: Boolean,
      default: true,
    },

    includesAnnadaan: {
      type: Boolean,
      default: false,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("RecurringSeva", recurringSevaSchema)