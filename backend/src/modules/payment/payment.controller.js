import {
  recordPayment,
  verifyPayment,
  getPaymentsForRentBill,
} from "./payment.service.js";

/**
 * Record a payment for a rent bill
 */
export const recordPaymentController = async (req, res, next) => {
  try {
    const ownerId = req.owner.id;
    const { rentBillId } = req.params;
    const { amount, method, reference, paidAt } = req.body;

    const payment = await recordPayment({
      ownerId,
      rentBillId,
      amount,
      method,
      reference,
      paidAt: paidAt ? new Date(paidAt) : new Date(),
    });

    return res.status(201).json({
      id: payment._id,
      rentBillId: payment.rentBillId,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      paidAt: payment.paidAt,
      createdAt: payment.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify a payment and mark rent bill as PAID
 */
export const verifyPaymentController = async (req, res, next) => {
  try {
    const ownerId = req.owner.id;
    const { paymentId } = req.params;

    const payment = await verifyPayment({
      ownerId,
      paymentId,
    });

    return res.status(200).json({
      id: payment._id,
      rentBillId: payment.rentBillId,
      status: payment.status,
      verifiedAt: payment.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all payments for a rent bill
 */
export const getPaymentsForRentBillController = async (req, res, next) => {
  try {
    const ownerId = req.owner.id;
    const { rentBillId } = req.params;

    const payments = await getPaymentsForRentBill({
      ownerId,
      rentBillId,
    });

    const response = payments.map((payment) => ({
      id: payment._id,
      amount: payment.amount,
      method: payment.method,
      reference: payment.reference,
      status: payment.status,
      paidAt: payment.paidAt,
      createdAt: payment.createdAt,
    }));

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
