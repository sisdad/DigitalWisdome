import express from "express";

import {
  getSiteSettings,
  getPublishedPage,
  getLocations,
  getSolutions,
  getBenefits,
  getCampaignProcess,
} from "../controllers/publicCmsController.js";

const router = express.Router();

// ============================================================
// PUBLIC CMS ROUTES
// ============================================================

// Site settings
router.get("/settings", getSiteSettings);

// Individual published page
// Example: /api/public-cms/pages/home
router.get("/pages/:pageKey", getPublishedPage);

// Locations
router.get("/locations", getLocations);

// Solutions
router.get("/solutions", getSolutions);

// Benefits
router.get("/benefits", getBenefits);

// Campaign process
router.get("/campaign-process", getCampaignProcess);

export default router;