const express = require("express");
const router = express.Router();
const { registerUser, loginUser, verifyEmail, verifyOtp } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

router.get("/me", protect, (req, res) => {
  res.json(req.user); // current logged-in user
});
// Register Route
router.post("/register", registerUser);

// Login Route
router.post("/login", loginUser);

router.get("/verify/:token", verifyEmail);

router.post("/verify-otp", verifyOtp);

module.exports = router;