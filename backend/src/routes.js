import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";

const router = express.Router();

// Mount auth routes
router.use("/api/auth", authRoutes);

// Ping route
router.get("/ping", (req, res) => {
  res.json({ success: true, message: "Server is alive" });
});

export default router;
