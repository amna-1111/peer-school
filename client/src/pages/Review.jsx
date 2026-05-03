import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createReview, getSessionReview } from "../api/reviewApi";
import { getMySessions } from "../api/sessionApi";

export default function Review() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [session, setSession] = useState(null);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get session details
    getMySessions().then(({ data }) => {
      const found = data.learning.find((s) => s._id === sessionId);
      setSession(found);
    });

    // Check if already reviewed
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

  if (alreadyReviewed)
    return (
      <div style={{ maxWidth: 500, margin: "40px auto", padding: "0 1rem" }}>
        <h2>Already Reviewed</h2>
        <p>You have already submitted a review for this session.</p>
        <button onClick={() => navigate("/sessions")}>Back to Sessions</button>
      </div>
    );

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: "0 1rem" }}>
      <h2>Leave a Review</h2>

      {session && (
        <div
          style={{
            border: "1px solid #ddd",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1.5rem"
          }}
        >
          <strong>{session.skillListing?.title}</strong>
          <p style={{ fontSize: "14px", margin: "4px 0" }}>
            Instructor: {session.instructor?.name}
          </p>
        </div>
      )}

      <div style={{ marginBottom: "1rem" }}>
        <label>Rating</label>
        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{
                fontSize: "28px",
                cursor: "pointer",
                color: star <= rating ? "#f59e0b" : "#ddd"
              }}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Comment (optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Share your experience..."
          style={{ width: "100%", marginTop: "8px" }}
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </button>
      <button
        onClick={() => navigate("/sessions")}
        style={{ marginLeft: "8px" }}
      >
        Cancel
      </button>
    </div>
  );
}
