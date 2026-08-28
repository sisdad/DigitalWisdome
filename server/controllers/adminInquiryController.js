import pool from "../config/database.js";

const VALID_STATUSES = [
  "NEW",
  "CONTACTED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

// ============================================================
// GET ALL INQUIRIES
// ============================================================

export async function getAllInquiries(req, res) {
  try {
    const [rows] = await pool.execute(
      `
      SELECT
        id,
        name,
        email,
        company,
        campaign_type,
        message,
        status,
        created_at,
        updated_at
      FROM inquiries
      ORDER BY created_at DESC
      `
    );

    return res.json({
      success: true,
      count: rows.length,
      inquiries: rows,
    });
  } catch (error) {
    console.error("GET ALL INQUIRIES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve inquiries.",
    });
  }
}

// ============================================================
// GET SINGLE INQUIRY
// ============================================================

export async function getInquiryById(req, res) {
  try {
    const inquiryId = Number(req.params.id);

    if (!Number.isSafeInteger(inquiryId) || inquiryId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry ID.",
      });
    }

    const [rows] = await pool.execute(
      `
      SELECT
        id,
        name,
        email,
        company,
        campaign_type,
        message,
        status,
        created_at,
        updated_at
      FROM inquiries
      WHERE id = ?
      LIMIT 1
      `,
      [inquiryId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found.",
      });
    }

    return res.json({
      success: true,
      inquiry: rows[0],
    });
  } catch (error) {
    console.error("GET INQUIRY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve inquiry.",
    });
  }
}

// ============================================================
// UPDATE INQUIRY STATUS
// ============================================================

export async function updateInquiryStatus(req, res) {
  try {
    const inquiryId = Number(req.params.id);

    const status = String(req.body.status || "")
      .trim()
      .toUpperCase();

    // ----------------------------------------------------------
    // Validate inquiry ID
    // ----------------------------------------------------------

    if (!Number.isSafeInteger(inquiryId) || inquiryId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry ID.",
      });
    }

    // ----------------------------------------------------------
    // Validate status
    // ----------------------------------------------------------

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry status.",
        allowedStatuses: VALID_STATUSES,
      });
    }

    // ----------------------------------------------------------
    // Confirm inquiry exists
    // ----------------------------------------------------------

    const [existingRows] = await pool.execute(
      `
      SELECT
        id,
        status
      FROM inquiries
      WHERE id = ?
      LIMIT 1
      `,
      [inquiryId]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found.",
      });
    }

    const currentStatus = existingRows[0].status;

    // ----------------------------------------------------------
    // Update only when status actually changes
    // ----------------------------------------------------------

    if (currentStatus !== status) {
      await pool.execute(
        `
        UPDATE inquiries
        SET status = ?
        WHERE id = ?
        `,
        [status, inquiryId]
      );
    }

    // ----------------------------------------------------------
    // Retrieve updated inquiry
    // ----------------------------------------------------------

    const [rows] = await pool.execute(
      `
      SELECT
        id,
        name,
        email,
        company,
        campaign_type,
        message,
        status,
        created_at,
        updated_at
      FROM inquiries
      WHERE id = ?
      LIMIT 1
      `,
      [inquiryId]
    );

    console.log("========================================");
    console.log("INQUIRY STATUS UPDATE");
    console.log("========================================");
    console.log("Inquiry ID:", inquiryId);
    console.log("Previous Status:", currentStatus);
    console.log("New Status:", status);
    console.log(
      "Admin ID:",
      req.admin?.id || req.admin?.token?.sub || "Unknown"
    );
    console.log(
      "Admin Role:",
      req.admin?.role || "Unknown"
    );
    console.log("========================================");

    return res.json({
      success: true,
      message:
        currentStatus === status
          ? "Inquiry status is already set to this value."
          : "Inquiry status updated successfully.",
      inquiry: rows[0],
    });
  } catch (error) {
    console.error("UPDATE INQUIRY STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update inquiry status.",
    });
  }
}