const express = require("express")
const router = express.Router()
const RecurringSeva = require("../models/RecurringSeva")
const Devotee = require("../models/Devotee")

// Create Recurring Seva
router.post("/", async (req, res) => {
  try {
    const { devoteeId, type, includesAnnadaan } = req.body

    const devotee = await Devotee.findById(devoteeId)
    if (!devotee) {
      return res.status(404).json({ message: "Devotee not found" })
    }

    let month, day

    if (type === "BIRTHDAY") {
      if (!devotee.dateOfBirth) {
        return res.status(400).json({ message: "Devotee has no date of birth" })
      }
      month = new Date(devotee.dateOfBirth).getMonth() + 1
      day = new Date(devotee.dateOfBirth).getDate()
    }

    if (type === "ANNIVERSARY") {
      if (!devotee.dateOfBirth) {
        return res.status(400).json({ message: "Anniversary date missing (use DOB temporarily)" })
      }
      month = new Date(devotee.dateOfBirth).getMonth() + 1
      day = new Date(devotee.dateOfBirth).getDate()
    }

    const recurring = new RecurringSeva({
      devotee: devotee._id,
      type,
      month,
      day,
      includesAnnadaan: includesAnnadaan || false
    })

    await recurring.save()

    res.status(201).json(recurring)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error creating recurring seva" })
  }
})

// Get All Active Recurring Sevas
router.get("/", async (req, res) => {
  try {
    const sevas = await RecurringSeva.find({ active: true })
      .populate("devotee")
      .sort({ month: 1, day: 1 })

    res.json(sevas)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error fetching recurring sevas" })
  }
})

module.exports = router