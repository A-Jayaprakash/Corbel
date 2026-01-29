import {
  createRentBillForUnitMonth,
  getRentBillsForUnit,
  getRentBillByMonth,
  markRentBillAsPaid,
} from "./rent-bill.service.js";

/**
 * Create Rent Bill for Unit + Month (idempotent)
 */
export const createRentBillController = async (req, res, next) => {
  try {
    const ownerId = req.owner.id;
    const { unitId } = req.params;
    const { billingMonth, dueDate } = req.body;

    const rentBill = await createRentBillForUnitMonth({
      ownerId,
      unitId,
      billingMonth,
      dueDate: new Date(dueDate),
    });

    return res.status(201).json({
      id: rentBill._id,
      unitId: rentBill.unitId,
      billingMonth: rentBill.billingMonth,
      rentAmount: rentBill.rentAmount,
      status: rentBill.status,
      dueDate: rentBill.dueDate,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all Rent Bills for a Unit
 */
export const getRentBillsForUnitController = async (req, res, next) => {
  try {
    const ownerId = req.owner.id;
    const { unitId } = req.params;

    const bills = await getRentBillsForUnit({
      ownerId,
      unitId,
    });

    const response = bills.map((bill) => ({
      id: bill._id,
      billingMonth: bill.billingMonth,
      rentAmount: bill.rentAmount,
      status: bill.status,
      dueDate: bill.dueDate,
      paidAt: bill.paidAt,
    }));

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Rent Bill by Month
 */
export const getRentBillByMonthController = async (req, res, next) => {
  try {
    const ownerId = req.owner.id;
    const { unitId, month } = req.params;

    const bill = await getRentBillByMonth({
      ownerId,
      unitId,
      billingMonth: month,
    });

    return res.status(200).json({
      id: bill._id,
      billingMonth: bill.billingMonth,
      rentAmount: bill.rentAmount,
      status: bill.status,
      dueDate: bill.dueDate,
      paidAt: bill.paidAt,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark Rent Bill as Paid
 */
export const markRentBillAsPaidController = async (req, res, next) => {
  try {
    const ownerId = req.owner.id;
    const { rentBillId } = req.params;

    const bill = await markRentBillAsPaid({
      ownerId,
      rentBillId,
    });

    return res.status(200).json({
      id: bill._id,
      status: bill.status,
      paidAt: bill.paidAt,
    });
  } catch (error) {
    next(error);
  }
};
