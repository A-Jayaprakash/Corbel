import { Tenant } from "../../models/Tenant.model.js";
import { Unit } from "../../models/Unit.model.js";
import { Property } from "../../models/Property.model.js";

/**
 * Assign a tenant to a unit
 */
export const assignTenantToUnit = async ({
  ownerId,
  unitId,
  name,
  phone,
  email,
}) => {
  // Ensure unit exists and belongs to owner
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

  // Ensure unit is vacant
  if (unit.status !== "VACANT") {
    throw {
      statusCode: 400,
      message: "UNIT_NOT_VACANT",
    };
  }

  // Ensure property exists and belongs to owner (defensive)
  const property = await Property.findOne({
    _id: unit.propertyId,
    ownerId,
  });

  if (!property) {
    throw {
      statusCode: 404,
      message: "PROPERTY_NOT_FOUND",
    };
  }

  // Create tenant record
  const tenant = await Tenant.create({
    ownerId,
    propertyId: property._id,
    unitId: unit._id,
    name,
    phone,
    email,
    status: "ACTIVE",
    tenancyStartDate: new Date(),
  });

  // Transition unit state to OCCUPIED
  unit.status = "OCCUPIED";
  await unit.save();

  return tenant;
};

/**
 * Get active tenant for a unit
 */
export const getActiveTenantForUnit = async ({ ownerId, unitId }) => {
  // Ensure unit belongs to owner
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

  // Fetch active tenant (if any)
  const tenant = await Tenant.findOne({
    unitId,
    ownerId,
    status: "ACTIVE",
  });

  return tenant; // may be null if unit is vacant
};

/**
 * Remove (exit) tenant from unit
 */
export const removeTenantFromUnit = async ({ ownerId, unitId }) => {
  // Ensure unit belongs to owner
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

  // Ensure unit is occupied
  if (unit.status !== "OCCUPIED") {
    throw {
      statusCode: 400,
      message: "UNIT_NOT_OCCUPIED",
    };
  }

  // Find active tenant
  const tenant = await Tenant.findOne({
    unitId,
    ownerId,
    status: "ACTIVE",
  });

  if (!tenant) {
    throw {
      statusCode: 404,
      message: "ACTIVE_TENANT_NOT_FOUND",
    };
  }

  // Exit tenant
  tenant.status = "EXITED";
  tenant.tenancyEndDate = new Date();
  await tenant.save();

  // Transition unit back to VACANT
  unit.status = "VACANT";
  await unit.save();

  return { success: true };
};
