import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllSkills } from "../api/skillApi";
import { Helmet } from "react-helmet-async";

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

const CATEGORY_COLORS = {
  Programming: "bg-blue-100 text-blue-700",
  Design: "bg-purple-100 text-purple-700",
  Mathematics: "bg-green-100 text-green-700",
  Languages: "bg-yellow-100 text-yellow-700",
  Music: "bg-pink-100 text-pink-700",
  Business: "bg-orange-100 text-orange-700",
  Other: "bg-gray-100 text-gray-700"
};

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
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>PeerSchool — Browse Skills</title>
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Browse Skills</h1>
          <p className="text-blue-100 text-sm mb-6">
            Discover what your peers are offering and book a session
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              placeholder="Search skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                category === c
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-gray-400 mb-4">
            {skills.length} skill{skills.length !== 1 ? "s" : ""} found
            {category !== "All" ? ` in ${category}` : ""}
            {search ? ` for "${search}"` : ""}
          </p>
        )}

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/4 mb-4" />
                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <p className="text-gray-400 font-medium">No skills found</p>
            <p className="text-gray-300 text-sm mt-1">
              Try a different search or category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div
                key={skill._id}
                onClick={() => navigate(`/instructor/${skill.instructor._id}`)}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all cursor-pointer group"
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors text-base leading-snug">
                    {skill.title}
                  </h3>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ml-2 shrink-0 ${CATEGORY_COLORS[skill.category] || "bg-gray-100 text-gray-600"}`}
                  >
                    {skill.category}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                  {skill.description}
                </p>

                {/* Bottom row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      {skill.instructor?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-500">
                      {skill.instructor?.name}
                    </span>
                    {skill.instructor?.avgRating > 0 && (
                      <span className="text-xs text-yellow-500 font-medium">
                        ⭐ {skill.instructor.avgRating}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <svg
                      className="w-3.5 h-3.5"
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
                    {skill.durationMinutes} mins
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
