import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";
import { NavLink } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await loginUser(formData);
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* LEFT SIDE */}
      <div className="w-full md:w-1/2 bg-gray-50 flex flex-col p-8 md:p-12">
        {/* Logo — top left */}
        <NavLink to="/" className="mb-auto">
          <img src="/logo.png" alt="logo" className="w-32" />
        </NavLink>

        {/* Form — vertically centered */}
        <div className="flex flex-col justify-center flex-1 max-w-sm w-full mx-auto py-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-blue-600 mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-500 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="john@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 transition-all text-white font-semibold py-3 rounded-lg w-full mt-2 disabled:opacity-60 shadow-md"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        {/* Spacer to balance the logo */}
        <div className="mb-auto hidden md:block" />
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-[radial-gradient(circle_at_center,_#61a0f4,_#1064d4)]">
        <img src="/reg_img.png" alt="illustration" className="w-[70%]" />
      </div>
    </div>
  );
}
