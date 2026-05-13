const SkillListing = require("../models/SkillListing");

// GET /api/skills — browse all, with optional search/filter
const getSkills = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    //if (search) filter.description = { $regex: search };

    const skills = await SkillListing.find(filter)
      .populate("instructor", "name avgRating profilePhoto")
      .sort({ createdAt: -1 });

    res.json(skills);
  } catch (error) {
    next(error);
  }
};

// GET /api/skills/instructor/:instructorId — all skills by one instructor
const getSkillsByInstructor = async (req, res, next) => {
  try {
    const skills = await SkillListing.find({
      instructor: req.params.instructorId
    });
    res.json(skills);
  } catch (error) {
    next(error);
  }
};

// POST /api/skills — create a skill listing
const createSkill = async (req, res, next) => {
  try {
    const { title, category, description, durationMinutes } = req.body;
    const skill = await SkillListing.create({
      instructor: req.user.id,
      title,
      category,
      description,
      durationMinutes
    });
    res.status(201).json(skill);
  } catch (error) {
    next(error);
  }
};

// PUT /api/skills/:id — edit a skill listing
const updateSkill = async (req, res, next) => {
  try {
    const skill = await SkillListing.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    if (skill.instructor.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const updated = await SkillListing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/skills/:id
const deleteSkill = async (req, res, next) => {
  try {
    const skill = await SkillListing.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    if (skill.instructor.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await skill.deleteOne();
    res.json({ message: "Skill deleted" });
  } catch (error) {
    next(error);
  }
};

const getSkillById = async (req, res, next) => {
  try {
    const skill = await SkillListing.findById(req.params.id).populate(
      "instructor",
      "name avgRating profilePhoto bio totalSessionsTaught"
    );
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    res.json(skill);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSkills,
  getSkillsByInstructor,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill
};
