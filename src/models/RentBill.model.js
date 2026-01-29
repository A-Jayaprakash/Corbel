import mongoose from "mongoose";

const rentBillSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
      index: true,
    },

    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },

    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: true,
      index: true,
    },

    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      default: null,
    },

    billingMonth: {
      type: String,
      required: true,
      match: /^\d{4}-(0[1-9]|1[0-2])$/, // YYYY-MM
      index: true,
    },

    rentAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["DUE", "PAID", "OVERDUE"],
      default: "DUE",
      index: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * Ensure one rent bill per unit per month
 */
rentBillSchema.index({ unitId: 1, billingMonth: 1 }, { unique: true });

export const RentBill = mongoose.model("RentBill", rentBillSchema);
