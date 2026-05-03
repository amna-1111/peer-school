const router = require("express").Router();
const {
  createReview,
  getInstructorReviews,
  getSessionReview
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createReview);
router.get("/instructor/:instructorId", getInstructorReviews);
router.get("/session/:sessionId", getSessionReview);

module.exports = router;
