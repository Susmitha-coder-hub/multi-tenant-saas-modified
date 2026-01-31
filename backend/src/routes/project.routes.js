const express = require("express");
const router = express.Router();
const { createProject, listProjects, updateProject, deleteProject, getProject } = require("../controllers/project.controller");
const { createTask, listTasks } = require("../controllers/task.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, listProjects);
router.put("/:projectId", authMiddleware, updateProject);
router.delete("/:projectId", authMiddleware, deleteProject);
router.get("/:projectId", authMiddleware, getProject);

// Nested Task Routes
router.post("/:projectId/tasks", authMiddleware, createTask);
router.get("/:projectId/tasks", authMiddleware, listTasks);

module.exports = router;
