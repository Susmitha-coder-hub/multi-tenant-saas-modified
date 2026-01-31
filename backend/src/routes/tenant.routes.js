const express = require("express");
const router = express.Router();
const { getTenant, updateTenant, listTenants } = require("../controllers/tenant.controller");
const { addUser, listUsers } = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, listTenants);
router.get("/:tenantId", authMiddleware, getTenant);
router.put("/:tenantId", authMiddleware, updateTenant);

// Nested User Routes
router.post("/:tenantId/users", authMiddleware, addUser);
router.get("/:tenantId/users", authMiddleware, listUsers);

module.exports = router;
