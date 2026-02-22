const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Login
router.post("/login", login);

// Get current user
router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

module.exports = router;
