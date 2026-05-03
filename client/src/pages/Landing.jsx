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
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
        {/* Left text */}
        <div className="flex-1">
          <span className="inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
            Peer to Peer Learning
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-blue-600 leading-tight mb-6">
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
          <svg
            viewBox="0 0 420 380"
            className="w-full max-w-lg"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background blob */}
            <ellipse cx="210" cy="200" rx="180" ry="160" fill="#eff6ff" />

            {/* Floating skill badges */}
            <rect
              x="20"
              y="40"
              width="80"
              height="32"
              rx="16"
              fill="#dbeafe"
              stroke="#93c5fd"
              strokeWidth="1"
            />
            <text
              x="60"
              y="61"
              textAnchor="middle"
              fontSize="11"
              fill="#2563eb"
              fontWeight="600"
            >
              Programming
            </text>

            <rect
              x="310"
              y="30"
              width="70"
              height="32"
              rx="16"
              fill="#dbeafe"
              stroke="#93c5fd"
              strokeWidth="1"
            />
            <text
              x="345"
              y="51"
              textAnchor="middle"
              fontSize="11"
              fill="#2563eb"
              fontWeight="600"
            >
              Design
            </text>

            <rect
              x="330"
              y="100"
              width="70"
              height="32"
              rx="16"
              fill="#ede9fe"
              stroke="#c4b5fd"
              strokeWidth="1"
            />
            <text
              x="365"
              y="121"
              textAnchor="middle"
              fontSize="11"
              fill="#7c3aed"
              fontWeight="600"
            >
              Music
            </text>

            <rect
              x="10"
              y="120"
              width="80"
              height="32"
              rx="16"
              fill="#d1fae5"
              stroke="#6ee7b7"
              strokeWidth="1"
            />
            <text
              x="50"
              y="141"
              textAnchor="middle"
              fontSize="11"
              fill="#059669"
              fontWeight="600"
            >
              Mathematics
            </text>

            {/* Gear at top center */}
            <g transform="translate(185, 55)">
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
              />
              <circle cx="25" cy="25" r="9" fill="#2563eb" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <rect
                  key={i}
                  x="22.5"
                  y="2"
                  width="5"
                  height="10"
                  rx="2"
                  fill="#2563eb"
                  transform={`rotate(${angle} 25 25)`}
                />
              ))}
            </g>

            {/* Dashed lines from gear to people */}
            <line
              x1="195"
              y1="100"
              x2="130"
              y2="175"
              stroke="#93c5fd"
              strokeWidth="1.5"
              strokeDasharray="5,4"
            />
            <line
              x1="210"
              y1="105"
              x2="210"
              y2="175"
              stroke="#93c5fd"
              strokeWidth="1.5"
              strokeDasharray="5,4"
            />
            <line
              x1="225"
              y1="100"
              x2="290"
              y2="175"
              stroke="#93c5fd"
              strokeWidth="1.5"
              strokeDasharray="5,4"
            />

            {/* Person 1 - left */}
            <circle cx="125" cy="195" r="22" fill="#1d4ed8" />
            <circle cx="125" cy="185" r="13" fill="#bfdbfe" />
            <rect
              x="103"
              y="215"
              width="44"
              height="50"
              rx="12"
              fill="#1d4ed8"
            />
            <rect
              x="110"
              y="218"
              width="30"
              height="18"
              rx="5"
              fill="#3b82f6"
            />
            {/* Arms */}
            <rect
              x="88"
              y="220"
              width="15"
              height="8"
              rx="4"
              fill="#1d4ed8"
              transform="rotate(-20 88 220)"
            />
            <rect
              x="147"
              y="220"
              width="15"
              height="8"
              rx="4"
              fill="#1d4ed8"
              transform="rotate(20 147 220)"
            />

            {/* Person 2 - center */}
            <circle cx="210" cy="188" r="22" fill="#2563eb" />
            <circle cx="210" cy="178" r="13" fill="#bfdbfe" />
            <rect
              x="188"
              y="208"
              width="44"
              height="50"
              rx="12"
              fill="#2563eb"
            />
            <rect
              x="195"
              y="211"
              width="30"
              height="18"
              rx="5"
              fill="#3b82f6"
            />
            <rect
              x="172"
              y="215"
              width="16"
              height="8"
              rx="4"
              fill="#2563eb"
              transform="rotate(-15 172 215)"
            />
            <rect
              x="234"
              y="215"
              width="16"
              height="8"
              rx="4"
              fill="#2563eb"
              transform="rotate(15 234 215)"
            />

            {/* Person 3 - right */}
            <circle cx="295" cy="195" r="22" fill="#1d4ed8" />
            <circle cx="295" cy="185" r="13" fill="#bfdbfe" />
            <rect
              x="273"
              y="215"
              width="44"
              height="50"
              rx="12"
              fill="#1d4ed8"
            />
            <rect
              x="280"
              y="218"
              width="30"
              height="18"
              rx="5"
              fill="#3b82f6"
            />
            <rect
              x="258"
              y="220"
              width="15"
              height="8"
              rx="4"
              fill="#1d4ed8"
              transform="rotate(-20 258 220)"
            />
            <rect
              x="317"
              y="220"
              width="15"
              height="8"
              rx="4"
              fill="#1d4ed8"
              transform="rotate(20 317 220)"
            />

            {/* Speech bubbles */}
            <rect
              x="60"
              y="270"
              width="90"
              height="30"
              rx="8"
              fill="white"
              stroke="#bfdbfe"
              strokeWidth="1.5"
            />
            <polygon
              points="85,300 95,300 90,310"
              fill="white"
              stroke="#bfdbfe"
              strokeWidth="1"
            />
            <text
              x="105"
              y="290"
              textAnchor="middle"
              fontSize="10"
              fill="#2563eb"
            >
              Teach Python?
            </text>

            <rect
              x="270"
              y="270"
              width="100"
              height="30"
              rx="8"
              fill="white"
              stroke="#bfdbfe"
              strokeWidth="1.5"
            />
            <polygon
              points="295,300 305,300 300,310"
              fill="white"
              stroke="#bfdbfe"
              strokeWidth="1"
            />
            <text
              x="320"
              y="290"
              textAnchor="middle"
              fontSize="10"
              fill="#2563eb"
            >
              Learn Design!
            </text>

            {/* Ground shadow */}
            <ellipse
              cx="210"
              cy="340"
              rx="140"
              ry="8"
              fill="#dbeafe"
              opacity="0.5"
            />
          </svg>
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
