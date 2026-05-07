import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getDashboard } from "../api/userApi";
import { Helmet } from "react-helmet-async";

const STATUS_THEMES = {
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  Completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200"
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

  const StatCard = ({ label, value, icon, colorClass }) => (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02]">
      <div
        className={`w-12 h-12 rounded-2xl ${colorClass} flex items-center justify-center text-xl shadow-inner`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-gray-800 leading-none mb-1">
          {value}
        </p>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
          {label}
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Helmet>
        <title>Dashboard | PeerSchool</title>
      </Helmet>

      {/* Modern Blue Header */}
      <div className="bg-gradient-to-r from-[#5395EF] to-[#3b82f6] pt-12 pb-24 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2">
              Welcome back, {user?.name.split(" ")[0]}! 👋
            </h1>
            <p className="text-blue-100 font-medium opacity-90">
              Ready to learn or teach something new today?
            </p>
          </div>
          <button
            onClick={() => navigate("/skills")}
            className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <span className="text-sm">EXPLORE SKILLS</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-12">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            label="Taught"
            value={stats?.totalSessionsTaught || 0}
            icon="🎓"
            colorClass="bg-purple-50 text-purple-600"
          />
          <StatCard
            label="Learned"
            value={stats?.totalSessionsAttended || 0}
            icon="📖"
            colorClass="bg-blue-50 text-blue-600"
          />
          <StatCard
            label="Rating"
            value={stats?.avgRating > 0 ? stats.avgRating.toFixed(1) : "—"}
            icon="⭐"
            colorClass="bg-amber-50 text-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Activity Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-gray-800">
                  Upcoming Schedule
                </h2>
                <button
                  onClick={() => navigate("/sessions")}
                  className="text-sm text-blue-600 font-bold hover:text-blue-800"
                >
                  View full calendar →
                </button>
              </div>

              {upcoming.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                  <div className="text-4xl mb-4">🗓️</div>
                  <p className="text-gray-500 font-medium">
                    Your schedule is clear!
                  </p>
                  <button
                    onClick={() => navigate("/skills")}
                    className="mt-4 text-sm text-blue-600 font-bold hover:underline"
                  >
                    Book your first session
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcoming.map((session) => {
                    const isTeaching =
                      session.instructor?._id === user?.id ||
                      session.instructor === user?.id;
                    const date = new Date(session.slot?.startTime);

                    return (
                      <div
                        key={session._id}
                        className="group flex items-center gap-5 p-5 bg-white hover:bg-blue-50/50 border border-gray-100 rounded-[1.5rem] transition-all duration-300"
                      >
                        <div className="hidden sm:flex flex-col items-center justify-center bg-white border border-blue-100 text-blue-600 w-16 h-16 rounded-2xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <span className="text-[10px] font-black uppercase tracking-tighter">
                            {date.toLocaleString("default", { month: "short" })}
                          </span>
                          <span className="text-xl font-black">
                            {date.getDate()}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-800 truncate leading-tight mb-1">
                            {session.skillListing?.title}
                          </h4>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                            {isTeaching
                              ? `Student: ${session.learner?.name}`
                              : `Instructor: ${session.instructor?.name}`}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-gray-700 mb-1">
                            {date.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black border uppercase tracking-tighter ${STATUS_THEMES[session.status]}`}
                          >
                            {session.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Quick Tools
              </h3>

              <div className="space-y-3">
                {[
                  {
                    label: "My Profile",
                    icon: "👤",
                    path: "/profile",
                    desc: "Bio & Availability"
                  },
                  {
                    label: "Manage Sessions",
                    icon: "📅",
                    path: "/sessions",
                    desc: "Teaching Schedule"
                  }
                ].map((action) => (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all text-left group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {action.icon}
                    </span>
                    <div>
                      <p className="font-bold text-gray-800 text-sm leading-none mb-1">
                        {action.label}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">
                        {action.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Action Banner */}
              <div className="mt-8 p-6 bg-gradient-to-br from-blue-700 to-blue-500 rounded-3xl text-white shadow-lg shadow-blue-200">
                <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70 mb-3">
                  Community Hub
                </p>
                <p className="text-sm font-medium leading-relaxed mb-4 text-blue-50">
                  Join our peer community on Discord to share resources and get
                  feedback!
                </p>
                <button className="w-full bg-white/20 hover:bg-white/30 py-2 rounded-xl text-xs font-bold transition-colors">
                  JOIN DISCORD
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
