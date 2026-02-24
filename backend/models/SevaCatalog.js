const mongoose = require("mongoose")

const sevaCatalogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

module.exports = mongoose.model("SevaCatalog", sevaCatalogSchema)