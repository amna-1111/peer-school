import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { getProfile, updateProfile } from "../api/userApi";
import { getInstructorSkills, createSkill, deleteSkill } from "../api/skillApi";
import {
  addSlot,
  deleteSlot as removeSlot,
  getAvailableSlots
} from "../api/sessionApi";
import { Helmet } from "react-helmet-async";

const CATEGORIES = [
  "Programming",
  "Design",
  "Mathematics",
  "Languages",
  "Music",
  "Business",
  "Other"
];

export default function MyProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    skillsWanted: []
  });
  const [skills, setSkills] = useState([]);
  const [wantedInput, setWantedInput] = useState("");
  const [newSkill, setNewSkill] = useState({
    title: "",
    category: "Programming",
    description: "",
    durationMinutes: 60
  });
  const [message, setMessage] = useState("");

  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ startTime: "", endTime: "" });

  useEffect(() => {
    if (!user) return;
    getProfile(user.id).then(({ data }) => {
      setProfile({
        name: data.name,
        bio: data.bio || "",
        skillsWanted: data.skillsWanted || []
      });
    });
    getInstructorSkills(user.id).then(({ data }) => setSkills(data));
    getAvailableSlots(user.id).then(({ data }) => setSlots(data));
  }, [user]);

  const handleProfileSave = async () => {
    try {
      await updateProfile(profile);
      setMessage("Profile updated!");
    } catch {
      setMessage("Failed to update profile");
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
    try {
      const { data } = await createSkill(newSkill);
      setSkills([...skills, data]);
      setNewSkill({
        title: "",
        category: "Programming",
        description: "",
        durationMinutes: 60
      });
      setMessage("Skill added!");
    } catch {
      setMessage("Failed to add skill");
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await deleteSkill(id);
      setSkills(skills.filter((s) => s._id !== id));
    } catch {
      setMessage("Failed to delete skill");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: "0 1rem" }}>
      <h2>My Profile</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* Profile Info */}
      <section>
        <h3>Basic Info</h3>
        <div>
          <label>Name</label>
          <input
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>
        <div>
          <label>Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows={3}
          />
        </div>
        <button onClick={handleProfileSave}>Save Profile</button>
      </section>

      {/* Skills Wanted */}
      <section style={{ marginTop: "2rem" }}>
        <h3>Skills I Want to Learn</h3>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            value={wantedInput}
            onChange={(e) => setWantedInput(e.target.value)}
            placeholder="e.g. Guitar, French..."
          />
          <button onClick={addWantedSkill}>Add</button>
        </div>
        <div
          style={{
            marginTop: "8px",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px"
          }}
        >
          {profile.skillsWanted.map((skill, i) => (
            <span
              key={i}
              style={{
                background: "#eee",
                padding: "4px 10px",
                borderRadius: "12px"
              }}
            >
              {skill}{" "}
              <button
                onClick={() => removeWantedSkill(i)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer"
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </section>

      {/* Skills Offered */}
      <section style={{ marginTop: "2rem" }}>
        <h3>Skills I Teach</h3>
        <div
          style={{
            border: "1px solid #ddd",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem"
          }}
        >
          <h4>Add a new skill</h4>
          <input
            placeholder="Title"
            value={newSkill.title}
            onChange={(e) =>
              setNewSkill({ ...newSkill, title: e.target.value })
            }
          />
          <select
            value={newSkill.category}
            onChange={(e) =>
              setNewSkill({ ...newSkill, category: e.target.value })
            }
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <textarea
            placeholder="Description"
            value={newSkill.description}
            onChange={(e) =>
              setNewSkill({ ...newSkill, description: e.target.value })
            }
            rows={2}
          />
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={newSkill.durationMinutes}
            onChange={(e) =>
              setNewSkill({ ...newSkill, durationMinutes: e.target.value })
            }
          />
          <button onClick={handleAddSkill}>Add Skill</button>
        </div>

        {skills.map((skill) => (
          <div
            key={skill._id}
            style={{
              border: "1px solid #ddd",
              padding: "0.75rem",
              borderRadius: "8px",
              marginBottom: "0.5rem"
            }}
          >
            <strong>{skill.title}</strong> — {skill.category}
            <p style={{ margin: "4px 0", fontSize: "14px" }}>
              {skill.description}
            </p>
            <button
              onClick={() => handleDeleteSkill(skill._id)}
              style={{ color: "red" }}
            >
              Delete
            </button>
          </div>
        ))}
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h3>My Availability</h3>
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "1rem"
          }}
        >
          <input
            type="datetime-local"
            value={newSlot.startTime}
            onChange={(e) =>
              setNewSlot({ ...newSlot, startTime: e.target.value })
            }
          />
          <input
            type="datetime-local"
            value={newSlot.endTime}
            onChange={(e) =>
              setNewSlot({ ...newSlot, endTime: e.target.value })
            }
          />
          <button
            onClick={async () => {
              const { data } = await addSlot(newSlot);
              setSlots([...slots, data]);
              setNewSlot({ startTime: "", endTime: "" });
            }}
          >
            Add Slot
          </button>
        </div>
        {slots.map((slot) => (
          <div
            key={slot._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginBottom: "0.5rem"
            }}
          >
            <span>{new Date(slot.startTime).toLocaleString()}</span>
            <button
              onClick={async () => {
                await removeSlot(slot._id);
                setSlots(slots.filter((s) => s._id !== slot._id));
              }}
              style={{ color: "red" }}
            >
              Remove
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
