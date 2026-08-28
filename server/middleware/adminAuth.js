import jwt from "jsonwebtoken";
import pool from "../config/database.js";

// ============================================================
// ADMIN AUTHENTICATION MIDDLEWARE
// ============================================================

export async function requireAdminAuth(
  req,
  res,
  next
) {
  try {
    const authorization =
      req.headers.authorization || "";

    // ----------------------------------------------------------
    // CHECK BEARER TOKEN
    // ----------------------------------------------------------

    if (
      !authorization.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token =
      authorization
        .substring(7)
        .trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication token is missing.",
      });
    }

    // ----------------------------------------------------------
    // JWT SECRET
    // ----------------------------------------------------------

    const secret =
      process.env.JWT_SECRET;

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
    // VERIFY JWT
    // ----------------------------------------------------------

    const decoded = jwt.verify(
      token,
      secret,
      {
        issuer:
          "digital-wisdom",

        audience:
          "digital-wisdom-admin",
      }
    );

    // ----------------------------------------------------------
    // VERIFY TOKEN TYPE
    // ----------------------------------------------------------

    if (
      decoded.type !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Invalid administrator token.",
      });
    }

    // ----------------------------------------------------------
    // VERIFY ADMIN ID
    // ----------------------------------------------------------

    const adminId =
      Number(decoded.sub);

    if (
      !Number.isInteger(adminId) ||
      adminId <= 0
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid administrator identity.",
      });
    }

    // ----------------------------------------------------------
    // LOAD CURRENT ADMIN FROM DATABASE
    // ----------------------------------------------------------

    const [rows] =
      await pool.execute(
        `
        SELECT
          id,
          full_name,
          email,
          role,
          status
        FROM admin_users
        WHERE id = ?
        LIMIT 1
        `,
        [adminId]
      );

    // ----------------------------------------------------------
    // ADMIN NOT FOUND
    // ----------------------------------------------------------

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message:
          "Administrator account not found.",
      });
    }

    const admin = rows[0];

    // ----------------------------------------------------------
    // ACCOUNT MUST BE ACTIVE
    // ----------------------------------------------------------

    if (
      admin.status !== "ACTIVE"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Administrator account is not active.",
      });
    }

    // ----------------------------------------------------------
    // VALIDATE CURRENT ROLE
    // ----------------------------------------------------------

    const allowedRoles = [
      "WEBSITE_CONTENT_MANAGER",
      "COMPANY_MANAGER",
    ];

    if (
      !allowedRoles.includes(
        admin.role
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Administrator role is not authorized.",
      });
    }

    // ----------------------------------------------------------
    // ATTACH CURRENT ADMIN TO REQUEST
    // ----------------------------------------------------------

    req.admin = {
      id: admin.id,
      fullName: admin.full_name,
      email: admin.email,
      role: admin.role,
      status: admin.status,
      token: decoded,
    };

    next();
  } catch (error) {
    console.error(
      "ADMIN AUTH ERROR:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired authentication token.",
    });
  }
}