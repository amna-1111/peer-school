import { useState, useEffect } from "react";
import { getMySessions, updateSessionStatus } from "../api/sessionApi";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const STATUS_THEMES = {
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  Completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200"
};

export default function MySessions() {
  const [learning, setLearning] = useState([]);
  const [teaching, setTeaching] = useState([]);
  const [tab, setTab] = useState("learning");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getMySessions()
      .then(({ data }) => {
        setLearning(data.learning);
        setTeaching(data.teaching);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (id, status, isTeaching) => {
    try {
      await updateSessionStatus(id, status);
      const updater = (prev) =>
        prev.map((s) => (s._id === id ? { ...s, status } : s));

      if (isTeaching) setTeaching(updater);
      else setLearning(updater);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const formatDate = (slot) => {
    if (!slot) return "Date TBD";
    const date = new Date(slot.startTime);
    return date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const SessionCard = ({ session, isTeaching }) => (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow mb-4">
      <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
        <div>
          <h3 className="font-bold text-gray-800 text-lg leading-tight">
            {session.skillListing?.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <span className="font-medium text-blue-600">
              {isTeaching ? "Learner:" : "Instructor:"}
            </span>
            {isTeaching ? session.learner?.name : session.instructor?.name}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_THEMES[session.status]}`}
        >
          {session.status.toUpperCase()}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-5 bg-gray-50 p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {formatDate(session.slot)}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {isTeaching && session.status === "Pending" && (
          <button
            onClick={() => handleStatusUpdate(session._id, "Confirmed", true)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Confirm Session
          </button>
        )}

        {isTeaching && session.status === "Confirmed" && (
          <button
            onClick={() => handleStatusUpdate(session._id, "Completed", true)}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Mark as Completed
          </button>
        )}

        {!isTeaching && session.status === "Completed" && (
          <button
            onClick={() => navigate(`/review/${session._id}`)}
            className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-bold py-2 px-4 rounded-lg transition-colors"
          >
            ⭐ Leave a Review
          </button>
        )}

        {session.status !== "Cancelled" && session.status !== "Completed" && (
          <button
            onClick={() =>
              handleStatusUpdate(session._id, "Cancelled", isTeaching)
            }
            className="text-gray-400 hover:text-red-500 text-sm font-semibold px-4 py-2 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );

  const sessions = tab === "learning" ? learning : teaching;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Helmet>
        <title>My Sessions - PeerSchool</title>
      </Helmet>

      {/* Blue Header Section */}
      <div className="bg-[#5395EF] pt-12 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">My Sessions</h1>
          <p className="text-blue-100">
            Manage your learning and teaching schedule
          </p>
        </div>
      </div>

      {/* Main Content (Lifted slightly over header) */}
      <div className="max-w-3xl mx-auto px-6 -mt-10">
        {/* Tab Switcher */}
        <div className="bg-white p-1.5 rounded-2xl shadow-sm flex gap-1 mb-8 border border-blue-100/50">
          <button
            onClick={() => setTab("learning")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
              tab === "learning"
                ? "bg-[#337DE1] text-white shadow-md"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            LEARNING{" "}
            <span className="ml-1 opacity-60 text-xs font-normal">
              ({learning.length})
            </span>
          </button>
          <button
            onClick={() => setTab("teaching")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
              tab === "teaching"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            TEACHING{" "}
            <span className="ml-1 opacity-60 text-xs font-normal">
              ({teaching.length})
            </span>
          </button>
        </div>

        {/* Session List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">
              No sessions scheduled here yet.
            </p>
            <button
              onClick={() => navigate("/skills")}
              className="mt-4 text-blue-600 font-bold text-sm hover:underline"
            >
              Browse Skills to get started →
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {sessions.map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                isTeaching={tab === "teaching"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
