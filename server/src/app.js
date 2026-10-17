const express = require("express");
const cors = require("cors");

const { errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

const app = express();

app.use(express.json());
//app.use(cors({ origin: "http://localhost:5173", credentials: true }));
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

//Routes

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const skillRoutes = require("./routes/skillRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(errorHandler);

module.exports = app;
