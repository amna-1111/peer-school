import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const FEATURES = [
  {
    title: "Learn from peers",
    description:
      "Book sessions with students and professionals who have the skills you want."
  },
  {
    title: "Teach what you know",
    description:
      "List your skills, set your availability, and help others grow."
  },
  {
    title: "Trusted reviews",
    description: "Every session can be rated so quality is always maintained."
  },
  {
    title: "No financial barriers",
    description: "PeerSchool is built on knowledge exchange, not money."
  }
];

const CATEGORIES = [
  "Programming",
  "Design",
  "Mathematics",
  "Languages",
  "Music",
  "Business"
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Create your profile",
    text: "Sign up and list the skills you can teach others."
  },
  {
    step: "2",
    title: "Browse skills",
    text: "Discover what others are offering and find what you want to learn."
  },
  {
    step: "3",
    title: "Book a session",
    text: "Pick a time slot that works for both you and the instructor."
  },
  {
    step: "4",
    title: "Learn & review",
    text: "Attend the session and leave a review to help the community."
  }
];

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-4 pb-16 md:pt-8 md:py-24 flex flex-col md:flex-row items-center gap-12">
        {/* Left text */}
        <div className="flex-1">
          <span className="inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
            Peer to Peer Learning
          </span>
          <h1 className="bg-[radial-gradient(at_0%_0%,_#61a0f4_0%,_#0d60d0_100%)] bg-clip-text text-transparent text-5xl md:text-6xl font-bold text-blue-600 leading-tight mb-6">
            Learn New Skills
            <br />
            by Trading Your
            <br />
            Expertise
          </h1>
          <p className="text-gray-500 text-base md:text-lg mb-8 max-w-md leading-relaxed">
            PeerSchool connects you with peers who want to learn what you know,
            and teach what you want to learn. Exchange skills and grow together.
          </p>
          <div className="flex gap-4 flex-wrap">
            {user ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-blue-600 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg text-sm"
              >
                Go to Dashboard →
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-blue-600 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg text-sm flex items-center gap-2"
                >
                  Start learning →
                </button>
                <button
                  onClick={() => navigate("/skills")}
                  className="border-2 border-blue-600 text-blue-600 px-7 py-3.5 rounded-full font-semibold hover:bg-blue-50 transition-all text-sm"
                >
                  Browse Skills
                </button>
              </>
            )}
          </div>

          {/* Stats row */}
          <div className="flex gap-8 mt-10">
            {[
              { value: "500+", label: "Active Learners" },
              { value: "200+", label: "Skills Listed" },
              { value: "1k+", label: "Sessions Held" }
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-2xl font-bold text-blue-600">{value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right illustration */}
        <div className="flex-1 flex justify-center">
          <img src="/landing_img.png" />
        </div>
      </div>

      {/* Categories */}
      <div className="bg-blue-50 py-14">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Explore by category
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            Find the skill you've always wanted to learn
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => navigate(`/skills?category=${cat}`)}
                className="px-6 py-2.5 rounded-full border-2 border-blue-200 bg-white text-blue-600 font-medium hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all text-sm shadow-sm"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            How it works
          </h2>
          <p className="text-gray-400 text-sm">
            Four simple steps to start exchanging skills
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map(({ step, title, text }) => (
            <div
              key={step}
              className="relative flex flex-col items-center text-center p-6 rounded-2xl border border-blue-100 bg-white hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mb-4 text-lg shadow-md group-hover:scale-110 transition-transform">
                {step}
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm">
                {title}
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Why PeerSchool?
            </h2>
            <p className="text-gray-400 text-sm">
              Everything you need for peer-to-peer learning
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ title, description }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100 hover:shadow-md transition-all"
              >
                {/* Icon placeholder — add your own later */}
                <div className="w-10 h-10 rounded-xl bg-blue-100 mb-4" />
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">
                  {title}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      {!user && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 py-20">
          <div className="max-w-xl mx-auto text-center px-6">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to start learning?
            </h2>
            <p className="text-blue-100 mb-8 text-sm leading-relaxed">
              Join PeerSchool and connect with peers who can help you grow —
              completely free.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-blue-600 font-bold px-8 py-3.5 rounded-full hover:bg-blue-50 transition-all shadow-lg text-sm"
            >
              Create your free account →
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-8 text-gray-300 text-xs border-t border-gray-100">
        PeerSchool — built with the MERN stack
      </div>
    </div>
  );
}
