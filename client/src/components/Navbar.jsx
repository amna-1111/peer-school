import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: "HOME", path: "/" },
    { label: "BROWSE", path: "/skills" },
    ...(user
      ? [
          { label: "Sessions", path: "/sessions" },
          { label: "Profile", path: "/profile" }
        ]
      : [])
  ];

  return (
    <nav className="bg-[radial-gradient(at_50%_50%,_#61a0f4_0%,_#1064d4_100%)] from-blue-500 to-blue-600 px-6 md:px-12 py-4 flex items-center justify-between shadow-md">
      {/* Logo */}
      <div
        onClick={() => navigate(user ? "/dashboard" : "/")}
        className="flex items-center gap-3 cursor-pointer"
      >
        <NavLink to="/" className="mb-auto flex items-center gap-2">
          <img src="/mini_logo.png" alt="favicon" className="w-16" />
          <img src="/nav_logo.png" alt="logo" className="w-32" />
        </NavLink>
      </div>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map(({ label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all ${
              isActive(path)
                ? "bg-white text-blue-600 shadow"
                : "text-white hover:bg-blue-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            {/* Avatar + name */}
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 text-white text-sm font-medium hover:bg-blue-400 px-3 py-2 rounded-full transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xs shadow">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:inline">{user.name}</span>
            </button>
            <button
              onClick={handleLogout}
              className="text-white text-sm border border-white/40 hover:bg-white hover:text-blue-600 px-4 py-2 rounded-full transition-all font-medium"
            >
              LOGOUT
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-white text-sm font-semibold hover:bg-blue-400 px-5 py-2 rounded-full transition-all"
            >
              LOGIN
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-blue-600 text-sm font-bold px-5 py-2 rounded-full hover:bg-blue-50 transition-all shadow"
            >
              SIGN UP
            </button>
          </>
        )}

        {/* Mobile hamburger */}
        <button className="md:hidden text-white ml-1">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}
