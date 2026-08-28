import express from "express";

import {
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
} from "../controllers/adminInquiryController.js";

import {
  requireAdminAuth,
} from "../middleware/adminAuth.js";

import {
  requireAdminRole,
} from "../middleware/requireAdminRole.js";

const router = express.Router();

// ============================================================
// ADMIN AUTHENTICATION
// ============================================================

router.use(
  requireAdminAuth
);

// ============================================================
// COMPANY REQUEST MANAGEMENT
//
// COMPANY_MANAGER
// WEBSITE_CONTENT_MANAGER
//
// Both may view/manage public inquiries.
//
// Primary business responsibility:
// COMPANY_MANAGER
// ============================================================

router.use(
  requireAdminRole(
    "COMPANY_MANAGER",
    "WEBSITE_CONTENT_MANAGER"
  )
);

// ============================================================
// GET ALL INQUIRIES
// GET /api/admin/inquiries
// ============================================================

router.get(
  "/",
  getAllInquiries
);

// ============================================================
// GET SINGLE INQUIRY
// GET /api/admin/inquiries/:id
// ============================================================

router.get(
  "/:id",
  getInquiryById
);

// ============================================================
// UPDATE INQUIRY STATUS
// PATCH /api/admin/inquiries/:id/status
// ============================================================

router.patch(
  "/:id/status",
  updateInquiryStatus
);

export default router;