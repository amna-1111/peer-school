import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getDashboard } from "../api/userApi";

const STATUS_COLORS = {
  Pending: "#f59e0b",
  Confirmed: "#3b82f6",
  Completed: "#10b981",
  Cancelled: "#ef4444"
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [upcoming, setUpcoming] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(({ data }) => {
        setUpcoming(data.upcoming);
        setStats(data.stats);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: "40px" }}>Loading...</p>;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: "0 1rem" }}>
      <h2>Welcome back, {user?.name} 👋</h2>

      {/* Stats */}
      <div style={{ display: "flex", gap: "1rem", margin: "1.5rem 0" }}>
        <div
          style={{
            flex: 1,
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1rem",
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: "28px", fontWeight: "bold" }}>
            {stats?.totalSessionsTaught || 0}
          </div>
          <div style={{ fontSize: "13px", color: "#888" }}>Sessions Taught</div>
        </div>
        <div
          style={{
            flex: 1,
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1rem",
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: "28px", fontWeight: "bold" }}>
            {stats?.totalSessionsAttended || 0}
          </div>
          <div style={{ fontSize: "13px", color: "#888" }}>
            Sessions Attended
          </div>
        </div>
        <div
          style={{
            flex: 1,
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1rem",
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: "28px", fontWeight: "bold" }}>
            {stats?.avgRating > 0 ? `⭐ ${stats.avgRating}` : "—"}
          </div>
          <div style={{ fontSize: "13px", color: "#888" }}>Avg Rating</div>
        </div>
      </div>

      {/* Quick nav */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "2rem" }}>
        <button onClick={() => navigate("/skills")}>Browse Skills</button>
        <button onClick={() => navigate("/profile")}>My Profile</button>
        <button onClick={() => navigate("/sessions")}>My Sessions</button>
      </div>

      {/* Upcoming sessions */}
      <h3>Upcoming Sessions</h3>
      {upcoming.length === 0 ? (
        <p style={{ color: "#888" }}>
          No upcoming sessions.{" "}
          <span
            style={{ cursor: "pointer", color: "#4f46e5" }}
            onClick={() => navigate("/skills")}
          >
            Browse skills to book one →
          </span>
        </p>
      ) : (
        upcoming.map((session) => {
          const isTeaching =
            session.instructor?._id === user?.id ||
            session.instructor === user?.id;
          return (
            <div
              key={session._id}
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
              <p style={{ fontSize: "13px", margin: "4px 0", color: "#888" }}>
                {isTeaching
                  ? `Teaching ${session.learner?.name}`
                  : `Learning from ${session.instructor?.name}`}
              </p>
              <p style={{ fontSize: "13px", margin: "4px 0" }}>
                📅{" "}
                {session.slot
                  ? new Date(session.slot.startTime).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}
