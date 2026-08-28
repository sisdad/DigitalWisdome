import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ============================================================
// ES MODULE PATH SETUP
// ============================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// CMS IMAGE UPLOAD DIRECTORY
// ============================================================
//
// middleware/ -> server/ -> uploads/cms
//
// Final directory:
//
// digital-wisdom/server/uploads/cms
//
// This matches server.js:
//
// app.use("/uploads", express.static(uploadsDir))
//
// ============================================================

const uploadDirectory = path.resolve(
  __dirname,
  "../uploads/cms"
);

// Create directory automatically
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// ============================================================
// STORAGE
// ============================================================

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (_req, file, cb) => {
    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    const baseName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();

    const timestamp = Date.now();

    cb(
      null,
      `${baseName || "cms-image"}-${timestamp}${extension}`
    );
  },
});

// ============================================================
// FILE FILTER
// ============================================================

const fileFilter = (_req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        "Invalid image type. Only JPG, PNG, WEBP, and GIF images are allowed."
      )
    );
  }

  cb(null, true);
};

// ============================================================
// MULTER
// ============================================================

const uploadCmsImage = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default uploadCmsImage;