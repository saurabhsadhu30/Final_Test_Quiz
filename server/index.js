const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const questionRoutes = require("./routes/questionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const globalErrorHandler = require("./controllers/errorController");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config();
const app = express();

// c
// connect db
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected successfully ✅"));

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  morgan("dev");
}

// routes
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/health", (req, res) => res.send("Server is live and running ✅"));

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

app.use("*", (req, res) => {
  res.status(400).json({
    status: false,
    msg: "url you are looking not found on server",
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server Listening at port ${PORT} ✅`));

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
