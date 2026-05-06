const Session = require("../models/Session");
const AvailabilitySlot = require("../models/AvailabilitySlots");
const SkillListing = require("../models/SkillListing");
const User = require("../models/User");
const sendEmail = require("../config/email");
const crypto = require("crypto");

// GET /api/sessions/slots/:instructorId — get available slots for an instructor
const getAvailableSlots = async (req, res, next) => {
  try {
    const slots = await AvailabilitySlot.find({
      instructor: req.params.instructorId,
      isBooked: false,
      startTime: { $gte: new Date() } // only future slots
    }).sort({ startTime: 1 });
    res.json(slots);
  } catch (error) {
    next(error);
  }
};

// POST /api/sessions/slots — instructor adds an availability slot
const addSlot = async (req, res, next) => {
  try {
    const { startTime, endTime } = req.body;
    const slot = await AvailabilitySlot.create({
      instructor: req.user.id,
      startTime,
      endTime
    });
    res.status(201).json(slot);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/sessions/slots/:slotId — instructor removes a slot
const deleteSlot = async (req, res, next) => {
  try {
    const slot = await AvailabilitySlot.findById(req.params.slotId);
    if (!slot) return res.status(404).json({ message: "Slot not found" });
    if (slot.instructor.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });
    if (slot.isBooked)
      return res.status(400).json({ message: "Cannot delete a booked slot" });
    await slot.deleteOne();
    res.json({ message: "Slot deleted" });
  } catch (error) {
    next(error);
  }
};

// POST /api/sessions/book — learner books a session
const bookSession = async (req, res, next) => {
  try {
    const { skillListingId, slotId } = req.body;

    // Check skill exists
    const skill = await SkillListing.findById(skillListingId);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    // Check slot exists and is not already booked (double booking prevention)
    const slot = await AvailabilitySlot.findById(slotId);
    if (!slot) return res.status(404).json({ message: "Slot not found" });
    if (slot.isBooked)
      return res.status(400).json({ message: "This slot is already booked" });

    // Prevent booking your own session
    if (skill.instructor.toString() === req.user.id)
      return res
        .status(400)
        .json({ message: "You cannot book your own session" });

    // Create session
    const session = await Session.create({
      skillListing: skillListingId,
      learner: req.user.id,
      instructor: skill.instructor,
      slot: slotId
    });

    // Mark slot as booked
    slot.isBooked = true;
    await slot.save();

    // Fetch emails for both parties
    const learnerUser = await User.findById(req.user.id).select("name email");
    const instructorUser = await User.findById(skill.instructor).select(
      "name email"
    );
    const slotTime = new Date(slot.startTime).toLocaleString();
    const skillTitle = skill.title;

    // Email to instructor
    await sendEmail({
      to: instructorUser.email,
      subject: "New session request — PeerSchool",
      html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #2563eb; padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">New Booking Request!</h1>
      </div>
      <div style="padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
        <p style="color: #374151;"><strong>${learnerUser.name}</strong> wants to book a session with you.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Skill</td>
            <td style="padding: 8px 0; color: #111827; font-weight: 600;">${skillTitle}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Requested by</td>
            <td style="padding: 8px 0; color: #111827; font-weight: 600;">${learnerUser.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Time</td>
            <td style="padding: 8px 0; color: #111827; font-weight: 600;">${slotTime}</td>
          </tr>
        </table>
        <div style="text-align: center; margin-top: 20px;">
          <p style="color: #6b7280;">Please log in to PeerSchool to accept or decline this request.</p>
          <a href="http://localhost:5173/sessions"
            style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; margin-top: 8px;">
            View Session Request →
          </a>
        </div>
      </div>
    </div>
  `
    });

    // Email to learner
    await sendEmail({
      to: learnerUser.email,
      subject: "Session booked — PeerSchool",
      html: `
    <h2>Your session is booked!</h2>
    <p>You have successfully booked a session with <strong>${instructorUser.name}</strong>.</p>
    <p><strong>Skill:</strong> ${skillTitle}</p>
    <p><strong>Time:</strong> ${slotTime}</p>
    <p>You will be notified once the instructor confirms.</p>
  `
    });

    // Update stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalSessionsAttended: 1 }
    });
    await User.findByIdAndUpdate(skill.instructor, {
      $inc: { totalSessionsTaught: 1 }
    });

    const populated = await session.populate([
      { path: "skillListing", select: "title category" },
      { path: "instructor", select: "name email" },
      { path: "slot" }
    ]);

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// GET /api/sessions/my — get all sessions for logged in user
const getMySessions = async (req, res, next) => {
  try {
    const learning = await Session.find({ learner: req.user.id })
      .populate("skillListing", "title category")
      .populate("instructor", "name")
      .populate("slot")
      .sort({ createdAt: -1 });

    const teaching = await Session.find({ instructor: req.user.id })
      .populate("skillListing", "title category")
      .populate("learner", "name")
      .populate("slot")
      .sort({ createdAt: -1 });

    res.json({ learning, teaching });
  } catch (error) {
    next(error);
  }
};

// PUT /api/sessions/:id/status — update session status
const updateSessionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    // Only instructor can confirm/complete, either party can cancel
    const isInstructor = session.instructor.toString() === req.user.id;
    const isLearner = session.learner.toString() === req.user.id;

    if (!isInstructor && !isLearner)
      return res.status(403).json({ message: "Not authorized" });

    if ((status === "Confirmed" || status === "Completed") && !isInstructor)
      return res.status(403).json({
        message: "Only the instructor can confirm or complete sessions"
      });

    // Generate meeting link when confirmed
    if (status === "Confirmed" && !session.meetingLink) {
      const roomId = crypto.randomBytes(6).toString("hex");
      session.meetingLink = `https://meet.jit.si/peerscool-${roomId}`;
    }

    session.status = status;
    await session.save();

    // Send email notification on status change
    const fullSession = await Session.findById(req.params.id)
      .populate("learner", "name email")
      .populate("instructor", "name email")
      .populate("skillListing", "title")
      .populate("slot");

    const skillTitle = fullSession.skillListing?.title;
    const slotTime = fullSession.slot
      ? new Date(fullSession.slot.startTime).toLocaleString()
      : "N/A";

    const statusMessages = {
      Confirmed: {
        subject: "Your session is confirmed — PeerSchool",
        html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #2563eb; padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Session Confirmed! 🎉</h1>
      </div>
      <div style="padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
        <p style="color: #374151;">Your session has been confirmed. Here are the details:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Skill</td>
            <td style="padding: 8px 0; color: #111827; font-weight: 600;">${skillTitle}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Instructor</td>
            <td style="padding: 8px 0; color: #111827; font-weight: 600;">${fullSession.instructor.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Learner</td>
            <td style="padding: 8px 0; color: #111827; font-weight: 600;">${fullSession.learner.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Date & Time</td>
            <td style="padding: 8px 0; color: #111827; font-weight: 600;">${slotTime}</td>
          </tr>
        </table>
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-top: 16px; text-align: center;">
          <p style="color: #1d4ed8; font-weight: 600; margin: 0 0 12px;">Join your session here:</p>
          <a href="${fullSession.meetingLink}"
            style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
            Join Meeting →
          </a>
          <p style="color: #6b7280; font-size: 12px; margin: 12px 0 0;">
            ${fullSession.meetingLink}
          </p>
        </div>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
          No account needed — just click the link at the scheduled time.
        </p>
      </div>
    </div>
  `
      },
      Completed: {
        subject: "Session completed — PeerSchool",
        html: `
      <h2>Session Completed!</h2>
      <p>Your session for <strong>${skillTitle}</strong> has been marked as completed.</p>
      <p>Don't forget to leave a review for <strong>${fullSession.instructor.name}</strong>!</p>
    `
      },
      Cancelled: {
        subject: "Session cancelled — PeerSchool",
        html: `
      <h2>Session Cancelled</h2>
      <p>Your session for <strong>${skillTitle}</strong> on ${slotTime} has been cancelled.</p>
      <p>You can browse other skills and book a new session anytime.</p>
    `
      }
    };

    if (statusMessages[status]) {
      await sendEmail({
        to: fullSession.learner.email,
        ...statusMessages[status]
      });

      // Also send to instructor when confirmed
      if (status === "Confirmed") {
        await sendEmail({
          to: fullSession.instructor.email,
          subject: "Session confirmed — PeerSchool",
          html: statusMessages["Confirmed"].html
        });
      }
    }

    res.json(session);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAvailableSlots,
  addSlot,
  deleteSlot,
  bookSession,
  getMySessions,
  updateSessionStatus
};
