/**
 * Document Service
 *
 * Business logic for unit document management
 *
 * Features:
 * - Upload documents with metadata
 * - Retrieve documents by unit/property
 * - Update document metadata
 * - Soft delete documents
 * - Track expiring documents
 * - Generate statistics
 *
 * Design Principles:
 * - Owner-scoped operations (all queries filtered by ownerId)
 * - Ownership validation before any operation
 * - Transactional file operations (rollback on failure)
 * - Immutable file storage (updates don't replace files)
 * - Audit trail preservation
 */

import UnitDocument, {
  DOCUMENT_TYPES,
} from "../../models/UnitDocument.model.js";
import { Unit } from "../../models/Unit.model.js";
import { Property } from "../../models/Property.model.js";
import { deleteFile } from "../../middleware/upload.middleware.js";

/**
 * Upload a new document for a unit
 *
 * @param {Object} ownerId - Owner ID from JWT
 * @param {Object} documentData - Document metadata
 * @param {Object} file - Uploaded file info from Multer
 * @returns {Object} Created document
 */
export async function uploadDocument(ownerId, documentData, file) {
  const {
    propertyId,
    unitId,
    documentType,
    documentName,
    description,
    expiryDate,
    tags,
  } = documentData;

  try {
    // 1. Validate property belongs to owner
    const property = await Property.findOne({ _id: propertyId, ownerId });
    if (!property) {
      // Clean up uploaded file
      await deleteFile(file.path);
      throw new Error("PROPERTY_NOT_FOUND");
    }

    // 2. Validate unit belongs to owner and property
    const unit = await Unit.findOne({ _id: unitId, ownerId, propertyId });
    if (!unit) {
      // Clean up uploaded file
      await deleteFile(file.path);
      throw new Error("UNIT_NOT_FOUND");
    }

    // 3. Validate document type
    const validDocumentTypes = Object.values(DOCUMENT_TYPES);
    if (!validDocumentTypes.includes(documentType)) {
      await deleteFile(file.path);
      throw new Error("INVALID_DOCUMENT_TYPE");
    }

    // 4. Parse tags if provided as comma-separated string
    let parsedTags = [];
    if (tags) {
      if (Array.isArray(tags)) {
        parsedTags = tags;
      } else if (typeof tags === "string") {
        parsedTags = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      }
    }

    // 5. Create document record
    const document = await UnitDocument.create({
      ownerId,
      propertyId,
      unitId,
      documentType,
      documentName,
      fileName: file.filename,
      fileSize: file.size,
      mimeType: file.mimetype,
      filePath: file.path,
      description: description || "",
      uploadedBy: "Owner",
      expiryDate: expiryDate || null,
      tags: parsedTags,
      isActive: true,
    });

    return document;
  } catch (error) {
    // If database operation fails, clean up uploaded file
    if (file && file.path) {
      await deleteFile(file.path);
    }
    throw error;
  }
}

/**
 * Get documents for a specific unit
 *
 * @param {String} ownerId - Owner ID from JWT
 * @param {String} unitId - Unit ID
 * @param {Object} filters - Optional filters (documentType, etc.)
 * @returns {Array} List of documents
 */
export async function getUnitDocuments(ownerId, unitId, filters = {}) {
  // 1. Validate unit belongs to owner
  const unit = await Unit.findOne({ _id: unitId, ownerId });
  if (!unit) {
    throw new Error("UNIT_NOT_FOUND");
  }

  // 2. Build query with filters
  const query = {
    ownerId,
    unitId,
    isActive: true,
  };

  if (filters.documentType) {
    query.documentType = filters.documentType;
  }

  // 3. Retrieve documents
  const documents = await UnitDocument.find(query).sort({ createdAt: -1 });

  return documents;
}

/**
 * Get documents for a property (all units)
 *
 * @param {String} ownerId - Owner ID from JWT
 * @param {String} propertyId - Property ID
 * @param {Object} filters - Optional filters
 * @returns {Array} List of documents
 */
export async function getPropertyDocuments(ownerId, propertyId, filters = {}) {
  // 1. Validate property belongs to owner
  const property = await Property.findOne({ _id: propertyId, ownerId });
  if (!property) {
    throw new Error("PROPERTY_NOT_FOUND");
  }

  // 2. Build query
  const query = {
    ownerId,
    propertyId,
    isActive: true,
  };

  if (filters.documentType) {
    query.documentType = filters.documentType;
  }

  if (filters.unitId) {
    query.unitId = filters.unitId;
  }

  // 3. Retrieve documents
  const documents = await UnitDocument.find(query).sort({ createdAt: -1 });

  return documents;
}

/**
 * Get a single document by ID
 *
 * @param {String} ownerId - Owner ID from JWT
 * @param {String} documentId - Document ID
 * @returns {Object} Document
 */
export async function getDocumentById(ownerId, documentId) {
  const document = await UnitDocument.findOne({
    _id: documentId,
    ownerId,
    isActive: true,
  });

  if (!document) {
    throw new Error("DOCUMENT_NOT_FOUND");
  }

  return document;
}

/**
 * Update document metadata
 *
 * @param {String} ownerId - Owner ID from JWT
 * @param {String} documentId - Document ID
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated document
 */
export async function updateDocument(ownerId, documentId, updates) {
  // 1. Find document and validate ownership
  const document = await UnitDocument.findOne({
    _id: documentId,
    ownerId,
    isActive: true,
  });

  if (!document) {
    throw new Error("DOCUMENT_NOT_FOUND");
  }

  // 2. Apply allowed updates only
  const allowedUpdates = ["documentName", "description", "expiryDate", "tags"];

  allowedUpdates.forEach((field) => {
    if (updates[field] !== undefined) {
      document[field] = updates[field];
    }
  });

  // 3. Save and return
  await document.save();
  return document;
}

/**
 * Delete a document (soft delete)
 *
 * @param {String} ownerId - Owner ID from JWT
 * @param {String} documentId - Document ID
 * @returns {Boolean} Success status
 */
export async function deleteDocument(ownerId, documentId) {
  // 1. Find document and validate ownership
  const document = await UnitDocument.findOne({
    _id: documentId,
    ownerId,
    isActive: true,
  });

  if (!document) {
    throw new Error("DOCUMENT_NOT_FOUND");
  }

  // 2. Soft delete (mark as inactive)
  document.isActive = false;
  await document.save();

  // 3. Delete physical file
  // Note: We do this after soft delete to ensure audit trail is preserved
  // Even if file deletion fails, the document is marked inactive
  try {
    await deleteFile(document.filePath);
  } catch (error) {
    // Log error but don't fail the operation
    console.error("Failed to delete file:", error);
  }

  return true;
}

/**
 * Get documents expiring within specified days
 *
 * @param {String} ownerId - Owner ID from JWT
 * @param {Number} daysFromNow - Number of days to look ahead (default: 30)
 * @returns {Array} List of expiring documents
 */
export async function getExpiringDocuments(ownerId, daysFromNow = 30) {
  const documents = await UnitDocument.findExpiring(ownerId, daysFromNow);

  // Calculate days until expiry for each document
  return documents.map((doc) => ({
    _id: doc._id,
    unitId: doc.unitId,
    propertyId: doc.propertyId,
    documentType: doc.documentType,
    documentName: doc.documentName,
    expiryDate: doc.expiryDate,
    daysUntilExpiry: doc.daysUntilExpiry,
  }));
}

/**
 * Get document statistics by type
 *
 * @param {String} ownerId - Owner ID from JWT
 * @returns {Array} Statistics by document type
 */
export async function getDocumentStatistics(ownerId) {
  const statistics = await UnitDocument.getStatistics(ownerId);
  return statistics;
}

/**
 * Get file path for download
 *
 * This validates ownership before returning file path
 *
 * @param {String} ownerId - Owner ID from JWT
 * @param {String} documentId - Document ID
 * @returns {Object} File info { path, filename, mimeType }
 */
export async function getDocumentFilePath(ownerId, documentId) {
  // 1. Find document and validate ownership
  const document = await UnitDocument.findOne({
    _id: documentId,
    ownerId,
    isActive: true,
  });

  if (!document) {
    throw new Error("DOCUMENT_NOT_FOUND");
  }

  // 2. Return file information
  return {
    path: document.filePath,
    filename: document.fileName,
    mimeType: document.mimeType,
    originalName: document.documentName,
  };
}

/**
 * Count documents by unit
 *
 * @param {String} ownerId - Owner ID from JWT
 * @param {String} unitId - Unit ID
 * @returns {Number} Document count
 */
export async function getDocumentCount(ownerId, unitId) {
  const count = await UnitDocument.countDocuments({
    ownerId,
    unitId,
    isActive: true,
  });

  return count;
}

// Export all service functions
export default {
  uploadDocument,
  getUnitDocuments,
  getPropertyDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  getExpiringDocuments,
  getDocumentStatistics,
  getDocumentFilePath,
  getDocumentCount,
};
