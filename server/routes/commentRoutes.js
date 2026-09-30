import express from "express";
import pool from "../config/database.js";

import { requireAdminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// ============================================================
// CREATE CUSTOMER COMMENT
// ============================================================

router.post("/", async (req, res) => {
  try {
    const comment =
      typeof req.body?.comment === "string"
        ? req.body.comment.trim()
        : "";

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "Please enter a comment.",
      });
    }

    if (comment.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot exceed 1000 characters.",
      });
    }

    // New comments are automatically UNSEEN.
    const [result] = await pool.execute(
      `
      INSERT INTO comments (
        comment,
        is_seen
      )
      VALUES (?, 0)
      `,
      [comment]
    );

    return res.status(201).json({
      success: true,
      message: "Thank you for your comment.",
      data: {
        id: result.insertId,
        comment,
        is_seen: 0,
      },
    });
  } catch (error) {
    console.error("CREATE COMMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit your comment.",
    });
  }
});

// ============================================================
// GET PUBLIC CUSTOMER COMMENTS
// ============================================================

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `
      SELECT
        id,
        comment,
        created_at
      FROM comments
      ORDER BY created_at DESC
      LIMIT 50
      `
    );

    return res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("GET COMMENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load comments.",
    });
  }
});

// ============================================================
// ADMIN COMMENT ROUTES
// ============================================================

router.use("/admin", requireAdminAuth);

// ============================================================
// GET ALL CUSTOMER COMMENTS
// ============================================================

router.get("/admin", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `
      SELECT
        id,
        comment,
        created_at,
        is_seen
      FROM comments
      ORDER BY
        is_seen ASC,
        created_at DESC
      `
    );

    return res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("ADMIN GET COMMENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load customer comments.",
    });
  }
});

// ============================================================
// GET SINGLE CUSTOMER COMMENT
// ============================================================
//
// Clicking View automatically changes the comment to SEEN.
// ============================================================

router.get("/admin/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID.",
      });
    }

    // Mark as SEEN when administrator opens the comment.
    await pool.execute(
      `
      UPDATE comments
      SET is_seen = 1
      WHERE id = ?
      `,
      [id]
    );

    const [rows] = await pool.execute(
      `
      SELECT
        id,
        comment,
        created_at,
        is_seen
      FROM comments
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    return res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error(
      "ADMIN GET SINGLE COMMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load the comment.",
    });
  }
});

export default router;