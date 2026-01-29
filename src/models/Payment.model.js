import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
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

    rentBillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RentBill",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    method: {
      type: String,
      enum: ["CASH", "UPI", "BANK_TRANSFER"],
      required: true,
    },

    reference: {
      type: String,
      trim: true,
      default: null,
    },

    status: {
      type: String,
      enum: ["RECORDED", "VERIFIED"],
      default: "RECORDED",
      index: true,
    },

    paidAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * Ensure only one VERIFIED payment per rent bill
 */
paymentSchema.index(
  { rentBillId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "VERIFIED" },
  },
);

export const Payment = mongoose.model("Payment", paymentSchema);
