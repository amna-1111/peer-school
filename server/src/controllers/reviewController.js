const Review = require("../models/Review");
const Session = require("../models/Session");
const User = require("../models/User");

// POST /api/reviews — submit a review
const createReview = async (req, res, next) => {
  try {
    const { sessionId, rating, comment } = req.body;

    // Session must exist
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    // Session must be completed
    if (session.status !== "Completed")
      return res
        .status(400)
        .json({ message: "Can only review completed sessions" });

    // Only the learner can review
    if (session.learner.toString() !== req.user.id)
      return res
        .status(403)
        .json({ message: "Only the learner can leave a review" });

    // Check if review already exists for this session
    const existing = await Review.findOne({ session: sessionId });
    if (existing)
      return res
        .status(400)
        .json({ message: "You have already reviewed this session" });

    // Create the review
    const review = await Review.create({
      session: sessionId,
      reviewer: req.user.id,
      reviewee: session.instructor,
      rating,
      comment
    });

    // Recalculate instructor's average rating
    const allReviews = await Review.find({ reviewee: session.instructor });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await User.findByIdAndUpdate(session.instructor, {
      avgRating: avgRating.toFixed(1)
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// GET /api/reviews/instructor/:instructorId — get all reviews for an instructor
const getInstructorReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.instructorId })
      .populate("reviewer", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// GET /api/reviews/session/:sessionId — check if a session has been reviewed
const getSessionReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({ session: req.params.sessionId });
    res.json(review); // null if not reviewed yet
  } catch (error) {
    next(error);
  }
};

module.exports = { createReview, getInstructorReviews, getSessionReview };
