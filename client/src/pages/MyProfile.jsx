import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  getProfile,
  updateProfile,
  uploadPhoto,
  changePassword
} from "../api/userApi";
import {
  getInstructorSkills,
  createSkill,
  deleteSkill,
  updateSkill
} from "../api/skillApi";
import {
  addSlot,
  deleteSlot as removeSlot,
  getAvailableSlots
} from "../api/sessionApi";
import { Helmet } from "react-helmet-async";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const CATEGORIES = [
  "Programming",
  "Design",
  "Mathematics",
  "Languages",
  "Music",
  "Business",
  "Other"
];

const CATEGORY_COLORS = {
  Programming: "bg-blue-100 text-blue-700",
  Design: "bg-purple-100 text-purple-700",
  Mathematics: "bg-green-100 text-green-700",
  Languages: "bg-yellow-100 text-yellow-700",
  Music: "bg-pink-100 text-pink-700",
  Business: "bg-orange-100 text-orange-700",
  Other: "bg-gray-100 text-gray-700"
};

export default function MyProfile() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    skillsWanted: []
  });
  const [skills, setSkills] = useState([]);
  const [slots, setSlots] = useState([]);
  const [wantedInput, setWantedInput] = useState("");
  const [newSkill, setNewSkill] = useState({
    title: "",
    category: "Programming",
    description: ""
    //durationMinutes: 60
  });
  const [editingSkill, setEditingSkill] = useState(null); // holds skill being edited

  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState("profile");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // For new slot modal
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [newSlot, setNewSlot] = useState({ startTime: "", endTime: "" });
  const [selectedSlotDate, setSelectedSlotDate] = useState(null);

  // for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordMessage, setPasswordMessage] = useState({
    text: "",
    type: ""
  });

  useEffect(() => {
    if (!user) return;
    getProfile(user.id).then(({ data }) => {
      setProfile({
        name: data.name,
        bio: data.bio || "",
        skillsWanted: data.skillsWanted || []
      });
      if (data.profilePhoto)
        setPhotoPreview(`http://localhost:5000${data.profilePhoto}`);
    });
    getInstructorSkills(user.id).then(({ data }) => setSkills(data));
    getAvailableSlots(user.id).then(({ data }) => setSlots(data));
  }, [user]);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoPreview(URL.createObjectURL(file));
    setUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append("photo", file);
      const { data } = await uploadPhoto(formData);
      updateUser({ profilePhoto: data.profilePhoto }); // sync to auth context
      showMessage("Photo updated!");
    } catch {
      showMessage("Failed to upload photo", "error");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleProfileSave = async () => {
    try {
      const { data } = await updateProfile(profile);
      updateUser({ name: data.name }); // Update global state
      showMessage("Profile updated!");
    } catch {
      showMessage("Failed to update profile", "error");
    }
  };

  const addWantedSkill = () => {
    if (!wantedInput.trim()) return;
    setProfile({
      ...profile,
      skillsWanted: [...profile.skillsWanted, wantedInput.trim()]
    });
    setWantedInput("");
  };

  const removeWantedSkill = (index) => {
    setProfile({
      ...profile,
      skillsWanted: profile.skillsWanted.filter((_, i) => i !== index)
    });
  };

  const handleAddSkill = async () => {
    if (!newSkill.title.trim()) return;
    try {
      const { data } = await createSkill(newSkill);
      setSkills([...skills, data]);
      setNewSkill({
        title: "",
        category: "Programming",
        description: ""
        //durationMinutes: 60
      });
      showMessage("Skill added!");
    } catch {
      showMessage("Failed to add skill", "error");
    }
  };

  const handleDeleteSkill = async (id) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this skill?"
    );
    if (!confirmation) return;
    try {
      await deleteSkill(id);
      setSkills(skills.filter((s) => s._id !== id));
    } catch {
      showMessage("Failed to delete skill", "error");
    }
  };

  const handleUpdateSkill = async () => {
    if (!editingSkill.title.trim()) return;
    try {
      const { data } = await updateSkill(editingSkill._id, {
        title: editingSkill.title,
        category: editingSkill.category,
        description: editingSkill.description,
        durationMinutes: editingSkill.durationMinutes
      });
      setSkills(skills.map((s) => (s._id === data._id ? data : s)));
      setEditingSkill(null);
      showMessage("Skill updated!");
    } catch {
      showMessage("Failed to update skill", "error");
    }
  };

  const handleAddSlot = async () => {
    if (moment(newSlot.endTime).isSameOrBefore(newSlot.startTime)) {
      showMessage("End time must be after start time", "error");
      return;
    }
    if (!newSlot.startTime || !newSlot.endTime) return;
    try {
      const { data } = await addSlot(newSlot);
      setSlots([...slots, data]);
      setNewSlot({ startTime: "", endTime: "" });
      setShowSlotModal(false);
      showMessage("Slot added!");
    } catch {
      showMessage("Failed to add slot", "error");
    }
  };

  const handleDeleteSlot = async (id) => {
    try {
      await removeSlot(id);
      setSlots(slots.filter((s) => s._id !== id));
    } catch {
      showMessage("Failed to remove slot", "error");
    }
  };

  // When user clicks a calendar slot
  const handleSelectSlot = ({ start, end }) => {
    const now = new Date();

    // Check if the selected start time is in the past
    if (moment(start).isBefore(now)) {
      showMessage("Cannot add availability to past dates or times.", "error");
      return;
    }
    const startStr = moment(start).format("YYYY-MM-DDTHH:mm");
    const endStr = moment(end).format("YYYY-MM-DDTHH:mm");
    setNewSlot({ startTime: startStr, endTime: endStr });
    setShowSlotModal(true);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ text: "New passwords do not match", type: "error" });
      return;
    }
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setPasswordMessage({ text: "Password updated!", type: "success" });
      setTimeout(() => setPasswordMessage({ text: "", type: "" }), 3000);
    } catch (err) {
      setPasswordMessage({
        text: err.response?.data?.message || "Failed to update password",
        type: "error"
      });
    }
  };

  // Convert slots to calendar events
  const calendarEvents = slots.map((slot) => ({
    id: slot._id,
    title: "Available",
    start: new Date(slot.startTime),
    end: new Date(slot.endTime)
  }));

  const tabs = ["profile", "skills", "availability"];

  // 2. Add a view drill-down handler
  const [currentView, setCurrentView] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleNavigate = (date) => setCurrentDate(date);
  const handleViewChange = (view) => setCurrentView(view);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>My Profile - PeerSchool</title>
      </Helmet>

      {/* Header */}
      <div className="bg-[#5395EF] py-10 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-blue-400 flex items-center justify-center cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-3xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              )}
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
            {uploadingPhoto && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">
              {profile.name || user?.name}
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              {profile.bio || "No bio yet — add one below"}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto mt-6 flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
                activeTab === tab
                  ? "bg-white text-blue-600 shadow"
                  : "text-white hover:bg-blue-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Toast message */}
      {message.text && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
            message.type === "error"
              ? "bg-red-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* ── PROFILE TAB ── */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Basic Info
            </h2>
            <div className="flex flex-col gap-5 max-w-lg">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Name
                </label>
                <input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  rows={4}
                  placeholder="Tell others about yourself..."
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                />
              </div>

              {/* Skills wanted */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Skills I Want to Learn
                </label>
                <div className="flex gap-2">
                  <input
                    value={wantedInput}
                    onChange={(e) => setWantedInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addWantedSkill()}
                    placeholder="e.g. Guitar, French..."
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <button
                    onClick={addWantedSkill}
                    className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-all"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile.skillsWanted.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5"
                    >
                      {skill}
                      <button
                        onClick={() => removeWantedSkill(i)}
                        className="hover:text-red-500 transition-colors font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleProfileSave}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md w-fit"
              >
                Save Changes
              </button>
            </div>

            {/* Change Password */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="text-base font-semibold text-gray-800 mb-4">
                Change Password
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value
                      })
                    }
                    placeholder="••••••"
                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value
                      })
                    }
                    placeholder="••••••"
                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value
                      })
                    }
                    placeholder="••••••"
                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                {passwordMessage.text && (
                  <p
                    className={`text-sm font-medium ${passwordMessage.type === "error" ? "text-red-500" : "text-green-500"}`}
                  >
                    {passwordMessage.text}
                  </p>
                )}
                <button
                  onClick={handleChangePassword}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md w-fit"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── SKILLS TAB ── */}
        {activeTab === "skills" && (
          <div className="flex flex-col gap-6">
            {/* Add skill form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-5">
                Add a New Skill
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Title
                  </label>
                  <input
                    placeholder="e.g. Python for beginners"
                    value={newSkill.title}
                    onChange={(e) =>
                      setNewSkill({ ...newSkill, title: e.target.value })
                    }
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Category
                  </label>
                  <select
                    value={newSkill.category}
                    onChange={(e) =>
                      setNewSkill({ ...newSkill, category: e.target.value })
                    }
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Description
                  </label>
                  <textarea
                    placeholder="What will students learn?"
                    value={newSkill.description}
                    onChange={(e) =>
                      setNewSkill({ ...newSkill, description: e.target.value })
                    }
                    rows={3}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                  />
                </div>
                {/* <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={newSkill.durationMinutes}
                    onChange={(e) =>
                      setNewSkill({
                        ...newSkill,
                        durationMinutes: e.target.value
                      })
                    }
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div> */}
              </div>
              <button
                onClick={handleAddSkill}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md text-sm"
              >
                + Add Skill
              </button>
            </div>

            {/* Existing skills */}
            {skills.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="font-medium">No skills listed yet</p>
                <p className="text-sm mt-1">Add your first skill above</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill) => (
                  <div
                    key={skill._id}
                    className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-800 text-sm">
                        {skill.title}
                      </h3>
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ml-2 shrink-0 ${CATEGORY_COLORS[skill.category] || "bg-gray-100 text-gray-600"}`}
                      >
                        {skill.category}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed mb-3">
                      {skill.description}
                    </p>
                    <div className="flex items-center justify-between">
                      {/* <span className="text-xs text-gray-400">
                        {skill.durationMinutes} mins
                      </span> */}

                      <button
                        onClick={() => setEditingSkill({ ...skill })}
                        className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteSkill(skill._id)}
                        className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── AVAILABILITY TAB ── */}
        {activeTab === "availability" && (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    My Availability
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Click and drag on the calendar to add available time slots
                  </p>
                </div>
                <button
                  onClick={() => setShowSlotModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-md"
                >
                  + Add Slot
                </button>
              </div>

              {/* Calendar */}
              <div style={{ height: 500 }}>
                <Calendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  selectable
                  // View Control
                  view={currentView}
                  onView={handleViewChange}
                  date={currentDate}
                  onNavigate={handleNavigate}
                  // Drill-down logic: Clicking a date in 'month' view takes you to 'day' view
                  onDrillDown={(date, view) => {
                    setCurrentDate(date);
                    setCurrentView("day");
                  }}
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={(event) => {
                    if (window.confirm("Remove this availability slot?")) {
                      handleDeleteSlot(event.id);
                    }
                  }}
                  views={["month", "week", "day"]}
                  min={new Date(0, 0, 0, 6, 0, 0)} // Optional: Hide late night hours (starts at 6am)
                  max={new Date(0, 0, 0, 23, 59, 59)} // Optional: End at midnight
                  eventPropGetter={() => ({
                    style: {
                      backgroundColor: "#2563eb",
                      borderRadius: "8px",
                      border: "none",
                      fontSize: "12px"
                    }
                  })}
                  style={{ borderRadius: "12px" }}
                />
              </div>
              <p className="text-xs text-gray-300 mt-3 text-center">
                Click on an existing slot to remove it
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add Slot Modal */}
      {showSlotModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Add Availability Slot
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={newSlot.startTime}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, startTime: e.target.value })
                  }
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={newSlot.endTime}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, endTime: e.target.value })
                  }
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddSlot}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-all"
              >
                Add Slot
              </button>
              <button
                onClick={() => {
                  setShowSlotModal(false);
                  setNewSlot({ startTime: "", endTime: "" });
                }}
                className="flex-1 border border-gray-200 text-gray-500 hover:bg-gray-50 font-medium py-2.5 rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Skill Modal */}
      {editingSkill && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              Edit Skill
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Title
                </label>
                <input
                  value={editingSkill.title}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, title: e.target.value })
                  }
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Category
                </label>
                <select
                  value={editingSkill.category}
                  onChange={(e) =>
                    setEditingSkill({
                      ...editingSkill,
                      category: e.target.value
                    })
                  }
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Description
                </label>
                <textarea
                  value={editingSkill.description}
                  onChange={(e) =>
                    setEditingSkill({
                      ...editingSkill,
                      description: e.target.value
                    })
                  }
                  rows={3}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                />
              </div>
              {/* <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={editingSkill.durationMinutes}
                  onChange={(e) =>
                    setEditingSkill({
                      ...editingSkill,
                      durationMinutes: e.target.value
                    })
                  }
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div> */}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateSkill}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-all"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingSkill(null)}
                className="flex-1 border border-gray-200 text-gray-500 hover:bg-gray-50 font-medium py-2.5 rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
