import { Unit } from "../../models/Unit.model.js";
import { Property } from "../../models/Property.model.js";

export const createUnit = async ({
  ownerId,
  propertyId,
  unitName,
  monthlyRent,
  advanceAmount,
}) => {
  const property = await Property.findOne({ _id: propertyId, ownerId });
  if (!property) throw { statusCode: 404, message: "PROPERTY_NOT_FOUND" };

  return Unit.create({
    ownerId,
    propertyId,
    unitName,
    monthlyRent,
    advanceAmount,
    status: "VACANT",
  });
};

export const getUnitsByProperty = async ({ ownerId, propertyId }) => {
  const property = await Property.findOne({ _id: propertyId, ownerId });
  if (!property) throw { statusCode: 404, message: "PROPERTY_NOT_FOUND" };

  return Unit.find({ propertyId }).sort({ createdAt: -1 });
};

export const updateUnit = async ({
  ownerId,
  unitId,
  unitName,
  monthlyRent,
  advanceAmount,
}) => {
  const unit = await Unit.findOne({ _id: unitId, ownerId });
  if (!unit) throw { statusCode: 404, message: "UNIT_NOT_FOUND" };

  if (unitName !== undefined) unit.unitName = unitName;
  if (monthlyRent !== undefined) unit.monthlyRent = monthlyRent;
  if (advanceAmount !== undefined) unit.advanceAmount = advanceAmount;
  await unit.save();
  return unit;
};

export const deleteUnit = async ({ ownerId, unitId }) => {
  const unit = await Unit.findOne({ _id: unitId, ownerId });
  if (!unit) throw { statusCode: 404, message: "UNIT_NOT_FOUND" };
  if (unit.status !== "VACANT")
    throw { statusCode: 400, message: "UNIT_NOT_VACANT" };

  await unit.deleteOne();
  return { success: true };
};
