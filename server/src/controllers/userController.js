const User = require("../models/User");

// GET /api/users/:id
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, skillsWanted } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, skillsWanted },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// GET /api/users/dashboard
const getDashboard = async (req, res, next) => {
  try {
    const Session = require("../models/Session");

    const upcoming = await Session.find({
      $or: [{ learner: req.user.id }, { instructor: req.user.id }],
      status: { $in: ["Pending", "Confirmed"] }
    })
      .populate("skillListing", "title category")
      .populate("learner", "name")
      .populate("instructor", "name")
      .populate("slot")
      .sort({ createdAt: -1 })
      .limit(5);

    const user = await require("../models/User")
      .findById(req.user.id)
      .select("name totalSessionsTaught totalSessionsAttended avgRating");

    res.json({ upcoming, stats: user });
  } catch (error) {
    next(error);
  }
};

// POST /api/users/upload-photo
const uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const imageUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePhoto: imageUrl },
      { new: true }
    ).select("-password");
    res.json({ profilePhoto: user.profilePhoto });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/change-password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    if (newPassword.length < 6)
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });

    user.password = newPassword;
    await user.save(); // pre-save hook will hash it
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  getDashboard,
  uploadPhoto,
  changePassword
};
