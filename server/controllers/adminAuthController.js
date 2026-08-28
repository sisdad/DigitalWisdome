import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";

// ============================================================
// ADMIN AUTHENTICATION
// ============================================================

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

// ============================================================
// ADMIN LOGIN
// ============================================================

export async function loginAdmin(req, res) {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const password = String(req.body.password || "");

    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // ----------------------------------------------------------
    // FIND ADMIN
    // ----------------------------------------------------------

    const [rows] = await pool.execute(
      `
      SELECT
        id,
        full_name,
        email,
        password_hash,
        role,
        status,
        failed_attempts,
        locked_until
      FROM admin_users
      WHERE email = ?
      LIMIT 1
      `,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const admin = rows[0];

    // ----------------------------------------------------------
    // CHECK TEMPORARY LOCK
    // ----------------------------------------------------------

    if (
      admin.locked_until &&
      new Date(admin.locked_until).getTime() > Date.now()
    ) {
      return res.status(423).json({
        success: false,
        message:
          "Account temporarily locked. Please try again later.",
      });
    }

    // ----------------------------------------------------------
    // CLEAR EXPIRED LOCK
    // ----------------------------------------------------------

    if (
      admin.locked_until &&
      new Date(admin.locked_until).getTime() <= Date.now()
    ) {
      await pool.execute(
        `
        UPDATE admin_users
        SET
          failed_attempts = 0,
          locked_until = NULL,
          status = 'ACTIVE'
        WHERE id = ?
        `,
        [admin.id]
      );

      admin.failed_attempts = 0;
      admin.locked_until = null;
      admin.status = "ACTIVE";
    }

    // ----------------------------------------------------------
    // CHECK ACCOUNT STATUS
    // ----------------------------------------------------------

    if (admin.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Administrator account is not active.",
      });
    }

    // ----------------------------------------------------------
    // CHECK ROLE
    // ----------------------------------------------------------

    const allowedRoles = [
      "WEBSITE_CONTENT_MANAGER",
      "COMPANY_MANAGER",
    ];

    if (!allowedRoles.includes(admin.role)) {
      return res.status(403).json({
        success: false,
        message: "Administrator role is not authorized.",
      });
    }

    // ----------------------------------------------------------
    // PASSWORD VERIFICATION
    // ----------------------------------------------------------

    const passwordMatches = await bcrypt.compare(
      password,
      admin.password_hash
    );

    if (!passwordMatches) {
      const failedAttempts =
        Number(admin.failed_attempts || 0) + 1;

      // --------------------------------------------------------
      // LOCK ACCOUNT
      // --------------------------------------------------------

      if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
        await pool.execute(
          `
          UPDATE admin_users
          SET
            failed_attempts = ?,
            locked_until = DATE_ADD(NOW(), INTERVAL ? MINUTE),
            status = 'LOCKED'
          WHERE id = ?
          `,
          [
            failedAttempts,
            LOCK_MINUTES,
            admin.id,
          ]
        );

        return res.status(423).json({
          success: false,
          message:
            "Too many failed login attempts. Account locked for 15 minutes.",
        });
      }

      // --------------------------------------------------------
      // SAVE FAILED ATTEMPT
      // --------------------------------------------------------

      await pool.execute(
        `
        UPDATE admin_users
        SET failed_attempts = ?
        WHERE id = ?
        `,
        [
          failedAttempts,
          admin.id,
        ]
      );

      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // ----------------------------------------------------------
    // JWT SECRET
    // ----------------------------------------------------------

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error(
        "JWT_SECRET is not configured."
      );

      return res.status(500).json({
        success: false,
        message:
          "Authentication service is not configured.",
      });
    }

    // ----------------------------------------------------------
    // CREATE JWT
    // ----------------------------------------------------------

    const token = jwt.sign(
      {
        sub: String(admin.id),
        email: admin.email,
        role: admin.role,
        type: "admin",
      },
      secret,
      {
        expiresIn:
          process.env.JWT_EXPIRES_IN || "8h",

        issuer: "digital-wisdom",

        audience:
          "digital-wisdom-admin",
      }
    );

    // ----------------------------------------------------------
    // UPDATE LOGIN INFORMATION
    // ----------------------------------------------------------

    await pool.execute(
      `
      UPDATE admin_users
      SET
        failed_attempts = 0,
        locked_until = NULL,
        status = 'ACTIVE',
        last_login_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [admin.id]
    );

    // ----------------------------------------------------------
    // RESPONSE
    // ----------------------------------------------------------

    return res.json({
      success: true,
      message: "Admin login successful.",

      token,

      admin: {
        id: admin.id,
        fullName: admin.full_name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(
      "ADMIN LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to process admin login.",
    });
  }
}