const router = require("express").Router();
const upload = require("../middleware/uploadMiddleware");

const {
  getUserProfile,
  updateProfile,
  getDashboard,
  uploadPhoto,
  changePassword
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/dashboard", protect, getDashboard);
router.get("/:id", getUserProfile);
router.put("/profile", protect, updateProfile);
router.post("/upload-photo", protect, upload.single("photo"), uploadPhoto);
router.put("/change-password", protect, changePassword);

module.exports = router;
