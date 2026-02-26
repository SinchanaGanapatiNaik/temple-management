const mongoose = require("mongoose")

const sevaExecutionSchema = new mongoose.Schema(
  {
    recurringSeva: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RecurringSeva",
      required: true,
    },

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

    year: {
      type: Number,
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

    includesAnnadaan: {
      type: Boolean,
      default: false,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("SevaExecution", sevaExecutionSchema)