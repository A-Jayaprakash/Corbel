/**
 * Document Validation Middleware
 *
 * Input validation for document API endpoints
 *
 * Uses custom validation logic following project patterns
 */

import { DOCUMENT_TYPES } from "../../models/UnitDocument.model.js";

/**
 * Validate document upload request
 */
export function validateUploadDocument(req, res, next) {
  const errors = [];

  // Required fields
  if (!req.body.propertyId) {
    errors.push("propertyId is required");
  }

  if (!req.body.unitId) {
    errors.push("unitId is required");
  }

  if (!req.body.documentType) {
    errors.push("documentType is required");
  } else if (!Object.values(DOCUMENT_TYPES).includes(req.body.documentType)) {
    errors.push(
      `Invalid documentType. Must be one of: ${Object.values(DOCUMENT_TYPES).join(", ")}`,
    );
  }

  if (!req.body.documentName) {
    errors.push("documentName is required");
  } else if (req.body.documentName.length > 200) {
    errors.push("documentName must be 200 characters or less");
  }

  // Optional fields validation
  if (req.body.description && req.body.description.length > 1000) {
    errors.push("description must be 1000 characters or less");
  }

  if (req.body.expiryDate) {
    const date = new Date(req.body.expiryDate);
    if (isNaN(date.getTime())) {
      errors.push("expiryDate must be a valid date");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      statusCode: 400,
      message: "VALIDATION_ERROR",
      description: "Invalid input data",
      errors,
    });
  }

  next();
}

/**
 * Validate document update request
 */
export function validateUpdateDocument(req, res, next) {
  const errors = [];

  // Optional fields validation (only if provided)
  if (req.body.documentName !== undefined) {
    if (
      typeof req.body.documentName !== "string" ||
      !req.body.documentName.trim()
    ) {
      errors.push("documentName must be a non-empty string");
    } else if (req.body.documentName.length > 200) {
      errors.push("documentName must be 200 characters or less");
    }
  }

  if (
    req.body.description !== undefined &&
    req.body.description.length > 1000
  ) {
    errors.push("description must be 1000 characters or less");
  }

  if (req.body.expiryDate !== undefined && req.body.expiryDate !== null) {
    const date = new Date(req.body.expiryDate);
    if (isNaN(date.getTime())) {
      errors.push("expiryDate must be a valid date");
    }
  }

  if (req.body.tags !== undefined) {
    if (!Array.isArray(req.body.tags)) {
      errors.push("tags must be an array");
    } else if (req.body.tags.length > 20) {
      errors.push("Cannot have more than 20 tags");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      statusCode: 400,
      message: "VALIDATION_ERROR",
      description: "Invalid input data",
      errors,
    });
  }

  next();
}

/**
 * Validate query parameters for filtering
 */
export function validateDocumentQuery(req, res, next) {
  const errors = [];

  if (req.query.documentType) {
    if (!Object.values(DOCUMENT_TYPES).includes(req.query.documentType)) {
      errors.push(
        `Invalid documentType. Must be one of: ${Object.values(DOCUMENT_TYPES).join(", ")}`,
      );
    }
  }

  if (req.query.daysFromNow !== undefined) {
    const days = parseInt(req.query.daysFromNow);
    if (isNaN(days) || days < 1 || days > 365) {
      errors.push("daysFromNow must be a number between 1 and 365");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      statusCode: 400,
      message: "VALIDATION_ERROR",
      description: "Invalid query parameters",
      errors,
    });
  }

  next();
}

/**
 * Validate MongoDB ObjectId format
 */
export function validateObjectId(paramName) {
  return (req, res, next) => {
    const id = req.params[paramName];

    // Basic ObjectId validation (24 hex characters)
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;

    if (!objectIdRegex.test(id)) {
      return res.status(400).json({
        statusCode: 400,
        message: "INVALID_ID",
        description: `Invalid ${paramName} format`,
      });
    }

    next();
  };
}

export default {
  validateUploadDocument,
  validateUpdateDocument,
  validateDocumentQuery,
  validateObjectId,
};
