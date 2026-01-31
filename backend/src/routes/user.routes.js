const express = require("express");
const router = express.Router();
const { updateUser, deleteUser } = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.put("/:userId", authMiddleware, updateUser);
router.delete("/:userId", authMiddleware, deleteUser);

module.exports = router;
