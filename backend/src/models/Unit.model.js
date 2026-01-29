import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
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

    unitName: {
      type: String,
      required: true,
      trim: true,
    },

    monthlyRent: {
      type: Number,
      required: true,
      min: 0,
    },

    advanceAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["VACANT", "OCCUPIED"],
      default: "VACANT",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Unit = mongoose.model("Unit", unitSchema);
