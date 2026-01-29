import {
  assignTenantToUnit,
  getActiveTenantForUnit,
  removeTenantFromUnit,
} from "./tenant.service.js";

/**
 * Assign Tenant to Unit Controller
 */
export const assignTenantToUnitController = async (req, res, next) => {
  try {
    const ownerId = req.owner.id;
    const { unitId } = req.params;
    const { name, phone, email } = req.body;

    const tenant = await assignTenantToUnit({
      ownerId,
      unitId,
      name,
      phone,
      email,
    });

    return res.status(201).json({
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

/**
 * Get Active Tenant for Unit Controller
 */
export const getActiveTenantForUnitController = async (req, res, next) => {
  try {
    const ownerId = req.owner.id;
    const { unitId } = req.params;

    const tenant = await getActiveTenantForUnit({
      ownerId,
      unitId,
    });

    if (!tenant) {
      return res.status(200).json(null);
    }

    return res.status(200).json({
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

/**
 * Remove (Exit) Tenant from Unit Controller
 */
export const removeTenantFromUnitController = async (req, res, next) => {
  try {
    const ownerId = req.owner.id;
    const { unitId } = req.params;

    await removeTenantFromUnit({
      ownerId,
      unitId,
    });

    return res.status(200).json({
      message: "Tenant removed successfully",
    });
  } catch (error) {
    next(error);
  }
};
