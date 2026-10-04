const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const taskRoutes = require("./src/routes/taskRoutes");

const app = express();


// =====================================
// MIDDLEWARE
// =====================================

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",

    credentials: true,
  })
);

app.use(express.json());


// =====================================
// HEALTH CHECK
// =====================================

app.get("/", (req, res) => {
  res.json({
    message:
      "Project Management API is running.",
  });
});


// =====================================
// API ROUTES
// =====================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/projects",
  projectRoutes
);

app.use(
  "/api/tasks",
  taskRoutes
);


// =====================================
// 404
// =====================================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found.",
  });
});


// =====================================
// ERROR HANDLER
// =====================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(error);

    res.status(500).json({
      message:
        "Something went wrong.",
    });
  }
);

module.exports = app;