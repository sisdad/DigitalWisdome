
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import inquiryRoutes from "./routes/inquiryRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminInquiryRoutes from "./routes/adminInquiryRoutes.js";
import publicCmsRoutes from "./routes/publicCmsRoutes.js";
import cmsImageRoutes from "./routes/cmsImageRoutes.js";
import adminCmsRoutes from "./routes/adminCmsRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
// ============================================================
// APP
// ============================================================

const app = express();

const PORT = process.env.PORT || 5000;

// ============================================================
// ES MODULE PATH SETUP
// ============================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// UPLOAD DIRECTORY
// ============================================================

const uploadsDir = path.join(__dirname, "uploads");

// Create uploads directory automatically if it does not exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, {
    recursive: true,
  });
}

// ============================================================
// ALLOWED FRONTEND ORIGINS
// ============================================================

const allowedOrigins = [
  // Local development
  "http://localhost:5173",
  "http://127.0.0.1:5173",

  // Production frontend
  process.env.CLIENT_URL,
].filter(Boolean);

// ============================================================
// HELMET
// ============================================================

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// ============================================================
// CORS
// ============================================================

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header.
      // Example: local server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin not allowed"));
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
  })
);

// ============================================================
// BODY PARSING
// ============================================================

app.use(
  express.json({
    limit: "1mb",
  })
);

// ============================================================
// PUBLIC UPLOADED FILES
// ============================================================
//
// Uploaded CMS images will be accessible through:
//
// http://localhost:5000/uploads/filename.jpg
//
// Example:
// /uploads/cms-1756123456789-123456789.jpg
//
// crossOriginResourcePolicy: cross-origin above allows the
// Vite frontend to display these images.
//

app.use(
  "/uploads",
  express.static(uploadsDir, {
    maxAge: "7d",
    index: false,
  })
);

// ============================================================
// GLOBAL API RATE LIMIT
// ============================================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 400,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

// ============================================================
// PUBLIC INQUIRY ROUTES
// ============================================================

app.use(
  "/api/inquiries",
  inquiryRoutes
);

// ============================================================
// ADMIN AUTH ROUTES
// ============================================================

app.use(
  "/api/admin/auth",
  adminAuthRoutes
);


// ============================================================
// ADMIN CMS MANAGEMENT ROUTES
// ============================================================

app.use(
  "/api/admin/cms",
  adminCmsRoutes
);



// ============================================================
// ADMIN INQUIRY ROUTES
// ============================================================

app.use(
  "/api/admin/inquiries",
  adminInquiryRoutes
);


// ============================================================
// Comment
// ============================================================

app.use("/api/comments", commentRoutes);


// ============================================================
// ADMIN CMS IMAGE UPLOAD ROUTES
// ============================================================
//
// Upload endpoint:
//
// POST /api/admin/cms/images
//
// This will be implemented in:
// server/routes/cmsImageRoutes.js
//
// The route will accept multipart/form-data with the
// field name:
//
// image
//

app.use(
  "/api/admin/cms/images",
  cmsImageRoutes
);

// ============================================================
// PUBLIC CMS ROUTES
// ============================================================

app.use(
  "/api/public-cms",
  publicCmsRoutes
);

// ============================================================
// HEALTH CHECK
// ============================================================

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      success: true,
      message: "Digital Wisdom API is running.",
      timestamp: new Date().toISOString(),
    });
  }
);



// ============================================================
// 404 API HANDLER
// ============================================================

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message: "API endpoint not found.",
    });
  }
);

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================

app.use(
  (err, req, res, next) => {
    console.error("SERVER ERROR:", err);

    // CORS error
    if (err.message === "CORS origin not allowed") {
      return res.status(403).json({
        success: false,
        message: "CORS origin not allowed.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
);

// ============================================================
// START SERVER
// ============================================================

app.listen(
  PORT,
  () => {
    console.log("========================================");
    console.log(" DIGITAL WISDOM API");
    console.log("========================================");
    console.log(
      ` Server: http://localhost:${PORT}`
    );
    console.log(
      ` Health: http://localhost:${PORT}/api/health`
    );
    console.log(
      ` Uploads: http://localhost:${PORT}/uploads`
    );
    console.log("========================================");
  }
);

