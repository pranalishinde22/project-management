const express = require("express");

const Task = require("../models/Task");
const Project = require("../models/Project");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================
// GET TASKS FOR A PROJECT
// GET /api/tasks/project/:projectId
// =====================================

router.get(
  "/project/:projectId",
  protect,
  async (req, res) => {
    try {
      const project =
        await Project.findOne({
          _id: req.params.projectId,
          owner: req.user._id,
        });

      if (!project) {
        return res.status(404).json({
          message: "Project not found.",
        });
      }

      const tasks = await Task.find({
        project: project._id,
        owner: req.user._id,
      }).sort({
        createdAt: -1,
      });

      res.json(tasks);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch tasks.",
      });
    }
  }
);


// =====================================
// CREATE TASK
// POST /api/tasks
// =====================================

router.post(
  "/",
  protect,
  async (req, res) => {
    try {
      const {
        title,
        projectId,
        status,
        priority,
        due,
        assignee,
      } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({
          message:
            "Task title is required.",
        });
      }

      const project =
        await Project.findOne({
          _id: projectId,
          owner: req.user._id,
        });

      if (!project) {
        return res.status(404).json({
          message:
            "Project not found.",
        });
      }

      const task =
        await Task.create({
          title: title.trim(),
          project: project._id,
          owner: req.user._id,
          status: status || "todo",
          priority: priority || "medium",
          due: due || "",
          assignee: assignee || "NA",
        });

      res.status(201).json(task);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to create task.",
      });
    }
  }
);


// =====================================
// UPDATE TASK
// PUT /api/tasks/:id
// =====================================

router.put(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const {
        title,
        status,
        priority,
        due,
        assignee,
      } = req.body;

      const task =
        await Task.findOne({
          _id: req.params.id,
          owner: req.user._id,
        });

      if (!task) {
        return res.status(404).json({
          message: "Task not found.",
        });
      }

      if (title !== undefined) {
        task.title =
          title.trim();
      }

      if (status !== undefined) {
        task.status = status;
      }

      if (priority !== undefined) {
        task.priority = priority;
      }

      if (due !== undefined) {
        task.due = due;
      }

      if (assignee !== undefined) {
        task.assignee = assignee;
      }

      await task.save();

      res.json(task);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to update task.",
      });
    }
  }
);


// =====================================
// DELETE TASK
// DELETE /api/tasks/:id
// =====================================

router.delete(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const task =
        await Task.findOneAndDelete({
          _id: req.params.id,
          owner: req.user._id,
        });

      if (!task) {
        return res.status(404).json({
          message: "Task not found.",
        });
      }

      res.json({
        message: "Task deleted.",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to delete task.",
      });
    }
  }
);


module.exports = router;