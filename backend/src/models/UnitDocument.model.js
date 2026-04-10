/**
 * UnitDocument Model
 *
 * Stores metadata and file information for documents uploaded against rental units.
 * Supports lease agreements, rental agreements, maintenance records, inspection reports, etc.
 *
 * Design Principles:
 * - Documents are soft-deleted (isActive flag)
 * - Owner-scoped for security
 * - Immutable metadata (except updates to name/description/tags)
 * - File storage path tracked for retrieval
 * - Expiry tracking for time-sensitive documents
 */

import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Supported document types for rental units
 */
const DOCUMENT_TYPES = {
  LEASE_AGREEMENT: "LEASE_AGREEMENT",
  RENTAL_AGREEMENT: "RENTAL_AGREEMENT",
  MAINTENANCE_RECORD: "MAINTENANCE_RECORD",
  INSPECTION_REPORT: "INSPECTION_REPORT",
  UTILITY_AGREEMENT: "UTILITY_AGREEMENT",
  OTHER: "OTHER",
};

/**
 * Schema definition for unit documents
 */
const unitDocumentSchema = new Schema(
  {
    // Ownership & Context
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
      index: true,
    },
    unitId: {
      type: Schema.Types.ObjectId,
      ref: "Unit",
      required: true,
      index: true,
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },

    // Document Classification
    documentType: {
      type: String,
      enum: Object.values(DOCUMENT_TYPES),
      required: true,
      index: true,
    },
    documentName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    // File Storage Information
    fileName: {
      type: String,
      required: true,
      unique: true, // Prevents duplicate file references
    },
    fileSize: {
      type: Number,
      required: true,
      min: 0,
    },
    mimeType: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },

    // Metadata
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    uploadedBy: {
      type: String,
      default: "Owner",
    },
    expiryDate: {
      type: Date,
      index: true, // For efficient expiry queries
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags) {
          return tags.length <= 20; // Reasonable limit
        },
        message: "Cannot have more than 20 tags",
      },
    },

    // Lifecycle
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.filePath; // Don't expose internal file path in API responses
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  },
);

/**
 * Compound Indexes for Optimization
 *
 * Critical for performance with owner-scoped queries
 */
// Owner + Unit lookup (most common query pattern)
unitDocumentSchema.index({ ownerId: 1, unitId: 1 });

// Owner + Property lookup (for property-wide document queries)
unitDocumentSchema.index({ ownerId: 1, propertyId: 1 });

// Document type filtering with active status
unitDocumentSchema.index({ documentType: 1, isActive: 1 });

// Expiry tracking (for notification/alert systems)
unitDocumentSchema.index({ expiryDate: 1, isActive: 1 });

/**
 * Virtual Fields
 */
// Check if document is expired
unitDocumentSchema.virtual("isExpired").get(function () {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
});

// Days until expiry
unitDocumentSchema.virtual("daysUntilExpiry").get(function () {
  if (!this.expiryDate) return null;
  const now = new Date();
  const expiry = new Date(this.expiryDate);
  const diffTime = expiry - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

/**
 * Pre-save Middleware
 *
 * Validate ownership chain: property -> unit -> owner
 * This ensures data integrity and prevents orphaned documents
 */
unitDocumentSchema.pre("save", async function (next) {
  // Only validate on new documents
  if (!this.isNew) return next();

  try {
    // Validate unit exists and belongs to owner
    const Unit = mongoose.model("Unit");
    const unit = await Unit.findOne({
      _id: this.unitId,
      ownerId: this.ownerId,
      propertyId: this.propertyId,
    });

    if (!unit) {
      const error = new Error(
        "Unit does not exist or does not belong to owner",
      );
      error.name = "ValidationError";
      return next(error);
    }

    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Static Methods
 */

/**
 * Find active documents by unit
 */
unitDocumentSchema.statics.findByUnit = function (
  ownerId,
  unitId,
  filters = {},
) {
  const query = {
    ownerId,
    unitId,
    isActive: true,
    ...filters,
  };
  return this.find(query).sort({ createdAt: -1 });
};

/**
 * Find expiring documents for an owner
 */
unitDocumentSchema.statics.findExpiring = function (ownerId, daysFromNow = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysFromNow);

  return this.find({
    ownerId,
    isActive: true,
    expiryDate: {
      $exists: true,
      $ne: null,
      $lte: futureDate,
      $gte: new Date(), // Not already expired
    },
  }).sort({ expiryDate: 1 });
};

/**
 * Get document statistics by type for an owner
 */
unitDocumentSchema.statics.getStatistics = function (ownerId) {
  return this.aggregate([
    {
      $match: {
        ownerId: new mongoose.Types.ObjectId(ownerId),
        isActive: true,
      },
    },
    {
      $group: {
        _id: "$documentType",
        count: { $sum: 1 },
        totalSize: { $sum: "$fileSize" },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);
};

/**
 * Instance Methods
 */

/**
 * Soft delete document
 */
unitDocumentSchema.methods.softDelete = function () {
  this.isActive = false;
  return this.save();
};

/**
 * Check if document belongs to owner
 */
unitDocumentSchema.methods.belongsToOwner = function (ownerId) {
  return this.ownerId.toString() === ownerId.toString();
};

// Export document types constant for use in validation
export { DOCUMENT_TYPES };

// Create and export model
const UnitDocument = mongoose.model("UnitDocument", unitDocumentSchema);
export default UnitDocument;
