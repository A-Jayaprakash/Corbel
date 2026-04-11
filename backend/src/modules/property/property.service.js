import { Property } from "../../models/Property.model.js";
import { Unit } from "../../models/Unit.model.js";

const FIELDS = [
  "name",
  "ownerName",
  "phone",
  "addressLine1",
  "addressLine2",
  "location",
  "pincode",
];

export const createProperty = async (payload) => {
  return Property.create(payload);
};

export const getPropertiesByOwner = async ({
  ownerId,
  page = 1,
  limit = 10,
}) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Property.find({ ownerId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Property.countDocuments({ ownerId }),
  ]);
  return {
    data,
    meta: { total, page, limit, pages: Math.ceil(total / limit) },
  };
};

export const updateProperty = async ({ ownerId, propertyId, ...fields }) => {
  const property = await Property.findOne({ _id: propertyId, ownerId });
  if (!property) throw { statusCode: 404, message: "PROPERTY_NOT_FOUND" };

  FIELDS.forEach((f) => {
    if (fields[f] !== undefined) property[f] = fields[f];
  });
  await property.save();
  return property;
};

export const deleteProperty = async ({ ownerId, propertyId }) => {
  const property = await Property.findOne({ _id: propertyId, ownerId });
  if (!property) throw { statusCode: 404, message: "PROPERTY_NOT_FOUND" };

  const unitCount = await Unit.countDocuments({ propertyId });
  if (unitCount > 0) throw { statusCode: 400, message: "PROPERTY_HAS_UNITS" };

  await property.deleteOne();
  return { success: true };
};
