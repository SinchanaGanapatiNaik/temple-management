const express = require("express")
const router = express.Router()
const SevaCatalog = require("../models/SevaCatalog")

// Create new seva
router.post("/", async (req, res) => {
  try {
    const { name, price } = req.body

    const newSeva = new SevaCatalog({
      name,
      price
    })

    await newSeva.save()

    res.status(201).json(newSeva)
  } catch (error) {
    res.status(500).json({ message: "Error creating seva" })
  }
})

// Get all active sevas
router.get("/", async (req, res) => {
  try {
    const sevas = await SevaCatalog.find({ active: true })
    res.json(sevas)
  } catch (error) {
    res.status(500).json({ message: "Error fetching sevas" })
  }
})

// Deactivate seva
router.put("/:id/deactivate", async (req, res) => {
  try {
    const seva = await SevaCatalog.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    )

    res.json(seva)
  } catch (error) {
    res.status(500).json({ message: "Error deactivating seva" })
  }
})

module.exports = router