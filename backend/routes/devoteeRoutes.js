const express = require("express")
const router = express.Router()
const Devotee = require("../models/Devotee")

// Create Devotee
router.post("/", async (req, res) => {
  try {
    const devotee = new Devotee(req.body)
    await devotee.save()
    res.status(201).json(devotee)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error creating devotee" })
  }
})

// Get All Devotees
router.get("/", async (req, res) => {
  try {
    const devotees = await Devotee.find({ active: true }).sort({ createdAt: -1 })
    res.json(devotees)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error fetching devotees" })
  }
})

// Get Single Devotee
router.get("/:id", async (req, res) => {
  try {
    const devotee = await Devotee.findById(req.params.id)
    if (!devotee) {
      return res.status(404).json({ message: "Devotee not found" })
    }
    res.json(devotee)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error fetching devotee" })
  }
})

// Update Devotee
router.put("/:id", async (req, res) => {
  try {
    const devotee = await Devotee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json(devotee)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error updating devotee" })
  }
})

// Soft Delete Devotee
router.delete("/:id", async (req, res) => {
  try {
    await Devotee.findByIdAndUpdate(req.params.id, { active: false })
    res.json({ message: "Devotee deactivated" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error deleting devotee" })
  }
})

module.exports = router