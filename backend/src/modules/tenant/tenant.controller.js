import {
  assignTenantToUnit,
  getActiveTenantForUnit,
  updateTenant,
  removeTenantFromUnit,
} from "./tenant.service.js";

export const assignTenantToUnitController = async (req, res, next) => {
  try {
    const { name, phone, email } = req.body;
    const tenant = await assignTenantToUnit({
      ownerId: req.owner.id,
      unitId: req.params.unitId,
      name,
      phone,
      email,
    });
    return res
      .status(201)
      .json({
        id: tenant._id,
        name: tenant.name,
        phone: tenant.phone,
        email: tenant.email,
        status: tenant.status,
        tenancyStartDate: tenant.tenancyStartDate,
      });
  } catch (error) {
    next(error);
  }
};

export const getActiveTenantForUnitController = async (req, res, next) => {
  try {
    const tenant = await getActiveTenantForUnit({
      ownerId: req.owner.id,
      unitId: req.params.unitId,
    });
    if (!tenant) return res.status(200).json(null);
    return res
      .status(200)
      .json({
        id: tenant._id,
        name: tenant.name,
        phone: tenant.phone,
        email: tenant.email,
        status: tenant.status,
        tenancyStartDate: tenant.tenancyStartDate,
      });
  } catch (error) {
    next(error);
  }
};

export const updateTenantController = async (req, res, next) => {
  try {
    const { name, phone, email } = req.body;
    const tenant = await updateTenant({
      ownerId: req.owner.id,
      unitId: req.params.unitId,
      name,
      phone,
      email,
    });
    return res
      .status(200)
      .json({
        id: tenant._id,
        name: tenant.name,
        phone: tenant.phone,
        email: tenant.email,
        status: tenant.status,
      });
  } catch (error) {
    next(error);
  }
};

export const removeTenantFromUnitController = async (req, res, next) => {
  try {
    await removeTenantFromUnit({
      ownerId: req.owner.id,
      unitId: req.params.unitId,
    });
    return res.status(200).json({ message: "Tenant removed successfully" });
  } catch (error) {
    next(error);
  }
};
