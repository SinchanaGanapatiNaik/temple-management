const mongoose = require("mongoose")

const receiptItemSchema = new mongoose.Schema({
  sevaCatalogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SevaCatalog",
    required: true
  },
  sevaName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  unitPrice: {
    type: Number,
    required: true
  },
  lineTotal: {
    type: Number,
    required: true
  }
})

const receiptSchema = new mongoose.Schema({
  receiptNumber: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMode: {
    type: String,
    enum: ["CASH", "UPI", "CARD"],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [receiptItemSchema]
}, { timestamps: true })

module.exports = mongoose.model("Receipt", receiptSchema)