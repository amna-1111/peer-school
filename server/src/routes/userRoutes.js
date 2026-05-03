const router = require("express").Router();
const {
  getUserProfile,
  updateProfile,
  getDashboard
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/dashboard", protect, getDashboard);
router.get("/:id", getUserProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;
