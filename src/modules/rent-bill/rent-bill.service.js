import { RentBill } from "../../models/RentBill.model.js";
import { Unit } from "../../models/Unit.model.js";
import { Tenant } from "../../models/Tenant.model.js";

/**
 * Create rent bill for a unit and month (idempotent)
 */
export const createRentBillForUnitMonth = async ({
  ownerId,
  unitId,
  billingMonth, // YYYY-MM
  dueDate,
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

  // Prevent duplicate bills (extra safety beyond unique index)
  const existingBill = await RentBill.findOne({
    unitId,
    billingMonth,
  });

  if (existingBill) {
    return existingBill; // idempotent behavior
  }

  // Snapshot active tenant (if any)
  const activeTenant = await Tenant.findOne({
    unitId,
    ownerId,
    status: "ACTIVE",
  });

  const rentBill = await RentBill.create({
    ownerId,
    propertyId: unit.propertyId,
    unitId: unit._id,
    tenantId: activeTenant ? activeTenant._id : null,
    billingMonth,
    rentAmount: unit.monthlyRent,
    status: "DUE",
    dueDate,
  });

  return rentBill;
};

/**
 * Get all rent bills for a unit
 */
export const getRentBillsForUnit = async ({ ownerId, unitId }) => {
  // Ownership check
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

  return RentBill.find({
    unitId,
    ownerId,
  }).sort({ billingMonth: -1 });
};

/**
 * Get rent bill for a specific month
 */
export const getRentBillByMonth = async ({ ownerId, unitId, billingMonth }) => {
  const rentBill = await RentBill.findOne({
    ownerId,
    unitId,
    billingMonth,
  });

  if (!rentBill) {
    throw {
      statusCode: 404,
      message: "RENT_BILL_NOT_FOUND",
    };
  }

  return rentBill;
};

/**
 * Mark rent bill as paid
 */
export const markRentBillAsPaid = async ({ ownerId, rentBillId }) => {
  const rentBill = await RentBill.findOne({
    _id: rentBillId,
    ownerId,
  });

  if (!rentBill) {
    throw {
      statusCode: 404,
      message: "RENT_BILL_NOT_FOUND",
    };
  }

  // PAID is terminal
  if (rentBill.status === "PAID") {
    return rentBill;
  }

  // Allow DUE → PAID or OVERDUE → PAID only
  if (!["DUE", "OVERDUE"].includes(rentBill.status)) {
    throw {
      statusCode: 400,
      message: "INVALID_RENT_STATUS_TRANSITION",
    };
  }

  rentBill.status = "PAID";
  rentBill.paidAt = new Date();

  await rentBill.save();

  return rentBill;
};
