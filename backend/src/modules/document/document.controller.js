/**
 * Document Controller
 *
 * HTTP request/response handlers for document operations
 *
 * Responsibilities:
 * - Extract and validate request data
 * - Call service layer functions
 * - Format responses consistently
 * - Handle errors appropriately
 *
 * Security:
 * - Owner ID always from req.owner (JWT)
 * - Never accept ownerId from client
 * - Validate all inputs
 */

import * as documentService from "./document.service.js";

/**
 * Upload a document
 *
 * POST /api/v1/documents/upload
 *
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export async function uploadDocument(req, res) {
  try {
    const ownerId = req.owner.id; // From JWT middleware

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        statusCode: 400,
        message: "BAD_REQUEST",
        description: "No file uploaded. Please provide a document file.",
      });
    }

    // Extract document metadata from request body
    const documentData = {
      propertyId: req.body.propertyId,
      unitId: req.body.unitId,
      documentType: req.body.documentType,
      documentName: req.body.documentName,
      description: req.body.description,
      expiryDate: req.body.expiryDate,
      tags: req.body.tags,
    };

    // Validate required fields
    if (
      !documentData.propertyId ||
      !documentData.unitId ||
      !documentData.documentType ||
      !documentData.documentName
    ) {
      return res.status(400).json({
        statusCode: 400,
        message: "BAD_REQUEST",
        description:
          "Missing required fields: propertyId, unitId, documentType, documentName",
      });
    }

    // Call service
    const document = await documentService.uploadDocument(
      ownerId,
      documentData,
      req.file,
    );

    // Success response
    return res.status(201).json({
      statusCode: 201,
      message: "DOCUMENT_UPLOADED",
      description: "Document uploaded successfully",
      data: {
        document,
      },
    });
  } catch (error) {
    console.error("Upload document error:", error);

    // Handle specific errors
    if (error.message === "PROPERTY_NOT_FOUND") {
      return res.status(404).json({
        statusCode: 404,
        message: "PROPERTY_NOT_FOUND",
        description: "Property not found or does not belong to you",
      });
    }

    if (error.message === "UNIT_NOT_FOUND") {
      return res.status(404).json({
        statusCode: 404,
        message: "UNIT_NOT_FOUND",
        description: "Unit not found or does not belong to you",
      });
    }

    if (error.message === "INVALID_DOCUMENT_TYPE") {
      return res.status(400).json({
        statusCode: 400,
        message: "INVALID_DOCUMENT_TYPE",
        description: "Invalid document type provided",
      });
    }

    // Generic error
    return res.status(500).json({
      statusCode: 500,
      message: "SERVER_ERROR",
      description: "Failed to upload document",
    });
  }
}

/**
 * Get documents for a unit
 *
 * GET /api/v1/documents/unit/:unitId
 *
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export async function getUnitDocuments(req, res) {
  try {
    const ownerId = req.owner.id;
    const { unitId } = req.params;
    const { documentType } = req.query;

    const filters = {};
    if (documentType) {
      filters.documentType = documentType;
    }

    const documents = await documentService.getUnitDocuments(
      ownerId,
      unitId,
      filters,
    );

    return res.status(200).json({
      statusCode: 200,
      message: "SUCCESS",
      description: "Documents retrieved successfully",
      data: {
        documents,
        count: documents.length,
      },
    });
  } catch (error) {
    console.error("Get unit documents error:", error);

    if (error.message === "UNIT_NOT_FOUND") {
      return res.status(404).json({
        statusCode: 404,
        message: "UNIT_NOT_FOUND",
        description: "Unit not found or does not belong to you",
      });
    }

    return res.status(500).json({
      statusCode: 500,
      message: "SERVER_ERROR",
      description: "Failed to retrieve documents",
    });
  }
}

/**
 * Get documents for a property
 *
 * GET /api/v1/documents/property/:propertyId
 *
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export async function getPropertyDocuments(req, res) {
  try {
    const ownerId = req.owner.id;
    const { propertyId } = req.params;
    const { documentType, unitId } = req.query;

    const filters = {};
    if (documentType) filters.documentType = documentType;
    if (unitId) filters.unitId = unitId;

    const documents = await documentService.getPropertyDocuments(
      ownerId,
      propertyId,
      filters,
    );

    return res.status(200).json({
      statusCode: 200,
      message: "SUCCESS",
      description: "Documents retrieved successfully",
      data: {
        documents,
        count: documents.length,
      },
    });
  } catch (error) {
    console.error("Get property documents error:", error);

    if (error.message === "PROPERTY_NOT_FOUND") {
      return res.status(404).json({
        statusCode: 404,
        message: "PROPERTY_NOT_FOUND",
        description: "Property not found or does not belong to you",
      });
    }

    return res.status(500).json({
      statusCode: 500,
      message: "SERVER_ERROR",
      description: "Failed to retrieve documents",
    });
  }
}

/**
 * Get a single document by ID
 *
 * GET /api/v1/documents/:documentId
 *
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export async function getDocumentById(req, res) {
  try {
    const ownerId = req.owner.id;
    const { documentId } = req.params;

    const document = await documentService.getDocumentById(ownerId, documentId);

    return res.status(200).json({
      statusCode: 200,
      message: "SUCCESS",
      description: "Document retrieved successfully",
      data: {
        document,
      },
    });
  } catch (error) {
    console.error("Get document error:", error);

    if (error.message === "DOCUMENT_NOT_FOUND") {
      return res.status(404).json({
        statusCode: 404,
        message: "DOCUMENT_NOT_FOUND",
        description: "Document not found or does not belong to you",
      });
    }

    return res.status(500).json({
      statusCode: 500,
      message: "SERVER_ERROR",
      description: "Failed to retrieve document",
    });
  }
}

/**
 * Download a document
 *
 * GET /api/v1/documents/:documentId/download
 *
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export async function downloadDocument(req, res) {
  try {
    const ownerId = req.owner.id;
    const { documentId } = req.params;

    // Get file information
    const fileInfo = await documentService.getDocumentFilePath(
      ownerId,
      documentId,
    );

    // Set headers for download
    res.setHeader("Content-Type", fileInfo.mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileInfo.originalName}"`,
    );

    // Stream file to response
    return res.sendFile(fileInfo.path, (err) => {
      if (err) {
        console.error("File download error:", err);
        if (!res.headersSent) {
          return res.status(500).json({
            statusCode: 500,
            message: "DOWNLOAD_FAILED",
            description: "Failed to download file",
          });
        }
      }
    });
  } catch (error) {
    console.error("Download document error:", error);

    if (error.message === "DOCUMENT_NOT_FOUND") {
      return res.status(404).json({
        statusCode: 404,
        message: "DOCUMENT_NOT_FOUND",
        description: "Document not found or does not belong to you",
      });
    }

    return res.status(500).json({
      statusCode: 500,
      message: "SERVER_ERROR",
      description: "Failed to download document",
    });
  }
}

/**
 * Update document metadata
 *
 * PUT /api/v1/documents/:documentId
 *
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export async function updateDocument(req, res) {
  try {
    const ownerId = req.owner.id;
    const { documentId } = req.params;
    const updates = req.body;

    const document = await documentService.updateDocument(
      ownerId,
      documentId,
      updates,
    );

    return res.status(200).json({
      statusCode: 200,
      message: "SUCCESS",
      description: "Document updated successfully",
      data: {
        document,
      },
    });
  } catch (error) {
    console.error("Update document error:", error);

    if (error.message === "DOCUMENT_NOT_FOUND") {
      return res.status(404).json({
        statusCode: 404,
        message: "DOCUMENT_NOT_FOUND",
        description: "Document not found or does not belong to you",
      });
    }

    return res.status(500).json({
      statusCode: 500,
      message: "SERVER_ERROR",
      description: "Failed to update document",
    });
  }
}

/**
 * Delete a document
 *
 * DELETE /api/v1/documents/:documentId
 *
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export async function deleteDocument(req, res) {
  try {
    const ownerId = req.owner.id;
    const { documentId } = req.params;

    await documentService.deleteDocument(ownerId, documentId);

    return res.status(200).json({
      statusCode: 200,
      message: "SUCCESS",
      description: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Delete document error:", error);

    if (error.message === "DOCUMENT_NOT_FOUND") {
      return res.status(404).json({
        statusCode: 404,
        message: "DOCUMENT_NOT_FOUND",
        description: "Document not found or does not belong to you",
      });
    }

    return res.status(500).json({
      statusCode: 500,
      message: "SERVER_ERROR",
      description: "Failed to delete document",
    });
  }
}

/**
 * Get expiring documents
 *
 * GET /api/v1/documents/expiring/list
 *
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export async function getExpiringDocuments(req, res) {
  try {
    const ownerId = req.owner.id;
    const daysFromNow = parseInt(req.query.daysFromNow) || 30;

    const documents = await documentService.getExpiringDocuments(
      ownerId,
      daysFromNow,
    );

    return res.status(200).json({
      statusCode: 200,
      message: "SUCCESS",
      description: "Expiring documents retrieved successfully",
      data: {
        documents,
        count: documents.length,
      },
    });
  } catch (error) {
    console.error("Get expiring documents error:", error);

    return res.status(500).json({
      statusCode: 500,
      message: "SERVER_ERROR",
      description: "Failed to retrieve expiring documents",
    });
  }
}

/**
 * Get document statistics
 *
 * GET /api/v1/documents/statistics/summary
 *
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export async function getDocumentStatistics(req, res) {
  try {
    const ownerId = req.owner.id;

    const statistics = await documentService.getDocumentStatistics(ownerId);

    return res.status(200).json({
      statusCode: 200,
      message: "SUCCESS",
      description: "Document statistics retrieved successfully",
      data: {
        statistics,
      },
    });
  } catch (error) {
    console.error("Get statistics error:", error);

    return res.status(500).json({
      statusCode: 500,
      message: "SERVER_ERROR",
      description: "Failed to retrieve statistics",
    });
  }
}

// Export all controller functions
export default {
  uploadDocument,
  getUnitDocuments,
  getPropertyDocuments,
  getDocumentById,
  downloadDocument,
  updateDocument,
  deleteDocument,
  getExpiringDocuments,
  getDocumentStatistics,
};
