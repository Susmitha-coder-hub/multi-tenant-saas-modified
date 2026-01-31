const express = require("express");
const router = express.Router();
const { registerTenant, login, getMe, logout } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/register-tenant", registerTenant);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.post("/logout", authMiddleware, logout);

module.exports = router;
