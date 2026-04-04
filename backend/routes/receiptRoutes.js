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
router.get("/stats", async (req, res) => {
  try {

    const today = new Date()
    today.setHours(0,0,0,0)

    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0,0,0,0)

    const todayReceipts = await Receipt.find({
      date: { $gte: today }
    })

    const monthReceipts = await Receipt.find({
      date: { $gte: monthStart }
    })

    const todayRevenue = todayReceipts.reduce((sum,r)=>sum+r.totalAmount,0)
    const monthRevenue = monthReceipts.reduce((sum,r)=>sum+r.totalAmount,0)

    const totalReceipts = await Receipt.countDocuments()

    res.json({
      todayRevenue,
      monthRevenue,
      todayReceipts: todayReceipts.length,
      totalReceipts
    })

  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" })
  }
})
// Get all receipts (for history page)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = 10
    const skip = (page - 1) * limit

    const totalReceipts = await Receipt.countDocuments()

    const receipts = await Receipt.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)

    res.json({
      receipts,
      totalPages: Math.ceil(totalReceipts / limit),
      currentPage: page
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Error fetching receipts"
    })
  }
})
router.get("/weekly-revenue", async (req, res) => {
  try {

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    sevenDaysAgo.setHours(0,0,0,0)

    const receipts = await Receipt.find({
      date: { $gte: sevenDaysAgo }
    })

    const revenueMap = {}

    receipts.forEach(r => {
      const date = new Date(r.date).toISOString().split("T")[0]

      if (!revenueMap[date]) {
        revenueMap[date] = 0
      }

      revenueMap[date] += r.totalAmount
    })

    const result = []

    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))

      const key = d.toISOString().split("T")[0]

      result.push({
        date: key,
        revenue: revenueMap[key] || 0
      })
    }

    res.json(result)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error fetching weekly revenue" })
  }
})
router.get("/top-sevas", async (req, res) => {
  try {

    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0,0,0,0)

    const result = await Receipt.aggregate([

      {
        $match: {
          date: { $gte: monthStart }
        }
      },

      { $unwind: "$items" },

      {
        $group: {
          _id: "$items.sevaName",
          revenue: { $sum: "$items.lineTotal" }
        }
      },

      {
        $sort: { revenue: -1 }
      },

      {
        $limit: 5
      }

    ])

    res.json(result)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error fetching top sevas" })
  }
})
router.get("/payment-mode-insights", async (req, res) => {
  try {
    const result = await Receipt.aggregate([
      {
        $group: {
          _id: "$paymentMode",
          count: { $sum: 1 }
        }
      }
    ])

    const total = result.reduce(
      (sum, item) => sum + item.count,
      0
    )

    const insights = result.map((item) => ({
      mode: item._id,
      count: item.count,
      percentage: ((item.count / total) * 100).toFixed(1)
    }))

    res.json(insights)

  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Error fetching payment insights"
    })
  }
})
module.exports = router