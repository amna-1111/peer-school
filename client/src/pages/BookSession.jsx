import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { bookSession } from "../api/sessionApi";

export default function BookSession() {
  const { skillId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const skill = state?.skill;
  const slots = state?.slots || [];

  const formatSlot = (slot) => {
    const start = new Date(slot.startTime);
    const end = new Date(slot.endTime);
    return `${start.toLocaleDateString()} ${start.toLocaleTimeString()} — ${end.toLocaleTimeString()}`;
  };

  const handleBook = async () => {
    if (!selectedSlot) return setError("Please select a slot");
    setLoading(true);
    setError("");
    try {
      await bookSession({ skillListingId: skillId, slotId: selectedSlot });
      navigate("/sessions");
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (!skill)
    return (
      <p>
        No skill data found.{" "}
        <button onClick={() => navigate("/skills")}>Browse skills</button>
      </p>
    );

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: "0 1rem" }}>
      <h2>Book a Session</h2>
      <div
        style={{
          border: "1px solid #ddd",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1.5rem"
        }}
      >
        <strong>{skill.title}</strong>
        <p style={{ fontSize: "14px" }}>{skill.description}</p>
        <p style={{ fontSize: "13px" }}>{skill.durationMinutes} mins</p>
      </div>

      <h3>Select a slot</h3>
      {slots.length === 0 ? (
        <p>No available slots for this instructor.</p>
      ) : (
        slots.map((slot) => (
          <div
            key={slot._id}
            onClick={() => setSelectedSlot(slot._id)}
            style={{
              border: `2px solid ${selectedSlot === slot._id ? "#4f46e5" : "#ddd"}`,
              padding: "0.75rem",
              borderRadius: "8px",
              marginBottom: "0.5rem",
              cursor: "pointer"
            }}
          >
            {formatSlot(slot)}
          </div>
        ))
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleBook} disabled={loading || slots.length === 0}>
        {loading ? "Booking..." : "Confirm Booking"}
      </button>
    </div>
  );
}
