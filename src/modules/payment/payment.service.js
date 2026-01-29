import { Payment } from "../../models/Payment.model.js";
import { RentBill } from "../../models/RentBill.model.js";

/**
 * Record a payment for a rent bill (RECORDED)
 */
export const recordPayment = async ({
  ownerId,
  rentBillId,
  amount,
  method,
  reference,
  paidAt,
}) => {
  // Ensure rent bill exists and belongs to owner
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

  // Prevent recording payments for already PAID bills
  if (rentBill.status === "PAID") {
    throw {
      statusCode: 400,
      message: "RENT_BILL_ALREADY_PAID",
    };
  }

  // Enforce strict amount matching (V1)
  if (amount !== rentBill.rentAmount) {
    throw {
      statusCode: 400,
      message: "PAYMENT_AMOUNT_MISMATCH",
    };
  }

  const payment = await Payment.create({
    ownerId,
    propertyId: rentBill.propertyId,
    unitId: rentBill.unitId,
    tenantId: rentBill.tenantId,
    rentBillId: rentBill._id,
    amount,
    method,
    reference: reference || null,
    status: "RECORDED",
    paidAt,
  });

  return payment;
};

/**
 * Verify a payment and mark rent bill as PAID
 */
export const verifyPayment = async ({ ownerId, paymentId }) => {
  // Fetch payment
  const payment = await Payment.findOne({
    _id: paymentId,
    ownerId,
  });

  if (!payment) {
    throw {
      statusCode: 404,
      message: "PAYMENT_NOT_FOUND",
    };
  }

  // Idempotent verification
  if (payment.status === "VERIFIED") {
    return payment;
  }

  // Fetch associated rent bill
  const rentBill = await RentBill.findOne({
    _id: payment.rentBillId,
    ownerId,
  });

  if (!rentBill) {
    throw {
      statusCode: 404,
      message: "RENT_BILL_NOT_FOUND",
    };
  }

  // Prevent double payment
  if (rentBill.status === "PAID") {
    throw {
      statusCode: 400,
      message: "RENT_BILL_ALREADY_PAID",
    };
  }

  // Verify payment first (DB-level uniqueness protects concurrency)
  payment.status = "VERIFIED";
  await payment.save();

  // Transition rent bill to PAID
  rentBill.status = "PAID";
  rentBill.paidAt = payment.paidAt;
  await rentBill.save();

  return payment;
};

/**
 * Get payments for a rent bill
 */
export const getPaymentsForRentBill = async ({ ownerId, rentBillId }) => {
  // Ownership check via rent bill
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

  return Payment.find({
    rentBillId,
    ownerId,
  }).sort({ createdAt: -1 });
};
