import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfile } from "../api/userApi";
import { getInstructorSkills } from "../api/skillApi";
import { getAvailableSlots } from "../api/sessionApi";
import { useAuth } from "../hooks/useAuth";
import { getInstructorReviews } from "../api/reviewApi";
import { Helmet } from "react-helmet-async";

export default function InstructorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [instructor, setInstructor] = useState(null);
  const [skills, setSkills] = useState([]);
  const [slots, setSlots] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getProfile(id).then(({ data }) => setInstructor(data));
    getInstructorSkills(id).then(({ data }) => setSkills(data));
    getAvailableSlots(id).then(({ data }) => setSlots(data));
    getInstructorReviews(id).then(({ data }) => setReviews(data));
  }, [id]);

  if (!instructor) return <p>Loading...</p>;

  const formatSlot = (slot) => {
    const start = new Date(slot.startTime);
    return start.toLocaleString();
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: "0 1rem" }}>
      <h2>{instructor.name}</h2>
      <p>{instructor.bio || "No bio yet."}</p>
      {instructor.avgRating > 0 && (
        <p>⭐ {instructor.avgRating.toFixed(1)} avg rating</p>
      )}

      <h3>Skills Offered</h3>
      {skills.length === 0 ? (
        <p>No skills listed yet.</p>
      ) : (
        skills.map((skill) => (
          <div
            key={skill._id}
            style={{
              border: "1px solid #ddd",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "0.75rem"
            }}
          >
            <strong>{skill.title}</strong>
            <span
              style={{
                marginLeft: "8px",
                fontSize: "12px",
                background: "#eee",
                padding: "2px 8px",
                borderRadius: "10px"
              }}
            >
              {skill.category}
            </span>
            <p style={{ fontSize: "14px", margin: "6px 0" }}>
              {skill.description}
            </p>
            <p style={{ fontSize: "13px" }}>{skill.durationMinutes} mins</p>
            {user && user.id !== id && (
              <button
                onClick={() =>
                  navigate(`/book/${skill._id}`, { state: { skill, slots } })
                }
              >
                Book this session
              </button>
            )}
          </div>
        ))
      )}

      <h3>Available Slots</h3>
      {slots.length === 0 ? (
        <p>No available slots.</p>
      ) : (
        <ul>
          {slots.map((slot) => (
            <li key={slot._id}>{formatSlot(slot)}</li>
          ))}
        </ul>
      )}

      <h3>Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div
            key={review._id}
            style={{
              border: "1px solid #ddd",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "0.75rem"
            }}
          >
            <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{ color: star <= review.rating ? "#f59e0b" : "#ddd" }}
                >
                  ★
                </span>
              ))}
            </div>
            <p style={{ fontSize: "14px", margin: "4px 0" }}>
              {review.comment}
            </p>
            <small>by {review.reviewer?.name}</small>
          </div>
        ))
      )}
    </div>
  );
}
