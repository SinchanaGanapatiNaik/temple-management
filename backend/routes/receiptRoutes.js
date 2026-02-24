const express = require("express")
const router = express.Router()
const Receipt = require("../models/Receipt")
const SevaCatalog = require("../models/SevaCatalog")

// Helper function to generate date-based receipt number
async function generateReceiptNumber() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")

  const prefix = `${year}-${month}`

  // Count receipts this month
  const count = await Receipt.countDocuments({
    receiptNumber: { $regex: `^${prefix}` }
  })

  const sequence = String(count + 1).padStart(5, "0")

  return `${prefix}-${sequence}`
}

// Create Receipt
router.post("/", async (req, res) => {
  try {
    const { paymentMode, items } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" })
    }

    let totalAmount = 0
    const processedItems = []

    for (const item of items) {
      const seva = await SevaCatalog.findById(item.sevaCatalogId)

      if (!seva || !seva.active) {
        return res.status(400).json({ message: "Invalid seva selected" })
      }

      const quantity = item.quantity || 1
      const unitPrice = seva.price
      const lineTotal = unitPrice * quantity

      totalAmount += lineTotal

      processedItems.push({
        sevaCatalogId: seva._id,
        sevaName: seva.name,
        quantity,
        unitPrice,
        lineTotal
      })
    }

    const receiptNumber = await generateReceiptNumber()

    const newReceipt = new Receipt({
      receiptNumber,
      paymentMode,
      totalAmount,
      createdBy:  "699d8cc55324426a34394626", // assuming auth middleware later
      items: processedItems
    })

    await newReceipt.save()

    res.status(201).json(newReceipt)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error creating receipt" })
  }
})
router.get("/today", async (req, res) => {
  try {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const receipts = await Receipt.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ createdAt: -1 })

    const totalRevenue = receipts.reduce(
      (sum, receipt) => sum + receipt.totalAmount,
      0
    )

    res.json({
      totalReceipts: receipts.length,
      totalRevenue,
      receipts
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error fetching today's receipts" })
  }
})


module.exports = router