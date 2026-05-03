const router = require("express").Router();
const {
  getAvailableSlots,
  addSlot,
  deleteSlot,
  bookSession,
  getMySessions,
  updateSessionStatus
} = require("../controllers/sessionController");
const { protect } = require("../middleware/authMiddleware");

router.get("/slots/:instructorId", getAvailableSlots);
router.post("/slots", protect, addSlot);
router.delete("/slots/:slotId", protect, deleteSlot);
router.post("/book", protect, bookSession);
router.get("/my", protect, getMySessions);
router.put("/:id/status", protect, updateSessionStatus);

module.exports = router;
