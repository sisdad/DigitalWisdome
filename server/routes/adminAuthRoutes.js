import express from "express";
import rateLimit from "express-rate-limit";

import { loginAdmin } from "../controllers/adminAuthController.js";

const router = express.Router();

// ============================================================
// ADMIN LOGIN RATE LIMITER
// ============================================================

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

// ============================================================
// ADMIN LOGIN
// ============================================================

router.post(
  "/login",
  adminLoginLimiter,
  loginAdmin
);

export default router;