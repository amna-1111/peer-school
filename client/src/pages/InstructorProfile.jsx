import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfile } from "../api/userApi";
import { getInstructorSkills } from "../api/skillApi";
import { getAvailableSlots } from "../api/sessionApi";
import { useAuth } from "../hooks/useAuth";
import { getInstructorReviews } from "../api/reviewApi";
import { Helmet } from "react-helmet-async";

export default function InstructorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [instructor, setInstructor] = useState(null);
  const [skills, setSkills] = useState([]);
  const [slots, setSlots] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    Promise.all([
      getProfile(id),
      getInstructorSkills(id),
      getAvailableSlots(id),
      getInstructorReviews(id)
    ]).then(([profileRes, skillsRes, slotsRes, reviewsRes]) => {
      setInstructor(profileRes.data);
      setSkills(skillsRes.data);
      setSlots(slotsRes.data);
      setReviews(reviewsRes.data);
      setLoading(false);
    });
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  const formatSlot = (slot) => {
    const start = new Date(slot.startTime);
    return start.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Helmet>
        <title>{instructor.name} | Instructor Profile</title>
      </Helmet>

      {/* Hero Profile Header */}
      <div className="bg-[#5395EF] pt-20 pb-32 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 text-white">
          <div className="w-32 h-32 bg-white/20 rounded-[2.5rem] flex items-center justify-center text-5xl border-4 border-white/30">
            {instructor.name.charAt(0)}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-black mb-2">{instructor.name}</h1>
            <p className="text-blue-50 text-lg max-w-2xl opacity-90 leading-relaxed">
              {instructor.bio || "This peer instructor hasn't added a bio yet."}
            </p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4 text-sm font-bold">
              <span className="bg-white/20 px-4 py-1.5 rounded-full border border-white/20">
                ⭐{" "}
                {instructor.avgRating > 0
                  ? instructor.avgRating.toFixed(1)
                  : "No rating"}
              </span>
              <span className="bg-white/20 px-4 py-1.5 rounded-full border border-white/20">
                🎓 {skills.length} Skills Shared
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Skills & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skills Section */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Skills Offered
              </h3>
              {skills.length === 0 ? (
                <p className="text-gray-400 italic">No skills listed yet.</p>
              ) : (
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div
                      key={skill._id}
                      className="p-6 border border-gray-100 rounded-[1.5rem] hover:bg-blue-50/30 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg text-gray-800">
                          {skill.title}
                        </h4>
                        <span className="text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                          {skill.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                        {skill.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                          {/* ⏱️ {skill.durationMinutes} mins */}
                        </span>
                        {user && user.id !== id && (
                          <button
                            onClick={() =>
                              navigate(`/book/${skill._id}`, {
                                state: { skill, slots }
                              })
                            }
                            className="bg-blue-600 text-white text-xs font-black px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                          >
                            BOOK SESSION
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 font-black uppercase tracking-tighter text-sm opacity-50">
                Peer Reviews
              </h3>
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl opacity-20 italic">
                    "No reviews yet"
                  </span>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="p-5 bg-gray-50 rounded-2xl border border-gray-100"
                    >
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-xs ${star <= review.rating ? "text-amber-500" : "text-gray-200"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm italic mb-3 leading-relaxed">
                        "{review.comment}"
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-700">
                          {review.reviewer?.name.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-gray-400">
                          {review.reviewer?.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Availability */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5 border border-gray-100 sticky top-8">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-blue-500">📅</span> Upcoming Slots
              </h3>
              {slots.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  No available slots this week.
                </p>
              ) : (
                <div className="space-y-3">
                  {slots.slice(0, 6).map((slot) => (
                    <div
                      key={slot._id}
                      className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between text-xs font-bold text-gray-600"
                    >
                      <span>{formatSlot(slot)}</span>
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    </div>
                  ))}
                  {slots.length > 6 && (
                    <p className="text-center text-[10px] text-gray-300 font-bold uppercase pt-2 tracking-widest">
                      and {slots.length - 6} more...
                    </p>
                  )}
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-gray-50">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                  Notice: Booking is subject to instructor confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
