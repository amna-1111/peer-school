import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createReview, getSessionReview } from "../api/reviewApi";
import { getMySessions } from "../api/sessionApi";

const RATING_LABELS = {
  1: "Poor — 1 star",
  2: "Fair — 2 stars",
  3: "Good — 3 stars",
  4: "Great — 4 stars",
  5: "Excellent — 5 stars"
};

export default function Review() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(null);
  const [comment, setComment] = useState("");
  const [session, setSession] = useState(null);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getMySessions().then(({ data }) => {
      const found = data.learning.find((s) => s._id === sessionId);
      setSession(found);
    });
    getSessionReview(sessionId).then(({ data }) => {
      if (data) setAlreadyReviewed(true);
    });
  }, [sessionId]);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await createReview({ sessionId, rating, comment });
      navigate("/sessions");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const activeStar = hovered ?? rating;

  if (alreadyReviewed)
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-[#5395EF] py-10 px-6">
          <div className="max-w-xl mx-auto">
            <button
              onClick={() => navigate("/sessions")}
              className="text-blue-100 hover:text-white text-sm font-bold mb-4 flex items-center gap-2 transition-colors"
            >
              ← Back to Sessions
            </button>
            <h1 className="text-2xl font-bold text-white">Leave a Review</h1>
            <p className="text-blue-100 text-sm mt-1">
              Share your experience to help others
            </p>
          </div>
        </div>
        <div className="max-w-xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="font-semibold text-gray-800 text-lg">
              Already Reviewed
            </h2>
            <p className="text-gray-400 text-sm mt-2 mb-6">
              You've already submitted a review for this session.
            </p>
            <button
              onClick={() => navigate("/sessions")}
              className="bg-[#5395EF] text-white font-semibold px-6 py-2.5 rounded-full hover:bg-blue-500 transition-all text-sm"
            >
              Back to Sessions
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#5395EF] py-10 px-6">
        <div className="max-w-xl mx-auto">
          <button
            onClick={() => navigate("/sessions")}
            className="text-blue-100 hover:text-white text-sm font-bold mb-4 flex items-center gap-2 transition-colors"
          >
            ← Back to Sessions
          </button>
          <h1 className="text-2xl font-bold text-white">Leave a Review</h1>
          <p className="text-blue-100 text-sm mt-1">
            Share your experience to help others
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-6 flex flex-col gap-4">
        {/* Session info */}
        {session && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 text-sm mb-3">
              Session
            </h2>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-base overflow-hidden shrink-0">
                {session.instructor?.profilePhoto ? (
                  <img
                    src={`http://localhost:5000${session.instructor.profilePhoto}`}
                    alt={session.instructor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  session.instructor?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  {session.skillListing?.title}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  Instructor: {session.instructor?.name}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Star rating */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 text-sm mb-3">
            Your Rating
          </h2>
          <div className="flex gap-1.5" onMouseLeave={() => setHovered(null)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                className="text-4xl cursor-pointer transition-transform hover:scale-110 select-none leading-none"
                style={{ color: star <= activeStar ? "#f59e0b" : "#e5e7eb" }}
              >
                ★
              </span>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-300 mt-1 px-0.5">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {RATING_LABELS[activeStar]}
          </p>
        </div>

        {/* Comment */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <label className="text-sm font-semibold text-gray-800 mb-2 block">
            Comment{" "}
            <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Share your experience — what was helpful, what could improve…"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#5395EF] text-white font-bold py-3 rounded-full hover:bg-blue-500 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? "Submitting…" : "Submit Review"}
          </button>
          <button
            onClick={() => navigate("/sessions")}
            className="border-2 border-gray-200 text-gray-500 font-semibold py-3 px-5 rounded-full hover:bg-gray-50 transition-all text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
