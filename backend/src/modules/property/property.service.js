import { Property } from "../../models/Property.model.js";
import { Unit } from "../../models/Unit.model.js";

export const createProperty = async ({ ownerId, name, address }) => {
  const property = await Property.create({ ownerId, name, address });
  return property;
};

export const getPropertiesByOwner = async ({ ownerId }) => {
  return Property.find({ ownerId }).sort({ createdAt: -1 });
};

export const updateProperty = async ({
  ownerId,
  propertyId,
  name,
  address,
}) => {
  const property = await Property.findOne({ _id: propertyId, ownerId });
  if (!property) throw { statusCode: 404, message: "PROPERTY_NOT_FOUND" };

  if (name !== undefined) property.name = name;
  if (address !== undefined) property.address = address;
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
