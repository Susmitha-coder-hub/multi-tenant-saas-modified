const express = require("express");
const router = express.Router();
const { updateTaskStatus, updateTask, deleteTask } = require("../controllers/task.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.patch("/:taskId/status", authMiddleware, updateTaskStatus);
router.put("/:taskId", authMiddleware, updateTask);
router.delete("/:taskId", authMiddleware, deleteTask);

module.exports = router;
