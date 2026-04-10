/**
 * Document Routes
 *
 * API endpoints for document management
 *
 * All routes require authentication (JWT)
 * All operations are owner-scoped
 */

import express from "express";
import * as documentController from "./document.controller.js";
import { authenticateOwner } from "../auth/auth.middleware.js"; // Adjust path as needed
import {
  uploadDocument,
  handleUploadError,
} from "../../middleware/upload.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/v1/documents/upload
 * @desc    Upload a document for a unit
 * @access  Private (Owner)
 *
 * Multipart/form-data with fields:
 * - document (file)
 * - propertyId (string)
 * - unitId (string)
 * - documentType (string)
 * - documentName (string)
 * - description (string, optional)
 * - expiryDate (date, optional)
 * - tags (array or comma-separated string, optional)
 */
router.post(
  "/upload",
  authenticateOwner,
  uploadDocument,
  handleUploadError,
  documentController.uploadDocument,
);

/**
 * @route   GET /api/v1/documents/unit/:unitId
 * @desc    Get all documents for a unit
 * @access  Private (Owner)
 * @query   documentType (optional) - Filter by document type
 */
router.get(
  "/unit/:unitId",
  authenticateOwner,
  documentController.getUnitDocuments,
);

/**
 * @route   GET /api/v1/documents/property/:propertyId
 * @desc    Get all documents for a property
 * @access  Private (Owner)
 * @query   documentType (optional) - Filter by document type
 * @query   unitId (optional) - Filter by specific unit
 */
router.get(
  "/property/:propertyId",
  authenticateOwner,
  documentController.getPropertyDocuments,
);

/**
 * @route   GET /api/v1/documents/expiring/list
 * @desc    Get documents expiring within specified days
 * @access  Private (Owner)
 * @query   daysFromNow (number, optional, default: 30)
 */
router.get(
  "/expiring/list",
  authenticateOwner,
  documentController.getExpiringDocuments,
);

/**
 * @route   GET /api/v1/documents/statistics/summary
 * @desc    Get document statistics by type
 * @access  Private (Owner)
 */
router.get(
  "/statistics/summary",
  authenticateOwner,
  documentController.getDocumentStatistics,
);

/**
 * @route   GET /api/v1/documents/:documentId
 * @desc    Get a single document by ID
 * @access  Private (Owner)
 */
router.get(
  "/:documentId",
  authenticateOwner,
  documentController.getDocumentById,
);

/**
 * @route   GET /api/v1/documents/:documentId/download
 * @desc    Download a document file
 * @access  Private (Owner)
 */
router.get(
  "/:documentId/download",
  authenticateOwner,
  documentController.downloadDocument,
);

/**
 * @route   PUT /api/v1/documents/:documentId
 * @desc    Update document metadata
 * @access  Private (Owner)
 *
 * Allowed updates:
 * - documentName
 * - description
 * - expiryDate
 * - tags
 */
router.put(
  "/:documentId",
  authenticateOwner,
  documentController.updateDocument,
);

/**
 * @route   DELETE /api/v1/documents/:documentId
 * @desc    Delete a document (soft delete)
 * @access  Private (Owner)
 */
router.delete(
  "/:documentId",
  authenticateOwner,
  documentController.deleteDocument,
);

export default router;
