import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, minlength: 2 },
    ownerName: { type: String, trim: true },
    phone: { type: String, trim: true },
    addressLine1: { type: String, trim: true },
    addressLine2: { type: String, trim: true },
    location: { type: String, trim: true },
    pincode: { type: String, trim: true },
    // keep legacy `address` for backwards compat
    address: { type: String, trim: true },
  },
  { timestamps: true, versionKey: false },
);

export const Property = mongoose.model("Property", propertySchema);
