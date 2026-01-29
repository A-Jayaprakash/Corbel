import { createUnit, getUnitsByProperty, deleteUnit } from "./unit.service.js";

/**
 * Create Unit Controller
 */
export const createUnitController = async (req, res, next) => {
  try {
    const ownerId = req.owner.id;
    const { propertyId } = req.params;
    const { unitName, monthlyRent, advanceAmount } = req.body;

    const unit = await createUnit({
      ownerId,
      propertyId,
      unitName,
      monthlyRent,
      advanceAmount,
    });

    return res.status(201).json({
      id: unit._id,
      unitName: unit.unitName,
      monthlyRent: unit.monthlyRent,
      advanceAmount: unit.advanceAmount,
      status: unit.status,
      createdAt: unit.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Units Under Property Controller
 */
export const getUnitsByPropertyController = async (req, res, next) => {
  try {
    const ownerId = req.owner.id;
    const { propertyId } = req.params;

    const units = await getUnitsByProperty({
      ownerId,
      propertyId,
    });

    const response = units.map((unit) => ({
      id: unit._id,
      unitName: unit.unitName,
      monthlyRent: unit.monthlyRent,
      advanceAmount: unit.advanceAmount,
      status: unit.status,
    }));

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Unit Controller
 */
export const deleteUnitController = async (req, res, next) => {
  try {
    const ownerId = req.owner.id;
    const { unitId } = req.params;

    await deleteUnit({ ownerId, unitId });

    return res.status(200).json({
      message: "Unit deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
