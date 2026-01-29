import { Unit } from "../../models/Unit.model.js";
import { Property } from "../../models/Property.model.js";

/**
 * Create a unit under a property
 */
export const createUnit = async ({
  ownerId,
  propertyId,
  unitName,
  monthlyRent,
  advanceAmount,
}) => {
  // Ensure property exists and belongs to owner
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

  const unit = await Unit.create({
    ownerId,
    propertyId,
    unitName,
    monthlyRent,
    advanceAmount,
    status: "VACANT",
  });

  return unit;
};

/**
 * Get all units under a property
 */
export const getUnitsByProperty = async ({ ownerId, propertyId }) => {
  // Ensure property belongs to owner
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

  return Unit.find({ propertyId }).sort({ createdAt: -1 });
};

/**
 * Delete a unit (only if VACANT)
 */
export const deleteUnit = async ({ ownerId, unitId }) => {
  const unit = await Unit.findOne({
    _id: unitId,
    ownerId,
  });

  if (!unit) {
    throw {
      statusCode: 404,
      message: "UNIT_NOT_FOUND",
    };
  }

  if (unit.status !== "VACANT") {
    throw {
      statusCode: 400,
      message: "UNIT_NOT_VACANT",
    };
  }

  await unit.deleteOne();

  return { success: true };
};
