const express = require("express");

const Project = require("../models/Project");
const Task = require("../models/Task");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================
// GET ALL PROJECTS
// GET /api/projects
// =====================================

router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find({
      owner: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json(projects);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch projects.",
    });
  }
});


// =====================================
// CREATE PROJECT
// POST /api/projects
// =====================================

router.post("/", protect, async (req, res) => {
  try {
    const {
      name,
      color,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message:
          "Project name is required.",
      });
    }

    const project =
      await Project.create({
        name: name.trim(),
        color: color || "bg-slate-500",
        owner: req.user._id,
      });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to create project.",
    });
  }
});


// =====================================
// UPDATE PROJECT
// PUT /api/projects/:id
// =====================================

router.put(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const {
        name,
        color,
      } = req.body;

      const project =
        await Project.findOne({
          _id: req.params.id,
          owner: req.user._id,
        });

      if (!project) {
        return res.status(404).json({
          message: "Project not found.",
        });
      }

      if (name !== undefined) {
        project.name =
          name.trim();
      }

      if (color !== undefined) {
        project.color = color;
      }

      await project.save();

      res.json(project);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to update project.",
      });
    }
  }
);


// =====================================
// DELETE PROJECT
// DELETE /api/projects/:id
// =====================================

router.delete(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const project =
        await Project.findOneAndDelete({
          _id: req.params.id,
          owner: req.user._id,
        });

      if (!project) {
        return res.status(404).json({
          message: "Project not found.",
        });
      }

      await Task.deleteMany({
        project: project._id,
        owner: req.user._id,
      });

      res.json({
        message:
          "Project and its tasks deleted.",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to delete project.",
      });
    }
  }
);


module.exports = router;