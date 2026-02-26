const express = require("express")
const router = express.Router()
const SevaExecution = require("../models/SevaExecution")

// Get today's executions
router.get("/today", async (req, res) => {
  try {
    const today = new Date()
    const month = today.getMonth() + 1
    const day = today.getDate()
    const year = today.getFullYear()

    const executions = await SevaExecution.find({
      month,
      day,
      year,
    })
      .populate("devotee")
      .sort({ createdAt: -1 })

    res.json(executions)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error fetching today's executions" })
  }
})

// Mark execution as completed
router.put("/:id/complete", async (req, res) => {
  try {
    const execution = await SevaExecution.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      { new: true }
    )

    if (!execution) {
      return res.status(404).json({ message: "Execution not found" })
    }

    res.json(execution)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error updating execution" })
  }
})

module.exports = router