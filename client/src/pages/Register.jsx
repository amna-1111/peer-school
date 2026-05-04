import { useState } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { registerUser } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";
import { Helmet } from "react-helmet-async";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
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
      const { data } = await registerUser(formData);
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Helmet>
        <title>Registration - PeerSchool</title>
      </Helmet>
      {/* LEFT SIDE */}
      <div className="w-full md:w-1/2 bg-gray-50 flex flex-col p-8 md:p-12">
        {/* Logo — top left */}
        <NavLink to="/" className="mb-auto">
          <img src="/logo.png" alt="logo" className="w-32" />
        </NavLink>

        {/* Form */}
        <div className="flex flex-col justify-center flex-1 max-w-sm w-full mx-auto py-12">
          <h1 className="bg-[linear-gradient(90deg,_#61a0f4_0%,_#004aad_100%)] bg-clip-text text-transparent text-4xl md:text-5xl font-normal text-blue-600 mb-2">
            Create new Account
          </h1>
          <p className="text-sm mb-8">
            Already Registered?{" "}
            <Link
              to="/login"
              className="text-blue-500 font-medium hover:underline"
            >
              Login
            </Link>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest">Name</label>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="border border-black px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest">Email</label>
              <input
                name="email"
                type="email"
                placeholder="john@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="border border-black px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="border border-black px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[linear-gradient(90deg,_#61a0f4_0%,_#004aad_100%)] hover:bg-blue-600 transition-all text-white font-semibold py-3 w-auto mt-2 disabled:opacity-60 shadow-md"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        </div>

        {/* Spacer */}
        <div className="mb-auto hidden md:block" />
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-[radial-gradient(circle_at_center,_#61a0f4,_#1064d4)]">
        <img src="/reg_img.png" alt="illustration" className="w-[70%]" />
      </div>
    </div>
  );
}
