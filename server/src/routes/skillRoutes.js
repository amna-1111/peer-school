const router = require("express").Router();
const {
  getSkills,
  getSkillsByInstructor,
  createSkill,
  updateSkill,
  deleteSkill
} = require("../controllers/skillController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getSkills);
router.get("/instructor/:instructorId", getSkillsByInstructor);
router.post("/", protect, createSkill);
router.put("/:id", protect, updateSkill);
router.delete("/:id", protect, deleteSkill);

module.exports = router;
