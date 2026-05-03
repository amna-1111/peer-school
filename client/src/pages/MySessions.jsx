import { useState, useEffect } from "react";
import { getMySessions, updateSessionStatus } from "../api/sessionApi";
import { useNavigate } from "react-router-dom";

const STATUS_COLORS = {
  Pending: "#f59e0b",
  Confirmed: "#3b82f6",
  Completed: "#10b981",
  Cancelled: "#ef4444"
};

export default function MySessions() {
  const [learning, setLearning] = useState([]);
  const [teaching, setTeaching] = useState([]);
  const [tab, setTab] = useState("learning");
  const navigate = useNavigate();

  useEffect(() => {
    getMySessions().then(({ data }) => {
      setLearning(data.learning);
      setTeaching(data.teaching);
    });
  }, []);

  const handleStatusUpdate = async (id, status, isTeaching) => {
    try {
      await updateSessionStatus(id, status);
      if (isTeaching) {
        setTeaching((prev) =>
          prev.map((s) => (s._id === id ? { ...s, status } : s))
        );
      } else {
        setLearning((prev) =>
          prev.map((s) => (s._id === id ? { ...s, status } : s))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const formatDate = (slot) =>
    slot ? new Date(slot.startTime).toLocaleString() : "N/A";

  const SessionCard = ({ session, isTeaching }) => (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "1rem",
        borderRadius: "8px",
        marginBottom: "0.75rem"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <strong>{session.skillListing?.title}</strong>
        <span
          style={{
            background: STATUS_COLORS[session.status],
            color: "#fff",
            padding: "2px 10px",
            borderRadius: "10px",
            fontSize: "12px"
          }}
        >
          {session.status}
        </span>
      </div>
      <p style={{ fontSize: "13px", margin: "4px 0" }}>
        {isTeaching
          ? `Learner: ${session.learner?.name}`
          : `Instructor: ${session.instructor?.name}`}
      </p>
      <p style={{ fontSize: "13px", margin: "4px 0" }}>
        📅 {formatDate(session.slot)}
      </p>

      {/* Status actions */}
      <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
        {isTeaching && session.status === "Pending" && (
          <button
            onClick={() => handleStatusUpdate(session._id, "Confirmed", true)}
          >
            Confirm
          </button>
        )}
        {isTeaching && session.status === "Confirmed" && (
          <button
            onClick={() => handleStatusUpdate(session._id, "Completed", true)}
          >
            Mark Complete
          </button>
        )}
        {session.status !== "Cancelled" && session.status !== "Completed" && (
          <button
            onClick={() =>
              handleStatusUpdate(session._id, "Cancelled", isTeaching)
            }
            style={{ color: "red" }}
          >
            Cancel
          </button>
        )}
        {!isTeaching && session.status === "Completed" && (
          <button onClick={() => navigate(`/review/${session._id}`)}>
            Leave Review
          </button>
        )}
      </div>
    </div>
  );

  const sessions = tab === "learning" ? learning : teaching;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: "0 1rem" }}>
      <h2>My Sessions</h2>

      <div style={{ display: "flex", gap: "12px", marginBottom: "1.5rem" }}>
        <button
          onClick={() => setTab("learning")}
          style={{ fontWeight: tab === "learning" ? "bold" : "normal" }}
        >
          Learning ({learning.length})
        </button>
        <button
          onClick={() => setTab("teaching")}
          style={{ fontWeight: tab === "teaching" ? "bold" : "normal" }}
        >
          Teaching ({teaching.length})
        </button>
      </div>

      {sessions.length === 0 ? (
        <p>No sessions yet.</p>
      ) : (
        sessions.map((session) => (
          <SessionCard
            key={session._id}
            session={session}
            isTeaching={tab === "teaching"}
          />
        ))
      )}
    </div>
  );
}
