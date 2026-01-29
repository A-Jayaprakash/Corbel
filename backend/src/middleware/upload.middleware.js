/**
 * Upload Middleware
 *
 * Configures Multer for file upload handling with validation
 *
 * Features:
 * - File type validation (MIME type + extension)
 * - File size limits (10MB max)
 * - Custom file naming strategy
 * - Storage location management
 * - Error handling
 */

import multer from "multer";
import path from "path";
import fs from "fs/promises";

/**
 * Allowed MIME types for document uploads
 */
const ALLOWED_MIME_TYPES = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "text/plain": ".txt",
};

/**
 * Maximum file size: 10MB
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

/**
 * Upload directory path
 */
const UPLOAD_DIR = "uploads/documents";

/**
 * Ensure upload directory exists
 */
async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error("Error creating upload directory:", error);
    throw error;
  }
}

// Initialize directory on module load
ensureUploadDir();

/**
 * Multer storage configuration
 *
 * Uses disk storage with custom filename generation
 * Format: {unitId}_{documentType}_{timestamp}.{extension}
 */
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      await ensureUploadDir();
      cb(null, UPLOAD_DIR);
    } catch (error) {
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    try {
      const { unitId, documentType } = req.body;

      // Validate required fields
      if (!unitId || !documentType) {
        return cb(new Error("unitId and documentType are required"));
      }

      // Get file extension from MIME type
      const extension = ALLOWED_MIME_TYPES[file.mimetype];
      if (!extension) {
        return cb(new Error(`Unsupported file type: ${file.mimetype}`));
      }

      // Generate filename: unitId_documentType_timestamp.extension
      const timestamp = Date.now();
      const filename = `${unitId}_${documentType}_${timestamp}${extension}`;

      cb(null, filename);
    } catch (error) {
      cb(error);
    }
  },
});

/**
 * File filter for validation
 *
 * Validates:
 * - MIME type is in allowed list
 * - File extension matches MIME type
 */
const fileFilter = (req, file, cb) => {
  // Check MIME type
  if (!ALLOWED_MIME_TYPES[file.mimetype]) {
    const error = new Error(
      `Invalid file type. Allowed types: ${Object.keys(ALLOWED_MIME_TYPES).join(", ")}`,
    );
    error.code = "INVALID_FILE_TYPE";
    return cb(error, false);
  }

  // Verify extension matches MIME type
  const expectedExtension = ALLOWED_MIME_TYPES[file.mimetype];
  const actualExtension = path.extname(file.originalname).toLowerCase();

  if (expectedExtension !== actualExtension) {
    const error = new Error(
      `File extension ${actualExtension} does not match file type ${file.mimetype}`,
    );
    error.code = "EXTENSION_MISMATCH";
    return cb(error, false);
  }

  cb(null, true);
};

/**
 * Multer configuration
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1, // Only one file per request
  },
});

/**
 * Upload middleware for single file
 *
 * Field name: 'document'
 */
export const uploadDocument = upload.single("document");

/**
 * Error handling middleware for Multer errors
 *
 * Should be used after uploadDocument middleware
 */
export const handleUploadError = (err, req, res, next) => {
  if (!err) {
    return next();
  }

  // Multer-specific errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        statusCode: 413,
        message: "FILE_TOO_LARGE",
        description: `File exceeds maximum size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      });
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        statusCode: 400,
        message: "UNEXPECTED_FIELD",
        description: "Unexpected field in upload. Use field name 'document'",
      });
    }

    return res.status(400).json({
      statusCode: 400,
      message: "UPLOAD_ERROR",
      description: err.message,
    });
  }

  // Custom validation errors
  if (err.code === "INVALID_FILE_TYPE" || err.code === "EXTENSION_MISMATCH") {
    return res.status(400).json({
      statusCode: 400,
      message: err.code,
      description: err.message,
    });
  }

  // Other errors
  console.error("Upload error:", err);
  return res.status(500).json({
    statusCode: 500,
    message: "UPLOAD_FAILED",
    description: "File upload failed. Please try again.",
  });
};

/**
 * Utility function to delete file from disk
 *
 * Used when database operation fails after file upload
 */
export async function deleteFile(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error("Error deleting file:", error);
    // Don't throw - this is cleanup, shouldn't break the flow
  }
}

/**
 * Get full file path from filename
 */
export function getFilePath(filename) {
  return path.join(UPLOAD_DIR, filename);
}

/**
 * Check if file exists
 */
export async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Export constants for use in other modules
export { ALLOWED_MIME_TYPES, MAX_FILE_SIZE, UPLOAD_DIR };
