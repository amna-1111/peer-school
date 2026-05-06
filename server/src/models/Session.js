const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    skillListing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SkillListing",
      required: true
    },
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AvailabilitySlot",
      required: true
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending"
    },
    meetingLink: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
