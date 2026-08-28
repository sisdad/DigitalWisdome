import pool from "../config/database.js";

// ============================================================
// CMS IMAGE CONTROLLER
// ============================================================
// Handles administrator assignment/removal of uploaded images
// for:
//
// 1. Page Sections
// 2. Solutions
//
// Uploaded files are handled by:
// server/middleware/uploadImage.js
//
// This controller stores the uploaded image URL and allows
// an existing image to be removed by setting image_url to null.
// ============================================================


// ============================================================
// VALIDATE CMS IMAGE URL
// ============================================================
//
// Supported:
//
// 1. Valid CMS image:
//    /uploads/cms/example.jpg
//
// 2. Remove image:
//    null
//    undefined
//    ""
//
// Rejected:
//
// - External URLs
// - Invalid paths
// - Path traversal
// - Backslash paths
// ============================================================

function validateCmsImageUrl(image_url) {
  // ----------------------------------------------------------
  // REMOVE IMAGE
  // ----------------------------------------------------------
  //
  // null, undefined, and empty string mean that the
  // administrator wants to remove the current image.
  //

  if (
    image_url === null ||
    image_url === undefined ||
    (
      typeof image_url === "string" &&
      image_url.trim() === ""
    )
  ) {
    return {
      valid: true,
      imageUrl: null,
      remove: true,
    };
  }

  // ----------------------------------------------------------
  // VALIDATE TYPE
  // ----------------------------------------------------------

  if (typeof image_url !== "string") {
    return {
      valid: false,
      message: "Invalid image URL.",
    };
  }

  const imageUrl = image_url.trim();

  // ----------------------------------------------------------
  // ONLY ALLOW CMS-UPLOADED IMAGES
  // ----------------------------------------------------------

  if (!imageUrl.startsWith("/uploads/cms/")) {
    return {
      valid: false,
      message:
        "Invalid CMS image URL. Image must be uploaded through the CMS image upload endpoint.",
    };
  }

  // ----------------------------------------------------------
  // PREVENT PATH TRAVERSAL
  // ----------------------------------------------------------

  if (
    imageUrl.includes("..") ||
    imageUrl.includes("\\")
  ) {
    return {
      valid: false,
      message: "Invalid image URL.",
    };
  }

  // ----------------------------------------------------------
  // VALID IMAGE URL
  // ----------------------------------------------------------

  return {
    valid: true,
    imageUrl,
    remove: false,
  };
}


// ============================================================
// UPDATE SECTION IMAGE
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
// To remove:
//
// {
//   "image_url": null
// }
//
// ============================================================

export async function updateSectionImage(
  req,
  res
) {
  try {
    // --------------------------------------------------------
    // VALIDATE SECTION ID
    // --------------------------------------------------------

    const sectionId =
      Number(req.params.sectionId);

    if (
      !Number.isInteger(sectionId) ||
      sectionId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid section ID.",
      });
    }

    // --------------------------------------------------------
    // VALIDATE IMAGE URL
    // --------------------------------------------------------

    const validation =
      validateCmsImageUrl(
        req.body?.image_url
      );

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const imageUrl =
      validation.imageUrl;

    // --------------------------------------------------------
    // FIND SECTION
    // --------------------------------------------------------

    const [sections] =
      await pool.execute(
        `
        SELECT
          id,
          page_id,
          section_key,
          image_url,
          status
        FROM page_sections
        WHERE id = ?
        LIMIT 1
        `,
        [sectionId]
      );

    if (sections.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "CMS section not found.",
      });
    }

    const section =
      sections[0];

    // --------------------------------------------------------
    // UPDATE SECTION IMAGE
    // --------------------------------------------------------
    //
    // imageUrl can be:
    //
    // /uploads/cms/example.jpg
    //
    // OR:
    //
    // null
    //
    // when removing the image.
    //

    await pool.execute(
      `
      UPDATE page_sections
      SET
        image_url = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [
        imageUrl,
        sectionId,
      ]
    );

    // --------------------------------------------------------
    // GET UPDATED SECTION
    // --------------------------------------------------------

    const [updatedRows] =
      await pool.execute(
        `
        SELECT
          id,
          page_id,
          section_key,
          eyebrow,
          title,
          subtitle,
          description,
          content,
          image_url,
          button_text,
          button_url,
          display_order,
          status,
          created_at,
          updated_at
        FROM page_sections
        WHERE id = ?
        LIMIT 1
        `,
        [sectionId]
      );

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        validation.remove
          ? "CMS section image removed successfully."
          : "CMS section image updated successfully.",

      data: {
        previous_image_url:
          section.image_url,

        section:
          updatedRows[0],
      },
    });
  } catch (error) {
    console.error(
      "CMS SECTION IMAGE UPDATE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update CMS section image.",
    });
  }
}


// ============================================================
// UPDATE SOLUTION IMAGE
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
// To remove:
//
// {
//   "image_url": null
// }
//
// ============================================================

export async function updateSolutionImage(
  req,
  res
) {
  try {
    // --------------------------------------------------------
    // VALIDATE SOLUTION ID
    // --------------------------------------------------------

    const solutionId =
      Number(req.params.solutionId);

    if (
      !Number.isInteger(solutionId) ||
      solutionId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid solution ID.",
      });
    }

    // --------------------------------------------------------
    // VALIDATE IMAGE URL
    // --------------------------------------------------------

    const validation =
      validateCmsImageUrl(
        req.body?.image_url
      );

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const imageUrl =
      validation.imageUrl;

    // --------------------------------------------------------
    // FIND SOLUTION
    // --------------------------------------------------------

    const [solutions] =
      await pool.execute(
        `
        SELECT
          id,
          title,
          image_url,
          status
        FROM solutions
        WHERE id = ?
        LIMIT 1
        `,
        [solutionId]
      );

    if (solutions.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Solution not found.",
      });
    }

    const solution =
      solutions[0];

    // --------------------------------------------------------
    // UPDATE SOLUTION IMAGE
    // --------------------------------------------------------
    //
    // imageUrl can be:
    //
    // /uploads/cms/example.jpg
    //
    // OR:
    //
    // null
    //
    // when removing the image.
    //

    await pool.execute(
      `
      UPDATE solutions
      SET
        image_url = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [
        imageUrl,
        solutionId,
      ]
    );

    // --------------------------------------------------------
    // GET UPDATED SOLUTION
    // --------------------------------------------------------

    const [updatedRows] =
      await pool.execute(
        `
        SELECT
          id,
          title,
          description,
          icon,
          image_url,
          display_order,
          status,
          created_at,
          updated_at
        FROM solutions
        WHERE id = ?
        LIMIT 1
        `,
        [solutionId]
      );

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        validation.remove
          ? "Solution image removed successfully."
          : "Solution image updated successfully.",

      data: {
        previous_image_url:
          solution.image_url,

        solution:
          updatedRows[0],
      },
    });
  } catch (error) {
    console.error(
      "CMS SOLUTION IMAGE UPDATE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update solution image.",
    });
  }
}