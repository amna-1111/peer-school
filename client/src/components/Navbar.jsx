import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const closeMenu = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const navLinks = [
    { label: "HOME", path: "/" },

    ...(user
      ? [
          { label: "DASHBOARD", path: "/dashboard" },
          { label: "MY SESSIONS", path: "/sessions" }
        ]
      : []),
    { label: "BROWSE", path: "/skills" }
  ];

  return (
    <nav className="bg-[radial-gradient(at_50%_50%,_#61a0f4_0%,_#1064d4_100%)] from-blue-500 to-blue-600 px-6 md:px-12 py-4 flex items-center justify-between shadow-md relative z-50">
      {/* Logo */}
      <div
        onClick={() => navigate(user ? "/dashboard" : "/")}
        className="flex items-center gap-3 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <img src="/mini_logo.png" alt="favicon" className="w-12 md:w-16" />
          <img src="/nav_logo.png" alt="logo" className="w-24 md:w-32" />
        </div>
      </div>

      {/* Desktop Nav links */}
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

      {/* Desktop Right side */}
      <div className="hidden md:flex items-center gap-3">
        {user ? (
          <>
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 text-white text-sm font-medium hover:bg-blue-400 px-3 py-2 rounded-full transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xs shadow overflow-hidden">
                {user.profilePhoto ? (
                  <img
                    src={`http://localhost:5000${user.profilePhoto}`}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.name?.charAt(0).toUpperCase()
                )}
              </div>
              <span>{user.name}</span>
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
      </div>

      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden text-white p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-[#5395EF] shadow-xl md:hidden flex flex-col p-6 gap-4 animate-in slide-in-from-top duration-200">
          {navLinks.map(({ label, path }) => (
            <button
              key={path}
              onClick={() => closeMenu(path)}
              className={`text-left px-4 py-3 rounded-xl font-semibold ${
                isActive(path) ? "bg-white text-blue-600" : "text-white"
              }`}
            >
              {label}
            </button>
          ))}

          <hr className="border-white/20" />

          {user ? (
            <>
              <button
                onClick={() => closeMenu("/profile")}
                className="flex items-center gap-3 text-white px-4 py-2"
              >
                <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold">{user.name}</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-center bg-blue-700 text-white font-bold py-3 rounded-xl"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => closeMenu("/login")}
                className="w-full text-white border border-white font-semibold py-3 rounded-xl"
              >
                LOGIN
              </button>
              <button
                onClick={() => closeMenu("/register")}
                className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl"
              >
                SIGN UP
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
