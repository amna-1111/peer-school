import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSkills } from "../api/skillApi";
import { useSearchParams } from "react-router-dom";

const CATEGORIES = [
  "All",
  "Programming",
  "Design",
  "Mathematics",
  "Languages",
  "Music",
  "Business",
  "Other"
];

export default function BrowseSkills() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category !== "All") params.category = category;

    setLoading(true);
    getAllSkills(params)
      .then(({ data }) => setSkills(data))
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: "0 1rem" }}>
      <h2>Browse Skills</h2>

      {/* Search and filter */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "1.5rem" }}>
        <input
          placeholder="Search skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <p>Loading...</p>
      ) : skills.length === 0 ? (
        <p>No skills found.</p>
      ) : (
        skills.map((skill) => (
          <div
            key={skill._id}
            onClick={() => navigate(`/instructor/${skill.instructor._id}`)}
            style={{
              border: "1px solid #ddd",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "0.75rem",
              cursor: "pointer"
            }}
          >
            <strong>{skill.title}</strong>
            <span
              style={{
                marginLeft: "8px",
                fontSize: "12px",
                background: "#eee",
                padding: "2px 8px",
                borderRadius: "10px"
              }}
            >
              {skill.category}
            </span>
            <p style={{ margin: "6px 0", fontSize: "14px" }}>
              {skill.description}
            </p>
            <small>
              By {skill.instructor?.name} · {skill.durationMinutes} mins
            </small>
          </div>
        ))
      )}
    </div>
  );
}
