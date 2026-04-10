import {
  createUnit,
  getUnitsByProperty,
  updateUnit,
  deleteUnit,
} from "./unit.service.js";

export const createUnitController = async (req, res, next) => {
  try {
    const { unitName, monthlyRent, advanceAmount } = req.body;
    const unit = await createUnit({
      ownerId: req.owner.id,
      propertyId: req.params.propertyId,
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

export const getUnitsByPropertyController = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const { data, meta } = await getUnitsByProperty({
      ownerId: req.owner.id,
      propertyId: req.params.propertyId,
      page,
      limit,
    });
    return res.status(200).json({
      data: data.map((u) => ({
        id: u._id,
        unitName: u.unitName,
        monthlyRent: u.monthlyRent,
        advanceAmount: u.advanceAmount,
        status: u.status,
      })),
      meta,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUnitController = async (req, res, next) => {
  try {
    const { unitName, monthlyRent, advanceAmount } = req.body;
    const unit = await updateUnit({
      ownerId: req.owner.id,
      unitId: req.params.unitId,
      unitName,
      monthlyRent,
      advanceAmount,
    });
    return res.status(200).json({
      id: unit._id,
      unitName: unit.unitName,
      monthlyRent: unit.monthlyRent,
      advanceAmount: unit.advanceAmount,
      status: unit.status,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUnitController = async (req, res, next) => {
  try {
    await deleteUnit({ ownerId: req.owner.id, unitId: req.params.unitId });
    return res.status(200).json({ message: "Unit deleted successfully" });
  } catch (error) {
    next(error);
  }
};
