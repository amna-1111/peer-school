import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../hooks/useAuth";
import { getInstructorSkills } from "../api/skillApi";
import { getProfile } from "../api/userApi";
import { getAvailableSlots } from "../api/sessionApi";
import { getSkillById } from "../api/skillApi";
import { getSkillReviews } from "../api/reviewApi";

const CATEGORY_COLORS = {
  Programming: "bg-blue-100 text-blue-700",
  Design: "bg-purple-100 text-purple-700",
  Mathematics: "bg-green-100 text-green-700",
  Languages: "bg-yellow-100 text-yellow-700",
  Music: "bg-pink-100 text-pink-700",
  Business: "bg-orange-100 text-orange-700",
  Other: "bg-gray-100 text-gray-700"
};

export default function SkillDetail() {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [skill, setSkill] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getSkillById(skillId)
      .then(({ data }) => {
        setSkill(data);
        setInstructor(data.instructor);
        getAvailableSlots(data.instructor._id).then(({ data: s }) =>
          setSlots(s)
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));

    getSkillById(skillId)
      .then(({ data }) => {
        setSkill(data);
        setInstructor(data.instructor);
        Promise.all([
          getAvailableSlots(data.instructor._id),
          getSkillReviews(skillId)
        ]).then(([slotsRes, reviewsRes]) => {
          setSlots(slotsRes.data);
          setReviews(reviewsRes.data);
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [skillId]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!skill)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Skill not found.</p>
      </div>
    );

  const isOwnSkill = user?.id === skill.instructor._id;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{skill.title} — PeerSchool</title>
      </Helmet>

      {/* Header */}
      <div className="bg-[#5395EF] py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/skills")}
            className="text-blue-100 hover:text-white text-sm font-bold mb-4 flex items-center gap-2 transition-colors"
          >
            ← Back to Browse
          </button>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full mb-3 inline-block ${CATEGORY_COLORS[skill.category] || "bg-gray-100 text-gray-600"}`}
              >
                {skill.category}
              </span>
              <h1 className="text-3xl font-bold text-white mt-2">
                {skill.title}
              </h1>
              {/* <p className="text-blue-100 text-sm mt-2 flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {skill.durationMinutes} minutes per session
              </p> */}
            </div>
            {user && !isOwnSkill && (
              <button
                onClick={() =>
                  navigate(`/book/${skill._id}`, { state: { skill, slots } })
                }
                disabled={slots.length === 0}
                className="bg-white text-blue-600 font-bold px-6 py-3 rounded-full hover:bg-blue-50 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {slots.length === 0 ? "No slots available" : "Book a Session →"}
              </button>
            )}
            {!user && (
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-blue-600 font-bold px-6 py-3 rounded-full hover:bg-blue-50 transition-all shadow-lg text-sm"
              >
                Login to Book →
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left — skill details */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-3">
              About this skill
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              {skill.description}
            </p>
          </div>

          {/* Available slots */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-4">
              Available Time Slots
            </h2>
            {slots.length === 0 ? (
              <p className="text-gray-400 text-sm">
                No available slots at the moment.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {slots.map((slot) => (
                  <div
                    key={slot._id}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100"
                  >
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {new Date(slot.startTime).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric"
                      })}
                    </div>
                    <span className="text-sm text-blue-600 font-medium">
                      {new Date(slot.startTime).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                      {" — "}
                      {new Date(slot.endTime).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Reviews for this skill */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">
                Reviews for this Skill
              </h2>
              {reviews.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-yellow-400 text-sm">⭐</span>
                  <span className="text-sm font-semibold text-gray-700">
                    {(
                      reviews.reduce((sum, r) => sum + r.rating, 0) /
                      reviews.length
                    ).toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                  </span>
                </div>
              )}
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <p className="text-gray-400 text-sm font-medium">
                  No reviews yet
                </p>
                <p className="text-gray-300 text-xs mt-1">
                  Be the first to book and review this skill
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-sm ${star <= review.rating ? "text-amber-400" : "text-gray-200"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    {/* Comment */}
                    {review.comment && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-3 italic">
                        "{review.comment}"
                      </p>
                    )}

                    {/* Reviewer */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold overflow-hidden">
                        {review.reviewer?.profilePhoto ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL}${review.reviewer.profilePhoto}`}
                            className="w-full h-full object-cover"
                            alt={review.reviewer.name}
                          />
                        ) : (
                          review.reviewer?.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="text-xs font-semibold text-gray-500">
                        {review.reviewer?.name}
                      </span>
                      <span className="text-xs text-gray-300 ml-auto">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          }
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — instructor card */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Instructor</h2>
            {instructor && (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-3 overflow-hidden shadow">
                  {instructor.profilePhoto ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}${instructor.profilePhoto}`}
                      alt={instructor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    instructor.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <h3 className="font-semibold text-gray-800">
                  {instructor.name}
                </h3>
                {instructor.avgRating > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-400 text-sm">⭐</span>
                    <span className="text-sm text-gray-600 font-medium">
                      {instructor.avgRating}
                    </span>
                  </div>
                )}
                <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                  {instructor.bio || "No bio yet."}
                </p>
                <div className="flex gap-3 mt-3 text-xs text-gray-400">
                  <span>
                    {instructor.totalSessionsTaught || 0} sessions taught
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/instructor/${instructor._id}`)}
                  className="mt-4 w-full border-2 border-blue-600 text-blue-600 font-semibold py-2 rounded-xl hover:bg-blue-50 transition-all text-sm"
                >
                  View Full Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
