import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { bookSession } from "../api/sessionApi";
import { Helmet } from "react-helmet-async";

export default function BookSession() {
  const { skillId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const skill = state?.skill;
  const slots = state?.slots || [];

  const formatSlotDetails = (slot) => {
    const start = new Date(slot.startTime);
    const end = new Date(slot.endTime);

    return {
      date: start.toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric"
      }),
      time: `${start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    };
  };

  const handleBook = async () => {
    if (!selectedSlot)
      return setError("Please select a time slot to continue.");
    setLoading(true);
    setError("");
    try {
      await bookSession({ skillListingId: skillId, slotId: selectedSlot });
      navigate("/sessions");
    } catch (err) {
      setError(
        err.response?.data?.message || "Booking failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!skill) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 text-center">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 max-w-sm">
          <p className="text-gray-500 mb-6">
            We couldn't find the skill data you're looking for.
          </p>
          <button
            onClick={() => navigate("/skills")}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Helmet>
        <title>Book Session | PeerSchool</title>
      </Helmet>

      {/* Header Section */}
      <div className="bg-[#5395EF] pt-12 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-100 hover:text-white text-sm font-bold mb-4 flex items-center gap-2 transition-colors"
          >
            ← Back to Details
          </button>
          <h1 className="text-3xl font-black text-white">
            Complete your Booking
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Slot Selection Column */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-blue-500">📅</span> Available Time Slots
              </h3>

              {slots.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-200">
                  <p className="text-gray-500">
                    No slots available for this instructor currently.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {slots.map((slot) => {
                    const details = formatSlotDetails(slot);
                    const isSelected = selectedSlot === slot._id;

                    return (
                      <button
                        key={slot._id}
                        onClick={() => setSelectedSlot(slot._id)}
                        className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-100"
                            : "border-gray-100 hover:border-blue-200 bg-white"
                        }`}
                      >
                        <div>
                          <p
                            className={`font-bold ${isSelected ? "text-blue-700" : "text-gray-800"}`}
                          >
                            {details.date}
                          </p>
                          <p className="text-sm text-gray-500 font-medium">
                            {details.time}
                          </p>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-200"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary Column */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5 border border-gray-100 sticky top-8">
              <h3 className="text-lg font-bold text-gray-800 mb-6 uppercase tracking-wider text-xs opacity-50">
                Session Summary
              </h3>

              <div className="mb-6 pb-6 border-b border-gray-100">
                <h4 className="font-black text-gray-800 text-xl leading-tight mb-2">
                  {skill.title}
                </h4>

                <p className="text-lg font-bold text-gray-800 uppercase tracking-wider text-xs opacity-50">
                  {skill.description}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-xl animate-shake">
                  ⚠️ {error}
                </div>
              )}

              <button
                onClick={handleBook}
                disabled={loading || slots.length === 0}
                className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest transition-all ${
                  loading || slots.length === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0"
                }`}
              >
                {loading ? "PROCESSING..." : "CONFIRM BOOKING"}
              </button>

              <p className="text-[14px] text-gray-400 text-center mt-4 font-medium uppercase tracking-tighter">
                By confirming, an email will be sent to the instructor for
                approval.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
