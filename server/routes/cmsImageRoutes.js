import express from "express";
import fs from "fs";

import uploadCmsImage from "../middleware/uploadImage.js";

import { requireAdminAuth } from "../middleware/adminAuth.js";

import { requireAdminRole } from "../middleware/requireAdminRole.js";

import {
  updateSectionImage,
  updateSolutionImage,
} from "../controllers/cmsImageController.js";

const router = express.Router();

// ============================================================
// CMS IMAGE AUTHORIZATION
// ============================================================
//
// CMS IMAGE OPERATIONS ARE AVAILABLE TO:
//
// WEBSITE_CONTENT_MANAGER
//
// COMPANY_MANAGER is intentionally NOT allowed here.
//
// Authentication:
// requireAdminAuth
//
// Authorization:
// requireAdminRole("WEBSITE_CONTENT_MANAGER")
// ============================================================

const requireCmsContentManager = [
  requireAdminAuth,
  requireAdminRole("WEBSITE_CONTENT_MANAGER"),
];

// ============================================================
// CMS IMAGE UPLOAD
// ============================================================
//
// POST /api/admin/cms/images
//
// Requires:
// - Admin authentication
// - WEBSITE_CONTENT_MANAGER role
// - multipart/form-data
// - field name: image
//
// Accepted:
// - JPG
// - JPEG
// - PNG
// - WEBP
// - GIF
//
// Maximum:
// - 5 MB
// ============================================================

router.post(
  "/",

  ...requireCmsContentManager,

  // ==========================================================
  // MULTER IMAGE UPLOAD
  // ==========================================================

  (req, res, next) => {
    uploadCmsImage.single("image")(
      req,
      res,
      (error) => {
        if (error) {
          console.error(
            "CMS IMAGE UPLOAD ERROR:",
            error
          );

          // ----------------------------------------------------
          // FILE TOO LARGE
          // ----------------------------------------------------

          if (
            error.code ===
            "LIMIT_FILE_SIZE"
          ) {
            return res.status(400).json({
              success: false,
              message:
                "Image is too large. Maximum allowed size is 5 MB.",
            });
          }

          // ----------------------------------------------------
          // INVALID FILE TYPE / MULTER ERROR
          // ----------------------------------------------------

          return res.status(400).json({
            success: false,
            message:
              error.message ||
              "Image upload failed.",
          });
        }

        next();
      }
    );
  },

  // ==========================================================
  // UPLOAD RESPONSE
  // ==========================================================

  (req, res) => {
    try {
      // --------------------------------------------------------
      // NO FILE
      // --------------------------------------------------------

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "No image file was uploaded.",
        });
      }

      // --------------------------------------------------------
      // PUBLIC IMAGE URL
      // --------------------------------------------------------

      const imageUrl =
        `/uploads/cms/${req.file.filename}`;

      // --------------------------------------------------------
      // SUCCESS
      // --------------------------------------------------------

      return res.status(201).json({
        success: true,

        message:
          "CMS image uploaded successfully.",

        data: {
          filename:
            req.file.filename,

          original_name:
            req.file.originalname,

          mime_type:
            req.file.mimetype,

          size:
            req.file.size,

          image_url:
            imageUrl,
        },
      });
    } catch (error) {
      console.error(
        "CMS IMAGE RESPONSE ERROR:",
        error
      );

      // --------------------------------------------------------
      // CLEAN UP FILE IF SOMETHING FAILS
      // --------------------------------------------------------

      if (
        req.file?.path &&
        fs.existsSync(req.file.path)
      ) {
        try {
          fs.unlinkSync(
            req.file.path
          );
        } catch (cleanupError) {
          console.error(
            "CMS IMAGE CLEANUP ERROR:",
            cleanupError.message
          );
        }
      }

      return res.status(500).json({
        success: false,
        message:
          "Unable to process uploaded image.",
      });
    }
  }
);

// ============================================================
// ASSIGN / UPDATE CMS SECTION IMAGE
// ============================================================
//
// PUT /api/admin/cms/images/sections/:sectionId
//
// Body:
//
// {
//   "image_url": "/uploads/cms/example.jpg"
// }
//
// Requires:
// - Admin authentication
// - WEBSITE_CONTENT_MANAGER role
//
// ============================================================

router.put(
  "/sections/:sectionId",

  ...requireCmsContentManager,

  updateSectionImage
);

// ============================================================
// ASSIGN / UPDATE CMS SOLUTION IMAGE
// ============================================================
//
// PUT /api/admin/cms/images/solutions/:solutionId
//
// Body:
//
// {
//   "image_url": "/uploads/cms/example.jpg"
// }
//
// Requires:
// - Admin authentication
// - WEBSITE_CONTENT_MANAGER role
//
// ============================================================

router.put(
  "/solutions/:solutionId",

  ...requireCmsContentManager,

  updateSolutionImage
);

// ============================================================
// EXPORT ROUTER
// ============================================================

export default router;