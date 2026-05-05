const router = require("express").Router();
const upload = require("../middleware/uploadMiddleware");

const {
  getUserProfile,
  updateProfile,
  getDashboard,
  uploadPhoto
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/dashboard", protect, getDashboard);
router.get("/:id", getUserProfile);
router.put("/profile", protect, updateProfile);
router.post("/upload-photo", protect, upload.single("photo"), uploadPhoto);

module.exports = router;
