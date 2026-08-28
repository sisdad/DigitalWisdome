import express from "express";

import {
  requireAdminAuth,
} from "../middleware/adminAuth.js";

import {
  requireAdminRole,
} from "../middleware/requireAdminRole.js";

import {
  getSiteSettingsAdmin,
  createSiteSetting,
  updateSiteSetting,
  deleteSiteSetting,

  getPages,
  getPage,
  createPage,
  updatePage,
  deletePage,

  getSections,
  createSection,
  updateSection,
  deleteSection,

  getSolutionsAdmin,
  createSolution,
  updateSolution,
  deleteSolution,

  getLocationsAdmin,
  createLocation,
  updateLocation,
  deleteLocation,

  getBenefitsAdmin,
  createBenefit,
  updateBenefit,
  deleteBenefit,

  getCampaignProcessAdmin,
  createCampaignProcess,
  updateCampaignProcess,
  deleteCampaignProcess,
} from "../controllers/adminCmsController.js";

const router = express.Router();

// ============================================================
// WEBSITE CONTENT MANAGER AUTHORIZATION
//
// ONLY:
// WEBSITE_CONTENT_MANAGER
//
// CAN ACCESS THIS ROUTER.
// ============================================================

router.use(
  requireAdminAuth,
  requireAdminRole(
    "WEBSITE_CONTENT_MANAGER"
  )
);

// ============================================================
// SITE SETTINGS
// ============================================================

router.get(
  "/settings",
  getSiteSettingsAdmin
);

router.post(
  "/settings",
  createSiteSetting
);

router.put(
  "/settings/:id",
  updateSiteSetting
);

router.delete(
  "/settings/:id",
  deleteSiteSetting
);

// ============================================================
// PAGES
// ============================================================

router.get(
  "/pages",
  getPages
);

router.get(
  "/pages/:id",
  getPage
);

router.post(
  "/pages",
  createPage
);

router.put(
  "/pages/:id",
  updatePage
);

router.delete(
  "/pages/:id",
  deletePage
);

// ============================================================
// PAGE SECTIONS
// ============================================================

router.get(
  "/pages/:pageId/sections",
  getSections
);

router.post(
  "/pages/:pageId/sections",
  createSection
);

router.put(
  "/sections/:id",
  updateSection
);

router.delete(
  "/sections/:id",
  deleteSection
);

// ============================================================
// SOLUTIONS
// ============================================================

router.get(
  "/solutions",
  getSolutionsAdmin
);

router.post(
  "/solutions",
  createSolution
);

router.put(
  "/solutions/:id",
  updateSolution
);

router.delete(
  "/solutions/:id",
  deleteSolution
);

// ============================================================
// LOCATIONS
// ============================================================

router.get(
  "/locations",
  getLocationsAdmin
);

router.post(
  "/locations",
  createLocation
);

router.put(
  "/locations/:id",
  updateLocation
);

router.delete(
  "/locations/:id",
  deleteLocation
);

// ============================================================
// BENEFITS
// ============================================================

router.get(
  "/benefits",
  getBenefitsAdmin
);

router.post(
  "/benefits",
  createBenefit
);

router.put(
  "/benefits/:id",
  updateBenefit
);

router.delete(
  "/benefits/:id",
  deleteBenefit
);

// ============================================================
// CAMPAIGN PROCESS
// ============================================================

router.get(
  "/campaign-process",
  getCampaignProcessAdmin
);

router.post(
  "/campaign-process",
  createCampaignProcess
);

router.put(
  "/campaign-process/:id",
  updateCampaignProcess
);

router.delete(
  "/campaign-process/:id",
  deleteCampaignProcess
);

export default router;