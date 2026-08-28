import express from "express";

import { createInquiry } from "../controllers/inquiryController.js";
import { validateInquiry } from "../middleware/validation.js";

const router = express.Router();

router.post(
  "/",
  validateInquiry,
  createInquiry
);

export default router;