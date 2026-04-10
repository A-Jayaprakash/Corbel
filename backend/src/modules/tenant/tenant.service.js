import { Tenant } from "../../models/Tenant.model.js";
import { Unit } from "../../models/Unit.model.js";
import { Property } from "../../models/Property.model.js";

export const assignTenantToUnit = async ({
  ownerId,
  unitId,
  name,
  phone,
  email,
}) => {
  const unit = await Unit.findOne({ _id: unitId, ownerId });
  if (!unit) throw { statusCode: 404, message: "UNIT_NOT_FOUND" };
  if (unit.status !== "VACANT")
    throw { statusCode: 400, message: "UNIT_NOT_VACANT" };

  const property = await Property.findOne({ _id: unit.propertyId, ownerId });
  if (!property) throw { statusCode: 404, message: "PROPERTY_NOT_FOUND" };

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

  unit.status = "OCCUPIED";
  await unit.save();
  return tenant;
};

export const getActiveTenantForUnit = async ({ ownerId, unitId }) => {
  const unit = await Unit.findOne({ _id: unitId, ownerId });
  if (!unit) throw { statusCode: 404, message: "UNIT_NOT_FOUND" };

  return Tenant.findOne({ unitId, ownerId, status: "ACTIVE" });
};

export const updateTenant = async ({ ownerId, unitId, name, phone, email }) => {
  const unit = await Unit.findOne({ _id: unitId, ownerId });
  if (!unit) throw { statusCode: 404, message: "UNIT_NOT_FOUND" };

  const tenant = await Tenant.findOne({ unitId, ownerId, status: "ACTIVE" });
  if (!tenant) throw { statusCode: 404, message: "ACTIVE_TENANT_NOT_FOUND" };

  if (name !== undefined) tenant.name = name;
  if (phone !== undefined) tenant.phone = phone;
  if (email !== undefined) tenant.email = email;
  await tenant.save();
  return tenant;
};

export const removeTenantFromUnit = async ({ ownerId, unitId }) => {
  const unit = await Unit.findOne({ _id: unitId, ownerId });
  if (!unit) throw { statusCode: 404, message: "UNIT_NOT_FOUND" };
  if (unit.status !== "OCCUPIED")
    throw { statusCode: 400, message: "UNIT_NOT_OCCUPIED" };

  const tenant = await Tenant.findOne({ unitId, ownerId, status: "ACTIVE" });
  if (!tenant) throw { statusCode: 404, message: "ACTIVE_TENANT_NOT_FOUND" };

  tenant.status = "EXITED";
  tenant.tenancyEndDate = new Date();
  await tenant.save();

  unit.status = "VACANT";
  await unit.save();
  return { success: true };
};
