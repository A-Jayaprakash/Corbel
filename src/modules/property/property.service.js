import { Property } from "../../models/Property.model";
import { Unit } from "../../models/Unit.model";

export const createProperty = async ({ ownerId, name, address }) => {
  const property = await Property.createOne({
    ownerId,
    name,
    address,
  });

  return property;
};

export const getPropertiesByOwner = async ({ ownerId }) => {
  return Property.find({ ownerId }).sort({ createdAt: -1 });
};

export const deleteProperty = async ({ ownerId, propertyId }) => {
  const property = await Property.findOne({
    _id: propertyId,
    ownerId,
  });
  if (!property) {
    throw {
      statusCode: 404,
      message: "PROPERTY_NOT_FOUND",
    };
  }

  /**
   * Checking if the property has any unit
   */
  const unitCount = await Unit.countDocuments({
    propertyId,
  });
  if (unitCount > 0) {
    throw {
      statusCode: 400,
      message: "PROPERTY_HAS_UNITS",
    };
  }
  await property.deleteOne();
  return { success: true };
};
