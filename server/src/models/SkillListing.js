const mongoose = require("mongoose");

const skillListingSchema = new mongoose.Schema(
  {
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: [true, "Skill title is required"],
      trim: true
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Programming",
        "Design",
        "Mathematics",
        "Languages",
        "Music",
        "Business",
        "Other"
      ]
    },
    description: {
      type: String,
      required: [true, "Description is required"]
    },
    durationMinutes: {
      type: Number,
      default: 60
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SkillListing", skillListingSchema);
