import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.75rem 2rem",
        borderBottom: "1px solid #ddd",
        marginBottom: "0"
      }}
    >
      <span
        onClick={() => navigate(user ? "/dashboard" : "/")}
        style={{ fontWeight: "bold", fontSize: "18px", cursor: "pointer" }}
      >
        PeerSchool
      </span>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <button onClick={() => navigate("/skills")}>Browse</button>
        {user ? (
          <>
            <button onClick={() => navigate("/sessions")}>Sessions</button>
            <button onClick={() => navigate("/profile")}>Profile</button>
            <button onClick={handleLogout} style={{ color: "red" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
}
