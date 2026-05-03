const express = require("express");
const cors = require("cors");

const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

//Routes

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/UserRoutes");
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
